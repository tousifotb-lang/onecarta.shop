import mongoose, { Schema, Document } from "mongoose";

export interface IPromoCode extends Document {
  codeName: string;
  discountType: "flat" | "upto" | "percentage";
  flatAmount: string;
  basePercentage: string;
  maxDiscountValue: string;
  hasMinPurchase: boolean;
  minPurchaseValue: string;
  hasUsageLimit: boolean;
  usageLimitPerUser: string;
  freeDelivery: boolean;
  freeDeliveryScope: "dhaka" | "all" | null;
  expiryDate: string;
  isActive: boolean;
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    codeName: { type: String, required: true, unique: true, uppercase: true, trim: true },
    // "percentage" — straight % discount of subtotal, optionally capped by
    // maxDiscountValue. Used for the NEW10 auto-applied first-order discount.
    discountType: { type: String, enum: ["flat", "upto", "percentage"], default: "flat" },
    flatAmount: { type: String, default: "" },
    basePercentage: { type: String, default: "" },
    maxDiscountValue: { type: String, default: "" },
    hasMinPurchase: { type: Boolean, default: false },
    minPurchaseValue: { type: String, default: "" },
    hasUsageLimit: { type: Boolean, default: false },
    usageLimitPerUser: { type: String, default: "" },
    freeDelivery: { type: Boolean, default: false },
    freeDeliveryScope: { type: String, enum: ["dhaka", "all", null], default: null },
    expiryDate: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "promocodes" }
);

export default mongoose.models.PromoCode ||
  mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);