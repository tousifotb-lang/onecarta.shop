import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  key: string;
  isActive: boolean;
  endsAt: string | null;
  updatedAt: Date;
}

// Mirrors the admin's raw-driver "settings" collection exactly — key is a
// unique identifier per settings block (e.g. "flashSale"), so this same
// collection/model can hold other future site-wide settings too.
const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    endsAt: { type: String, default: null },
  },
  { timestamps: true, collection: "settings" }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);