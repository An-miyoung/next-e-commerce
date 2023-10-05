import ReviewForm from "@/app/components/ReviewForm";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import ReviewModel from "@/app/models/reviewModel";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: { id: string };
}
// 사용자가 자신이 작성한 리뷰만 본다.
const fetchMyReview = async (productId: string) => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/auth/signin");
  }

  if (!isValidObjectId(productId)) return redirect("/404");

  await startDb();
  const review = await ReviewModel.findOne({
    userId: session.user.id,
    product: productId,
  }).populate<{ product: { title: string; thumbnail: { url: string } } }>({
    path: "product",
    select: "title thumbnail.url",
    model: ProductModel,
  });

  if (!review) return null;

  return {
    id: review._id.toString(),
    rating: review.rating,
    comment: review.comment,
    product: {
      title: review.product.title,
      thumbnail: review.product.thumbnail.url,
    },
  };
};

const fetchProductThumbnail = async (productId: string) => {
  if (!isValidObjectId(productId)) return redirect("/404");
  await startDb();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");

  return {
    title: product.title,
    thumbnail: product.thumbnail.url,
  };
};

export default async function Review({ params }: Props) {
  const productId = params.id;
  const review = await fetchMyReview(productId);
  // comment 를 안달경우를 대비해 model 에 comment? 를 달면 comment:review.comment || "" 식으로 써줘야 함
  const initialValue = review
    ? { rating: review.rating, comment: review.comment || "" }
    : undefined;

  const { title, thumbnail } = await fetchProductThumbnail(productId);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Image
          src={review?.product.thumbnail || thumbnail}
          alt={`${review?.product.title}` || title}
          width={50}
          height={50}
          style={{ width: "auto", height: "auto" }}
          className=" rounded"
        />
        <h3>{title}</h3>
      </div>
      <ReviewForm productId={productId} initialValue={initialValue} />
    </div>
  );
}
