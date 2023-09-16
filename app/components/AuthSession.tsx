"use client";

// SessionProvider 는 react의 context 같은 기능을 한다
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthSession({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
