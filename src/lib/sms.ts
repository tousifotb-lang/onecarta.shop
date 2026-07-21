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

  const url = new URL(process.env.SMS_ENDPOINT || "https://api.sms.net.bd/sendsms");
  url.searchParams.set("api_key", process.env.SMS_API_KEY || "");
  url.searchParams.set("msg", message);
  url.searchParams.set("to", phone);

  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error !== 0) {
    console.error("SMS send failed:", data);
  }
  return data;
}