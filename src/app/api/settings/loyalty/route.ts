import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LoyaltySettings from "@/models/LoyaltySettings";

export const dynamic = "force-dynamic";

// Public GET — tells checkout + dashboard whether points are enabled and
// what the current earn/redeem rates are.
export async function GET() {
  try {
    await connectDB();
    const doc = await LoyaltySettings.findOne({}).lean();

    return NextResponse.json(
      {
        isActive: doc?.isActive ?? true,
        earnRateAmount: doc?.earnRateAmount ?? 100,
        earnRatePoints: doc?.earnRatePoints ?? 1,
        redeemPointsAmount: doc?.redeemPointsAmount ?? 100,
        redeemValueAmount: doc?.redeemValueAmount ?? 10,
        minRedeemPoints: doc?.minRedeemPoints ?? 100,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Loyalty settings fetch error:", error);
    return NextResponse.json(
      { isActive: false, earnRateAmount: 100, earnRatePoints: 1, redeemPointsAmount: 100, redeemValueAmount: 10, minRedeemPoints: 100 },
      { status: 200 }
    );
  }
}