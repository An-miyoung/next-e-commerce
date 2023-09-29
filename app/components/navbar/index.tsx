import React from "react";
import NavUI from "./NavUi";
import startDb from "@/app/lib/db";
import { auth } from "@/auth";
import CartModel from "@/app/models/cartModel";
import { Types } from "mongoose";

const getCartItemsCount = async () => {
  try {
    const session = await auth();
    if (!session?.user) return 0;

    const userId = session.user.id;
    await startDb();
    const cart = await CartModel.aggregate([
      // string 인 userId 를 입력형식에 맞춰 object 로 만들어준다.
      {
        $match: { userId: new Types.ObjectId(userId) },
      },
      // object로만 보이는 items를 풀어서 개별적으로 보이게 한다.
      {
        $unwind: "$items",
      },
      // 같은 카트아이디끼리 묶은 후 items의 갯수를 더해 totalQuantity 필드에 넣어준다.
      {
        $group: {
          _id: "$_id",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
    ]);
    if (cart.length) {
      return cart[0].totalQuantity;
    } else return 0;
  } catch (error: any) {
    console.log("장바구니를 가져오는데 실패했습니다.", error.message);
    return 0;
  }
};

export default async function Navbar() {
  const count = await getCartItemsCount();
  return (
    <div>
      {" "}
      <NavUI cartItemsCount={count} />
    </div>
  );
}
