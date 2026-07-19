import mongoose, { Schema, Document } from "mongoose";

// Singleton document (one record only) — admin-configurable earn/redeem rates.
export interface ILoyaltySettings extends Document {
  isActive: boolean;
  earnRateAmount: number; // spend this many taka...
  earnRatePoints: number; // ...to earn this many points
  redeemPointsAmount: number; // this many points...
  redeemValueAmount: number; // ...equals this many taka discount
  minRedeemPoints: number; // minimum balance required before any redemption
}

const LoyaltySettingsSchema = new Schema<ILoyaltySettings>(
  {
    isActive: { type: Boolean, default: true },
    earnRateAmount: { type: Number, default: 100 },
    earnRatePoints: { type: Number, default: 1 },
    redeemPointsAmount: { type: Number, default: 100 },
    redeemValueAmount: { type: Number, default: 10 },
    minRedeemPoints: { type: Number, default: 100 },
  },
  { timestamps: true, collection: "loyaltysettings" }
);

export default mongoose.models.LoyaltySettings ||
  mongoose.model<ILoyaltySettings>("LoyaltySettings", LoyaltySettingsSchema);