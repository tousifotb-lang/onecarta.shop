import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import LoyaltyTransaction from "@/models/LoyaltyTransaction";

const NON_CANCELLABLE_STATUSES = ["Delivered", "Completed", "Cancelled", "Returned"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const userId = (session.user as any).id;
  const user = await User.findById(userId).select("phone").lean();

  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const belongsToUser =
    (order.userId && order.userId.toString() === userId) ||
    (user?.phone && order.customerPhone === user.phone);

  if (!belongsToUser) {
    return NextResponse.json({ error: "You are not allowed to cancel this order" }, { status: 403 });
  }

  if (NON_CANCELLABLE_STATUSES.includes(order.deliveryStatus)) {
    return NextResponse.json(
      { error: `This order can no longer be cancelled (current status: ${order.deliveryStatus})` },
      { status: 400 }
    );
  }

  const changedAt = new Date();
  order.deliveryStatus = "Cancelled";
  order.statusHistory.push({ status: "Cancelled", changedAt });
  order.updatedAt = changedAt;

  if (order.userId) {
    // Refund any redeemed points
    if (order.pointsRedeemed > 0 && !order.pointsRedeemedRefunded) {
      await User.updateOne(
        { _id: order.userId },
        { $inc: { loyaltyPoints: order.pointsRedeemed } }
      );
      await LoyaltyTransaction.create({
        userId: order.userId,
        type: "refunded",
        status: "completed",
        points: order.pointsRedeemed,
        orderId: order._id,
        description: `Refunded — order #${order.orderId} was cancelled`,
      });
      order.pointsRedeemedRefunded = true;
    }

    // Defensive: if this order had somehow already been credited (unusual,
    // since Delivered orders can't reach this route at all), reverse it
    // instead of leaving phantom points in the balance.
    if (order.pointsEarnedCredited && (order.pointsEarned || 0) > 0) {
      const userDoc = await User.findById(order.userId).select("loyaltyPoints").lean();
      const currentBalance = (userDoc as any)?.loyaltyPoints || 0;
      const newBalance = Math.max(0, currentBalance - order.pointsEarned);
      await User.updateOne({ _id: order.userId }, { $set: { loyaltyPoints: newBalance } });
      await LoyaltyTransaction.updateMany(
        { orderId: order._id, type: "earned", status: "completed" },
        { $set: { status: "reversed", description: `Reversed — order #${order.orderId} was cancelled` } }
      );
      order.pointsEarnedCredited = false;
    } else if (!order.pointsEarnedCredited) {
      // Still-pending earned points for this order — void them.
      await LoyaltyTransaction.updateMany(
        { orderId: order._id, type: "earned", status: "pending" },
        { $set: { status: "voided", description: `Voided — order #${order.orderId} was cancelled` } }
      );
      order.pointsEarnedCredited = true; // prevents future crediting
    }
  }

  await order.save();

  return NextResponse.json(order, { status: 200 });
}