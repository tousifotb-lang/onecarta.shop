import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AbandonedCart from "@/models/AbandonedCart";
import { sendAbandonedCartEmail } from "@/lib/email";
import { sendAbandonedCartSMS } from "@/lib/sms";

const STAGE_DELAY_HOURS = [1, 24, 72]; // stage 1: 1hr, stage 2: 24hr, stage 3: 72hr

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const now = Date.now();
  const candidates = await AbandonedCart.find({
    status: { $in: ["active", "abandoned"] },
    reminderStage: { $lt: STAGE_DELAY_HOURS.length },
  });

  let sentCount = 0;

  for (const cart of candidates) {
    const nextStage = cart.reminderStage + 1;
    const delayHours = STAGE_DELAY_HOURS[nextStage - 1];
    const hoursSinceUpdate = (now - new Date(cart.updatedAt).getTime()) / 3600000;

    if (hoursSinceUpdate < delayHours) continue;

    const recoveryLink = `${process.env.NEXT_PUBLIC_SITE_URL}/cart/recover/${cart.recoveryToken}`;

    try {
      if (cart.email) {
        await sendAbandonedCartEmail({
          to: cart.email,
          name: cart.name,
          items: cart.items,
          totalAmount: cart.totalAmount,
          recoveryLink,
          stage: nextStage,
        });
      }
      if (cart.phone) {
        await sendAbandonedCartSMS({
          to: cart.phone,
          name: cart.name,
          totalAmount: cart.totalAmount,
          recoveryLink,
        });
      }

      cart.status = "abandoned";
      cart.reminderStage = nextStage;
      cart.lastReminderSentAt = new Date();
      await cart.save();
      sentCount++;
    } catch (err) {
      console.error(`Reminder failed for cart ${cart._id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, processed: candidates.length, sent: sentCount });
}