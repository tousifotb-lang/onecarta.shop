"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
}

const FALLBACK_COLORS = [
  "bg-blue-50 hover:bg-blue-100",
  "bg-pink-50 hover:bg-pink-100",
  "bg-yellow-50 hover:bg-yellow-100",
  "bg-green-50 hover:bg-green-100",
  "bg-orange-50 hover:bg-orange-100",
  "bg-rose-50 hover:bg-rose-100",
  "bg-purple-50 hover:bg-purple-100",
  "bg-indigo-50 hover:bg-indigo-100",
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold text-gray-800">Shop by Category</h2>
        <Link href="/products" className="text-sm text-[#2c2769] font-semibold hover:underline">
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="min-w-[85px] h-[90px] bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? null : (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-8 md:overflow-x-visible scrollbar-hide snap-x snap-mandatory">
          {categories.map((cat, idx) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className={`${FALLBACK_COLORS[idx % FALLBACK_COLORS.length]} rounded-2xl p-3 flex flex-col items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 group min-w-[85px] md:min-w-0 snap-center flex-shrink-0`}
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-lg group-hover:scale-110 transition-transform"
                />
              ) : (
                <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">
                  {cat.icon || "🛍️"}
                </span>
              )}
              <span className="text-[11px] md:text-xs font-bold text-gray-700 text-center leading-tight whitespace-nowrap md:whitespace-normal">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}