import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SearchLog from "@/models/SearchLog";

// GET: Full search-analytics breakdown for the admin dashboard.
// - topSearches: most-searched terms overall
// - zeroResultSearches: terms customers searched for but that NEVER returned
//   a product — direct signal for what to add to inventory
export async function GET() {
  try {
    await connectDB();

    const topSearches = await SearchLog.find({})
      .sort({ count: -1 })
      .limit(20)
      .select("term count resultsFoundCount lastSearchedAt")
      .lean();

    const zeroResultSearches = await SearchLog.find({ resultsFoundCount: 0 })
      .sort({ count: -1 })
      .limit(20)
      .select("term count lastSearchedAt")
      .lean();

    return NextResponse.json({ topSearches, zeroResultSearches });
  } catch (error) {
    console.error("Search analytics error:", error);
    return NextResponse.json({ topSearches: [], zeroResultSearches: [] }, { status: 500 });
  }
}