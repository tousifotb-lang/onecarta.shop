import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// TEMPORARY ONE-TIME MIGRATION ROUTE — delete after running once successfully.
// Fixes products where categoryId was saved as a plain string (via admin's
// raw MongoDB driver) instead of a real ObjectId (which storefront's
// Mongoose $in query requires to actually match).
//
// Usage: GET /api/debug/fix-category-id-types?confirm=yes
export async function GET(req: NextRequest) {
  try {
    const confirm = req.nextUrl.searchParams.get("confirm");
    if (confirm !== "yes") {
      return NextResponse.json(
        { error: "Add ?confirm=yes to the URL to actually run this migration." },
        { status: 400 }
      );
    }

    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "No DB connection" }, { status: 500 });
    }

    // Preview: how many docs currently have categoryId stored as a string
    const stringCount = await db
      .collection("products")
      .countDocuments({ categoryId: { $type: "string" } });

    // Aggregation-pipeline update (Mongo 4.2+): converts categoryId from
    // string -> real ObjectId in place, only for docs where it's currently a string.
    const result = await db.collection("products").updateMany(
      { categoryId: { $type: "string" } },
      [{ $set: { categoryId: { $toObjectId: "$categoryId" } } }]
    );

    return NextResponse.json({
      docsFoundWithStringCategoryId: stringCount,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}