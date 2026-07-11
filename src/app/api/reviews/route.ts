import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

// GET: Fetch all reviews for a product + a per-star breakdown (used to draw
// the real rating bars instead of the old fake percentage formula).
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "A valid productId is required" }, { status: 400 });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean();

    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      const star = Math.round(r.rating);
      if (breakdown[star] !== undefined) breakdown[star]++;
    }

    // If the visitor is logged in and already reviewed this product, surface
    // that review separately so the "Write a Review" form can pre-fill it
    // as an edit instead of letting them accidentally create a duplicate.
    const session = await auth();
    const currentUserId = session?.user ? (session.user as any).id : null;
    const myReview = currentUserId
      ? reviews.find((r) => r.userId?.toString() === currentUserId) || null
      : null;

    return NextResponse.json(
      { reviews, breakdown, myReview },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Submit (or update) a review. Requires login. After saving, the
// product's aggregate `rating` and `reviewCount` are recalculated from ALL
// reviews so every other place on the storefront that shows the star
// rating (product cards, product detail header, specs tab) stays accurate.
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in to write a review" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { productId, rating, comment } = body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "A valid productId is required" }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: "Please select a rating between 1 and 5 stars" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const userName = session.user.name || "Customer";

    await Review.findOneAndUpdate(
      { productId, userId },
      {
        productId,
        userId,
        userName,
        rating: numericRating,
        comment: typeof comment === "string" ? comment.trim().slice(0, 1000) : "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const allReviews = await Review.find({ productId }).lean();
    const reviewCount = allReviews.length;
    const avgRating =
      reviewCount > 0
        ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
        : 0;

    await Product.findByIdAndUpdate(productId, { rating: avgRating, reviewCount });

    return NextResponse.json({ success: true, rating: avgRating, reviewCount }, { status: 201 });
  } catch (error: any) {
    console.error("Review submit error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}