import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import PromoCode from "@/models/PromoCode";
import Product from "@/models/Product";
import User from "@/models/User";
import LoyaltySettings from "@/models/LoyaltySettings";
import LoyaltyTransaction from "@/models/LoyaltyTransaction";

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
      pointsToRedeem,
    } = body;

    if (!customerName || !customerPhone || !customerAddress) {
      return NextResponse.json({ error: "Customer name, phone, and address are required" }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one product" }, { status: 400 });
    }

    const normalizedPhone = String(customerPhone).replace(/\D/g, "");
    const normalizedCouponCode = couponCode ? String(couponCode).trim().toUpperCase() : "";
    const userId = session?.user ? (session.user as any).id : null;

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

    const loyaltySettings = await LoyaltySettings.findOne({}).lean();
    const loyaltyIsActive = loyaltySettings?.isActive ?? true;
    const earnRateAmount = Number(loyaltySettings?.earnRateAmount ?? 100) || 0;
    const earnRatePoints = Number(loyaltySettings?.earnRatePoints ?? 1) || 0;

    // ---- Loyalty points redemption (final server-side gate) ----
    // Deducted from the balance IMMEDIATELY — this is a real, completed
    // transaction, unlike the "earned" side below which stays pending.
    let pointsRedeemed = 0;
    let pointsDiscountAmount = 0;

    if (userId && pointsToRedeem && Number(pointsToRedeem) > 0 && loyaltyIsActive) {
      const requestedPoints = Math.floor(Number(pointsToRedeem));
      const minRedeem = Number(loyaltySettings?.minRedeemPoints ?? 100) || 0;
      const redeemPointsUnit = Number(loyaltySettings?.redeemPointsAmount ?? 100) || 0;
      const redeemValueUnit = Number(loyaltySettings?.redeemValueAmount ?? 10) || 0;

      if (requestedPoints >= minRedeem && redeemPointsUnit > 0) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId, loyaltyPoints: { $gte: requestedPoints } },
          { $inc: { loyaltyPoints: -requestedPoints } },
          { new: true }
        );

        if (updatedUser) {
          pointsRedeemed = requestedPoints;
          pointsDiscountAmount = Math.round((requestedPoints / redeemPointsUnit) * redeemValueUnit);
        }
      }
    }

    // ---- Loyalty points EARNED — locked in NOW (using the rate at the
    // moment of purchase, so a later admin rate change never retroactively
    // affects an already-placed order), but NOT yet added to the customer's
    // balance. It sits as a "pending" transaction until the order reaches
    // Delivered — see the admin PATCH /api/orders route for that step.
    let pointsEarned = 0;
    if (userId && loyaltyIsActive && earnRateAmount > 0 && earnRatePoints > 0) {
      const basisForEarning = Math.max(0, itemsSubtotal - (Number(discountAmount) || 0) - pointsDiscountAmount);
      pointsEarned = Math.floor(basisForEarning / earnRateAmount) * earnRatePoints;
    }

    const totalAmount = Math.max(
      0,
      itemsSubtotal - (Number(discountAmount) || 0) - pointsDiscountAmount + (Number(deliveryCharge) || 0)
    );

    const orderId = String(Math.floor(1000000 + Math.random() * 9000000));
    const createdAt = new Date();

    const newOrder = await Order.create({
      orderId,
      userId,
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
      couponCode: normalizedCouponCode || null,
      itemsSubtotal,
      totalAmount,
      paymentStatus: "PENDING",
      deliveryStatus: "Placed",
      statusHistory: [{ status: "Placed", changedAt: createdAt }],
      note: normalizedCouponCode ? `Coupon applied: ${normalizedCouponCode}` : "",
      pointsRedeemed,
      pointsDiscountAmount,
      pointsEarned,
      pointsEarnedCredited: false,
    });

    if (pointsRedeemed > 0) {
      await LoyaltyTransaction.create({
        userId,
        type: "redeemed",
        status: "completed",
        points: pointsRedeemed,
        orderId: newOrder._id,
        description: `Redeemed on order #${orderId}`,
      }).catch((err) => console.error("Failed to log points redemption:", err));
    }

    if (pointsEarned > 0) {
      await LoyaltyTransaction.create({
        userId,
        type: "earned",
        status: "pending",
        points: pointsEarned,
        orderId: newOrder._id,
        description: `Pending — order #${orderId} placed`,
      }).catch((err) => console.error("Failed to log pending points:", err));
    }

    await Promise.all(
      items
        .filter((item: any) => item.productId)
        .map((item: any) =>
          Product.updateOne(
            { _id: item.productId, stock: { $gte: Number(item.qty) } },
            { $inc: { stock: -Number(item.qty), sold: Number(item.qty) } }
          ).catch((err: unknown) => {
            console.error(`Failed to decrement stock for product ${item.productId}:`, err);
          })
        )
    );

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}