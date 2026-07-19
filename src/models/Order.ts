import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId | null;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface IStatusHistoryEntry {
  status: string;
  changedAt: Date;
}

export interface IOrder extends Document {
  orderId: string;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  items: IOrderItem[];
  orderType: "In shop" | "Online";
  deliveryZone: string;
  deliveryCharge: number;
  discountPercent: number;
  discountAmount: number;
  couponCode?: string;
  vatPercent: number;
  vatAmount: number;
  itemsSubtotal: number;
  totalAmount: number;
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  partialPaidAmount: number;
  deliveryStatus:
    | "Placed" | "On Hold" | "Confirmed" | "Shipped" | "Delivered"
    | "Completed" | "Cancelled" | "Returned" | "Payment OnProcess" | "Payment Failed";
  statusHistory: IStatusHistoryEntry[];
  isFraud: boolean;
  note?: string;
  // NEW — Loyalty Points: earned side (credited once the order reaches
  // Delivered) and redeemed side (deducted immediately at checkout,
  // refunded automatically if the order is later Cancelled/Returned).
  pointsEarned: number;
  pointsEarnedCredited: boolean;
  pointsRedeemed: number;
  pointsDiscountAmount: number;
  pointsRedeemedRefunded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", default: null },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema<IStatusHistoryEntry>(
  {
    status: { type: String, required: true },
    changedAt: { type: Date, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    items: [OrderItemSchema],
    orderType: { type: String, enum: ["In shop", "Online"], default: "Online" },
    deliveryZone: { type: String, default: "Inside Dhaka" },
    deliveryCharge: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    vatPercent: { type: Number, default: 0 },
    vatAmount: { type: Number, default: 0 },
    itemsSubtotal: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["PAID", "PENDING", "FAILED"], default: "PENDING" },
    partialPaidAmount: { type: Number, default: 0 },
    deliveryStatus: {
      type: String,
      enum: ["Placed", "On Hold", "Confirmed", "Shipped", "Delivered", "Completed", "Cancelled", "Returned", "Payment OnProcess", "Payment Failed"],
      default: "Placed",
    },
    statusHistory: [StatusHistorySchema],
    isFraud: { type: Boolean, default: false },
    note: { type: String, default: "" },
    pointsEarned: { type: Number, default: 0 },
    pointsEarnedCredited: { type: Boolean, default: false },
    pointsRedeemed: { type: Number, default: 0 },
    pointsDiscountAmount: { type: Number, default: 0 },
    pointsRedeemedRefunded: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "orders" }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);