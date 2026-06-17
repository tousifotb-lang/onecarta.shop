"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    href: "/products?category=electronics",
    bg: "from-[#2c2769] to-[#1a1a4e]",
  },
  {
    id: 2,
    href: "/products?category=fashion",
    bg: "from-[#39378c] to-[#2c2769]",
  },
  {
    id: 3,
    href: "/products?tag=flash-sale",
    bg: "from-[#1a1a2e] to-[#2c2769]",
  },
];

const sideBanners = [
  {
    id: 1,
    href: "/products?category=electronics",
    bg: "from-[#0f0f23] to-[#2c2769]",
  },
  {
    id: 2,
    href: "/products?category=fashion",
    bg: "from-[#39378c] to-[#1a1a4e]",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* Left — Big Slider (2/3 width) - ফুল ইমেজ ক্লিকেবল */}
      <div className="lg:col-span-2 relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg group/slider">
        
        {/* স্লাইড র্যাপার কন্টেইনার */}
        <div 
          className="h-full flex transition-transform duration-700 ease-in-out"
          style={{ 
            width: `${slides.length * 100}%`, 
            transform: `translateX(-${(current * 100) / slides.length}%)` 
          }}
        >
          {slides.map((slide) => (
            <Link
              key={slide.id}
              href={slide.href}
              className={`h-full bg-gradient-to-r ${slide.bg} block cursor-pointer`}
              style={{ width: `${100 / slides.length}%` }}
            >
              <div className="w-full h-full" />
            </Link>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 md:opacity-0 md:group-hover/slider:opacity-100 text-white p-2 rounded-full transition-all z-10 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 md:opacity-0 md:group-hover/slider:opacity-100 text-white p-2 rounded-full transition-all z-10 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right — 2 Banners (মোবাইলে নিচে পাশাপাশি ২ কলামে দেখাবে, ডেক্সটপে ডান পাশে স্ট্যাকড থাকবে - পয়েন্ট ৩ ফিক্সড) */}
      <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4">
        {sideBanners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className={`bg-gradient-to-br ${banner.bg} rounded-2xl overflow-hidden block cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 h-24 sm:h-32 lg:h-auto lg:flex-1`}
          >
            {/* ইমেজ বা ব্যাকগ্রাউন্ডের জন্য এই স্পেসটি খালি ও ক্লিন */}
            <div className="w-full h-full" />
          </Link>
        ))}
      </div>

    </div>
  );
}