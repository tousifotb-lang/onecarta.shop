import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  type: "hero" | "side";
  imageUrl: string;
  href: string;
  title: string;
  isActive: boolean;
  order: number;
}

const BannerSchema = new Schema<IBanner>(
  {
    type: { type: String, enum: ["hero", "side"], required: true },
    imageUrl: { type: String, required: true },
    href: { type: String, default: "/" },
    title: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "banners" }
);

BannerSchema.index({ type: 1, order: 1 });

export default mongoose.models.Banner ||
  mongoose.model<IBanner>("Banner", BannerSchema);