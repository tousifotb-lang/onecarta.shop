import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getDescendantCategoryIds } from "@/lib/categoryTree";

// TEMPORARY DEBUG ROUTE — delete this file once the category-filter bug is
// fixed. No auth guard, so don't leave it live on production long-term.
//
// Usage: GET /api/debug/category-check?categoryId=<the id from the failing request>
//
// Shows exactly what's stored on the product side vs what the category
// query is looking for, so a categoryId mismatch (stale/orphaned reference)
// is immediately visible instead of guessed at.
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const categoryId = req.nextUrl.searchParams.get("categoryId");
    if (!categoryId) {
      return NextResponse.json({ error: "Pass ?categoryId=..." }, { status: 400 });
    }

    const categoryDoc = await Category.findById(categoryId).lean();

    const descendantIds = await getDescendantCategoryIds(categoryId);
    const descendantDocs = await Category.find({ _id: { $in: descendantIds } })
      .select("name slug")
      .lean();
    const descendantNames = descendantDocs.map((c: any) => c.name);

    const countByCategoryId = await Product.countDocuments({
      categoryId: { $in: descendantIds },
    });

    // Products whose plain `category` NAME text matches this category
    // (regardless of what their categoryId field says) — this reveals any
    // mismatch between the two fields.
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const namePattern = descendantNames.map(escapeRegex).join("|");
    const sampleByName = namePattern
      ? await Product.find({ category: { $regex: `^(${namePattern})$`, $options: "i" } })
          .select("name category categoryId status stock")
          .limit(15)
          .lean()
      : [];

    return NextResponse.json({
      requestedCategoryId: categoryId,
      categoryDocFound: categoryDoc
        ? { _id: categoryDoc._id, name: (categoryDoc as any).name, slug: (categoryDoc as any).slug }
        : null,
      descendantIds: descendantIds.map((id) => String(id)),
      descendantNames,
      countOfProductsMatchingByCategoryId: countByCategoryId,
      sampleProductsMatchingByNameInstead: sampleByName.map((p: any) => ({
        name: p.name,
        category: p.category,
        categoryId: p.categoryId ? String(p.categoryId) : null,
        status: p.status,
        stock: p.stock,
      })),
    });
  } catch (error) {
    console.error("Debug category-check error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}