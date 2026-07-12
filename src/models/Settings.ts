import mongoose, { Schema, Document } from "mongoose";

export interface IDeliveryRates {
  insideDhaka: number;
  specialZone: number; // Savar, Keranigonj
  outsideDhaka: number;
}

export interface ISettings extends Document {
  key: string;
  isActive: boolean;
  endsAt: string | null;   // used by "flashSale"
  messages: string[];      // used by "announcement"
  rates?: IDeliveryRates;  // used by "delivery"
  updatedAt: Date;
}

const DeliveryRatesSchema = new Schema<IDeliveryRates>(
  {
    insideDhaka: { type: Number, required: true },
    specialZone: { type: Number, required: true },
    outsideDhaka: { type: Number, required: true },
  },
  { _id: false }
);

// একটাই generic "settings" collection — key দিয়ে আলাদা আলাদা settings block
// (flashSale, announcement, delivery, ভবিষ্যতে আরও যা লাগবে) সব এই collection-এই থাকে।
const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    endsAt: { type: String, default: null },
    messages: { type: [String], default: [] },
    rates: { type: DeliveryRatesSchema, default: undefined },
  },
  { timestamps: true, collection: "settings" }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);