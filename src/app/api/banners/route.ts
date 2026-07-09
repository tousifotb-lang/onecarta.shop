import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Banner from "../../../models/Banner";

// GET: Public banner list for the storefront homepage.
// ?type=hero | side   -> filter by banner type
// ?activeOnly=true    -> only banners the admin has marked active
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const activeOnly = searchParams.get("activeOnly");

    const filter: any = {};
    if (type === "hero" || type === "side") {
      filter.type = type;
    }
    if (activeOnly === "true") {
      filter.isActive = true;
    }

    const banners = await Banner.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}