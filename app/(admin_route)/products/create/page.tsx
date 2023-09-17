"use client";

import ProductForm from "@/app/components/ProductForm";
import { NewProductInfo } from "@/app/types";
import React from "react";
import { newProductInfoSchema } from "@utils/validationSchema";
import { ValidationError } from "yup";
import { toast } from "react-toastify";

export default function create() {
  const handleCreateProduct = async (values: NewProductInfo) => {
    try {
      await newProductInfoSchema.validate(values, { abortEarly: false });
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
