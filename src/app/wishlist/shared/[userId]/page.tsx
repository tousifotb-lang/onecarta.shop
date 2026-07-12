"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Heart, ShoppingCart, ArrowLeft, PackageOpen, AlertCircle, Loader2
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface SharedProduct {
  _id: string;
  name?: string;
  title?: string;
  slug: string;
  images: string[];
  price: number;
  originalPrice: number;
  category?: string;
  brand?: string;
  stock: number;
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

export default function SharedWishlistPage() {
  const { userId } = useParams();
  const { addItem } = useCartStore();

  const [ownerName, setOwnerName] = useState("");
  const [items, setItems] = useState<SharedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/wishlist/${userId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load wishlist");
        setOwnerName(data.ownerName || "A Onecarta Shopper");
        setItems(data.items || []);
      })
      .catch((err) => setError(err.message || "This wishlist link is invalid or no longer available."))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleAddToCart = (item: SharedProduct) => {
    const displayPrice = item.isFlashSale && item.flashSalePrice ? item.flashSalePrice : item.price;
    addItem({
      _id: item._id,
      name: item.name || item.title || "Product",
      slug: item.slug,
      image: item.images?.[0] || "",
      price: displayPrice,
      originalPrice: item.originalPrice,
      category: item.category || "",
      brand: item.brand || "",
      stock: item.stock,
    });
    setAddedId(item._id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-lg font-black text-gray-800 mb-2">Wishlist Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <Link href="/products" className="bg-[#1a1a2e] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#111122] transition-colors">
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-red-500 fill-red-500" />
            <h1 className="text-lg font-black text-gray-800">
              {ownerName}'s Wishlist
            </h1>
            {items.length > 0 && (
              <span className="bg-[#1a1a2e] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <PackageOpen size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-black text-gray-700 mb-2">This wishlist is empty</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              {ownerName} hasn't saved anything here yet.
            </p>
            <Link href="/products" className="bg-[#1a1a2e] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#111122] transition-colors">
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold p-3 rounded-xl mb-5">
              You're viewing a shared wishlist. Add items to your own cart to gift them!
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {items.map((item) => {
                const displayName = item.name || item.title || "Product";
                const displayPrice = item.isFlashSale && item.flashSalePrice ? item.flashSalePrice : item.price;
                const originalPrice = item.originalPrice ?? displayPrice;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                      {originalPrice > displayPrice && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg">
                          -{Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    <div className="p-3">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-xs font-bold text-gray-800 line-clamp-2 hover:text-[#1a1a2e] transition-colors mb-1.5">
                          {displayName}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="text-sm font-black text-[#1a1a2e]">
                          ৳{displayPrice.toLocaleString()}
                        </span>
                        {originalPrice > displayPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ৳{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {item.stock > 0 && item.stock <= 5 && (
                        <p className="text-[10px] text-orange-500 font-bold mb-1.5">
                          Only {item.stock} left!
                        </p>
                      )}
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock === 0}
                        className={`w-full flex items-center justify-center gap-1.5 text-white text-[11px] font-bold py-2 rounded-xl transition-colors ${
                          addedId === item._id
                            ? "bg-green-500"
                            : "bg-[#1a1a2e] hover:bg-[#111122] disabled:bg-gray-300 disabled:cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart size={13} />
                        {item.stock === 0 ? "Out of Stock" : addedId === item._id ? "Added!" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}