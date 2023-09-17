import ProductTable from "@/app/components/ProductTable";
import React from "react";

const products = [
  {
    id: "12345",
    title: "12345",
    thumbnail: "https://",
    description: "awesome",
    price: {
      mrp: 3000,
      salePrice: 2900,
      saleOff: 10,
    },
    category: "food",
    quantity: 30,
  },
];

export default function ProductsPage() {
  return (
    <div>
      <ProductTable
        products={products}
        currentPageNo={1}
        hasMore={false}
        showPageNavigator={true}
      />
    </div>
  );
}
