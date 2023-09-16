import PasswordResetToken from "@/app/models/passwordResetToken";
import UserModel from "@/app/models/userModels";
import { ForgetPassword } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import startDb from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";
import { use } from "react";

export const POST = async (req: Request) => {
  try {
    const { email } = (await req.json()) as ForgetPassword;
    if (!email) {
      return NextResponse.json(
        { error: "존재하지 않은 이메일입니다." },
        { status: 401 }
      );
    }

    await startDb();
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "가입하지 않은 이메일입니다." },
        { status: 404 }
      );
    }

    await PasswordResetToken.findOneAndDelete({ user: user._id });

    const token = crypto.randomBytes(36).toString("hex");
    await PasswordResetToken.create({
      user: user._id,
      token,
    });

    const resetPasswordLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;
    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "forget-password",
      linkUrl: resetPasswordLink,
    });

    return NextResponse.json({
      message: "비밀번호 재설정을 위한 이메일을 확인해 주세요.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
