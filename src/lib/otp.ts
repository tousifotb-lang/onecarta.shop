import { Resend } from "resend";
import { normalizeBDPhone } from "@/lib/phone";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail({ to, name, code }: { to: string; name?: string; code: string }) {
  if (!resend) {
    console.log("RESEND_API_KEY not set yet — skipping OTP email send.");
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Hi ${name || "there"},</h2>
      <p>Use the code below to reset your Onecarta account password. This code expires in 10 minutes.</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background:#f3f3f8; color:#2c2769; padding:16px 24px; border-radius:12px; text-align:center; margin: 20px 0;">
        ${code}
      </div>
      <p style="color:#888; font-size:12px;">If you didn't request this, you can safely ignore this email — your account remains secure.</p>
    </div>
  `;

  await resend.emails.send({
    from: "Onecarta Account <account@onecarta.shop>",
    to,
    subject: "Your Onecarta password reset code",
    html,
  });
}

export async function sendOTPSMS({ to, code }: { to: string; code: string }) {
  const phone = normalizeBDPhone(to);
  const message = `Your Onecarta password reset code is ${code}. It expires in 10 minutes. Do not share this code with anyone.`;

  const url = new URL(process.env.SMS_ENDPOINT || "https://bulksmsbd.net/api/smsapi");
  url.searchParams.set("api_key", process.env.SMS_API_KEY || "");
  url.searchParams.set("senderid", process.env.SMS_SENDER_ID || "");
  url.searchParams.set("type", "text");
  url.searchParams.set("number", phone);
  url.searchParams.set("message", message);

  const res = await fetch(url.toString());
  const data = await res.text();

  if (!data.trim().startsWith("202")) {
    console.error("OTP SMS send failed:", data);
  }
  return data;
}