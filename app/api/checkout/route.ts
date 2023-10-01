import { getCartItems } from "@/app/lib/cartHelper";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export const POST = async (req: Request) => {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );

    const data = await req.json();
    const cartId = data.cartId as string;
    if (!isValidObjectId(cartId))
      return NextResponse.json(
        { error: "장바구니가 없습니다." },
        { status: 401 }
      );

    const cartItems = await getCartItems(session.user.id, cartId);
    if (!cartItems)
      return NextResponse.json(
        { error: "장바구니에 결제할 상품이 없습니다." },
        { status: 401 }
      );

    const line_items = cartItems.products.map((product) => {
      return {
        price_data: {
          currency: "KRW",
          unit_amount: product.price,
          product_data: {
            name: product.title,
            images: [product.thumbnail],
          },
        },
        quantity: product.quantity,
      };
    });

    const customer = await stripe.customers.create({
      metadata: {
        userId: session.user.id,
        cartId: cartId,
        type: "checkout",
      },
    });

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
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
