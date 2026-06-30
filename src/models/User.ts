import mongoose, { Schema, Document } from "mongoose";

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  label: string;
  name: string;
  phone: string;
  district: string;
  thana: string;
  homeAddress: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  dob?: string;
  gender?: string;
  addresses: IAddress[];
  wishlist: mongoose.Types.ObjectId[];
  isActive: boolean;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: "Home" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    district: { type: String, required: true },
    thana: { type: String, required: true },
    homeAddress: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    dob: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Others", ""], default: "" },
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);