import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SearchLog from "@/models/SearchLog";

// POST: Record that a shopper searched for this term (upsert + increment).
// `hadResults` tells us whether this particular search actually returned
// any products — used to surface "customers searched but found nothing"
// terms to the admin, which is a direct signal for what to stock next.
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { term, hadResults } = await req.json();

    const normalized = (term || "").toLowerCase().trim();
    if (!normalized || normalized.length < 2) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    await SearchLog.findOneAndUpdate(
      { term: normalized },
      {
        $inc: { count: 1, ...(hadResults ? { resultsFoundCount: 1 } : {}) },
        $set: { lastSearchedAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Search log error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// GET: Return the top trending search terms, most-searched first.
// Used by the storefront's "Trending Now" chips.
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