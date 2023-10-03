import OrderListPublic from "@/app/components/OrderListPublic";
import startDb from "@/app/lib/db";
import OrderModel from "@/app/models/orderModel";
import { Orders } from "@/app/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const fetchOrders = async () => {
  const session = await auth();
  if (!session?.user) return null;
  const userId = session.user.id;

  await startDb();
  const orders = await OrderModel.find({ userId }).sort("-createdAt");
  const result: Orders[] = orders.map((order) => {
    return {
      id: order._id.toString(),
      paymentStatus: order.paymentStatus,
      date: order.createdAt.toString(),
      total: order.totalAmount,
      deliveryStatus: order.deliveryStatus,
      products: order.orderItems,
    };
  });

  return JSON.stringify(result);
};

export default async function Order() {
  const result = await fetchOrders();
  if (!result) {
    return redirect("/404");
  }
  const orders = JSON.parse(result);
  return (
    <div>
      <OrderListPublic orders={orders} />
    </div>
  );
}
