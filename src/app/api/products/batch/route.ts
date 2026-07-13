import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

// POST: Fetch multiple products by their _id in one call — used by the
// dashboard's "Reorder" button so it can look up current price/stock/slug
// for every item in a past order without one request per product.
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const validIds = ids.filter((id: any) => typeof id === "string" && id.length === 24);
    if (validIds.length === 0) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const products = await Product.find({ _id: { $in: validIds } }).lean();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Batch product fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}