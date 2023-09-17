"use client";

import ProductForm from "@/app/components/ProductForm";
import React from "react";

// const init = {
//   id: "1234567",
//   title: "Test",
//   description: "awesome",
//   thumbnail: "https://",
//   images: ["https://"],
//   bulletPoints: [],
//   mrp: 3000,
//   salePrice: 2500,
//   category: "food",
//   quantity: 30,
// };

export default function create() {
  const handleSubmit = () => {};
  return (
    <>
      <ProductForm
        onSubmit={(values) => {
          console.log(values);
        }}
      />
    </>
  );
}
