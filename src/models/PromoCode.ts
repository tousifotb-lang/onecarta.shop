import mongoose, { Schema, Document } from "mongoose";

export interface IPromoCode extends Document {
  codeName: string;
  discountType: "flat" | "upto";
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
    discountType: { type: String, enum: ["flat", "upto"], default: "flat" },
    flatAmount: { type: String, default: "" },
    basePercentage: { type: String, default: "" },
    maxDiscountValue: { type: String, default: "" },
    hasMinPurchase: { type: Boolean, default: false },
    minPurchaseValue: { type: String, default: "" },
    hasUsageLimit: { type: Boolean, default: false },
    usageLimitPerUser: { type: String, default: "" },
    // NEW — free delivery benefit, independent of the flat/upto discount above.
    // "dhaka" = only orders shipping within Dhaka get free delivery; "all" = always.
    freeDelivery: { type: Boolean, default: false },
    freeDeliveryScope: { type: String, enum: ["dhaka", "all", null], default: null },
    expiryDate: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "promocodes" }
);

export default mongoose.models.PromoCode ||
  mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);