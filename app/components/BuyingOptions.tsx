"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@material-tailwind/react";
import CartCountUpdater from "@components/CartCountUpdater";
import { useRouter, useParams } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function BuyingOptions() {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // buyingOption 은 화면이 없기때문에
  //function BuyingProduct({ params }: Props)
  // const { product } = params;
  // 같은 형태로 가져올 수 있다. 부모가 갖고 있는 params를 useHook 으로 가져다 쓴다.
  const params = useParams();
  const { product } = params;
  const productId = product[1];
  const { loggedIn } = useAuth();
  const router = useRouter();

  const handleIncrement = () => {
    setQuantity((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    if (quantity === 0) return;
    setQuantity((prevCount) => prevCount - 1);
  };

  const addToCart = async () => {
    if (!productId) return;
    if (!loggedIn) router.push("/auth/signin");

    const res = await fetch("/api/product/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    const { error } = await res.json();
    if (!res.ok && error) {
      toast.warning(error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <CartCountUpdater
        onDecrement={handleDecrement}
        onIncrement={handleIncrement}
        value={quantity}
      />

      <Button
        onClick={() =>
          startTransition(async () => {
            await addToCart();
          })
        }
        variant="text"
        disabled={isPending}
      >
        Add to Cart
      </Button>
      <Button color="amber" className="rounded-full" disabled={isPending}>
        Buy Now
      </Button>
    </div>
  );
}