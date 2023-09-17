import mongoose, { Document, Model, Schema, models, model } from "mongoose";
import categories from "../utils/categories";

// Step 1: Create the interface for ProductDocument
interface ProductDocument extends Document {
  title: string;
  description: string;
  bulletPoints?: string[];
  thumbnail: {
    url: string;
    id: string;
  };
  images?: {
    url: string;
    id: string;
  }[];
  price: {
    base: number;
    discounted: number;
  };
  quantity: number;
  category: string;

  // Step 3: Define the virtual property
  sale: number;
}

// Step 2: Create the ProductSchema
const productSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    bulletPoints: { type: [String] },
    thumbnail: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    images: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    price: {
      base: { type: Number, required: true },
      discounted: { type: Number, required: true },
    },
    quantity: { type: Number, required: true },
    category: { type: String, enum: [...categories], required: true },
  },
  { timestamps: true }
);

// Step 3: Define the virtual property 'sale'
productSchema.virtual("sale").get(function (this: ProductDocument) {
  return (this.price.base - this.price.discounted) / this.price.base;
});

// Step 4: Check if the model already exists before creating it
const ProductModel =
  models.Product || model<ProductDocument>("Product", productSchema);

export default ProductModel as Model<ProductDocument>;
