"use client";

import { useEffect, useState, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const stopDragging = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold text-gray-800">Shop by Category</h2>
        <Link href="/categories" className="text-sm text-[#2c2769] font-semibold hover:underline">
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[88px]">
              <div className="w-20 h-20 rounded-full bg-gray-100 animate-pulse" />
              <div className="w-14 h-2.5 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? null : (
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onMouseMove={handleMouseMove}
          className="flex items-start gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-hide cursor-grab select-none"
        >
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              draggable={false}
              className="flex flex-col items-center gap-2 group flex-shrink-0 w-20 sm:w-24"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:shadow-md pointer-events-none">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl">{cat.icon || "🛍️"}</span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight w-full truncate">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}