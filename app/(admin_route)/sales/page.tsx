import OrderModel from "@/app/models/orderModel";
import React from "react";
import dateformat from "dateformat";
import SalesCharts from "@/app/components/SalesCharts";
import GridView from "@/app/components/GridView";
import { formatPrice } from "@/app/utils/helper";

const sevenDaySalesHistory = async () => {
  // calcurate the date: 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dateList: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split("T")[0];
    dateList.push(dateString);
  }
  // fetch data from within those 7 days
  const lastSevenDaysSales: { _id: string; totalAmount: number }[] =
    await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

  // compare the date and fill empty sales with 0

  const sales = dateList.map((date) => {
    const matchedSale = lastSevenDaysSales.find((sale) => date === sale._id);
    return {
      day: dateformat(date, "ddd"),
      sale: matchedSale ? matchedSale.totalAmount : 0,
    };
  });

  const totalSales = lastSevenDaysSales.reduce((prev, { totalAmount }) => {
    // 배열을 더할때는 필요없지만, object 내부 인자를 더할때는 return 이 필요.
    return (prev += totalAmount);
  }, 0);

  return { sales, totalSales };
};

export default async function Sales() {
  const { sales, totalSales } = await sevenDaySalesHistory();
  return (
    <div>
      <GridView>
        <div className=" bg-blue-500 p-4 rounded space-y-4">
          <h1 className=" font-semibold text-3xl text-white">
            {formatPrice(totalSales)}
          </h1>
          <div className=" text-white">
            <p>총 판매금액</p>
            <p>지난 7일</p>
          </div>
        </div>
      </GridView>
      <h1 className=" font-semibold text-3xl mt-10">지난 7일간 판매챠트</h1>
      <SalesCharts data={sales} />
    </div>
  );
}
