"use client";
import React, { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

export default function Verify({ searchParams }: Props) {
  // interface 를 선언하지 않으면 아래와 같이 useSearchParams hook 을 가져와 쓴다.
  // const searchparams = useSearchParams();
  // const token = searchparams.get("token");

  const { token, userId } = searchParams;
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      body: JSON.stringify({ token, userId }),
    }).then(async (res) => {
      const { error, message } = (await res.json()) as {
        message: string;
        error: string;
      };
      if (res.ok) {
        toast.success(message);
      }
      if (!res.ok && error) {
        toast.error(error);
      }
      router.replace("/");
    });
  }, [router, token, userId]);

  // Todo: 404페이지를 만들어 redirect 해주는 방법
  if (!token || !userId) return notFound();
  return (
    <div className="text-3xl opacity-70 text-center p-6 animate-pulse">
      잠깐만 기다려주세요...
      <p className="p-6">지금 이메일 인증중입니다.</p>
    </div>
  );
}
