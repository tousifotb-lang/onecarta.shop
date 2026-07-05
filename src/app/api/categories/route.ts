import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

// GET: Public category reads for the storefront.
// - ?slug=xxx      -> single category + breadcrumb chain + direct subcategories
// - ?all=true      -> flat list of EVERY category (all depths), used by
//                      FilterSidebar to build the full nested tree
// - ?parentId=xxx  -> direct children of that category
// - (no params)    -> top-level categories only (homepage grid)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const parentId = searchParams.get("parentId");
    const all = searchParams.get("all");

    if (slug) {
      const category = await Category.findOne({ slug }).lean();
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }

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

      const subCategories = await Category.find({ parentId: (category as any)._id })
        .sort({ order: 1 })
        .lean();

      return NextResponse.json({ category, breadcrumb, subCategories });
    }

    if (all === "true") {
      const categories = await Category.find({}).sort({ order: 1 }).lean();
      return NextResponse.json(categories);
    }

    const filter: any = { parentId: parentId || null };
    const categories = await Category.find(filter).sort({ order: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}