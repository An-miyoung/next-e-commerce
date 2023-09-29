"use server";

import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModels";
import { UserProfileToUpdate } from "@/app/types";

export const updateUserProfile = async (info: UserProfileToUpdate) => {
  try {
    await startDb();
    await UserModel.findByIdAndUpdate(info.id, {
      name: info.name,
      avatar: info.avatar,
    });
  } catch (error: any) {
    console.log("사용자프로파일을 수정하는데 실패했습니다.");
    throw new Error(error.message);
  }
};
