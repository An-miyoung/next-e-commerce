import ProductView from "@/app/components/ProductView";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { isValidObjectId } from "mongoose";
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
  };
  return JSON.stringify(finalProduct);
};

export default async function Product({ params }: Props) {
  const { product } = params;
  const productId = product[1];
  const productInfo = JSON.parse(await fetchProduct(productId));

  let productImages: string[] = [productInfo.thumbnail];
  if (productInfo.images) {
    productImages = productImages.concat(productInfo.images);
  }

  return (
    <div className="p-5">
      <ProductView
        title={productInfo.title}
        description={productInfo.description}
        images={productImages}
        points={productInfo.bulletPoints}
        price={productInfo.price}
        sale={productInfo.sale}
      />
    </div>
  );
}
