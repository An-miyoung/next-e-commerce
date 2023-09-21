"use server";

import startDb from "@/app/lib/db";
import ProductModel, { NewProduct } from "@/app/models/productModel";
import { ProductToUpdate } from "@/app/types";
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

export const updateProduct = async (
  id: string,
  productInfo: ProductToUpdate
) => {
  try {
    await startDb();
    // productInfo 내부의 images 를 다른 이름으로 보관하고 삭제해서 push operator 를 사용할때 충돌이 나지 않게 한다
    const updateImages = productInfo.images && [...productInfo.images];
    // delete 로 그냥 지울수 있다!!!!!!!
    delete productInfo.images;
    await ProductModel.findByIdAndUpdate(id, {
      ...productInfo,
      // 기존내용 위에 지정한 내용한 push 해준다, 즉 images 가 새로 생긴다.
      $push: {
        images: updateImages,
      },
    });
  } catch (error: any) {
    console.log("상품수정에 실패했습니다.", error.message);
    throw new Error(error.message);
  }
};
