import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export const dynamic = "force-dynamic";

// Public GET — no auth needed, this just tells the homepage whether to show
// the Flash Sale banner and what time its countdown should end.
export async function GET() {
  try {
    await connectDB();
    const doc = await Settings.findOne({ key: "flashSale" }).lean();

    return NextResponse.json(
      { isActive: doc?.isActive ?? true, endsAt: doc?.endsAt ?? null },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Flash sale settings fetch error:", error);
    // Fail-safe: behave like the feature was never configured — daily
    // midnight-reset countdown, same as before this feature existed.
    return NextResponse.json({ isActive: true, endsAt: null }, { status: 200 });
  }
}