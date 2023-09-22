import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { auth } from "@/auth";
import Navbar from "@components/navbar";

interface props {
  children: ReactNode;
}

export default async function HomeLayout({ children }: props) {
  return (
    <div className=" max-w-screen-2xl mx-auto p-4">
      <Navbar />
      {children}
    </div>
  );
}
