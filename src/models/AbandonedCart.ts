import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";

function generateShortCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export interface IAbandonedCartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
}

export interface IAbandonedCart extends Document {
  identifier: string; // email (logged-in) othoba normalized phone (guest) — unique per shopper
  email?: string | null;
  sessionId?: string | null;
  phone?: string | null;
  name?: string;
  items: IAbandonedCartItem[];
  totalAmount: number;
  status: "active" | "abandoned" | "recovered" | "converted";
  reminderStage: number;
  lastReminderSentAt?: Date | null;
  recoveryToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const AbandonedCartItemSchema = new Schema<IAbandonedCartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, default: "" },
    image: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const AbandonedCartSchema = new Schema<IAbandonedCart>(
  {
    identifier: { type: String, required: true, index: true },
    sessionId: { type: String, default: null, index: true },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    name: { type: String, default: "" },
    items: [AbandonedCartItemSchema],
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "abandoned", "recovered", "converted"],
      default: "active",
    },
    reminderStage: { type: Number, default: 0 },
    lastReminderSentAt: { type: Date, default: null },
    recoveryToken: {
      type: String,
      required: true,
      unique: true,
      default: () => generateShortCode(6),
    },
  },
  { timestamps: true }
);

AbandonedCartSchema.index({ identifier: 1, status: 1 });

export default mongoose.models.AbandonedCart ||
  mongoose.model<IAbandonedCart>("AbandonedCart", AbandonedCartSchema);