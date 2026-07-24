import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { generateOTPCode, sendOTPEmail, sendOTPSMS } from "@/lib/otp";
//import { normalizeBDPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();
    if (!identifier || !String(identifier).trim()) {
      return NextResponse.json({ error: "Email or phone number is required" }, { status: 400 });
    }

    const raw = String(identifier).trim();
    const isEmail = raw.includes("@");
    const channel: "email" | "sms" = isEmail ? "email" : "sms";

    const normalizedValue = isEmail ? raw.toLowerCase() : raw.replace(/\D/g, "");

    await connectDB();

    const user = isEmail
      ? await User.findOne({ email: normalizedValue }).select("name email").lean()
      : await User.findOne({ phone: normalizedValue }).select("name phone").lean();

    // Account exist na korলেও success dেখানো হয় — enumeration আটকানোর জন্য
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const code = generateOTPCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.deleteMany({ identifier: normalizedValue, purpose: "password_reset", verified: false });
    await OTP.create({ identifier: normalizedValue, channel, code, purpose: "password_reset", expiresAt });

    if (isEmail) {
      await sendOTPEmail({ to: normalizedValue, name: (user as any).name, code });
    } else {
      await sendOTPSMS({ to: normalizedValue, code });
    }

    return NextResponse.json({ ok: true, channel });
  } catch (err) {
    console.error("Forgot password request error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}