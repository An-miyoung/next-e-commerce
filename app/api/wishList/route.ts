import startDb from "@/app/lib/db";
import WishListModel from "@/app/models/wishListModel";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      {
        error: "로그인이 필요합니다.",
      },
      { status: 403 }
    );
  }

  const { productId } = await req.json();
  if (!isValidObjectId(productId)) {
    return NextResponse.json(
      {
        error: "존재하지 않는 아이디의 상품을 등록할 수 없습니다.",
      },
      { status: 422 }
    );
  }

  await startDb();
  const wishList = await WishListModel.findOne({
    user: session.user.id,
    products: productId,
  });
  if (wishList) {
    await WishListModel.findByIdAndUpdate(wishList._id, {
      $pull: { products: productId },
    });
  } else {
    await WishListModel.findOneAndUpdate(
      {
        user: session.user.id,
      },
      {
        user: session.user.id,
        $push: { products: productId },
      },
      { upsert: true }
    );
  }

  return NextResponse.json({ success: true });
};
