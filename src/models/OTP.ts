import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  identifier: string; // email or normalized phone
  channel: "email" | "sms";
  code: string;
  purpose: "password_reset";
  verified: boolean;
  resetToken?: string | null;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    identifier: { type: String, required: true, index: true },
    channel: { type: String, enum: ["email", "sms"], required: true },
    code: { type: String, required: true },
    purpose: { type: String, enum: ["password_reset"], default: "password_reset" },
    verified: { type: Boolean, default: false },
    resetToken: { type: String, default: null, index: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

OTPSchema.index({ identifier: 1, purpose: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);