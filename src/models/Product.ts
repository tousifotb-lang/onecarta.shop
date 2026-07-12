import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  category: string;
  categoryId?: mongoose.Types.ObjectId | null;
  brand: string;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isFlashSale: boolean;
  isBestSelling: boolean;
  flashSalePrice?: number;
  flashSaleEnds?: Date;
  restockedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    brand: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    isBestSelling: { type: Boolean, default: false },
    flashSalePrice: { type: Number },
    flashSaleEnds: { type: Date },
    restockedAt: { type: Date },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", brand: "text" });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ categoryId: 1, isActive: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ restockedAt: -1 });

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);