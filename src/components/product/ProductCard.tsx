"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import WishlistButton from "@/components/WishlistButton";

interface Props {
  product: Product;
  listView?: boolean;
}

function getImageUrl(image: string | { url: string } | undefined): string {
  if (!image) return "https://placehold.co/400x400/2c2769/white?text=No+Image";
  if (typeof image === "string") return image;
  if (image?.url) return image.url;
  return "https://placehold.co/400x400/2c2769/white?text=No+Image";
}

export default function ProductCard({ product, listView = false }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const productName = product.name || product.title || "Unknown Product";
  const productImage = getImageUrl(product.images?.[0]);

  const displayPrice = product.isFlashSale && product.flashSalePrice
    ? product.flashSalePrice
    : product.price;

  const discountPercent = product.originalPrice > displayPrice
    ? Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100)
    : 0;

  const wishlistProduct = {
    _id: product._id,
    name: productName,
    slug: product.slug,
    image: productImage,
    price: displayPrice,
    originalPrice: product.originalPrice,
    category: product.category,
    brand: product.brand,
    stock: product.stock,
  };

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      name: productName,
      slug: product.slug,
      image: productImage,
      price: displayPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // ==================== LIST VIEW ====================
  if (listView) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl flex flex-row gap-3 p-2.5 shadow-sm hover:shadow-md transition-all group relative">

        {/* Image */}
        <div className="relative flex-shrink-0 w-28 h-28 bg-gray-50/70 rounded-lg overflow-hidden">
          {discountPercent > 0 && (
            <span className="absolute top-1 left-1 z-10 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          <Link href={`/products/${product.slug}`} className="w-full h-full block p-1">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
              sizes="112px"
            />
          </Link>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-between py-0.5">
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              {product.category}
            </span>
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-xs font-bold text-gray-800 hover:text-[#2c2769] transition-colors mt-0.5 line-clamp-2 leading-tight">
                {productName}
              </h3>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-[#2c2769]">
              {formatPrice(displayPrice)}
            </span>
            {displayPrice < product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
            <div>
              {product.stock === 0 ? (
                <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Stock Out</span>
              ) : product.stock < 10 ? (
                <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Only {product.stock} left</span>
              ) : null}
            </div>

            <div className="flex items-center gap-1.5">
              <WishlistButton
                product={wishlistProduct}
                className="w-7 h-7 bg-gray-50 hover:bg-red-50 border border-gray-100 rounded-lg flex items-center justify-center"
                size={13}
              />

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex items-center gap-1 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                  added ? "bg-green-500" : "bg-[#2c2769] hover:bg-[#1f1b4d]"
                }`}
              >
                {added ? <Check size={12} /> : <ShoppingCart size={12} />}
                <span>{added ? "Added" : "Cart"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== GRID VIEW ====================
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group relative">

      {/* Image */}
      <div className="relative w-full aspect-square bg-gray-50/60 rounded-lg overflow-hidden mb-2">
        {discountPercent > 0 && (
          <span className="absolute top-1.5 left-1.5 z-10 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {product.isFlashSale && (
          <span className="absolute top-1.5 right-1.5 z-10 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
            ⚡ SALE
          </span>
        )}

        <WishlistButton
          product={wishlistProduct}
          className="absolute bottom-1.5 right-1.5 z-10 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm md:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50"
          size={13}
        />

        <Link href={`/products/${product.slug}`} className="w-full h-full block relative p-1.5">
          <Image
            src={productImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
          {product.category}
        </span>

        <Link href={`/products/${product.slug}`} className="block mb-2">
          <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#2c2769] transition-colors line-clamp-2 leading-tight">
            {productName}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-1 mb-2">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-sm md:text-base font-black text-[#2c2769]">
              {formatPrice(displayPrice)}
            </span>
            {displayPrice < product.originalPrice && (
              <span className="text-[10px] font-semibold text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex-shrink-0">
            {product.stock === 0 ? (
              <span className="text-[8px] font-extrabold text-gray-500 bg-gray-100 px-1 py-0.5 rounded">Out</span>
            ) : product.stock < 10 ? (
              <span className="text-[8px] font-extrabold text-red-500 bg-red-50 px-1 py-0.5 rounded">Only {product.stock}</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={`w-full flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-sm ${
          added ? "bg-green-500" : "bg-[#2c2769] hover:bg-[#1f1b4d]"
        }`}
      >
        {added ? (
          <><Check size={13} /> Added!</>
        ) : (
          <><ShoppingCart size={13} /> Add to Cart</>
        )}
      </button>
    </div>
  );
}