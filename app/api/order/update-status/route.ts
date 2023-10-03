import startDb from "@/app/lib/db";
import OrderModel from "@/app/models/orderModel";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

const validStatus = ["delivered", "ordered", "shipped"];

export const POST = async (req: Request) => {
  const session = await auth();
  if (session?.user.role !== "admin")
    return NextResponse.json(
      {
        error: "admin 만 접근할 수 있습니다.",
      },
      { status: 401 }
    );

  const { orderId, deliveryStatus } = await req.json();
  if (!isValidObjectId(orderId) || !validStatus.includes(deliveryStatus))
    return NextResponse.json(
      {
        error: "주문내역이 없습니다.",
      },
      { status: 401 }
    );

  await startDb();
  const order = await OrderModel.findByIdAndUpdate(orderId, { deliveryStatus });
  return NextResponse.json({ success: true });
};
