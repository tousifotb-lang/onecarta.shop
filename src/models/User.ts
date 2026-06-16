import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  addresses: {
    label: string;
    address: string;
    city: string;
    district: string;
    phone: string;
    isDefault: boolean;
  }[];
  isActive: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [
      {
        label: String,
        address: String,
        city: String,
        district: String,
        phone: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);