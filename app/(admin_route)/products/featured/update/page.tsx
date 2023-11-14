// import FeaturedProductForm from "@/app/components/FeaturedProductForm";
import startDb from "@/app/lib/db";
import FeaturedProductModel from "@/app/models/featuredProduct";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

const fetchFeaturedProduct = async (id: string) => {
  await startDb();
  const product = await FeaturedProductModel.findById(id);
  if (!product) return redirect("404");

  return JSON.stringify({
    id: product._id.toString(),
    title: product.title,
    link: product.link,
    linkTitle: product.linkTitle,
    banner: product.banner.url,
  });
};

export default async function UpdateFeaturedProduct({ searchParams }: Props) {
  const { id } = searchParams;
  if (!isValidObjectId(id)) return redirect("/404");
  const product = JSON.parse(await fetchFeaturedProduct(id));
  // return <FeaturedProductForm initialValue={product} />;
}
