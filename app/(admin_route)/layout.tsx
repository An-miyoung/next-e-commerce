import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { auth } from "@/auth";
import AdminSidebar from "../components/AdminSideBar";

interface props {
  children: ReactNode;
}

export default async function AdminLayout({ children }: props) {
  const session = await auth();
  const user = session.user;
  const isAdmin = user?.role === "admin";
  if (!isAdmin) return redirect("/auth/signin");

  return <AdminSidebar>{children}</AdminSidebar>;
}
