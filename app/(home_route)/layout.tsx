import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { auth } from "@/auth";
import Navbar from "@components/navbar";

interface props {
  children: ReactNode;
}

export default async function HomeLayout({ children }: props) {
  return (
    <div className=" max-w-screen-xl mx-auto lg:p-0 p-4">
      <Navbar />
      {children}
    </div>
  );
}
