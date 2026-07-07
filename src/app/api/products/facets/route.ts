import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getDescendantCategoryIds } from "@/lib/categoryTree";

// Returns which brands actually exist among the matching products, so the
// storefront's Brand filter never shows options irrelevant to the current
// category (e.g. no Electronics brands while browsing Fashion).
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const categorySlug = searchParams.get("category");

    const query: Record<string, unknown> = { status: "ACTIVE" };

    let resolvedCategoryId = categoryId;
    if (!resolvedCategoryId && categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug }).select("_id").lean();
      if (cat) resolvedCategoryId = String((cat as any)._id);
    }

    if (resolvedCategoryId) {
      const descendantIds = await getDescendantCategoryIds(resolvedCategoryId);
      query.categoryId = { $in: descendantIds };
    } else if (categorySlug) {
      query.category = categorySlug;
    }

    const brands: string[] = await Product.distinct("brand", {
      ...query,
      brand: { $exists: true, $ne: "" },
    });

    brands.sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Facets API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}