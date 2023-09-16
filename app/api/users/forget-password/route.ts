import PasswordResetToken from "@/app/models/passwordResetToken";
import UserModel from "@/app/models/userModels";
import { ForgetPassword } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import startDb from "@/app/lib/db";

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

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "bba5cff856b0b4",
        pass: "ae82f06d522b95",
      },
    });

    const resetPasswordLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

    await transport.sendMail({
      from: "peanuts-closet@peanut.com",
      to: user.email,
      html: `<h1>비밀번호를 재설정합니다.</h1>
      <h2><a href="${resetPasswordLink}">이 링크</a>를 눌러 비밀번호를 재설정하세요.</h2>`,
    });

    return NextResponse.json({
      message: "비밀번호 재설정을 위한 이메일을 확인해 주세요.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
