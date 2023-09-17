import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModels";
import { SignInCredentials } from "@/app/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, password } = (await req.json()) as SignInCredentials;
  if (!email || !password)
    return NextResponse.json({
      error: "존재하지 않는 이메일 혹은 비밀번호입니다.",
    });

  await startDb();

  const user = await UserModel.findOne({ email });
  if (!user)
    return NextResponse.json({
      error: "존재하지 않는 사용자입니다.",
    });

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch)
    return NextResponse.json({
      error: "비밀번호가 다릅니다.",
    });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar?.url,
      role: user.role,
      verified: user.verified,
    },
  });
};
