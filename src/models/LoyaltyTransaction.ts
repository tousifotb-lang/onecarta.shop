import mongoose, { Schema, Document } from "mongoose";

export interface ILoyaltyTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: "earned" | "redeemed" | "refunded";
  // pending: reserved but not yet in balance (order not yet Delivered)
  // completed: actually applied to the balance
  // voided: a pending "earned" transaction cancelled before it became real
  // reversed: a completed "earned" transaction taken back OUT of the balance
  //   because the order moved off Delivered/Completed to some other status
  status: "pending" | "completed" | "voided" | "reversed";
  points: number;
  orderId?: mongoose.Types.ObjectId | null;
  description: string;
  createdAt: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["earned", "redeemed", "refunded"], required: true },
    status: { type: String, enum: ["pending", "completed", "voided", "reversed"], default: "completed" },
    points: { type: Number, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", default: null },
    description: { type: String, default: "" },
  },
  { timestamps: true, collection: "loyaltytransactions" }
);

LoyaltyTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.LoyaltyTransaction ||
  mongoose.model<ILoyaltyTransaction>("LoyaltyTransaction", LoyaltyTransactionSchema);