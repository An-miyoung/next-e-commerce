import EmailVerificationToken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModels";
import { EmailVerifyRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/app/lib/email";
import startDb from "@/app/lib/db";

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

export const GET = async (req: Request) => {
  try {
    console.log(req.url);
    const userId = req.url.split("?userId=")[1];
    if (!isValidObjectId(userId))
      return NextResponse.json(
        { error: "존재하지 않는 사용자입니다." },
        { status: 401 }
      );

    await startDb();
    const user = await UserModel.findById(userId);
    if (!user)
      return NextResponse.json(
        { error: "가입하지 않는 사용자입니다." },
        { status: 401 }
      );

    if (user.verified)
      return NextResponse.json(
        { error: "이미 이메일인증이 됐습니다." },
        { status: 401 }
      );

    const token = crypto.randomBytes(36).toString("hex");
    await EmailVerificationToken.findOneAndDelete({ user: userId });
    await EmailVerificationToken.create({
      user: userId,
      token,
    });
    const verificationUrl = `${process.env.VERIFICATION_URL}?token=${token}&userId=${userId}`;

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "verification",
      linkUrl: verificationUrl,
    });

    return NextResponse.json({ message: "이메일을 확인해주세요." });
  } catch (error: any) {
    return NextResponse.json(
      { error: "인증토큰을 읽어오는데 실패했습니다." },
      { status: 500 }
    );
  }
};
