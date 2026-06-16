"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Heart, Share2, Star, Truck, Shield,
  RotateCcw, ChevronRight, Minus, Plus, Check
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  useEffect(() => {
    if (!slug) return;
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      setProduct(data.product);

      if (data.product?.category) {
        const relRes = await fetch(
          `/api/products?category=${data.product.category}&limit=5`
        );
        const relData = await relRes.json();
        setRelated(relData.products?.filter((p: Product) => p.slug !== slug) || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      price: product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand || "",
      stock: product.stock,
    }, quantity);

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
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

  const displayPrice = product.isFlashSale && product.flashSalePrice
    ? product.flashSalePrice
    : product.price;

  const discountPercent = Math.round(
    ((product.originalPrice - displayPrice) / product.originalPrice) * 100
  );

  const images = product.images.length > 1
    ? product.images
    : [
        product.images[0],
        `https://placehold.co/400x400/39378c/white?text=${encodeURIComponent(product.name)}`,
        `https://placehold.co/400x400/1a1a2e/white?text=${encodeURIComponent(product.brand || "Brand")}`,
        `https://placehold.co/400x400/2c2769/white?text=View+2`,
      ];

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
        <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-3">
          <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden h-96 flex items-center justify-center">
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
            <Image
              src={images[selectedImage]}
              alt={product.name}
              width={400}
              height={400}
              className="object-contain max-h-80 w-auto transition-all duration-300"
            />
          </div>

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
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#eeedf5] text-[#2c2769] text-xs font-semibold px-3 py-1 rounded-full capitalize">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-sm text-gray-500">by <span className="font-semibold text-gray-700">{product.brand}</span></span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
            {product.name}
          </h1>

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
              <span className="text-3xl font-extrabold text-[#2c2769]">
                {formatPrice(displayPrice)}
              </span>
              {displayPrice < product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-sm font-bold text-green-600">
                  Save {formatPrice(product.originalPrice - displayPrice)}
                </span>
              )}
            </div>
            {product.isFlashSale && product.flashSaleEnds && (
              <p className="text-xs text-orange-600 font-medium">
                ⚡ Flash Sale price — limited time offer!
              </p>
            )}
          </div>

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

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                addedToCart
                  ? "bg-green-500 text-white"
                  : "bg-[#2c2769] hover:bg-[#39378c] text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedToCart ? (
                <><Check size={18} /> Added to Cart!</>
              ) : (
                <><ShoppingCart size={18} /> Add to Cart</>
              )}
            </button>
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
              Buy Now
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors">
              <Heart size={20} className="text-gray-400 hover:text-red-500" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Share2 size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
            <div className="flex items-center gap-3 p-3">
              <div className="bg-[#eeedf5] p-2 rounded-lg">
                <Truck size={18} className="text-[#2c2769]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Free Delivery</p>
                <p className="text-xs text-gray-500">On orders above ৳999 — Dhaka: 1-2 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3">
              <div className="bg-[#eeedf5] p-2 rounded-lg">
                <RotateCcw size={18} className="text-[#2c2769]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">7-Day Return</p>
                <p className="text-xs text-gray-500">Easy return & exchange policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3">
              <div className="bg-[#eeedf5] p-2 rounded-lg">
                <Shield size={18} className="text-[#2c2769]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Authentic Product</p>
                <p className="text-xs text-gray-500">100% genuine, quality guaranteed</p>
              </div>
            </div>
          </div>
          
          {/* Tags section has been completely removed from here to maintain a premium UI look */}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm mb-12">
        <div className="flex border-b border-gray-100">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "text-[#2c2769] border-b-2 border-[#2c2769]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "reviews" ? `Reviews (${product.reviewCount})` : tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>{product.description || "No description available."}</p>
              <p>Brand: <span className="font-semibold text-gray-800">{product.brand || "N/A"}</span></p>
              <p>Category: <span className="font-semibold text-gray-800 capitalize">{product.category}</span></p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Brand", product.brand || "N/A"],
                ["Category", product.category],
                ["Stock", `${product.stock} units`],
                ["Total Sold", `${product.sold} units`],
                ["Rating", `${product.rating}/5`],
                ["Reviews", `${product.reviewCount} reviews`],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-semibold text-gray-800 capitalize">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-[#2c2769]">{product.rating}</p>
                  <StarRating rating={product.rating} size={14} />
                  <p className="text-xs text-gray-500 mt-1">{product.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-3">{star}</span>
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-yellow-400 h-1.5 rounded-full"
                          style={{ width: `${star === Math.round(product.rating) ? 70 : star > product.rating ? 10 : 40}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {[
                { name: "Rahim", rating: 5, comment: "Excellent product! Very satisfied with the quality.", date: "2 days ago" },
                { name: "Karim", rating: 4, comment: "Good product, fast delivery. Recommended!", date: "1 week ago" },
                { name: "Sumaiya", rating: 4, comment: "Nice quality. Worth the price.", date: "2 weeks ago" },
              ].map((review, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#2c2769] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {review.name[0]}
                      </div>
                      <span className="font-semibold text-sm text-gray-800">{review.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} size={12} />
                  <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {related.slice(0, 5).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}