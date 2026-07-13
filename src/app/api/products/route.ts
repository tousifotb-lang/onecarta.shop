import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getDescendantCategoryIds } from "@/lib/categoryTree";

// ── Fuzzy search helpers ─────────────────────────────────────────────────────

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
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function scoreProduct(product: any, searchTerm: string): number {
  const term = searchTerm.toLowerCase().trim();
  const name = (product.name || product.title || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const description = (product.description || "").toLowerCase();

  if (!term) return 0;

  if (name === term) return 100;
  if (name.startsWith(term)) return 95;

  const nameWords = name.split(/\s+/).filter(Boolean);
  if (nameWords.some((w: string) => w.startsWith(term))) return 90;
  if (name.includes(term)) return 85;

  if (brand === term || brand.includes(term)) return 75;
  if (category === term || category.includes(term)) return 65;

  if (description.includes(term)) return 50;

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

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET: Fetch all products from MongoDB
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const categorySlug = searchParams.get("category"); // legacy/slug-based filter
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "createdAt";
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

      // Legacy safety net: some products were created before the categoryId
      // field existed and only ever got the plain `category` NAME string
      // (e.g. "Smartphones"). Those would otherwise silently vanish from
      // every category page even though they clearly belong there. Catch
      // them too — but only when categoryId is genuinely missing, so we
      // never double-count a product that already has a proper categoryId.
      const descendantDocs = await Category.find({ _id: { $in: descendantIds } })
        .select("name")
        .lean();
      const descendantNames = descendantDocs.map((c: any) => c.name).filter(Boolean);

      const categoryOr: Record<string, unknown>[] = [{ categoryId: { $in: descendantIds } }];
      if (descendantNames.length > 0) {
        const namePattern = descendantNames.map(escapeRegex).join("|");
        categoryOr.push({
          categoryId: null, // matches both missing AND explicitly-null categoryId
          category: { $regex: `^(${namePattern})$`, $options: "i" },
        });
      }

      query.$or = categoryOr;
    } else if (categorySlug) {
      // No matching category document found at all for this slug — fall
      // back to a direct slug-vs-name compare as a last resort (kept for
      // backward compatibility with any very old direct callers).
      query.category = categorySlug;
    }

    if (tag === "flash-sale") query.isFlashSale = true;
    if (tag === "featured") query.isFeatured = true;
    if (tag === "best-selling") query.isBestSelling = true;
    if (tag === "new") query.createdAt = { $exists: true };
    if (brand) query.brand = brand;

    if (minPrice || maxPrice) {
      const priceQuery: Record<string, number> = {};
      if (minPrice) priceQuery.$gte = parseInt(minPrice);
      if (maxPrice) priceQuery.$lte = parseInt(maxPrice);
      query.price = priceQuery;
    }

    const skip = (page - 1) * limit;

    // ── Search path: relevance-ranked with typo tolerance ──────────────────
    if (search && search.trim()) {
      const candidates = await Product.find(query)
        .select(
          "name title slug price originalPrice discount images category brand description " +
          "isFeatured isFlashSale isBestSelling stock sold rating reviewCount createdAt"
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
    const sortObj: Record<string, 1 | -1> = { [sort]: order === "asc" ? 1 : -1 };

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