import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Public route — কোনো login/auth লাগে না। শুধু owner-এর নাম আর wishlist-এর
// product গুলো (public-safe field) দেয় — email/phone/address কখনোই না।
export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid wishlist link" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId)
      .select("name wishlist")
      .populate("wishlist")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });
    }

    // Deleted/deactivated product still থাকতে পারে wishlist array-তে (populate
    // null return করবে ওগুলোর জন্য) — এখানে বাদ দেওয়া হচ্ছে।
    const items = ((user as any).wishlist || []).filter((p: any) => p && p.isActive !== false);

    return NextResponse.json(
      { ownerName: (user as any).name || "A Onecarta Shopper", items },
      { status: 200, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (error) {
    console.error("Shared wishlist fetch error:", error);
    return NextResponse.json({ error: "Failed to load wishlist" }, { status: 500 });
  }
}