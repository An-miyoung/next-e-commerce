import React from "react";
import HorizontalMenu from "@components/HorizontalMenu";
import Image from "next/image";
import { formatPrice } from "@utils/helper";
import Link from "next/link";

interface Props {
  products: {
    id: string;
    title: string;
    thumbnail: string;
    price: number;
  }[];
}

export default function SimillarProductList({ products }: Props) {
  return (
    <div>
      <h1 className=" font-semibold text-lg text-blue-gray-600">
        당신이 좋아할 만한 상품들
      </h1>
      <HorizontalMenu>
        {products.map((product) => {
          return (
            <Link href={`/${product.title}/${product.id}`} key={product.id}>
              <div className="w-[100px] mr-4 space-y-2">
                <Image
                  width={100}
                  height={100}
                  src={product.thumbnail}
                  alt={product.title}
                  style={{ width: "100px", height: "100px" }}
                  className="rounded"
                />
                <div>
                  <h2 className=" text-sm line-clamp-3">{product.title}</h2>
                  <h2>{formatPrice(product.price)}</h2>
                </div>
              </div>
            </Link>
          );
        })}
      </HorizontalMenu>
    </div>
  );
}
