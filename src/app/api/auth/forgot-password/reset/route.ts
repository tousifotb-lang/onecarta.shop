import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import OTP from "@/models/OTP";
//import { normalizeBDPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const { identifier, resetToken, password } = await req.json();
    if (!identifier || !resetToken || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const raw = String(identifier).trim();
    const isEmail = raw.includes("@");
    const normalizedValue = isEmail ? raw.toLowerCase() : raw.replace(/\D/g, "");

    await connectDB();

    const otp = await OTP.findOne({
      identifier: normalizedValue,
      purpose: "password_reset",
      verified: true,
      resetToken,
    });

    if (!otp) {
      return NextResponse.json({ error: "Invalid or expired reset session. Please start over." }, { status: 400 });
    }
    if (otp.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "This reset session has expired. Please start over." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = isEmail
      ? await User.findOneAndUpdate({ email: normalizedValue }, { $set: { password: hashedPassword } }, { new: true })
      : await User.findOneAndUpdate({ phone: normalizedValue }, { $set: { password: hashedPassword } }, { new: true });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await OTP.deleteOne({ _id: otp._id });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Forgot password reset error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}