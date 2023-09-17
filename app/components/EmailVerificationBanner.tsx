"use client";

import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function EmailVerificationBanner() {
  const [submitting, setSubmitting] = useState(false);
  const { profile } = useAuth();
  console.log(profile);

  const applyForReverification = async () => {
    if (!profile) return;
    setSubmitting(true);
    const res = await fetch(`/api/users/verify?userId=${profile?.id}`, {
      method: "GET",
    });
    const { message, error } = await res.json();

    if (res.ok) {
      toast.success(message);
    }
    if (!res.ok && error) {
      toast.error(error);
    }
    setSubmitting(false);
  };

  if (profile?.verified) return null;
  return (
    <div className="p-2 text-center bg-yellow-500">
      <span>이메일 인증을 해주세요. </span>
      <button
        onClick={applyForReverification}
        className=" font-bold ml-2 text-green-900"
        disabled={submitting}
      >
        {submitting ? "인증하는 중..." : "이메일 인증하기"}
      </button>
    </div>
  );
}
