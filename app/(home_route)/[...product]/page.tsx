import ProductView from "@/app/components/ProductView";
import ReviewsList from "@/app/components/ReviewList";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import ReviewModel from "@/app/models/reviewModel";
import UserModel from "@/app/models/userModels";
import { ObjectId, isValidObjectId } from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: { product: string[] };
}

const fetchProduct = async (productId: string) => {
  if (!isValidObjectId(productId)) return redirect("/404");
  await startDb();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");
  const finalProduct = {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    thumbnail: product.thumbnail.url,
    images: product.images?.map((image) => image.url),
    bulletPoints: product.bulletPoints,
    price: product.price,
    sale: product.sale,
    rating: product.rating,
    outOfStock: product.quantity <= 0,
  };
  return JSON.stringify(finalProduct);
};

// 해당 상품에 달린 모든 리뷰를 렌더
const fetchProductReview = async (productId: string) => {
  if (!isValidObjectId(productId)) return redirect("/404");

  await startDb();
  const reviews = await ReviewModel.find({ product: productId }).populate<{
    userId: { _id: ObjectId; name: string; avatar?: { url: string } };
  }>({ path: "userId", select: "name avatar.url", model: UserModel });

  if (!reviews) return redirect("/404");

  const result = reviews.map((review) => {
    return {
      id: review._id.toString(),
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt,
      userInfo: {
        id: review.userId._id.toString(),
        name: review.userId.name,
        avatar: review.userId.avatar?.url,
      },
    };
  });

  return JSON.stringify(result);
};

export default async function Product({ params }: Props) {
  const { product } = params;
  const productId = product[1];
  const productInfo = JSON.parse(await fetchProduct(productId));

  let productImages: string[] = [productInfo.thumbnail];
  if (productInfo.images) {
    productImages = productImages.concat(productInfo.images);
  }

  const reviews = JSON.parse(await fetchProductReview(productId));

  return (
    <div className="p-5">
      <ProductView
        title={productInfo.title}
        description={productInfo.description}
        images={productImages}
        points={productInfo.bulletPoints}
        price={productInfo.price}
        sale={productInfo.sale}
        rating={productInfo.rating}
        outOfStock={productInfo.outOfStock}
      />
      <div className="py-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className=" text-2xl font-semibold mb-2">후기</h1>
          <Link
            href={`/add-review/${productInfo.id}`}
            className=" underline text-blue-700"
          >
            내 후기 쓰기
          </Link>
        </div>
        <div>
          <ReviewsList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
