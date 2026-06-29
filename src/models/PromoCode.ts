import mongoose, { Schema, Document } from "mongoose";

export interface IPromoCode extends Document {
  codeName: string;
  amount: string;
  percentage: string;
  hasMaxDiscount: boolean;
  maxDiscountValue: string;
  hasMinPurchase: boolean;
  minPurchaseValue: string;
  expiryDate: string;
  isActive: boolean;
}

// NOTE: This model intentionally mirrors the exact field names and types
// (mostly strings) used by the separate OneCarta admin project, which writes
// directly to the "promocodes" collection via the raw MongoDB driver. Keeping
// the shape identical means documents created by the admin panel are read
// correctly here, and vice versa.
const PromoCodeSchema = new Schema<IPromoCode>(
  {
    codeName: { type: String, required: true, unique: true, uppercase: true, trim: true },
    amount: { type: String, default: "" },
    percentage: { type: String, default: "" },
    hasMaxDiscount: { type: Boolean, default: false },
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