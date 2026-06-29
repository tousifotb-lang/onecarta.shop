import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PromoCode from "@/models/PromoCode";

// POST: Validate a promo code entered at checkout against the shared
// `promocodes` collection (same MongoDB database the admin panel writes to).
//
// Body: { code: string, subtotal: number, deliveryCharge: number | null }
// Returns: { valid: true, code, discount } on success
//          { valid: false, error: string } on failure
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { code, subtotal, deliveryCharge } = await req.json();

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ valid: false, error: "Please enter a coupon code." }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    const promo = await PromoCode.findOne({ codeName: normalizedCode }).lean();

    if (!promo) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code." }, { status: 404 });
    }

    // Respect the admin "isActive" flag if it has been turned off
    if (promo.isActive === false) {
      return NextResponse.json({ valid: false, error: "This coupon is no longer active." }, { status: 400 });
    }

    // Expiry check — expiryDate is stored as a plain "YYYY-MM-DD" string, or "" for no expiry
    if (promo.expiryDate) {
      const expiry = new Date(promo.expiryDate + "T23:59:59");
      if (!isNaN(expiry.getTime()) && expiry.getTime() < Date.now()) {
        return NextResponse.json({ valid: false, error: "This coupon has expired." }, { status: 400 });
      }
    }

    // Min purchase check
    const minPurchase = promo.hasMinPurchase ? Number(promo.minPurchaseValue) || 0 : 0;
    const cartSubtotal = Number(subtotal) || 0;
    if (minPurchase > 0 && cartSubtotal < minPurchase) {
      return NextResponse.json(
        { valid: false, error: `Minimum purchase of ৳${minPurchase} required for this coupon.` },
        { status: 400 }
      );
    }

    // Calculate discount: either a flat amount or a percentage of the subtotal,
    // capped by maxDiscountValue if that option is enabled.
    let discount = 0;
    if (promo.percentage) {
      const pct = Number(promo.percentage) || 0;
      discount = (cartSubtotal * pct) / 100;
    } else if (promo.amount) {
      discount = Number(promo.amount) || 0;
    }

    if (promo.hasMaxDiscount) {
      const maxDiscount = Number(promo.maxDiscountValue) || 0;
      if (maxDiscount > 0) {
        discount = Math.min(discount, maxDiscount);
      }
    }

    // Never let the discount exceed what's actually being charged
    const chargeable = cartSubtotal + (Number(deliveryCharge) || 0);
    discount = Math.min(discount, chargeable);
    discount = Math.round(discount);

    if (discount <= 0) {
      return NextResponse.json({ valid: false, error: "This coupon does not apply to your order." }, { status: 400 });
    }

    return NextResponse.json(
      { valid: true, code: promo.codeName, discount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Promo code validation error:", error);
    return NextResponse.json({ valid: false, error: "Server error while validating coupon." }, { status: 500 });
  }
}