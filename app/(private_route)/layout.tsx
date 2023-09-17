import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { auth } from "@/auth";
import EmailVerificationBanner from "../components/EmailVerificationBanner";
import Navbar from "@components/navbar";

interface props {
  children: ReactNode;
}

export default async function PrivateLayout({ children }: props) {
  const session = await auth();
  if (!session) return redirect("/auth/signin");
  console.log("private session => ", session.user);

  return (
    <div className="max-w-screen-xl mx-auto p-4 lg:p-0">
      <Navbar />
      {session.user.verified ? null : <EmailVerificationBanner />}
      {children}
    </div>
  );
}
