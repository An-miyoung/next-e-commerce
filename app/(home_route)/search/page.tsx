import GridView from "@/app/components/GridView";
import ProductCard from "@/app/components/ProductCard";
import SearchFilter from "@/app/components/SearchFilter";
import startDb from "@/app/lib/db";
import ProductModel, { ProductDocument } from "@/app/models/productModel";
import { LatestProduct } from "@/app/types";
import { FilterQuery } from "mongoose";
import React from "react";

interface Options {
  query: string;
  priceSort?: "asc" | "desc";
  maxRating?: number;
  minRating?: number;
}

interface Props {
  searchParams: Options;
}

const searchProducts = async (options: Options) => {
  const { query, priceSort, maxRating, minRating } = options;
  await startDb();
  // url에서 읽어온 입력값으로 필터를 만들어 DB 에 보낸다
  const filter: FilterQuery<ProductDocument> = {
    title: { $regex: query, $options: "i" },
  };
  if (typeof minRating === "number" && typeof maxRating === "number") {
    const minCondition = minRating >= 0;
    const maxCondition = maxRating <= 5;
    if (minCondition && maxCondition) {
      filter.rating = { $gte: minRating, $lte: maxRating };
    }
  }

  const products = await ProductModel.find({
    ...filter,
  }).sort({ "price.discounted": priceSort === "asc" ? 1 : -1 });

  const results = products.map((product) => {
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

  return JSON.stringify(results);
};

export default async function Search({ searchParams }: Props) {
  const { maxRating, minRating } = searchParams;
  const results = JSON.parse(
    await searchProducts({
      ...searchParams,
      maxRating: maxRating && +maxRating,
      minRating: minRating && +minRating,
    })
  );

  const noProduct = results.length <= 0;

  return (
    <div>
      <SearchFilter>
        {noProduct ? (
          <div className="w-full flex justify-center text-lg font-semibold text-blue-gray-500">
            필터에 맞는 상품이 없습니다
          </div>
        ) : (
          <GridView>
            {results.map((product: LatestProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </GridView>
        )}
      </SearchFilter>
    </div>
  );
}
