import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModels";
import { auth } from "@/auth";
import EmailVerificationBanner from "@components/EmailVerificationBanner";
import ProfileForm from "@components/ProfileForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const fetchUserProfile = async () => {
  const session = await auth();
  if (!session) return redirect("/auth/signin");

  await startDb();
  const user = await UserModel.findById(session.user.id);
  if (!user) return redirect("/auth/signin");
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar?.url,
    verified: user.verified,
  };
};

export default async function Profile() {
  const { id, name, email, avatar, verified } = await fetchUserProfile();
  return (
    <div>
      <EmailVerificationBanner id={id} verified={verified} />
      <div className="flex py-4 space-y-4">
        <div className="border-r border-gray-700 p-4 space-y-4">
          <ProfileForm id={id} email={email} name={name} avatar={avatar} />
        </div>

        <div className="p-4 flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold uppercase opacity-70 mb-4">
              Your recent orders
            </h1>
            <Link href="/profile/orders" className="uppercase hover:underline">
              See all orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
