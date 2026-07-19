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
      pointsToRedeem, // NEW
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

    // ---- Loyalty points redemption (final server-side gate) ----
    // Only logged-in customers can redeem. Points are deducted immediately
    // at order placement, and refunded automatically by the admin order
    // route if the order is later Cancelled/Returned.
    let pointsRedeemed = 0;
    let pointsDiscountAmount = 0;

    if (userId && pointsToRedeem && Number(pointsToRedeem) > 0) {
      const requestedPoints = Math.floor(Number(pointsToRedeem));
      const loyaltySettings = await LoyaltySettings.findOne({}).lean();

      if (loyaltySettings?.isActive) {
        const minRedeem = loyaltySettings.minRedeemPoints || 0;
        const redeemPointsUnit = loyaltySettings.redeemPointsAmount || 0;
        const redeemValueUnit = loyaltySettings.redeemValueAmount || 0;

        if (requestedPoints >= minRedeem && redeemPointsUnit > 0) {
          // Atomic deduction — only succeeds if the balance is actually
          // sufficient, guarding against a stale UI or double-submit race.
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
    });

    if (pointsRedeemed > 0) {
      await LoyaltyTransaction.create({
        userId,
        type: "redeemed",
        points: pointsRedeemed,
        orderId: newOrder._id,
        description: `Redeemed on order #${orderId}`,
      }).catch((err) => console.error("Failed to log points redemption:", err));
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