import WishListProductCard from "@/app/components/WishListProductCard";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import WishListModel from "@/app/models/wishListModel";
import { auth } from "@/auth";
import React from "react";

const fetchWishList = async () => {
  const session = await auth();
  if (!session?.user) return null;
  const userId = session.user.id;

  await startDb();
  const wishList = await WishListModel.findOne<{
    products: [
      {
        _id: Object;
        title: string;
        thumbnail: { url: string };
        price: { discounted: number };
      }
    ];
  }>({ user: userId }).populate({
    path: "products",
    select: "title thumbnail.url price.discounted",
    model: ProductModel,
  });

  if (!wishList) return [];

  const wishListProduct = wishList?.products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      url: product.thumbnail.url,
      price: product.price.discounted,
    };
  });

  return wishListProduct;
};

export default async function WishList() {
  const products = await fetchWishList();

  if (!products || !products.length) {
    return (
      <>
        <h1 className=" text-lg font-semibold pl-2">나의 찜한 목록</h1>
        <h2 className=" text-xl opacity-50 text-center p-6 font-semibold">
          찜한 상품이 없습니다.
        </h2>
      </>
    );
  }

  return (
    <div className=" space-y-4 p-4">
      <h1 className=" text-lg font-semibold pl-2">나의 찜한 목록</h1>
      {products.map((product) => (
        <WishListProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
