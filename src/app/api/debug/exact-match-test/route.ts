import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { getDescendantCategoryIds } from "@/lib/categoryTree";

// TEMPORARY — delete after use.
// Isolates whether the categoryId $in mismatch is a Mongoose-casting quirk
// or a genuine data-level mismatch, by comparing raw-driver vs Mongoose
// results side by side against the exact same ObjectId array.
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const categoryId = req.nextUrl.searchParams.get("categoryId");
    if (!categoryId) {
      return NextResponse.json({ error: "Pass ?categoryId=..." }, { status: 400 });
    }

    const descendantIds = await getDescendantCategoryIds(categoryId);
    const target = descendantIds[1]; // the "Smartphones" id from last run

    const db = mongoose.connection.db;
    if (!db) return NextResponse.json({ error: "No DB connection" }, { status: 500 });

    // 1) Raw driver, no Mongoose casting at all
    const rawProduct: any = await db.collection("products").findOne({ name: "iPhone 15" });

    // 2) Raw driver $in, using the exact same descendantIds array
    const rawInCount = await db.collection("products").countDocuments({
      categoryId: { $in: descendantIds },
    });

    // 3) Raw driver single-value equality against the target id
    const rawEqCount = await db.collection("products").countDocuments({
      categoryId: target,
    });

    // 4) Mongoose, single-value equality (not $in) against the same target
    const mongooseEqCount = await Product.countDocuments({ categoryId: target });

    // 5) Mongoose, freshly-constructed ObjectId from the target's hex string
    const freshId = new mongoose.Types.ObjectId(target.toString());
    const mongooseFreshCount = await Product.countDocuments({ categoryId: freshId });

    return NextResponse.json({
      targetId: target.toString(),
      rawProductCategoryId_typeof: rawProduct ? typeof rawProduct.categoryId : null,
      rawProductCategoryId_constructorName: rawProduct?.categoryId?.constructor?.name ?? null,
      rawProductCategoryId_asString: rawProduct?.categoryId ? String(rawProduct.categoryId) : null,
      rawProductCategoryId_equalsTarget:
        rawProduct?.categoryId?.equals?.(target) ?? "no .equals method (likely not a real ObjectId)",
      rawDriver_inCount: rawInCount,
      rawDriver_eqCount: rawEqCount,
      mongoose_eqCount: mongooseEqCount,
      mongoose_freshIdEqCount: mongooseFreshCount,
    });
  } catch (error) {
    console.error("exact-match-test error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}