import ProductTable from "@/app/components/ProductTable";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import React from "react";

interface Props {
  searchParams: { query: string };
}

const searchproduct = async (query: string) => {
  await startDb();
  const products = await ProductModel.find({
    title: { $regex: query, $options: "i" },
  });

  const results = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      thumbnail: product.thumbnail.url,
      description: product.description,
      price: {
        mrp: product.price.base,
        salePrice: product.price.discounted,
        slaeOff: product.sale,
      },
      category: product.category,
      quantity: product.quantity,
    };
  });

  return JSON.stringify(results);
};

export default async function AdminSearch({ searchParams }: Props) {
  const { query } = searchParams;
  const products = JSON.parse(await searchproduct(query));
  return (
    <div>
      <ProductTable
        products={products}
        currentPageNo={0}
        showPageNavigator={false}
      />
    </div>
  );
}
