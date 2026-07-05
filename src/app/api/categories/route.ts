import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

// GET: Public category reads for the storefront.
// - ?slug=xxx  -> single category + breadcrumb chain + direct subcategories
//                 (used by the /category/[...slug] page)
// - ?parentId=xxx -> direct children of that category
// - (no params) -> top-level categories only (used by homepage grid + FilterSidebar)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const parentId = searchParams.get("parentId");

    if (slug) {
      const category = await Category.findOne({ slug, isActive: true }).lean();
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }

      // Walk up the parent chain to build the breadcrumb (root first)
      const breadcrumb: any[] = [category];
      let currentParentId = (category as any).parentId;
      let safety = 0;
      while (currentParentId && safety < 20) {
        const parent = await Category.findById(currentParentId).lean();
        if (!parent) break;
        breadcrumb.unshift(parent);
        currentParentId = (parent as any).parentId;
        safety += 1;
      }

      const subCategories = await Category.find({
        parentId: (category as any)._id,
        isActive: true,
      })
        .sort({ order: 1 })
        .lean();

      return NextResponse.json({ category, breadcrumb, subCategories });
    }

    const filter: any = { isActive: true, parentId: parentId || null };
    const categories = await Category.find(filter).sort({ order: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}