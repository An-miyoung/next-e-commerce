import startDb from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";
import PasswordResetToken from "@/app/models/passwordResetToken";
import UserModel from "@/app/models/userModels";
import { UpdatePassword } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req: Request) => {
  try {
    const { password, token, userId } = (await req.json()) as UpdatePassword;
    if (!password || !token || !isValidObjectId(userId))
      return NextResponse.json(
        { error: "비밀번호가 없거나 가입하지 않은 사용자입니다. " },
        { status: 401 }
      );

    await startDb();
    const resetToken = await PasswordResetToken.findOne({ user: userId });
    if (!resetToken)
      return NextResponse.json(
        { error: "가입하지 않은 사용자입니다." },
        { status: 401 }
      );

    const matched = await resetToken.compareToken(token);
    if (!matched)
      return NextResponse.json(
        { error: "토큰인증에 실패했습니다." },
        { status: 401 }
      );

    const user = await UserModel.findById(userId);
    if (!user)
      return NextResponse.json(
        { error: "가입하지 않은 사용자입니다." },
        { status: 404 }
      );

    const isMatched = await user.comparePassword(password);
    if (isMatched)
      return NextResponse.json(
        { error: "이전 비밀번호와 다른 번호를 입력하세요" },
        { status: 401 }
      );

    user.password = password;
    await user.save();
    await PasswordResetToken.findByIdAndDelete(resetToken._id);

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "update-password",
    });

    return NextResponse.json({ message: "비밀번호가 재설정됐습니다." });
  } catch (error: any) {
    return NextResponse.json(
      { error: "비밀전호 재설정에 실패했습니다." },
      { status: 500 }
    );
  }
};
