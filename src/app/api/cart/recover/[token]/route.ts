import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AbandonedCart, { IAbandonedCartItem } from "@/models/AbandonedCart";
import Product from "@/models/Product";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    await connectDB();
    const cart = await AbandonedCart.findOne({ recoveryToken: token });
    if (!cart) return NextResponse.json({ error: "not found" }, { status: 404 });

    const products = await Product.find({
      _id: { $in: cart.items.map((i: IAbandonedCartItem) => i.productId) },
      isActive: true,
    });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const restoredItems = cart.items
      .map((item: IAbandonedCartItem) => {
        const product = productMap.get(item.productId);
        if (!product || product.stock <= 0) return null;
        return {
          productId: item.productId,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] || item.image,
          price: product.price,
          originalPrice: product.originalPrice,
          category: product.category,
          brand: product.brand,
          stock: product.stock,
          quantity: Math.min(item.quantity, product.stock),
        };
      })
      .filter(Boolean);

    cart.status = "recovered";
    await cart.save();

    return NextResponse.json({ items: restoredItems });
  } catch (err) {
    console.error("Cart recovery error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}