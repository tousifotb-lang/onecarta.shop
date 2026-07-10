import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SearchLog from "@/models/SearchLog";

// POST: Record that a shopper searched for this term (upsert + increment).
// Called when the shopper actually submits a search or clicks a result —
// not on every keystroke, so noise/partial-typing doesn't pollute trends.
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { term } = await req.json();

    const normalized = (term || "").toLowerCase().trim();
    if (!normalized || normalized.length < 2) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    await SearchLog.findOneAndUpdate(
      { term: normalized },
      { $inc: { count: 1 }, $set: { lastSearchedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Search log error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// GET: Return the top trending search terms, most-searched first.
export async function GET() {
  try {
    await connectDB();
    const trending = await SearchLog.find({})
      .sort({ count: -1 })
      .limit(8)
      .select("term count")
      .lean();

    return NextResponse.json({ trending: trending.map((t) => t.term) });
  } catch (error) {
    console.error("Trending fetch error:", error);
    return NextResponse.json({ trending: [] });
  }
}