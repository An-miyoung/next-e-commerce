import startDb from "@/app/lib/db";
import ReviewModel from "@/app/models/reviewModel";
import { ReviewRequestBody } from "@/app/types";
import { auth } from "@/auth";
import mongoose, { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json(
      {
        error: "로그인하지 않은 사용자입니다.",
      },
      { status: 401 }
    );

  const userId = session.user.id;
  const { productId, comment, rating } =
    (await req.json()) as ReviewRequestBody;

  if (!isValidObjectId(productId))
    return NextResponse.json(
      {
        error: "상품이 존재하지 않습니다.",
      },
      { status: 401 }
    );
  if (rating <= 0 || rating > 5)
    return NextResponse.json(
      {
        error: "별점은 1~5사이입니다.",
      },
      { status: 401 }
    );

  const data = {
    userId,
    product: productId,
    comment,
    rating,
  };
  await startDb();
  await ReviewModel.findOneAndUpdate(
    {
      userId,
      product: productId,
    },
    data,
    {
      upsert: true,
    }
  );

  return NextResponse.json({ success: true }, { status: 201 });
};
