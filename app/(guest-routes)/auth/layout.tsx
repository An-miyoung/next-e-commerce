import React from "react";

interface props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: props) {
  return (
    <div className=" max-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
