import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getDescendantCategoryIds } from "@/lib/categoryTree";

// ── Fuzzy search helpers ─────────────────────────────────────────────────────

// Standard edit-distance calculation — counts how many single-character
// changes (insert/delete/swap) turn one word into another. Used to catch
// typos like "iphon" -> "iphone" or "hedphone" -> "headphone".
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Scores a single product against the search term. Higher = more relevant.
// 0 means "not a match at all" and gets filtered out.
function scoreProduct(product: any, searchTerm: string): number {
  const term = searchTerm.toLowerCase().trim();
  const name = (product.name || product.title || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const description = (product.description || "").toLowerCase();

  if (!term) return 0;

  // ── Tier 1: strong direct matches ──
  if (name === term) return 100;
  if (name.startsWith(term)) return 95;

  const nameWords = name.split(/\s+/).filter(Boolean);
  if (nameWords.some((w: string) => w.startsWith(term))) return 90;
  if (name.includes(term)) return 85;

  // ── Tier 2: brand / category matches ──
  if (brand === term || brand.includes(term)) return 75;
  if (category === term || category.includes(term)) return 65;

  // ── Tier 3: description match (weakest direct match) ──
  if (description.includes(term)) return 50;

  // ── Tier 4: typo tolerance — compare the search term against each word
  // in the product name using edit distance. Allows ~1 typo per 3 letters,
  // capped at 3 edits so very short/long mismatches don't false-positive.
  let bestDistance = Infinity;
  for (const word of nameWords) {
    if (Math.abs(word.length - term.length) > 3) continue;
    const dist = levenshtein(term, word);
    if (dist < bestDistance) bestDistance = dist;
  }

  const threshold = Math.max(1, Math.min(3, Math.floor(term.length * 0.34)));
  if (bestDistance <= threshold) {
    return 40 - bestDistance * 8;
  }

  return 0;
}

// GET: Fetch all products from MongoDB
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const categorySlug = searchParams.get("category"); // legacy/slug-based filter
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const sortParam = searchParams.get("sort");
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const brand = searchParams.get("brand");

    const query: Record<string, unknown> = { status: "ACTIVE" };

    // Resolve which category (if any) we're filtering by, then expand it
    // to include every descendant subcategory so a parent category page
    // shows products tagged under any of its children too.
    let resolvedCategoryId = categoryId;
    if (!resolvedCategoryId && categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug }).select("_id").lean();
      if (cat) resolvedCategoryId = String((cat as any)._id);
    }

    if (resolvedCategoryId) {
      const descendantIds = await getDescendantCategoryIds(resolvedCategoryId);
      query.categoryId = { $in: descendantIds };
    } else if (categorySlug) {
      // Fallback for older products that only ever got the plain string field
      query.category = categorySlug;
    }

    if (tag === "flash-sale") query.isFlashSale = true;
    if (tag === "featured") query.isFeatured = true;
    if (tag === "best-selling") query.isBestSelling = true;
    if (tag === "new") query.createdAt = { $exists: true };

    // Recently Restocked — products that went from out-of-stock back to
    // in-stock within the last 30 days. The window keeps this section from
    // showing a restock that happened months ago and is no longer "news".
    if (tag === "restocked") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.restockedAt = { $gte: thirtyDaysAgo };
      query.stock = { $gt: 0 };
    }

    if (brand) query.brand = brand;

    if (minPrice || maxPrice) {
      const priceQuery: Record<string, number> = {};
      if (minPrice) priceQuery.$gte = parseInt(minPrice);
      if (maxPrice) priceQuery.$lte = parseInt(maxPrice);
      query.price = priceQuery;
    }

    const skip = (page - 1) * limit;

    // ── Search path: relevance-ranked with typo tolerance ──────────────────
    // Instead of a plain regex $or (which returns matches in arbitrary order
    // and misses typos entirely), pull the filtered candidate set and score
    // each product's relevance in-app, then sort by that score. This stays
    // fast for catalogs up to a few thousand products.
    if (search && search.trim()) {
      const candidates = await Product.find(query)
        .select(
          "name title slug price originalPrice discount images category brand description " +
          "isFeatured isFlashSale isBestSelling stock sold rating reviewCount createdAt restockedAt"
        )
        .lean();

      const scored = candidates
        .map((p) => ({ product: p, score: scoreProduct(p, search) }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);

      const total = scored.length;
      const paged = scored.slice(skip, skip + limit).map((s) => s.product);

      return NextResponse.json({
        products: paged,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    // ── Normal (non-search) path — unchanged sort/filter/paginate ──────────
    // Restocked tag defaults to sorting by most-recently-restocked first
    // unless the caller explicitly asked for a different sort field.
    const sortField = sortParam || (tag === "restocked" ? "restockedAt" : "createdAt");
    const sortObj: Record<string, 1 | -1> = { [sortField]: order === "asc" ? 1 : -1 };

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}