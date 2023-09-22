import ProductTable, { Product } from "@/app/components/ProductTable";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { redirect } from "next/navigation";
import React, { useState } from "react";

interface Props {
  searchParams: { page: string };
}

const fetchProduct = async (
  pageNo: number,
  perPage: number
): Promise<Product[]> => {
  // perpage : 한페이지당 몇개 아이템을 보여줄 건가,  pageNo: 현재 페이지수
  // 전체 데이터갯수에서 몇번째부터 보여줄 것인지를 결정
  const skipCount = (pageNo - 1) * perPage;
  await startDb();
  const products = await ProductModel.find()
    .sort("-createdAt")
    .skip(skipCount)
    .limit(perPage);

  return products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      bulletPoints: product.bulletPoints,
      thumbnail: product.thumbnail.url,
      price: {
        mrp: product.price.base,
        salePrice: product.price.discounted,
        saleOff: product.sale,
      },
      category: product.category,
      quantity: product.quantity,
    };
  });
};

const PRODUCT_PER_PAGE = 10;

export default async function ProductsPage({ searchParams }: Props) {
  const { page = "1" } = searchParams;
  if (isNaN(+page)) return redirect("/404");

  const products = await fetchProduct(+page, PRODUCT_PER_PAGE);
  let hasMore = true;

  if (products.length < PRODUCT_PER_PAGE) hasMore = false;
  else hasMore = true;

  return (
    <div>
      <ProductTable
        products={products}
        currentPageNo={+page}
        hasMore={hasMore}
        showPageNavigator={true}
      />
    </div>
  );
}
