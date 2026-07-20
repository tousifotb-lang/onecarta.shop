import mongoose, { Schema, Document } from "mongoose";

export interface ILoyaltyTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: "earned" | "redeemed" | "refunded";
  // pending: points reserved but not yet in the customer's balance (order
  //   not yet Delivered)
  // completed: points actually added to (or deducted from) the balance
  // voided: a pending "earned" transaction that got cancelled before it
  //   ever became real — no balance change happened, kept for history only
  status: "pending" | "completed" | "voided";
  points: number;
  orderId?: mongoose.Types.ObjectId | null;
  description: string;
  createdAt: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["earned", "redeemed", "refunded"], required: true },
    status: { type: String, enum: ["pending", "completed", "voided"], default: "completed" },
    points: { type: Number, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", default: null },
    description: { type: String, default: "" },
  },
  { timestamps: true, collection: "loyaltytransactions" }
);

LoyaltyTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.LoyaltyTransaction ||
  mongoose.model<ILoyaltyTransaction>("LoyaltyTransaction", LoyaltyTransactionSchema);