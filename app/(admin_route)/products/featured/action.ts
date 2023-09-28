"use server";

import startDb from "@/app/lib/db";
import FeaturedProductModel from "@/app/models/featuredProduct";
import { FeaturedProductForUpdate, NewFeaturedProduct } from "@/app/types";
import { removeImageFromCloud } from "../action";

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

export const updateFeaturedProduct = async (
  id: string,
  info: FeaturedProductForUpdate
) => {
  try {
    if (!info) return;
    await startDb();
    await FeaturedProductModel.findByIdAndUpdate(id, {
      ...info,
    });
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const deleteFeaturedProduct = async (id: string) => {
  try {
    await startDb();
    const product = await FeaturedProductModel.findByIdAndDelete(id);
    if (product) {
      await removeImageFromCloud(product.banner.id);
    }
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
