"use client";

import React from "react";
import ProductForm, { InitialValue } from "./ProductForm";
import { ProductResponse } from "@/app/types";

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

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return <ProductForm initialValue={initialValue} onSubmit={handleSubmit} />;
}
