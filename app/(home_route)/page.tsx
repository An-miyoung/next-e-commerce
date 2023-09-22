import React from "react";
import startDb from "../lib/db";
import ProductModel from "../models/productModel";
import GridView from "../components/GridView";
import ProductCard from "../components/ProductCard";

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
}

const fetchLatestProducts = async () => {
  await startDb();
  const products = await ProductModel.find().sort("-createdAt").limit(20);

  const fianlproducts = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      thumbnail: product.thumbnail.url,
      price: product.price,
      category: product.category,
      sale: product.sale,
    };
  });
  return JSON.stringify(fianlproducts);
};

export default async function Home() {
  const products = await fetchLatestProducts();
  const latestProducts = JSON.parse(products);

  return (
    <GridView>
      {latestProducts.map((product: LatestProduct) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </GridView>
  );
}
