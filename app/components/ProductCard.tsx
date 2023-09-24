"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  CardFooter,
  Chip,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import truncate from "truncate";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
  product: {
    id: string;
    title: string;
    description: string;
    category: string;
    thumbnail: string;
    sale: number;
    price: {
      base: number;
      discounted: number;
    };
  };
}

export default function ProductCard({ product }: Props) {
  const [isPending, startTransition] = useTransition();
  const { loggedIn } = useAuth();
  const router = useRouter();

  const addToCart = async () => {
    console.log(product);
    if (!product.id) return;
    if (!loggedIn) router.push("/auth/signin");

    const res = await fetch("/api/product/cart", {
      method: "POST",
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });
    console.log(res);
    const { error } = await res.json();
    if (!res.ok && error) {
      toast.warning(error);
    }
  };
  return (
    <div key={product.id} className="border-2 border-black">
      <Card className="w-full">
        <Link className="w-full" href={`/${product.title}/${product.id}`}>
          <CardHeader
            shadow={false}
            floated={false}
            className="relative w-20 aspect-square m-0"
          >
            <div className="absolute p-2">
              <Chip color="red" value={`${product.sale}% off`} />
            </div>
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={200}
              height={200}
              priority={false}
            />
          </CardHeader>
          <CardBody>
            <div className="mb-2">
              <h3 className="line-clamp-1 font-medium text-blue-gray-800">
                {truncate(product.title, 50)}
              </h3>
            </div>
            <div className="flex justify-end items-center space-x-2 mb-2">
              <Typography
                color="blue-gray"
                className="font-medium line-through"
              >
                ${product.price.base}
              </Typography>
              <p> ~ </p>
              <Typography color="blue-gray" className="font-medium">
                ${product.price.discounted}
              </Typography>
            </div>
            <p className="font-normal text-sm opacity-75 line-clamp-3">
              {product.description}
            </p>
          </CardBody>
        </Link>
        <CardFooter className="pt-0 space-y-4">
          <Button
            ripple={false}
            fullWidth={false}
            onClick={() =>
              startTransition(async () => {
                await addToCart();
              })
            }
            disabled={isPending}
          >
            Add to Cart
          </Button>
          <Button
            ripple={false}
            fullWidth={false}
            className=" text-white shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
            disabled={isPending}
          >
            Buy Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}