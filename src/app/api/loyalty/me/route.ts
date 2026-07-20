import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import LoyaltyTransaction from "@/models/LoyaltyTransaction";

export const dynamic = "force-dynamic";

// GET: Logged-in customer's current points balance (completed only),
// pending points (from orders not yet Delivered), and recent history.
export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await User.findById(userId).select("loyaltyPoints").lean();
    const transactions = await LoyaltyTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const pendingPoints = transactions
      .filter((t: any) => t.type === "earned" && t.status === "pending")
      .reduce((sum: number, t: any) => sum + t.points, 0);

    return NextResponse.json({
      balance: (user as any)?.loyaltyPoints || 0,
      pendingPoints,
      transactions,
    });
  } catch (error) {
    console.error("Loyalty balance fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch loyalty data" }, { status: 500 });
  }
}