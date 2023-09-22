"use client";

import ProductForm from "@/app/components/ProductForm";
import { NewProductInfo } from "@/app/types";
import React from "react";
import { ValidationError } from "yup";
import { toast } from "react-toastify";
import { uploadImage } from "@/app/utils/helper";
import { createProduct } from "../action";

export default function create() {
  const handleCreateProduct = async (values: NewProductInfo) => {
    const { thumbnail, images } = values;
    try {
      // await newProductInfoSchema.validate(values, { abortEarly: false });
      const thumbnailRes = await uploadImage(thumbnail!);

      let productImages: { url: string; id: string }[] = [];
      if (images) {
        const uploadPromise = images.map(async (imageFile) => {
          const { url, id } = await uploadImage(imageFile!);
          return { url, id };
        });

        productImages = await Promise.all(uploadPromise);
      }

      await createProduct({
        ...values,
        price: { base: values.mrp, discounted: values.salePrice },
        thumbnail: thumbnailRes,
        images: productImages,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.map((e) => {
          toast.warning(e.message);
        });
      }
    }
  };

  return (
    <>
      <ProductForm onSubmit={handleCreateProduct} />
    </>
  );
}
