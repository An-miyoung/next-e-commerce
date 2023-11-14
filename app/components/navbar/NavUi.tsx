"use client";

import Link from "next/link";
import React from "react";
import {
  Navbar as MaterialNav,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import { Bars3Icon, HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

import { MobileNav } from "../MobileNav";
import CartIcon from "../CartIcon";
// tsconfig 안에 경로를 이렇게 표기하겠다고 선언함
import useAuth from "@hooks/useAuth";
import ProfileMenu from "../ProfileMenu";
import SearchForm from "../SearchForm";

interface Props {
  cartItemsCount: number;
  avatar?: string;
}

export const menuItems = [
  {
    href: "/profile",
    icon: <UserCircleIcon className="h-4 w-4" />,
    label: "My Profile",
  },
  {
    href: "/profile/orders",
    icon: <ShoppingBagIcon className="h-4 w-4" />,
    label: "Orders",
  },
  {
    href: "/profile/wishList",
    icon: <HeartIcon className="h-4 w-4" />,
    label: "WishList",
  },
];

export default function NavUI({ cartItemsCount, avatar }: Props) {
  const [open, setOpen] = React.useState(false);
  const { loading, loggedIn } = useAuth();
  const [innerWidth, setInnerWidth] = React.useState(0);

  React.useEffect(() => {
    setInnerWidth(window.innerWidth);
    // 로그인을 하는 샌드위치버튼이 눌린 상태에서 화면을 960픽셀이상으로 늘리면 drawer 가 닫힌다.
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <MaterialNav className="mx-auto max-w-screen-xl px-4 py-2">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link
            href="/"
            className="mr-4 cursor-pointer py-1.5 lg:ml-2 font-semibold"
          >
            Peanuts Closet
          </Link>

          <div className="hidden lg:flex-1 lg:flex lg:justify-center ">
            <div className="md:w-96 w-full md:mx-0 mx-4">
              <SearchForm submitTo={`/search?query=`} />
            </div>
          </div>

          <div className="hidden lg:flex gap-2 items-center">
            <CartIcon cartItems={cartItemsCount} />
            {loggedIn ? (
              <ProfileMenu menuItems={menuItems} avatar={avatar} />
            ) : loading ? (
              <Spinner />
            ) : (
              <>
                <Link className="px-4 py-1" href="/auth/signin">
                  Sign in
                </Link>
                <Link
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  href="/auth/signup"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <CartIcon cartItems={cartItemsCount} />

            <IconButton
              variant="text"
              color="blue-gray"
              className="lg:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <XMarkIcon className="h-6 w-6" strokeWidth={2} />
              ) : (
                <Bars3Icon className="h-6 w-6" strokeWidth={2} />
              )}
            </IconButton>
          </div>
        </div>
        <div className="lg:hidden flex-1 flex justify-center">
          <div className="md:w-96 w-full md:mx-0 mx-4 mt-1">
            <SearchForm submitTo={`/search?query=`} />
          </div>
        </div>
      </MaterialNav>
      <div className="lg:hidden">
        <MobileNav
          menuItems={menuItems}
          onClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </>
  );
}
