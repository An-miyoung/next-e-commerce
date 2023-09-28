"use server";

import startDb from "@/app/lib/db";
import FeaturedProductModel from "@/app/models/featuredProduct";
import { NewFeaturedProduct } from "@/app/types";

export const createFeaturedProduct = async (info: NewFeaturedProduct) => {
  try {
    if (!info) return;
    await startDb();
    await FeaturedProductModel.create({ ...info });
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
