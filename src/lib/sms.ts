import { normalizeBDPhone } from "@/lib/phone";

export async function sendAbandonedCartSMS({
  to,
  name,
  totalAmount,
  recoveryLink,
}: {
  to: string;
  name?: string;
  totalAmount: number;
  recoveryLink: string;
}) {
  const phone = normalizeBDPhone(to);
  const message = `Hi ${name || ""}, apnar cart e item ache (Total: ৳${totalAmount.toFixed(0)}). Order complete korte: ${recoveryLink}`;

  const url = new URL(process.env.SMS_ENDPOINT || "https://bulksmsbd.net/api/smsapi");
  url.searchParams.set("api_key", process.env.SMS_API_KEY || "");
  url.searchParams.set("senderid", process.env.SMS_SENDER_ID || "");
  url.searchParams.set("type", "text");
  url.searchParams.set("number", phone);
  url.searchParams.set("message", message);

  const res = await fetch(url.toString());
  const data = await res.text();

  // BulkSMSBD returns a plain response code (e.g. "202"), not JSON like Alpha SMS did.
  if (!data.trim().startsWith("202")) {
    console.error("SMS send failed:", data);
  }
  return data;
}