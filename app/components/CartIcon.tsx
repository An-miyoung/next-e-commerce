import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  cartItems: number;
}

export default function CartIcon({ cartItems }: Props) {
  return (
    <div className=" bg-amber-500 w-10 h-10 xs:h-8 xs-w-8 p-1 flex relative rounded-full items-center justify-center">
      <Link href="/cart" className="i">
        <ShoppingCartIcon className="w-5 h-5 " />
        <div className=" absolute text-sm text-white top-0 right-0 bg-gray-500 rounded-full w-5 h-5 text-center">
          {cartItems}
        </div>
      </Link>
    </div>
  );
}
