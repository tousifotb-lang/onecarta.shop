"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Heart, Share2, Star,
  ChevronRight, Minus, Plus, Check, ArrowRight, ZoomIn
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import ProductCard from "@/components/product/ProductCard";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthModalStore } from "@/store/authModalStore";
import { addRecentlyViewed } from "@/lib/recentlyViewed";

interface ReviewItem {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function getImageUrl(img: unknown): string {
  if (typeof img === "string") return img;
  if (img && typeof img === "object" && "url" in img) {
    return (img as { url: string }).url;
  }
  return "";
}

// ─── Premium Add to Cart Button ────────────────────────────────────────────────
type CartBtnState = "idle" | "pressing" | "adding" | "added";

function AddToCartButton({
  onAdd,
  disabled,
  quantity,
  productId,
}: {
  onAdd: () => void;
  disabled: boolean;
  quantity: number;
  productId: string;
}) {
  const cartItems = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);

  const cartCount = cartItems
    .filter((item) => item._id === productId)
    .reduce((sum, item) => sum + item.quantity, 0);

  const [state, setState] = useState<CartBtnState>("idle");
  const [badgePop, setBadgePop] = useState(false);
  const [iconWiggle, setIconWiggle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (cartCount === 0) setState("idle");
  }, [cartCount]);

  const handleClick = () => {
    if (state === "added") {
      openCart();
      return;
    }

    if (disabled || state !== "idle") return;

    setState("pressing");

    timerRef.current = setTimeout(() => {
      setState("adding");
      setIconWiggle(true);
      setTimeout(() => setIconWiggle(false), 500);

      onAdd();
      setBadgePop(true);
      setTimeout(() => setBadgePop(false), 400);

      setTimeout(() => setState("added"), 150);

      setTimeout(() => {
        setState((prev) => (prev === "added" ? "idle" : prev));
      }, 2600);
    }, 120);
  };

  const isAdded = state === "added";
  const isPressing = state === "pressing";

  return (
    <button
      onClick={handleClick}
      disabled={disabled && state !== "added"}
      style={{
        transition: isAdded
          ? "all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: isPressing ? "scale(0.95)" : "scale(1)",
        background: isAdded
          ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
          : "linear-gradient(135deg, #2c2769 0%, #39378c 100%)",
        boxShadow: isAdded
          ? "0 4px 20px rgba(22,163,74,0.35)"
          : isPressing
          ? "0 1px 4px rgba(44,39,105,0.2)"
          : "0 4px 14px rgba(44,39,105,0.25)",
        minWidth: isAdded ? "160px" : "auto",
      }}
      className="relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPressing && (
        <span
          className="absolute inset-0 rounded-xl"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            animation: "ripple 0.3s ease-out forwards",
          }}
        />
      )}

      <span
        style={{
          display: "inline-flex",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: iconWiggle ? "rotate(-15deg) scale(1.2)" : "rotate(0deg) scale(1)",
        }}
      >
        {isAdded ? (
          <Check
            size={18}
            style={{ animation: "checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
          />
        ) : (
          <ShoppingCart size={18} />
        )}
      </span>

      <span className="relative overflow-hidden h-5 flex items-center">
        <span
          style={{
            display: "block",
            transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease",
            transform: isAdded ? "translateY(-110%)" : "translateY(0%)",
            opacity: isAdded ? 0 : 1,
            position: isAdded ? "absolute" : "relative",
            whiteSpace: "nowrap",
          }}
        >
          Add to Cart
        </span>
        <span
          style={{
            display: "block",
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
            transform: isAdded ? "translateY(0%)" : "translateY(110%)",
            opacity: isAdded ? 1 : 0,
            position: isAdded ? "relative" : "absolute",
            whiteSpace: "nowrap",
          }}
        >
          View Cart
        </span>
      </span>

      {cartCount > 0 && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "20px",
            height: "20px",
            padding: "0 5px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.25)",
            fontSize: "11px",
            fontWeight: 800,
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: badgePop ? "scale(1.5)" : "scale(1)",
          }}
        >
          {cartCount}
        </span>
      )}

      {isAdded && (
        <ArrowRight
          size={15}
          style={{
            animation: "slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards",
            opacity: 0,
          }}
        />
      )}

      <style>{`
        @keyframes ripple {
          0%   { opacity: 1; transform: scale(0.8); }
          100% { opacity: 0; transform: scale(1.2); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.3) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slideIn {
          0%   { opacity: 0; transform: translateX(-6px); }
          100% { opacity: 1; transform: translateX(0px); }
        }
      `}</style>
    </button>
  );
}
// ───────────────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { status } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist, getWishlistItems } = useWishlistStore();
  const { openModal } = useAuthModalStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "reviews">("specs");
  const [mounted, setMounted] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  // ── Zoom on hover (main image) ──────────────────────────────────────────
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  // ── Reviews state ─────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewBreakdown, setReviewBreakdown] = useState<Record<number, number>>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [myReview, setMyReview] = useState<ReviewItem | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [reviewFormRating, setReviewFormRating] = useState(0);
  const [reviewFormHoverRating, setReviewFormHoverRating] = useState(0);
  const [reviewFormComment, setReviewFormComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState("");
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  const isLoggedIn = mounted && status === "authenticated";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetchProduct();
  }, [slug]);

  // Thumbnail switch করলে জুম স্টেট রিসেট — না হলে নতুন ছবিতে পুরনো zoom position/state আটকে থাকতে পারে
  useEffect(() => {
    setIsZooming(false);
  }, [selectedImage]);

  const fetchReviews = async (productId: string) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setReviewBreakdown(data.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        setMyReview(data.myReview || null);
        if (data.myReview) {
          setReviewFormRating(data.myReview.rating);
          setReviewFormComment(data.myReview.comment || "");
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      setProduct(data.product);
      setSelectedImage(0);

      if (data.product) {
        // Prefer categoryId (this also picks up matching subcategories via
        // the API's descendant-category expansion) — fall back to the
        // legacy plain category-name field for older products that predate
        // categoryId.
        const catQuery = data.product.categoryId
          ? `categoryId=${data.product.categoryId}`
          : `category=${encodeURIComponent(data.product.category)}`;

        const relRes = await fetch(`/api/products?${catQuery}&limit=8`);
        const relData = await relRes.json();
        let relatedProducts: Product[] = (relData.products || []).filter(
          (p: Product) => p.slug !== slug
        );

        // No other products in the same category — fall back to
        // best-selling so this section is never a dead end.
        if (relatedProducts.length === 0) {
          const fallbackRes = await fetch(`/api/products?tag=best-selling&limit=8`);
          const fallbackData = await fallbackRes.json();
          relatedProducts = (fallbackData.products || []).filter(
            (p: Product) => p.slug !== slug
          );
        }

        // Prioritize products the shopper has already wishlisted — these
        // are things they've explicitly shown interest in, so surface them
        // first within the related list rather than mixing in randomly.
        const wishlistIds = new Set(getWishlistItems().map((w) => w._id));
        relatedProducts.sort((a, b) => {
          const aWishlisted = wishlistIds.has(a._id) ? 1 : 0;
          const bWishlisted = wishlistIds.has(b._id) ? 1 : 0;
          return bWishlisted - aWishlisted;
        });

        setRelated(relatedProducts);

        // Record this product as "recently viewed" (localStorage) for the
        // shared RecentlyViewedSection to pick up on the homepage too.
        const productName = data.product.name || data.product.title || "Unknown Product";
        const displayPriceForHistory =
          data.product.isFlashSale && data.product.flashSalePrice
            ? data.product.flashSalePrice
            : data.product.price;

        addRecentlyViewed({
          _id: data.product._id,
          slug: data.product.slug,
          name: productName,
          image: getImageUrl(data.product.images?.[0]),
          price: displayPriceForHistory,
          category: data.product.category,
        });

        fetchReviews(data.product._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      openModal();
      return;
    }
    if (!product) return;
    if (reviewFormRating < 1) {
      setReviewSubmitError("Please select a star rating.");
      return;
    }

    setSubmittingReview(true);
    setReviewSubmitError("");
    setReviewSubmitSuccess(false);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          rating: reviewFormRating,
          comment: reviewFormComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      // Reflect the recalculated rating/count everywhere on this page immediately
      // (header StarRating, tab label, specs table) without needing a full reload.
      setProduct((prev) => (prev ? { ...prev, rating: data.rating, reviewCount: data.reviewCount } : prev));
      await fetchReviews(product._id);
      setReviewSubmitSuccess(true);
      setTimeout(() => setReviewSubmitSuccess(false), 2500);
    } catch (err: any) {
      setReviewSubmitError(err.message || "Something went wrong");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-gray-200 rounded-2xl h-96" />
          <div className="space-y-4">
            <div className="bg-gray-200 h-6 rounded w-3/4" />
            <div className="bg-gray-200 h-4 rounded w-1/2" />
            <div className="bg-gray-200 h-10 rounded w-1/3" />
            <div className="bg-gray-200 h-12 rounded" />
            <div className="bg-gray-200 h-12 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
        <button onClick={() => router.push("/products")} className="mt-4 btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  const productName = product.name || product.title || "Unknown Product";

  const displayPrice = product.isFlashSale && product.flashSalePrice
    ? product.flashSalePrice
    : product.price;

  const discountPercent = Math.round(
    ((product.originalPrice - displayPrice) / product.originalPrice) * 100
  );

  const isWishlisted = mounted ? isInWishlist(product._id) : false;

  const images: string[] = product.images.length > 0
    ? product.images.map((img) => getImageUrl(img)).filter((url) => url !== "")
    : [`https://placehold.co/400x400/39378c/white?text=${encodeURIComponent(productName)}`];

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      _id: product._id,
      name: productName,
      slug: product.slug,
      image: getImageUrl(product.images[0]) || "",
      price: displayPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand || "",
      stock: product.stock,
    }, quantity);
  };

  const handleBuyNow = () => {
    if (!product || buyingNow) return;
    setBuyingNow(true);
    addItem({
      _id: product._id,
      name: productName,
      slug: product.slug,
      image: getImageUrl(product.images[0]) || "",
      price: displayPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand || "",
      stock: product.stock,
    }, quantity);
    setTimeout(() => router.push("/checkout"), 800);
  };

  const handleWishlist = () => {
    if (!isLoggedIn) { openModal(); return; }
    if (!product) return;
    toggleWishlist({
      _id: product._id,
      name: productName,
      slug: product.slug,
      image: getImageUrl(product.images[0]) || "",
      price: displayPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand || "",
      stock: product.stock,
    });
  };

  return (
    <div className="container-main py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#2c2769]">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-[#2c2769]">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${product.category}`} className="hover:text-[#2c2769] capitalize">
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium line-clamp-1">{productName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div className="space-y-3">
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleImageMouseMove}
            className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden h-96 cursor-zoom-in"
          >
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discountPercent}% OFF
                </span>
              )}
              {product.isFlashSale && (
                <span className="absolute top-4 right-4 z-10 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  ⚡ Flash Sale
                </span>
              )}
              {!isZooming && (
                <span className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
                  <ZoomIn size={13} /> Hover to zoom
                </span>
              )}
              <Image
                src={images[selectedImage]}
                alt={productName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
                style={{
                  transform: isZooming ? "scale(2.2)" : "scale(1)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transition: isZooming ? "none" : "transform 0.25s ease-out",
                }}
              />
            </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-18 h-18 rounded-xl border-2 overflow-hidden transition-all ${
                    selectedImage === i
                      ? "border-[#2c2769] shadow-md"
                      : "border-gray-200 hover:border-[#39378c]"
                  }`}
                >
                  <div className="relative w-16 h-16">
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-contain p-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#eeedf5] text-[#2c2769] text-xs font-semibold px-3 py-1 rounded-full capitalize">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-sm text-gray-500">by <span className="font-semibold text-gray-700">{product.brand}</span></span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">{productName}</h1>

          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} count={product.reviewCount} size={16} />
            <span className="text-sm text-gray-500">{product.sold} sold</span>
            {product.stock > 0 ? (
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#2c2769]">{formatPrice(displayPrice)}</span>
              {displayPrice < product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {discountPercent > 0 && (
                <span className="text-sm font-bold text-green-600">
                  Save {formatPrice(product.originalPrice - displayPrice)}
                </span>
              )}
            </div>
            {product.isFlashSale && product.flashSaleEnds && (
              <p className="text-xs text-orange-600 font-medium">⚡ Flash Sale price — limited time offer!</p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600"
              >
                <Minus size={16} />
              </button>
              <span className="px-5 py-2 text-sm font-bold border-x border-gray-200 min-w-[50px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-xs text-gray-400">{product.stock} available</span>
          </div>

          {/* Action Buttons */}
            <div className="flex gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <AddToCartButton
                  onAdd={handleAddToCart}
                  disabled={product.stock === 0}
                  quantity={quantity}
                  productId={product._id}
                />

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || buyingNow}
                  className={`relative overflow-hidden py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:cursor-not-allowed
                    ${buyingNow
                      ? "bg-orange-400 scale-95 shadow-lg shadow-orange-200"
                      : "bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] hover:shadow-md hover:shadow-orange-200 active:scale-95"
                    } text-white`}
                >
                  {buyingNow && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_0.8s_ease-in-out]" />
                  )}
                  <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${buyingNow ? "scale-90 opacity-80" : ""}`}>
                    {buyingNow ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Just a Moment...
                      </>
                    ) : (
                      <>⚡ Buy Now</>
                    )}
                  </span>
                </button>
              </div>

              <button
                onClick={handleWishlist}
                className={`p-3 border rounded-xl transition-all duration-200 ${
                  isWishlisted
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:bg-red-50 hover:border-red-200"
                }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart
                  size={20}
                  className={`transition-all duration-200 ${
                    isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </button>

              <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Share2 size={20} className="text-gray-400" />
              </button>
            </div>

        </div>
      </div>

      {/* Tabs — order: Specifications, Description, Reviews */}
      <div className="bg-white rounded-2xl shadow-sm mb-12">
        <div className="flex border-b border-gray-100">
          {(["specs", "description", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "text-[#2c2769] border-b-2 border-[#2c2769]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "reviews"
                ? `Reviews (${product.reviewCount || 0})`
                : tab === "specs"
                ? "Specifications"
                : "Description"}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Brand", product.brand || "N/A"],
                ["Category", product.category],
                ["Stock", `${product.stock} units`],
                ["Total Sold", `${product.sold} units`],
                ["Rating", `${product.rating || 0}/5`],
                ["Reviews", `${product.reviewCount || 0} reviews`],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-semibold text-gray-800 capitalize">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "description" && (
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              {product.description ? (
                <div
                  className="prose prose-sm max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p>No description available.</p>
              )}
              <p>Brand: <span className="font-semibold text-gray-800">{product.brand || "N/A"}</span></p>
              <p>Category: <span className="font-semibold text-gray-800 capitalize">{product.category}</span></p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Rating summary + real per-star breakdown */}
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-[#2c2769]">{product.rating || 0}</p>
                  <StarRating rating={product.rating || 0} size={14} />
                  <p className="text-xs text-gray-500 mt-1">{product.reviewCount || 0} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewBreakdown[star] || 0;
                    const total = product.reviewCount || 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-3">{star}</span>
                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-yellow-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400 w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write / Update a Review */}
              <div className="border border-gray-100 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-800 mb-3">
                  {myReview ? "Update Your Review" : "Write a Review"}
                </h4>

                {!isLoggedIn ? (
                  <button
                    type="button"
                    onClick={openModal}
                    className="text-sm font-semibold text-[#2c2769] hover:underline cursor-pointer"
                  >
                    Sign in to write a review
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setReviewFormHoverRating(star)}
                          onMouseLeave={() => setReviewFormHoverRating(0)}
                          onClick={() => setReviewFormRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            size={22}
                            className={`transition-colors ${
                              (reviewFormHoverRating || reviewFormRating) >= star
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={reviewFormComment}
                      onChange={(e) => setReviewFormComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c2769] resize-none"
                    />

                    {reviewSubmitError && (
                      <p className="text-xs font-semibold text-red-500">{reviewSubmitError}</p>
                    )}
                    {reviewSubmitSuccess && (
                      <p className="text-xs font-semibold text-green-600">Thanks! Your review has been posted.</p>
                    )}

                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      className="bg-[#2c2769] hover:bg-[#1f1b4d] text-white text-sm font-bold px-5 py-2.5 rounded-xl disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {submittingReview ? "Submitting..." : myReview ? "Update Review" : "Submit Review"}
                    </button>
                  </div>
                )}
              </div>

              {/* Real review list */}
              {reviewsLoading ? (
                <p className="text-sm text-gray-400 text-center py-6">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600">No reviews yet</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#2c2769] text-white rounded-full flex items-center justify-center text-sm font-bold uppercase">
                            {review.userName?.[0] || "U"}
                          </div>
                          <span className="font-semibold text-sm text-gray-800">{review.userName}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size={12} />
                      {review.comment && <p className="text-sm text-gray-600 mt-2">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products — directly below the Specifications/Tabs card.
          Wishlisted items are sorted to the front (see fetchProduct). */}
      {related.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {related.slice(0, 5).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed — shared component, also used on the homepage */}
      <RecentlyViewedSection excludeSlug={String(slug)} />
    </div>
  );
}