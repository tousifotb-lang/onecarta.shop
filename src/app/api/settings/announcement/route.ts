import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export const dynamic = "force-dynamic";

// Public GET — navbar-er announcement bar ei route theke text/on-off state fetch kore
export async function GET() {
  try {
    await connectDB();
    const doc = await Settings.findOne({ key: "announcement" }).lean();

    return NextResponse.json(
      { isActive: doc?.isActive ?? false, text: doc?.text ?? "" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Announcement settings fetch error:", error);
    // Fail-safe: kono error hoile bar-ta hide thakbe, page break korbe na
    return NextResponse.json({ isActive: false, text: "" }, { status: 200 });
  }
}