import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

// এই route টা যেন কখনোই cache না হয়, প্রতিবার fresh data fetch করে
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const userId = (session.user as any).id;
  const user = await User.findById(userId).select("phone").lean();

  const matchConditions: any[] = [{ userId }];
  if (user?.phone) {
    matchConditions.push({ customerPhone: user.phone });
  }

  const orders = await Order.find({ $or: matchConditions })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(orders, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}