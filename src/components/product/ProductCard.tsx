"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import { useCartStore } from "@/store/cartStore";

interface Props {
  product: Product;
  listView?: boolean;
}

export default function ProductCard({ product, listView = false }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const displayPrice = product.isFlashSale && product.flashSalePrice
    ? product.flashSalePrice
    : product.price;

  const discountPercent = Math.round(
    ((product.originalPrice - displayPrice) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      price: displayPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (listView) {
    return (
      <div className="card group flex flex-row gap-4 p-3">
        {/* Image — Left */}
        <div className="relative flex-shrink-0 w-36 h-36 bg-gray-50 rounded-xl overflow-hidden">
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
          {product.isFlashSale && (
            <span className="absolute top-2 right-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              ⚡ Sale
            </span>
          )}
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.images[0] || "https://placehold.co/400x400/2c2769/white?text=No+Image"}
              alt={product.name}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              sizes="144px"
            />
          </Link>
        </div>

        {/* Info — Right */}
        <div className="flex flex-col flex-1 justify-between py-1">
          <div>
            <span className="text-[11px] text-[#39378c] font-medium uppercase tracking-wide">
              {product.category}
            </span>
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-sm font-semibold text-gray-800 hover:text-[#2c2769] transition-colors mt-0.5 line-clamp-2">
                {product.name}
              </h3>
            </Link>
            {product.brand && (
              <p className="text-xs text-gray-400 mt-0.5">by {product.brand}</p>
            )}
          </div>

          <StarRating rating={product.rating} count={product.reviewCount} />

          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-extrabold text-[#2c2769]">
              {formatPrice(displayPrice)}
            </span>
            {displayPrice < product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {product.stock < 10 && product.stock > 0 && (
            <p className="text-[11px] text-red-500">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-[11px] text-red-600 font-semibold">Out of Stock</p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`mt-2 w-fit flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              added ? "bg-green-500" : "bg-[#2c2769] hover:bg-[#39378c]"
            }`}
          >
            {added ? (
              <><Check size={15} /> Added!</>
            ) : (
              <><ShoppingCart size={15} /> Add to Cart</>
            )}
          </button>
        </div>

        {/* Wishlist */}
        <button className="self-start p-1.5 hover:bg-red-50 rounded-full transition-colors">
          <Heart size={16} className="text-gray-300 hover:text-red-500 transition-colors" />
        </button>
      </div>
    );
  }

  // Grid View
  return (
    <div className="card group relative flex flex-col">
      {discountPercent > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
          -{discountPercent}%
        </span>
      )}
      {product.isFlashSale && (
        <span className="absolute top-2 right-10 z-10 bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
          ⚡ Sale
        </span>
      )}
      <button className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
        <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
      </button>

      <Link href={`/products/${product.slug}`}>
        <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-gray-50">
          <Image
            src={product.images[0] || "https://placehold.co/400x400/2c2769/white?text=No+Image"}
            alt={product.name}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <span className="text-[11px] text-[#39378c] font-medium uppercase tracking-wide mb-1">
          {product.category}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-[#2c2769] transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-base font-extrabold text-[#2c2769]">
            {formatPrice(displayPrice)}
          </span>
          {displayPrice < product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-[11px] text-red-500 mt-1">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-[11px] text-red-600 font-semibold mt-1">Out of Stock</p>
        )}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`mt-3 w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            added ? "bg-green-500" : "bg-[#2c2769] hover:bg-[#39378c]"
          }`}
        >
          {added ? (
            <><Check size={15} /> Added!</>
          ) : (
            <><ShoppingCart size={15} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}