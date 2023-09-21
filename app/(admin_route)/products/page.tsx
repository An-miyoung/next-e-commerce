import ProductTable, { Product } from "@/app/components/ProductTable";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import React from "react";

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
      images: product.images,
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

export default async function ProductsPage() {
  const products = await fetchProduct(1, 10);
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
