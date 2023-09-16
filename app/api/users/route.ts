import UserModel from "@models/userModels";
import startDb from "@lib/db";
import { NextResponse } from "next/server";
import { NewUserRequest } from "@/app/types";
import nodemailer from "nodemailer";
import EmailVerificationToken from "@models/emailVerificationToken";
import crypto from "crypto";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;

  startDb();
  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
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

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  const verifiedMail = await transport.sendMail({
    from: "peanuts-closet@peanut.com",
    to: newUser.email,
    html: `<h1>Welcome to Join Peanuts-Closet</h1>
    <h2>Please, verify your Email by clicking on <a href="${verificationUrl}">this link</a></h2>`,
  });

  return NextResponse.json({ message: "이메일을 인증하세요." });
};
