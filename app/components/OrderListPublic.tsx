"use client";
import Image from "next/image";
import React from "react";
import dateFormat from "dateformat";
import { Chip } from "@material-tailwind/react";
import { Orders } from "../types";

export default function OrderListPublic({ orders }: { orders: Orders[] }) {
  return (
    <div className=" max-w-sm mt-5 md:mt-10 mx-auto">
      {orders.map((order) => {
        return (
          <div key={order.id} className="py-4 space-y-4">
            <div className="flex justify-between items-center bg-blue-gray-400 text-white p-2">
              <div className="flex flex-col">
                <p className=" text-sm">
                  주문시각: {dateFormat(order.date, "yyyy-mm-dd, HH:MM")}
                </p>
                <p className=" text-sm">
                  총금액: {order.total.toLocaleString()}원
                </p>
              </div>
              <Chip value={order.paymentStatus} color="amber" />
            </div>

            {order.products.map((p) => {
              return (
                <div key={p.id} className="flex space-x-2">
                  <Image
                    src={p.thumbnail}
                    width={50}
                    height={50}
                    alt={p.title}
                    style={{ width: "auto", height: "auto" }}
                  />
                  <div>
                    <p>{p.title}</p>
                    <div className="flex space-x-2 text-sm">
                      <p>{p.quantity}개</p>
                      <p>X</p>
                      <p>{p.price.toLocaleString()}원</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="text-right p-2 border-t border-b">
              <p>
                주문진행상태:{" "}
                <span className="font-semibold uppercase">
                  {order.deliveryStatus}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
