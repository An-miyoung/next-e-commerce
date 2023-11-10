import { ObjectId, Schema, model, models, Document } from "mongoose";

interface WishListDocument extends Document {
  user: ObjectId;
  products: ObjectId[];
}

const wishListSchema = new Schema<WishListDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    products: [{ type: Schema.Types.ObjectId, required: true, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

const WishListModel = models.WishList || model("WishList", wishListSchema);

export default WishListModel;
