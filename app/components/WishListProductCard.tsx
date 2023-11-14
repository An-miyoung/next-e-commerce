"use client";

import Image from "next/image";
import React, { useTransition } from "react";
import { formatPrice } from "../utils/helper";
import { Button } from "@material-tailwind/react";
import { WishListUi } from "../ui/WishListUi";
import Link from "next/link";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  product: {
    id: string;
    title: string;
    url: string;
    price: number;
  };
}

export default function WishListProductCard({ product }: Props) {
  const [isPending, startTransition] = useTransition();
  const { id, title, url, price } = product;
  const router = useRouter();

  const updateWishList = async () => {
    if (!id) return;

    const res = await fetch("/api/wishList", {
      method: "POST",
      body: JSON.stringify({ productId: id }),
    });
    const { error } = await res.json();
    if (!res.ok && error) {
      toast.warning(error);
    }
    router.refresh();
  };

  return (
    <div className="flex space-x-4 items-center">
      <Image src={url} alt={title} width={100} height={100} priority />
      <Link className="flex-1 h-full" href={`/${product.title}/${product.id}`}>
        <h1 className=" text-lg text-blue-gray-700 ">{title}</h1>
        <p className=" text-blue-gray-700">{formatPrice(price)}</p>
      </Link>
      <Button
        onClick={() =>
          startTransition(async () => {
            await updateWishList();
          })
        }
        variant="text"
        color="blue"
      >
        <WishListUi isActive />
      </Button>
    </div>
  );
}
