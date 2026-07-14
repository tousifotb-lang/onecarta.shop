import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// ONE-TIME MIGRATION — delete this file after running it once.
//
// Fixes existing products whose `categoryId` was accidentally saved as a
// plain STRING (via the admin Edit Product form) instead of a proper
// MongoDB ObjectId. Those products silently vanish from every category
// filter because BSON treats string and ObjectId as different types, even
// when the value "looks" identical.
//
// Visit this URL once in the browser: /api/debug/fix-categoryid-types
export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "No DB connection" }, { status: 500 });
    }

    const productsCol = db.collection("products");

    // Find every product where categoryId exists but is stored as a string
    const brokenProducts = await productsCol
      .find({ categoryId: { $type: "string" } })
      .project({ _id: 1, name: 1, categoryId: 1 })
      .toArray();

    let fixedCount = 0;
    const fixedNames: string[] = [];

    for (const product of brokenProducts) {
      const rawId = String(product.categoryId);
      if (!mongoose.Types.ObjectId.isValid(rawId)) continue;

      await productsCol.updateOne(
        { _id: product._id },
        { $set: { categoryId: new mongoose.Types.ObjectId(rawId) } }
      );
      fixedCount += 1;
      fixedNames.push(product.name);
    }

    return NextResponse.json({
      totalFound: brokenProducts.length,
      totalFixed: fixedCount,
      fixedProductNames: fixedNames,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}