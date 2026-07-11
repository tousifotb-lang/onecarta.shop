import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export const dynamic = "force-dynamic";

// Public GET — navbar এই route থেকে messages list + on/off state fetch করে
export async function GET() {
  try {
    await connectDB();
    const doc = await Settings.findOne({ key: "announcement" }).lean();

    return NextResponse.json(
      { isActive: doc?.isActive ?? false, messages: Array.isArray(doc?.messages) ? doc.messages : [] },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Announcement settings fetch error:", error);
    return NextResponse.json({ isActive: false, messages: [] }, { status: 200 });
  }
}