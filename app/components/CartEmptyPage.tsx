import Link from "next/link";
import React from "react";

export default function CartEmptyPage() {
  return (
    <div className=" flex flex-col justify-center items-center py-10 md:py-20">
      <h1 className=" text-lg md:text-2xl font-semibold">당신의 장바구니</h1>
      <h2 className=" py-5">
        저장된 상품이 없습니다.{"   "}
        <Link href={"/"} className=" text-blue-700 underline">
          쇼핑하러가기
        </Link>
      </h2>
    </div>
  );
}
