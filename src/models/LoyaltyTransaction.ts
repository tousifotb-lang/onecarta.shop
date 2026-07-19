import mongoose, { Schema, Document } from "mongoose";

export interface ILoyaltyTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: "earned" | "redeemed" | "refunded";
  points: number;
  orderId?: mongoose.Types.ObjectId | null;
  description: string;
  createdAt: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["earned", "redeemed", "refunded"], required: true },
    points: { type: Number, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", default: null },
    description: { type: String, default: "" },
  },
  { timestamps: true, collection: "loyaltytransactions" }
);

LoyaltyTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.LoyaltyTransaction ||
  mongoose.model<ILoyaltyTransaction>("LoyaltyTransaction", LoyaltyTransactionSchema);