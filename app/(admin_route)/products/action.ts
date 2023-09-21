"use server";

import startDb from "@/app/lib/db";
import ProductModel, { NewProduct } from "@/app/models/productModel";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

export const getCloudConfig = async () => {
  return {
    name: process.env.CLOUD_NAME!,
    key: process.env.CLOUD_API_KEY!,
  };
};

// generate our cloud signature
export const getCloudSignature = async () => {
  const secret = cloudinary.config().api_secret! as string;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
    },
    secret
  );

  return { timestamp, signature };
};

// create product
export const createProduct = async (info: NewProduct) => {
  try {
    await startDb();
    const res = await ProductModel.create({ ...info });
    console.log(res);
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Fail to create new product");
  }
};
