"use client";

import { Button, Rating } from "@material-tailwind/react";
import { StarIcon as RatedIcon } from "@heroicons/react/24/solid";
import { StarIcon as UnratedIcon } from "@heroicons/react/24/outline";
import React, { useState, FormEventHandler, useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  productId: string;
  initialValue?: { rating: number; comment: string };
}

export default function ReviewForm({ productId, initialValue }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });

  const submitReview: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const { rating, comment } = review;
    if (!rating) {
      return toast.warning("별점을 주세요. 제발요~");
    }

    setIsPending(true);
    const res = await fetch("/api/product/review", {
      method: "POST",
      body: JSON.stringify({ productId, rating, comment }),
    });
    const { error } = await res.json();
    setIsPending(false);

    if (!res.ok) {
      return toast.warning(error);
    }
  };

  useEffect(() => {
    if (initialValue) setReview({ ...initialValue });
  }, [initialValue]);

  return (
    <form onSubmit={submitReview} className="space-y-2">
      <div>
        <h3 className="font-semibold text-lg mb-1">별점주기</h3>
        <Rating
          ratedIcon={<RatedIcon className="h-8 w-8" />}
          unratedIcon={<UnratedIcon className="h-8 w-8" />}
          value={initialValue?.rating || review.rating}
          onChange={(rating) => setReview({ ...review, rating })}
        />
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-1">후기 쓰기</h3>
        <textarea
          placeholder="상품에 대한 평을 써 주세요."
          className="w-full resize-none border p-2 rounded border-blue-gray-500 outline-blue-400 transition"
          rows={4}
          value={review.comment}
          onChange={({ target }) =>
            setReview({ ...review, comment: target.value })
          }
        />
      </div>
      <div className="text-right">
        <Button disabled={isPending} type="submit" color="blue">
          제출하기
        </Button>
      </div>
    </form>
  );
}
