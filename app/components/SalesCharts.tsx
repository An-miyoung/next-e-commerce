"use client";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPrice } from "../utils/helper";

interface Props {
  data: {
    day: string;
    sale: number;
  }[];
}

export default function SalesCharts({ data }: Props) {
  return (
    <LineChart
      margin={{ left: 50, top: 50 }}
      width={600}
      height={400}
      data={data}
    >
      <XAxis dataKey="day" />
      <YAxis dataKey="sale" tickFormatter={(value) => formatPrice(value)} />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="sale" stroke="#8884d8" />
      <Tooltip formatter={(value, name) => [formatPrice(+value), name]} />
    </LineChart>
  );
}
