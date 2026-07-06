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

export default function AllCategoriesPage() {
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
    <div className="container-main py-8">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">All Categories</h1>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-gray-100 animate-pulse" />
              <div className="w-14 h-2.5 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-gray-500 text-sm">No categories found.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:shadow-md">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">{cat.icon || "🛍️"}</span>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}