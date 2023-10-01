import { getCartItems } from "@/app/lib/cartHelper";
import ProductModel from "@/app/models/productModel";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

// 장바구니에 있는 상품은 무시하고 이 상품만 결제
export const POST = async (req: Request) => {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );

    const data = await req.json();
    const productId = data.productId as string;
    if (!isValidObjectId(productId))
      return NextResponse.json(
        { error: "존재하지 않는 상품아이디입니다." },
        { status: 401 }
      );

    const product = await ProductModel.findById(productId);
    if (!product)
      return NextResponse.json(
        { error: "존재하지 않는 상품입니다." },
        { status: 401 }
      );

    const line_items = {
      price_data: {
        currency: "KRW",
        unit_amount: product.price.discounted,
        product_data: {
          name: product.title,
          images: [product.thumbnail.url],
        },
      },
      quantity: 1,
    };

    const customer = await stripe.customers.create({
      metadata: {
        userId: session.user.id,
        productId: productId,
        type: "instant-checkout",
        product: JSON.stringify({
          id: productId,
          title: product.title,
          thumbnail: product.thumbnail.url,
          price: product.price.discounted,
          totalPrice: product.price.discounted,
          quantity: 1,
        }),
      },
    });

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [line_items],
      success_url: `${process.env.PAYMENT_SUCCESS_URL}`,
      cancel_url: `${process.env.PAYMENT_CANCEL_URL}`,
      shipping_address_collection: { allowed_countries: ["US"] },
      customer: customer.id,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        error: "결제에 실패했습니다.",
      },
      { status: 500 }
    );
  }
};
