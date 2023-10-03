import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import ReviewModel from "@/app/models/reviewModel";
import { ReviewRequestBody } from "@/app/types";
import { auth } from "@/auth";
import { Types, isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

const updateProductRating = async (productId: string) => {
  const [result] = await ReviewModel.aggregate([
    {
      $match: { product: new Types.ObjectId(productId) },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  if (result.averageRating) {
    await ProductModel.findByIdAndUpdate(productId, {
      rating: result.averageRating,
    });
  }
};

export const POST = async (req: Request) => {
  try {
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

    await updateProductRating(productId);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: `후기작성에 실패했습니다.: ${error.message}`,
      },
      { status: 500 }
    );
  }
};
