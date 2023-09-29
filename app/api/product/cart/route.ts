import startDb from "@/app/lib/db";
import CartModel from "@/app/models/cartModel";
import { NewCartRequest } from "@/app/types";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user)
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );

    const { productId, quantity } = (await req.json()) as NewCartRequest;
    if (!isValidObjectId(productId) || isNaN(quantity))
      return NextResponse.json(
        { error: "존재하지 않는 상품입니다." },
        { status: 404 }
      );
    await startDb();
    const cart = await CartModel.findOne({ userId: user.id });
    // 새로운 장바구니
    if (!cart) {
      await CartModel.create({
        userId: user.id,
        items: [{ productId, quantity }],
      });
      return NextResponse.json({ success: true });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // 장바구니에 기존 아이템의 수량을 변경하기
      existingItem.quantity += quantity;
      // 아이템의 수량을 0으로 만들면 카트에서 지운다
      if (quantity <= 0) {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    } else {
      // 예전 장바구니에 새로운 아이템 더하기
      cart.items.push({ productId: productId as any, quantity });
    }
    await cart.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
