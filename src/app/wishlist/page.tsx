"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Heart, ShoppingCart, Trash2, ArrowLeft,
  PackageOpen, Lock, Loader2
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useAuthModalStore } from "@/store/authModalStore";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const [clearing, setClearing] = useState(false);

  // ✅ localStorage flag বাদ দিয়ে real NextAuth session দিয়ে login state চেক করা
  // হচ্ছে — বাকি সব component (Navbar, ProductDetailPage) এভাবেই করে, তাই এখন
  // consistent থাকবে এবং login করা থাকলেও "Login Required" আর দেখাবে না।
  const { status } = useSession();
  const isLoggedIn = mounted && status === "authenticated";

  const { fetchWishlist, toggleWishlist, getWishlistItems, loaded } = useWishlistStore();
  const { addItem } = useCartStore();
  const { openModal } = useAuthModalStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navbar-ও session authenticated হলে fetchWishlist কল করে, কিন্তু direct এই
  // page-এ এসে পড়লে (deep link/refresh) race condition এড়াতে এখানেও নিশ্চিত
  // করে নেওয়া হচ্ছে যে wishlist data লোড হয়েছে।
  useEffect(() => {
    if (isLoggedIn && !loaded) {
      fetchWishlist();
    }
  }, [isLoggedIn, loaded, fetchWishlist]);

  const items = mounted && isLoggedIn ? getWishlistItems() : [];

  const handleAddToCart = (item: ReturnType<typeof getWishlistItems>[number]) => {
    addItem({
      _id: item._id,
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice ?? item.price,
      category: item.category ?? "",
      brand: item.brand ?? "",
      stock: item.stock ?? 0,
    });
  };

  // WishlistItem already store-এ আছে মানে toggleWishlist কল করলে এটা remove
  // হয়ে যাবে (add/remove দুটোই একই function দিয়ে হ্যান্ডেল হয়) — এবং এটা
  // backend-এও DELETE কল করে দেয়, শুধু local state না।
  const handleRemove = (item: ReturnType<typeof getWishlistItems>[number]) => {
    toggleWishlist(item);
  };

  // clearWishlist() শুধু local state clear করে, backend-এ কিছু delete করে না —
  // তাই এখানে প্রতিটা item-এর উপর toggleWishlist চালিয়ে backend থেকেও
  // সবগুলো সরিয়ে দেওয়া হচ্ছে, নাহলে refresh দিলে সব ফিরে আসবে।
  const handleClearAll = async () => {
    setClearing(true);
    try {
      const currentItems = getWishlistItems();
      for (const item of currentItems) {
        await toggleWishlist(item);
      }
    } finally {
      setClearing(false);
    }
  };

  // Session status এখনো resolve হচ্ছে — flash of wrong state এড়াতে loading দেখানো
  if (!mounted || status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </main>
    );
  }

  // 🔐 Login Wall — login না থাকলে এটা দেখাবে
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center pb-24 md:pb-0">
        <div className="flex flex-col items-center text-center px-6 max-w-sm">
          <div className="w-24 h-24 bg-[#1a1a2e]/5 rounded-full flex items-center justify-center mb-5">
            <Lock size={36} className="text-[#1a1a2e]/40" />
          </div>
          <h2 className="text-xl font-black text-gray-800 mb-2">
            Login Required
          </h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            আপনার wishlist দেখতে বা product save করতে প্রথমে login করুন।
          </p>
          <button
            onClick={openModal}
            className="w-full bg-[#1a1a2e] hover:bg-[#111122] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Heart size={16} className="fill-white" />
            Login to View Wishlist
          </button>
          <Link
            href="/products"
            className="mt-3 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Continue browsing →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-red-500 fill-red-500" />
              <h1 className="text-lg font-black text-gray-800 uppercase tracking-wide">
                My Wishlist
              </h1>
              {items.length > 0 && (
                <span className="bg-[#1a1a2e] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={clearing}
              className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {clearing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {clearing ? "Clearing..." : "Clear All"}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <PackageOpen size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-black text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Save items you love here. We'll keep them safe while you shop!
            </p>
            <Link
              href="/products"
              className="bg-[#1a1a2e] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#111122] transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {items.map((item) => {
                const originalPrice = item.originalPrice ?? item.price;
                const stock = item.stock ?? 0;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                      <button
                        onClick={() => handleRemove(item)}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                      >
                        <Heart size={14} className="fill-red-500 text-red-500" />
                      </button>
                      {originalPrice > item.price && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg">
                          -{Math.round(((originalPrice - item.price) / originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    <div className="p-3">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-xs font-bold text-gray-800 line-clamp-2 hover:text-[#1a1a2e] transition-colors mb-1.5">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="text-sm font-black text-[#1a1a2e]">
                          ৳{item.price.toLocaleString()}
                        </span>
                        {originalPrice > item.price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ৳{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {stock > 0 && stock <= 5 && (
                        <p className="text-[10px] text-orange-500 font-bold mb-1.5">
                          Only {stock} left!
                        </p>
                      )}
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={stock === 0}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#1a1a2e] hover:bg-[#111122] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[11px] font-bold py-2 rounded-xl transition-colors"
                      >
                        <ShoppingCart size={13} />
                        {stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] border border-[#1a1a2e] px-6 py-2.5 rounded-xl hover:bg-[#1a1a2e] hover:text-white transition-all"
              >
                <ArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}