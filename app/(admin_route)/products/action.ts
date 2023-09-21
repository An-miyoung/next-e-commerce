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
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Fail to create new product");
  }
};

export const removeImageFromCloud = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};

export const removeAndUpdateProductImage = async (
  id: string,
  publicId: string
) => {
  try {
    const { result } = await cloudinary.uploader.destroy(publicId);
    // DB 에서 지우기
    if (result === "ok") {
      await startDb();
      await ProductModel.findByIdAndUpdate(id, {
        // pull operator 는 원하는 조건과 일치하는 것을 pull(제거한다)
        $pull: { images: { id: publicId } },
      });
    }
  } catch (error: any) {
    console.log("이미지를 삭제하는데 실패했습니다.", error.message);
    throw new Error(error.message);
  }
};
