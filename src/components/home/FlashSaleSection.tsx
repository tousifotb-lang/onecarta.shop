"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { Zap } from "lucide-react";

function Countdown() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1">
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white text-[#2c2769] font-extrabold text-sm px-2 py-1 rounded-lg min-w-[32px] text-center">
            {val}
          </span>
          {i < 2 && <span className="text-white font-bold">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function FlashSaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?tag=flash-sale&limit=6")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-[#2c2769] to-[#39378c] rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <div>
            <h2 className="text-white font-extrabold text-lg">Flash Sale</h2>
            <p className="text-white/70 text-xs">Hurry up! Limited stock</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Countdown />
          <Link
            href="/products?tag=flash-sale"
            className="bg-white text-[#2c2769] text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors hidden sm:block"
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