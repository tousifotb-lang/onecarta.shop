import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // ⚠️ tor lib/mongodb.ts er export naam check kore niye thik koro
import AbandonedCart from "@/models/AbandonedCart";
import { normalizeBDPhone } from "@/lib/phone";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, name, items, totalAmount } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, reason: "empty cart" });
    }

    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;
    const normalizedPhone = phone && phone.length >= 10 ? normalizeBDPhone(phone) : null;
    const identifier = normalizedEmail || normalizedPhone;

    if (!identifier) {
      return NextResponse.json({ ok: false, reason: "no contact info yet" });
    }

    await connectDB();

    const orConditions: any[] = [];
      if (normalizedPhone) orConditions.push({ phone: normalizedPhone });
      if (normalizedEmail) orConditions.push({ email: normalizedEmail });

      const existing = orConditions.length > 0
        ? await AbandonedCart.findOne({
            $or: orConditions,
            status: { $in: ["active", "abandoned"] },
          })
        : null;

    if (existing) {
      existing.email = normalizedEmail || existing.email;
      existing.phone = normalizedPhone || existing.phone;
      existing.name = name || existing.name;
      existing.items = items;
      existing.totalAmount = totalAmount || 0;
      existing.status = "active";
      existing.reminderStage = 0;
      existing.lastReminderSentAt = null;
      await existing.save();
      return NextResponse.json({ ok: true });
    }

    await AbandonedCart.create({
      identifier,
      email: normalizedEmail,
      phone: normalizedPhone,
      name: name || "",
      items,
      totalAmount: totalAmount || 0,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Cart sync error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}