import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon: string;
  image: string;
  bannerImage: string;
  shortDescription: string;
  parentId: mongoose.Types.ObjectId | null;
  order: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ parentId: 1 });

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);