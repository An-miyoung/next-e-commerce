import { getCartItems } from "@/app/lib/cartHelper";
import startDb from "@/app/lib/db";
import CartModel from "@/app/models/cartModel";
import OrderModel from "@/app/models/orderModel";
import ProductModel from "@/app/models/productModel";
import { StripeCustomer } from "@/app/types";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2023-08-16",
});

export const POST = async (req: Request) => {
  const data = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(data, signature, webhookSecret);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 400 }
    );
  }

  if ((event.type = "checkout.session.completed")) {
    // checkout/route.ts 에서 만든 customer를 받아온다
    const stripeSession = event.data.object as {
      customer: string;
      payment_intent: string;
      payment_status: string;
      amount_subtotal: number;
      customer_details: {
        address: any;
        email: string;
        name: string;
      };
    };
    const customer = (await stripe.customers.retrieve(
      stripeSession.customer
    )) as unknown as StripeCustomer;
    const {
      metadata: { userId, cartId, type },
    } = customer;

    // create new order
    if (type === "checkout") {
      const cartItems = await getCartItems(userId, cartId);

      await startDb();
      await OrderModel.create({
        userId,
        stripeCustomerId: stripeSession.customer,
        paymentIntent: stripeSession.payment_intent,
        totalAmount: stripeSession.amount_subtotal,
        shippingDetails: {
          address: stripeSession.customer_details.address,
          email: stripeSession.customer_details.email,
          name: stripeSession.customer_details.name,
        },
        paymentStatus: stripeSession.payment_status,
        deliveryStatus: "ordered",
        orderItems: cartItems.products,
      });

      // recount our stock
      const updateProductsPromises = cartItems.products.map(async (product) => {
        return await ProductModel.findByIdAndUpdate(product.id, {
          $inc: { quantity: -product.quantity },
        });
      });
      await Promise.all(updateProductsPromises);

      // remove the cart
      await CartModel.findByIdAndDelete(cartId);
    }
  }
  return NextResponse.json({});
};
