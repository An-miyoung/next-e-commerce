import UpdateProduct from "@/app/components/UpdateProduct";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { ProductResponse } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

const fetchProductInfo = async (productId: string): Promise<string> => {
  if (!isValidObjectId(productId)) return redirect("/404");

  await startDb();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");

  const finalProduct: ProductResponse = {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    bulletPoints: product.bulletPoints,
    thumbnail: product.thumbnail,
    images: product.images?.map(({ url, id }) => {
      return { url, id };
    }),
    price: product.price,
    quantity: product.quantity,
    category: product.category,
  };
  // Warning: Only plain objects can be passed to Client Components from Server Components. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.
  // object 를 server 에서 client 로 보낼수 없다는 경고를 해결하기 위해 stringify 시킨다.
  return JSON.stringify(finalProduct);
};

export default async function UpdatePage({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = params;
  const product = await fetchProductInfo(productId);
  // stringify 한 데이터를 object 로 변환해준다.
  return <UpdateProduct product={JSON.parse(product)} />;
}
