import React from "react";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";
import FeaturedProductsSlider from "@components/FeaturedProductsSlider";
import FeaturedProductModel from "@models/featuredProduct";

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
      rating: product.rating,
    };
  });
  return JSON.stringify(fianlproducts);
};

const fetchFeaturedProducts = async () => {
  await startDb();
  const products = await FeaturedProductModel.find().sort("-createdAt");

  const featuredProducts = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      banner: product.banner.url,
      link: product.link,
      linkTitle: product.linkTitle,
    };
  });
  return featuredProducts;
};

export default async function Home() {
  const products = await fetchLatestProducts();
  const latestProducts = JSON.parse(products);
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <div>
      <FeaturedProductsSlider products={featuredProducts} />
      <GridView>
        {latestProducts.map((product: LatestProduct) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </GridView>
    </div>
  );
}
