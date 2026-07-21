import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const SUBJECT_BY_STAGE: Record<number, string> = {
  1: "You left something in your cart 🛒",
  2: "Still thinking it over? Your cart is waiting",
  3: "Last chance — complete your order",
};

export async function sendAbandonedCartEmail({
  to,
  name,
  items,
  totalAmount,
  recoveryLink,
  stage,
}: {
  to: string;
  name?: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  recoveryLink: string;
  stage: number;
}) {
  if (!resend) {
    console.log("RESEND_API_KEY not set yet — skipping email send.");
    return;
  }

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;">${item.name} × ${item.quantity}</td>
        <td style="padding:8px 0; text-align:right;">৳${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Hi ${name || "there"},</h2>
      <p>You left some items in your cart at Onecarta.</p>
      <table style="width:100%; border-collapse: collapse;">${itemsHtml}</table>
      <p style="font-weight:bold; margin-top:12px;">Total: ৳${totalAmount.toFixed(2)}</p>
      <a href="${recoveryLink}" style="display:inline-block; margin-top:16px; background:#2c2769; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none;">Complete Your Order</a>
    </div>
  `;

  await resend.emails.send({
    from: "Onecarta <reminders@onecarta.shop>",
    to,
    subject: SUBJECT_BY_STAGE[stage] || SUBJECT_BY_STAGE[1],
    html,
  });
}