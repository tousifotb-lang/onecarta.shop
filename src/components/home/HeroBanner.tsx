"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "Electronics Summer Sale",
    description: "Up to 40% off on smartphones, laptops & more",
    cta: "Shop Electronics",
    href: "/products?category=electronics",
    bg: "from-[#2c2769] to-[#1a1a4e]",
    badge: "🔥 Hot Deal",
    emoji: "💻",
  },
  {
    id: 2,
    title: "Fashion Week",
    subtitle: "Trending Styles 2024",
    description: "Latest fashion for men & women at unbeatable prices",
    cta: "Explore Fashion",
    href: "/products?category=fashion",
    bg: "from-[#39378c] to-[#2c2769]",
    badge: "👗 New Season",
    emoji: "👗",
  },
  {
    id: 3,
    title: "Flash Sale",
    subtitle: "Limited Time Offers",
    description: "Grab the best deals before they're gone!",
    cta: "View Flash Sale",
    href: "/products?tag=flash-sale",
    bg: "from-[#1a1a2e] to-[#2c2769]",
    badge: "⚡ Flash Sale",
    emoji: "⚡",
  },
];

const sideBanners = [
  {
    id: 1,
    title: "Largest Electronic",
    subtitle: "HYPERMARKET",
    description: "Enjoy up to 70% off",
    href: "/products?category=electronics",
    bg: "from-[#0f0f23] to-[#2c2769]",
    emoji: "📱",
    badge: "UP TO 70% OFF",
  },
  {
    id: 2,
    title: "New Season",
    subtitle: "FASHION SALE",
    description: "Shop latest trends now",
    href: "/products?category=fashion",
    bg: "from-[#39378c] to-[#1a1a2e]",
    emoji: "🛍️",
    badge: "NEW ARRIVALS",
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

      {/* Left — Big Slider (2/3 width) */}
      <div className="lg:col-span-2 relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="h-full flex items-center justify-between px-8 md:px-12">
              {/* Text */}
              <div className="text-white max-w-sm">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {slide.badge}
                </span>
                <p className="text-sm md:text-base text-white/80 font-medium mb-1">
                  {slide.subtitle}
                </p>
                <h1 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xs md:text-sm text-white/70 mb-6">
                  {slide.description}
                </p>
                <Link
                  href={slide.href}
                  className="inline-flex items-center gap-2 bg-white text-[#2c2769] font-bold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm"
                >
                  {slide.cta} →
                </Link>
              </div>

              {/* Emoji */}
              <div className="hidden md:flex text-[100px] lg:text-[120px] opacity-20 select-none">
                {slide.emoji}
              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right — 2 Stacked Banners (1/3 width) */}
      <div className="hidden lg:flex flex-col gap-4">
        {sideBanners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className={`flex-1 bg-gradient-to-br ${banner.bg} rounded-2xl overflow-hidden relative group shadow-lg`}
          >
            <div className="h-full flex items-center justify-between p-6">
              <div className="text-white">
                <span className="inline-block bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-2 tracking-wider">
                  {banner.badge}
                </span>
                <p className="text-white/70 text-xs font-medium">{banner.title}</p>
                <h3 className="text-xl font-extrabold text-white leading-tight">
                  {banner.subtitle}
                </h3>
                <p className="text-white/60 text-xs mt-1">{banner.description}</p>
                <span className="inline-block mt-3 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                  Shop Now →
                </span>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all select-none">
                {banner.emoji}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}