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
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
              <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
              <div className="w-12 h-2.5 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? null : (
        <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-8 md:overflow-x-visible scrollbar-hide snap-x snap-mandatory">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-2 group min-w-[72px] md:min-w-0 snap-center flex-shrink-0"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:shadow-md">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl md:text-3xl">
                    {cat.icon || "🛍️"}
                  </span>
                )}
              </div>
              <span className="text-[11px] md:text-xs font-semibold text-gray-700 text-center leading-tight whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}