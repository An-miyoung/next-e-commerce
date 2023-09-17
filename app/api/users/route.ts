import UserModel from "@models/userModels";
import startDb from "@lib/db";
import { NextResponse } from "next/server";
import { NewUserRequest } from "@/app/types";
import EmailVerificationToken from "@models/emailVerificationToken";
import crypto from "crypto";
import { sendEmail } from "@/app/lib/email";

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
  const verificationUrl = `${process.env.VERIFICATION_URL}?token=${token}&userId=${newUser._id}`;

  await sendEmail({
    profile: { name: newUser.name, email: newUser.email },
    subject: "verification",
    linkUrl: verificationUrl,
  });

  return NextResponse.json({ message: "이메일을 인증하세요." });
};
