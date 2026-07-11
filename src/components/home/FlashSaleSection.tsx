"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";

// admin endsAt set na korle, "আজকের রাত ১২:০০টা" পর্যন্ত fallback countdown —
// আগের behavior অক্ষুণ্ণ রাখা হলো যদি admin কিছু configure না করে থাকে।
function getRemainingSeconds(endsAt: string | null): number {
  const now = new Date();
  let target: Date;
  if (endsAt) {
    target = new Date(endsAt);
    if (isNaN(target.getTime())) {
      target = new Date(now);
      target.setHours(23, 59, 59, 999);
    }
  } else {
    target = new Date(now);
    target.setHours(23, 59, 59, 999);
  }
  return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
}

function Countdown({ endsAt }: { endsAt: string | null }) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => getRemainingSeconds(endsAt));

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(endsAt));
    const timer = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(endsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const h = Math.floor(remainingSeconds / 3600);
  const m = Math.floor((remainingSeconds % 3600) / 60);
  const s = remainingSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1 select-none">
      {[pad(h), pad(m), pad(s)].map((val, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white text-[#2c2769] font-extrabold text-sm px-2 py-1 rounded-lg min-w-[32px] text-center shadow-sm">
            {val}
          </span>
          {i < 2 && <span className="text-white font-bold">:</span>}
        </span>
      ))}
    </div>
  );
}

// Below this many products, show a static grid — the auto-scroll marquee
// only kicks in once there are enough items that looping actually reads
// as "endless" rather than obviously repeating too soon.
const AUTO_SCROLL_THRESHOLD = 6;

// How long the carousel pauses between each single-card step.
const STEP_INTERVAL_MS = 2800;

// How long we wait after starting a smooth scroll before checking whether
// we've crossed into the duplicated set and need to snap back invisibly.
const STEP_SETTLE_MS = 650;

function FlashSaleCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    const firstSet = firstSetRef.current;
    if (!container || !firstSet) return;

    const interval = setInterval(() => {
      if (isPausedRef.current) return;

      const singleSetWidth = firstSet.scrollWidth;
      // Average per-card width (including its share of the gap) — computed
      // fresh every tick so it stays correct across responsive breakpoints
      // and doesn't need a separate width measurement per card.
      const step = singleSetWidth / products.length;

      container.scrollTo({ left: container.scrollLeft + step, behavior: "smooth" });

      // Once we've scrolled a full set's worth, the duplicated second set
      // is now sitting exactly where the first set started — snap back by
      // that same width instantly so the loop never visibly "ends".
      setTimeout(() => {
        if (!container) return;
        if (container.scrollLeft >= singleSetWidth - 1) {
          container.scrollTo({ left: container.scrollLeft - singleSetWidth, behavior: "auto" });
        }
      }, STEP_SETTLE_MS);
    }, STEP_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [products.length]);

  const cardWidthClasses = "w-[46%] sm:w-[31%] md:w-[23%] lg:w-[15.6%] flex-shrink-0";

  return (
    <div
      ref={scrollRef}
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
      className="flex overflow-hidden gap-4"
    >
      <div ref={firstSetRef} className="flex gap-4 flex-shrink-0">
        {products.map((p) => (
          <div key={`set-a-${p._id}`} className={cardWidthClasses}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="flex gap-4 flex-shrink-0">
        {products.map((p) => (
          <div key={`set-b-${p._id}`} className={cardWidthClasses}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FlashSaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // admin-controlled toggle + countdown end time
  const [flashSaleSettings, setFlashSaleSettings] = useState<{ isActive: boolean; endsAt: string | null } | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?tag=flash-sale&limit=12")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/settings/flash-sale")
      .then((r) => r.json())
      .then((d) => setFlashSaleSettings(d))
      .catch(() => setFlashSaleSettings({ isActive: true, endsAt: null })) // fail-safe: behave as before
      .finally(() => setSettingsLoading(false));
  }, []);

  // Settings এখনো load হচ্ছে, বা admin এই banner টা explicitly off করে রেখেছে —
  // দুই ক্ষেত্রেই কিছু render করা হবে না।
  if (settingsLoading || flashSaleSettings?.isActive === false) {
    return null;
  }

  const shouldAutoScroll = products.length > AUTO_SCROLL_THRESHOLD;

  return (
    <div>
      {/* Header — 🛠️ কাস্টম মোবাইল রেসপন্সিভ ব্যানার */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-gradient-to-r from-[#2c2769] to-[#39378c] rounded-2xl p-4 md:px-5 md:py-4 gap-4 md:gap-0">
        
        {/* Left Side: Text only, no icon */}
        <div>
          <h2 className="text-white font-extrabold text-base md:text-lg tracking-tight">Flash Sale</h2>
          <p className="text-white/70 text-[11px] md:text-xs">Hurry up! Limited stock</p>
        </div>
        
        {/* Right Side: Timer + View All (মোবাইলে ফুল উইডথ জ্যাম-মুক্ত স্পেস) */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t border-white/10 pt-3 md:pt-0 md:border-t-0">
          <Countdown endsAt={flashSaleSettings?.endsAt ?? null} />
          <Link
            href="/products?tag=flash-sale"
            className="bg-white text-[#2c2769] text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-3 animate-pulse">
              <div className="bg-gray-200 h-36 rounded-lg mb-3" />
              <div className="bg-gray-200 h-3 rounded mb-2" />
              <div className="bg-gray-200 h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No flash sale products</p>
      ) : shouldAutoScroll ? (
        <FlashSaleCarousel products={products} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}