import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  key: string;
  isActive: boolean;
  endsAt: string | null; // used by "flashSale"
  text: string;          // used by "announcement"
  updatedAt: Date;
}

// একটাই generic "settings" collection — key দিয়ে আলাদা আলাদা settings block
// (flashSale, announcement, ভবিষ্যতে আরও যা লাগবে) সব এই collection-এই থাকে।
// Admin এই একই collection-এ raw driver দিয়ে লেখে, key-অনুযায়ী field ভিন্ন হয়।
const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    endsAt: { type: String, default: null },
    text: { type: String, default: "" },
  },
  { timestamps: true, collection: "settings" }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);