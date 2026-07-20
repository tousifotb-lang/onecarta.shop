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

  // ---- Loyalty points refund ----
  // If this order had points redeemed at checkout, credit them back now
  // that the order never went through. Guarded by pointsRedeemedRefunded so
  // this never double-refunds (e.g. if an admin also touches this order).
  if (order.userId && order.pointsRedeemed > 0 && !order.pointsRedeemedRefunded) {
    await User.updateOne(
      { _id: order.userId },
      { $inc: { loyaltyPoints: order.pointsRedeemed } }
    );
    await LoyaltyTransaction.create({
      userId: order.userId,
      type: "refunded",
      points: order.pointsRedeemed,
      orderId: order._id,
      description: `Refunded — order #${order.orderId} was cancelled`,
    });
    order.pointsRedeemedRefunded = true;
  }

  await order.save();

  return NextResponse.json(order, { status: 200 });
}