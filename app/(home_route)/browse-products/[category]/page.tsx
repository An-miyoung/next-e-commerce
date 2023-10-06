import React from "react";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";
import CategoryMenu from "@components/CategoryMenu";

interface LatestProduct {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: {
    base: number;
    discounted: number;
  };
  category: string;
  sale: number;
  outOfStock: boolean;
}

interface Props {
  params: {
    category: string;
  };
}

const fetchProductsByCategory = async (category: string) => {
  await startDb();
  const products = await ProductModel.find({ category })
    .sort("-createdAt")
    .limit(20);

  const fianlproducts = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      thumbnail: product.thumbnail.url,
      price: product.price,
      category: product.category,
      sale: product.sale,
      rating: product.rating,
      outOfStock: product.quantity <= 0,
    };
  });
  return JSON.stringify(fianlproducts);
};

export default async function ProductByCategory({ params }: Props) {
  const category = decodeURIComponent(params.category);
  const products = await fetchProductsByCategory(category);
  const productsByCategory = JSON.parse(products);

  return (
    <div className="p-4 space-y-4">
      <CategoryMenu />
      {productsByCategory.length ? (
        <GridView>
          {productsByCategory.map((product: LatestProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </GridView>
      ) : (
        <div className="m-10 mx-auto text-center text-blue-700 font-semibold text-lg">
          <p>상품을 준비중입니다.</p>
        </div>
      )}
    </div>
  );
}
