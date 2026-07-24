import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AbandonedCart from "@/models/AbandonedCart";
import { normalizeBDPhone } from "@/lib/phone";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, name, items, totalAmount, sessionId } = body;

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

    // Priority 1: same browser session — always same document, regardless
    // of typos/corrections in phone or email.
    let existing = sessionId
      ? await AbandonedCart.findOne({ sessionId, status: { $in: ["active", "abandoned"] } })
      : null;

    // Priority 2: fallback matching by phone/email (legacy sessions).
    if (!existing) {
      const orConditions: any[] = [];
      if (normalizedPhone) orConditions.push({ phone: normalizedPhone });
      if (normalizedEmail) orConditions.push({ email: normalizedEmail });
      if (orConditions.length > 0) {
        existing = await AbandonedCart.findOne({
          $or: orConditions,
          status: { $in: ["active", "abandoned"] },
        });
      }
    }

    if (existing) {
      existing.sessionId = sessionId || existing.sessionId;
      existing.identifier = identifier;
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
      sessionId: sessionId || null,
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