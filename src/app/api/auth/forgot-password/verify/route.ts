import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import OTP from "@/models/OTP";
//import { normalizeBDPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const { identifier, code } = await req.json();
    if (!identifier || !code) {
      return NextResponse.json({ error: "Identifier and code are required" }, { status: 400 });
    }

    const raw = String(identifier).trim();
    const isEmail = raw.includes("@");
    const normalizedValue = isEmail ? raw.toLowerCase() : raw.replace(/\D/g, "");

    await connectDB();

    const otp = await OTP.findOne({
      identifier: normalizedValue,
      purpose: "password_reset",
      verified: false,
    }).sort({ createdAt: -1 });

    if (!otp) {
      return NextResponse.json({ error: "No pending request found. Please request a new code." }, { status: 400 });
    }
    if (otp.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "This code has expired. Please request a new one." }, { status: 400 });
    }
    if (otp.attempts >= 5) {
      return NextResponse.json({ error: "Too many incorrect attempts. Please request a new code." }, { status: 400 });
    }
    if (otp.code !== String(code).trim()) {
      otp.attempts += 1;
      await otp.save();
      return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    otp.verified = true;
    otp.resetToken = resetToken;
    await otp.save();

    return NextResponse.json({ ok: true, resetToken });
  } catch (err) {
    console.error("Forgot password verify error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}