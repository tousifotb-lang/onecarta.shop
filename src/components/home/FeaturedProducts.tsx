"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { Star } from "lucide-react";

interface Props {
  title: string;
  icon: string;
  tag: string;
  viewAllHref: string;
}

export default function ProductSection({ title, icon, tag, viewAllHref }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?tag=${tag}&limit=5`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, [tag]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-extrabold text-gray-800">{title}</h2>
          <div className="w-1 h-6 bg-[#2c2769] rounded-full ml-1" />
        </div>
        <Link
          href={viewAllHref}
          className="text-sm text-[#2c2769] font-semibold hover:underline flex items-center gap-1"
        >
          View All →
        </Link>
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-3 animate-pulse">
              <div className="bg-gray-200 h-40 rounded-lg mb-3" />
              <div className="bg-gray-200 h-3 rounded mb-2" />
              <div className="bg-gray-200 h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}