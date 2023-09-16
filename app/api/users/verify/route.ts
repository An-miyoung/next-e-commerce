import EmailVerificationToken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModels";
import { EmailVerifyRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { token, userId } = (await req.json()) as EmailVerifyRequest;

    if (!isValidObjectId(userId) || !token) {
      return NextResponse.json(
        { error: "유효하지 않은 요청 : 사용자식별오류 혹은 토큰없음" },
        { status: 401 }
      );
    }

    const verifyToken = await EmailVerificationToken.findOne({
      user: userId,
    });
    if (!verifyToken) {
      return NextResponse.json(
        { error: "유효하지 않은 토큰" },
        { status: 401 }
      );
    }

    const isMatched = await verifyToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json({ error: "인증실패" }, { status: 401 });
    }

    await UserModel.findByIdAndUpdate(userId, { verified: true });
    await EmailVerificationToken.findByIdAndDelete(verifyToken._id);

    return NextResponse.json({ message: "이메일이 인증됐습니다." });
  } catch (error: any) {
    return NextResponse.json(
      { error: "이메일 인증에 실패했습니다." },
      { status: 500 }
    );
  }
};
