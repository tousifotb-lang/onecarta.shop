import mongoose, { Schema, Document } from "mongoose";

export interface IPromoCode extends Document {
  codeName: string;
  discountType: "flat" | "upto";
  flatAmount: string;
  basePercentage: string;
  maxDiscountValue: string;
  hasMinPurchase: boolean;
  minPurchaseValue: string;
  expiryDate: string;
  isActive: boolean;
}

// NOTE: mirrors the exact field names/types used by the admin project
// (raw MongoDB driver, "promocodes" collection). Keeping shapes identical
// so documents created in admin read correctly here, and vice versa.
const PromoCodeSchema = new Schema<IPromoCode>(
  {
    codeName: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["flat", "upto"], default: "flat" },
    flatAmount: { type: String, default: "" },
    basePercentage: { type: String, default: "" },
    maxDiscountValue: { type: String, default: "" },
    hasMinPurchase: { type: Boolean, default: false },
    minPurchaseValue: { type: String, default: "" },
    expiryDate: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "promocodes" }
);

export default mongoose.models.PromoCode ||
  mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);