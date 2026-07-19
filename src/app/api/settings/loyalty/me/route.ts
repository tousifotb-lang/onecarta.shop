import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import LoyaltyTransaction from "@/models/LoyaltyTransaction";

export const dynamic = "force-dynamic";

// GET: Logged-in customer's current points balance + recent history.
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

    return NextResponse.json({
      balance: (user as any)?.loyaltyPoints || 0,
      transactions,
    });
  } catch (error) {
    console.error("Loyalty balance fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch loyalty data" }, { status: 500 });
  }
}