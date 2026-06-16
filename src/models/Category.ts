import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon: string;
  image: string;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);