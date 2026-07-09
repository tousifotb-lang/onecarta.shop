import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PromoCode from "@/models/PromoCode";

// Calculates the taka discount for a given promo + cart subtotal.
// Returns { discount } on success, or { error } if the order doesn't qualify.
function calculateDiscount(
  promo: {
    discountType: "flat" | "upto";
    flatAmount: string;
    basePercentage: string;
    maxDiscountValue: string;
    hasMinPurchase: boolean;
    minPurchaseValue: string;
  },
  subtotal: number
): { discount: number } | { error: string } {
  if (promo.discountType === "flat") {
    const minPurchase = promo.hasMinPurchase ? Number(promo.minPurchaseValue) || 0 : 0;
    if (minPurchase > 0 && subtotal < minPurchase) {
      return { error: `Minimum purchase of ৳${minPurchase} required for this coupon.` };
    }
    return { discount: Number(promo.flatAmount) || 0 };
  }

  // discountType === "upto" — scaling percentage, capped at maxDiscountValue
  const minPurchase = Number(promo.minPurchaseValue) || 0;
  const maxDiscount = Number(promo.maxDiscountValue) || 0;
  const basePercentage = Number(promo.basePercentage) || 0;

  if (minPurchase <= 0 || maxDiscount <= 0 || basePercentage <= 0) {
    return { error: "This coupon is misconfigured. Please contact support." };
  }

  if (subtotal < minPurchase) {
    return { error: `Minimum purchase of ৳${minPurchase} required for this coupon.` };
  }

  // Order jotoi min purchase theke baray, effective % totoi barbe — kintu maxDiscount cross korbe na
  const effectivePercent = basePercentage * (subtotal / minPurchase);
  const discount = Math.min((maxDiscount * effectivePercent) / 100, maxDiscount);

  return { discount };
}

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

    if (promo.isActive === false) {
      return NextResponse.json({ valid: false, error: "This coupon is no longer active." }, { status: 400 });
    }

    // Expiry check — expiryDate stored as "YYYY-MM-DD" string, or "" for no expiry
    if (promo.expiryDate) {
      const expiry = new Date(promo.expiryDate + "T23:59:59");
      if (!isNaN(expiry.getTime()) && expiry.getTime() < Date.now()) {
        return NextResponse.json({ valid: false, error: "This coupon has expired." }, { status: 400 });
      }
    }

    const cartSubtotal = Number(subtotal) || 0;

    const result = calculateDiscount(
      {
        discountType: promo.discountType || "flat",
        flatAmount: promo.flatAmount || "",
        basePercentage: promo.basePercentage || "",
        maxDiscountValue: promo.maxDiscountValue || "",
        hasMinPurchase: !!promo.hasMinPurchase,
        minPurchaseValue: promo.minPurchaseValue || "",
      },
      cartSubtotal
    );

    if ("error" in result) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
    }

    // Never let the discount exceed what's actually being charged
    const chargeable = cartSubtotal + (Number(deliveryCharge) || 0);
    let discount = Math.min(result.discount, chargeable);
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