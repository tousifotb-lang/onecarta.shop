import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export const dynamic = "force-dynamic";

const DEFAULT_RATES = { insideDhaka: 80, specialZone: 100, outsideDhaka: 120 };

export async function GET() {
  try {
    await connectDB();
    const doc = await Settings.findOne({ key: "delivery" }).lean();
    return NextResponse.json(
      { rates: doc?.rates || DEFAULT_RATES },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Delivery settings fetch error:", error);
    // Fail-safe: fall back to the original hardcoded rates so checkout never breaks
    return NextResponse.json({ rates: DEFAULT_RATES }, { status: 200 });
  }
}