"use client";

import React from "react";
import ProductForm, { InitialValue } from "./ProductForm";
import { ProductResponse } from "@/app/types";
import { removeAndUpdateProductImage } from "../(admin_route)/products/action";

interface Props {
  product: ProductResponse;
}

export default function UpdateProduct({ product }: Props) {
  const initialValue: InitialValue = {
    ...product,
    thumbnail: product.thumbnail.url,
    images: product.images?.map(({ url }) => url),
    mrp: product.price.base,
    salePrice: product.price.discounted,
  };

  const handleImageRemove = (source: string) => {
    const fileName = source.split("/").pop();
    const publicId = fileName?.split(".")[0];
    if (!publicId) return;

    removeAndUpdateProductImage(product.id, publicId);
  };

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <ProductForm
      onImageRemove={handleImageRemove}
      initialValue={initialValue}
      onSubmit={handleSubmit}
    />
  );
}
