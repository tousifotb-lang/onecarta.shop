"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { getRecentlyViewed, RecentlyViewedItem } from "@/lib/recentlyViewed";

interface Props {
  excludeSlug?: string;
  title?: string;
}

export default function RecentlyViewedSection({ excludeSlug, title = "Recently Viewed" }: Props) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    const all = getRecentlyViewed();
    setItems(excludeSlug ? all.filter((p) => p.slug !== excludeSlug) : all);
  }, [excludeSlug]);

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold text-gray-800">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.slug}
            href={`/products/${item.slug}`}
            className="bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 block"
          >
            <div className="relative w-full aspect-square bg-gray-50/60 rounded-lg overflow-hidden mb-2">
              <Image
                src={item.image || `https://placehold.co/300x300/2c2769/white?text=${encodeURIComponent(item.name[0] || "P")}`}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-contain p-2"
              />
            </div>
            <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight mb-1">{item.name}</p>
            <p className="text-sm font-black text-[#2c2769]">{formatPrice(item.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}