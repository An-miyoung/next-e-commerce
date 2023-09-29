"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  id?: string;
  verified?: boolean;
}

export default function EmailVerificationBanner({ id, verified }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const applyForReverification = async () => {
    if (!id) return;
    setSubmitting(true);
    const res = await fetch(`/api/users/verify?userId=${id}`, {
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

  if (verified) return null;
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
