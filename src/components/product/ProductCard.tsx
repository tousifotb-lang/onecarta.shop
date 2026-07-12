"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check, Minus, Plus, Share2 } from "lucide-react";
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
  const [qty, setQty] = useState(1);
  const [shareCopied, setShareCopied] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const productName = product.name || product.title || "Unknown Product";
  const productImage = getImageUrl(product.images?.[0]);

  const displayPrice = product.isFlashSale && product.flashSalePrice
    ? product.flashSalePrice
    : product.price;

  const discountPercent = product.originalPrice > displayPrice
    ? Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100)
    : 0;

  // এই product-এর কতটুকু ইতিমধ্যে cart-এ আছে, সেটা বের করে বাকি available stock
  // হিসাব করা হচ্ছে — আগে এটা check না হওয়ায় বারবার "Add to Cart" ক্লিক করলে
  // stock-এর চেয়ে বেশি quantity cart-এ ঢুকে যেত ("stock did not countable" bug fix).
  const qtyAlreadyInCart = cartItems
    .filter((item) => item._id === product._id)
    .reduce((sum, item) => sum + item.quantity, 0);
  const remainingStock = Math.max(0, product.stock - qtyAlreadyInCart);
  const isMaxedOut = product.stock > 0 && remainingStock === 0;

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

  const handleQtyChange = (delta: number) => {
    setQty((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > remainingStock) return remainingStock || 1;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (product.stock === 0 || isMaxedOut) return;
    const qtyToAdd = Math.min(qty, remainingStock);
    if (qtyToAdd <= 0) return;

    addItem(
      {
        _id: product._id,
        name: productName,
        slug: product.slug,
        image: productImage,
        price: displayPrice,
        originalPrice: product.originalPrice,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
      },
      qtyToAdd
    );
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/products/${product.slug}`;
    const shareData = { title: productName, text: `Check out ${productName} on Onecarta!`, url: shareUrl };

    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
        return;
      } catch {
        // user cancelled native share sheet — clipboard fallback e move kora
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch (err) {
      console.error("Failed to copy product link:", err);
    }
  };

  // Grid ar list — dutai jaygay same compact quantity stepper use hocche
  const QuantityStepper = () => (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); handleQtyChange(-1); }}
        disabled={qty <= 1}
        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus size={10} />
      </button>
      <span className="w-6 text-center text-[11px] font-bold text-gray-700">{qty}</span>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); handleQtyChange(1); }}
        disabled={qty >= remainingStock}
        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus size={10} />
      </button>
    </div>
  );

  // ==================== LIST VIEW ====================
  if (listView) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl flex flex-row gap-3 p-2.5 shadow-sm hover:shadow-md transition-all group relative h-full">

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
        <div className="flex flex-col flex-1 justify-between py-0.5 min-w-0">
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              {product.category}
            </span>
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-xs font-bold text-gray-800 hover:text-[#2c2769] transition-colors mt-0.5 line-clamp-2 leading-tight min-h-[2.2em]">
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

          <div className="flex items-center justify-between mt-1 gap-1.5 flex-wrap">
            <div className="min-w-0">
              {product.stock === 0 ? (
                <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Stock Out</span>
              ) : isMaxedOut ? (
                <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">Max in cart</span>
              ) : product.stock < 10 ? (
                <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Only {product.stock} left</span>
              ) : null}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleShare}
                title="Share this product"
                className="w-7 h-7 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg flex items-center justify-center text-gray-500"
              >
                {shareCopied ? <Check size={13} className="text-green-500" /> : <Share2 size={13} />}
              </button>

              <WishlistButton
                product={wishlistProduct}
                className="w-7 h-7 bg-gray-50 hover:bg-red-50 border border-gray-100 rounded-lg flex items-center justify-center"
                size={13}
              />

              {!isMaxedOut && product.stock > 0 && <QuantityStepper />}

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isMaxedOut}
                className={`flex items-center gap-1 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                  added ? "bg-green-500" : "bg-[#2c2769] hover:bg-[#1f1b4d]"
                }`}
              >
                {added ? <Check size={12} /> : <ShoppingCart size={12} />}
                <span>{added ? "Added" : isMaxedOut ? "Max" : "Cart"}</span>
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

        <div className="absolute bottom-1.5 right-1.5 z-10 flex flex-col gap-1.5 md:opacity-0 group-hover:opacity-100 transition-all duration-200">
          <WishlistButton
            product={wishlistProduct}
            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50"
            size={13}
          />
          <button
            onClick={handleShare}
            title="Share this product"
            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 text-gray-600"
          >
            {shareCopied ? <Check size={13} className="text-green-500" /> : <Share2 size={13} />}
          </button>
        </div>

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
          <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#2c2769] transition-colors line-clamp-2 leading-tight min-h-[2.2em]">
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
            ) : isMaxedOut ? (
              <span className="text-[8px] font-extrabold text-orange-500 bg-orange-50 px-1 py-0.5 rounded">Max</span>
            ) : product.stock < 10 ? (
              <span className="text-[8px] font-extrabold text-red-500 bg-red-50 px-1 py-0.5 rounded">Only {product.stock}</span>
            ) : null}
          </div>
        </div>

        {!isMaxedOut && product.stock > 0 && (
          <div className="flex items-center justify-center mb-2">
            <QuantityStepper />
          </div>
        )}
      </div>

      {/* Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isMaxedOut}
        className={`w-full flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-sm ${
          added ? "bg-green-500" : "bg-[#2c2769] hover:bg-[#1f1b4d]"
        }`}
      >
        {added ? (
          <><Check size={13} /> Added!</>
        ) : isMaxedOut ? (
          <>Max Quantity in Cart</>
        ) : product.stock === 0 ? (
          <>Out of Stock</>
        ) : (
          <><ShoppingCart size={13} /> Add to Cart</>
        )}
      </button>
    </div>
  );
}