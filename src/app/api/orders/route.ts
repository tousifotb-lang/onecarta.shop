import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import PromoCode from "@/models/PromoCode";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      deliveryCharge,
      discountAmount,
      couponCode,
    } = body;

    if (!customerName || !customerPhone || !customerAddress) {
      return NextResponse.json({ error: "Customer name, phone, and address are required" }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one product" }, { status: 400 });
    }

    // Digits-only phone — matches how checkout sends it, and how the per-customer
    // coupon usage count below queries `customerPhone`.
    const normalizedPhone = String(customerPhone).replace(/\D/g, "");
    const normalizedCouponCode = couponCode ? String(couponCode).trim().toUpperCase() : "";

    // ---- Per-customer coupon usage limit enforcement (final server-side gate) ----
    // The checkout page's "Apply Coupon" step already checks this, but that check
    // can be bypassed (stale UI state, direct API calls, two tabs racing each other),
    // so it's re-verified here right before the order actually gets created — this
    // is the route the storefront checkout really hits, so this is the real gate.
    if (normalizedCouponCode) {
      const promo = await PromoCode.findOne({ codeName: normalizedCouponCode }).lean();
      if (promo?.hasUsageLimit) {
        const limit = Number(promo.usageLimitPerUser) || 0;
        if (limit > 0 && normalizedPhone) {
          const usedCount = await Order.countDocuments({
            couponCode: normalizedCouponCode,
            customerPhone: normalizedPhone,
          });
          if (usedCount >= limit) {
            return NextResponse.json(
              { error: `This coupon can only be used ${limit} time(s) per customer.` },
              { status: 400 }
            );
          }
        }
      }
    }

    const itemsSubtotal = items.reduce(
      (sum: number, item: any) => sum + Number(item.unitPrice) * Number(item.qty),
      0
    );
    const totalAmount = Math.max(
      0,
      itemsSubtotal - (Number(discountAmount) || 0) + (Number(deliveryCharge) || 0)
    );

    const orderId = String(Math.floor(1000000 + Math.random() * 9000000));
    const createdAt = new Date();

    const newOrder = await Order.create({
      orderId,
      // লগইন করা থাকলে session থেকে userId set হবে, guest checkout হলে শুধু phone দিয়ে match হবে
      userId: session?.user ? (session.user as any).id : null,
      customerName,
      customerEmail: customerEmail || "",
      customerPhone: normalizedPhone || customerPhone,
      customerAddress,
      items: items.map((item: any) => ({
        productId: item.productId || null,
        name: item.name,
        qty: Number(item.qty),
        unitPrice: Number(item.unitPrice),
      })),
      orderType: "Online",
      deliveryZone: "Inside Dhaka",
      deliveryCharge: Number(deliveryCharge) || 0,
      discountAmount: Number(discountAmount) || 0,
      couponCode: normalizedCouponCode || null, // NEW — real field, used for usage-limit counting
      itemsSubtotal,
      totalAmount,
      paymentStatus: "PENDING", // Cash on Delivery — ডেলিভারির পর paid হবে
      deliveryStatus: "Placed",
      statusHistory: [{ status: "Placed", changedAt: createdAt }],
      note: normalizedCouponCode ? `Coupon applied: ${normalizedCouponCode}` : "",
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}