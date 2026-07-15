import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import PromoCode from "@/models/PromoCode";

function calculateDiscount(
  promo: {
    discountType: "flat" | "upto" | "percentage";
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

  if (promo.discountType === "percentage") {
    // Straight % of subtotal, optionally capped — used for NEW10 etc.
    const minPurchase = promo.hasMinPurchase ? Number(promo.minPurchaseValue) || 0 : 0;
    if (minPurchase > 0 && subtotal < minPurchase) {
      return { error: `Minimum purchase of ৳${minPurchase} required for this coupon.` };
    }
    const pct = Number(promo.basePercentage) || 0;
    if (pct <= 0) {
      return { error: "This coupon is misconfigured. Please contact support." };
    }
    let discount = (subtotal * pct) / 100;
    const cap = Number(promo.maxDiscountValue) || 0;
    if (cap > 0) {
      discount = Math.min(discount, cap);
    }
    return { discount };
  }

  // "upto" — scaling percentage
  const minPurchase = Number(promo.minPurchaseValue) || 0;
  const maxDiscount = Number(promo.maxDiscountValue) || 0;
  const basePercentage = Number(promo.basePercentage) || 0;

  if (minPurchase <= 0 || maxDiscount <= 0 || basePercentage <= 0) {
    return { error: "This coupon is misconfigured. Please contact support." };
  }

  if (subtotal < minPurchase) {
    return { error: `Minimum purchase of ৳${minPurchase} required for this coupon.` };
  }

  const effectivePercent = basePercentage * (subtotal / minPurchase);
  const discount = Math.min((maxDiscount * effectivePercent) / 100, maxDiscount);

  return { discount };
}

async function getCustomerUsageCount(normalizedPhone: string, codeName: string): Promise<number> {
  const db = mongoose.connection.db;
  if (!db) return 0;
  return db.collection("orders").countDocuments({
    customerPhone: normalizedPhone,
    couponCode: codeName,
  });
}

// Body: { code, subtotal, deliveryCharge, phone, isDhaka }
// isDhaka — true jodi customer-er selected district "Dhaka" hoy, jate
// "Inside Dhaka Only" scope-er free-delivery coupon thik jaygay apply hoy.
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { code, subtotal, deliveryCharge, phone, isDhaka } = await req.json();

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

    if (promo.expiryDate) {
      const expiry = new Date(promo.expiryDate + "T23:59:59");
      if (!isNaN(expiry.getTime()) && expiry.getTime() < Date.now()) {
        return NextResponse.json({ valid: false, error: "This coupon has expired." }, { status: 400 });
      }
    }

    const normalizedPhone = typeof phone === "string" ? phone.replace(/\D/g, "") : "";
    if (promo.hasUsageLimit && normalizedPhone) {
      const limit = Number(promo.usageLimitPerUser) || 0;
      if (limit > 0) {
        const usedCount = await getCustomerUsageCount(normalizedPhone, promo.codeName);
        if (usedCount >= limit) {
          return NextResponse.json(
            { valid: false, error: `You've already used this coupon the maximum ${limit} time(s) allowed.` },
            { status: 400 }
          );
        }
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

    const chargeable = cartSubtotal + (Number(deliveryCharge) || 0);
    let discount = Math.min(result.discount, chargeable);
    discount = Math.round(discount);

    // Free delivery — independent benefit. "all" scope always applies;
    // "dhaka" scope only applies when the order is shipping within Dhaka.
    const freeDeliveryEligible =
      !!promo.freeDelivery &&
      (promo.freeDeliveryScope === "all" || (promo.freeDeliveryScope === "dhaka" && !!isDhaka));

    if (discount <= 0 && !freeDeliveryEligible) {
      if (promo.freeDelivery && promo.freeDeliveryScope === "dhaka" && !isDhaka) {
        return NextResponse.json(
          { valid: false, error: "This coupon offers free delivery only within Dhaka." },
          { status: 400 }
        );
      }
      return NextResponse.json({ valid: false, error: "This coupon does not apply to your order." }, { status: 400 });
    }

    return NextResponse.json(
      { valid: true, code: promo.codeName, discount, freeDelivery: freeDeliveryEligible },
      { status: 200 }
    );
  } catch (error) {
    console.error("Promo code validation error:", error);
    return NextResponse.json({ valid: false, error: "Server error while validating coupon." }, { status: 500 });
  }
}