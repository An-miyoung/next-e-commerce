import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { auth } from "@/auth";

interface props {
  children: ReactNode;
}

export default async function GuestLayout({ children }: props) {
  const session = await auth();

  return (
    <div className=" max-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
