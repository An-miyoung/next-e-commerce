import FeaturedProductForm from "@/app/components/FeaturedProductForm";
import FeaturedProductTable from "@/app/components/FeaturedProductTable";
import startDb from "@/app/lib/db";
import FeaturedProductModel from "@/app/models/featuredProduct";
import React from "react";

const fetchFeaturedProduct = async () => {
  await startDb();
  const products = await FeaturedProductModel.find();
  return products.map((product) => {
    return {
      id: product._id.toString(),
      banner: product.banner.url,
      title: product.title,
      link: product.link,
      linkTitle: product.linkTitle,
    };
  });
};

export default async function AddFeaturedProduct() {
  const products = await fetchFeaturedProduct();
  return (
    <>
      <FeaturedProductForm />
      <FeaturedProductTable products={products} />
    </>
  );
}
