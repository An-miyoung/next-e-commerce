"use client";

import React from "react";
import ProductForm, { InitialValue } from "./ProductForm";
import { NewProductInfo, ProductResponse, ProductToUpdate } from "@/app/types";
import {
  removeAndUpdateProductImage,
  removeImageFromCloud,
  updateProduct,
} from "../(admin_route)/products/action";
import { uploadImage } from "@utils/helper";
import { ValidationError } from "yup";
import { toast } from "react-toastify";
import { updateProductInfoSchema } from "@utils/validationSchema";

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

  const handleSubmit = async (values: NewProductInfo) => {
    try {
      const { thumbnail, images } = values;

      await updateProductInfoSchema.validate(values, { abortEarly: false });
      const dataToUpdate: ProductToUpdate = {
        title: values.title,
        description: values.description,
        bulletPoints: values.bulletPoints,
        category: values.category,
        quantity: values.quantity,
        price: { base: values.mrp, discounted: values.salePrice },
      };

      if (thumbnail) {
        // 기본 썸네일을 클라우드에서 지운다.
        console.log(thumbnail);
        // await removeImageFromCloud(product.thumbnail.id);
        const { id, url } = await uploadImage(thumbnail);
        console.log(id, url);
        dataToUpdate.thumbnail = { id, url };
      }

      if (images?.length) {
        const uploadPromise = images.map(async (imageFile) => {
          return await uploadImage(imageFile!);
        });
        dataToUpdate.images = await Promise.all(uploadPromise);

        await updateProduct(product.id, dataToUpdate);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.map((e) => {
          toast.warning(e.message);
        });
      }
    }
  };

  return (
    <ProductForm
      onImageRemove={handleImageRemove}
      initialValue={initialValue}
      onSubmit={handleSubmit}
    />
  );
}
