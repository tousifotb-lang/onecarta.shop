"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  _id: string;
  type: "hero" | "side";
  imageUrl: string;
  href: string;
  title: string;
}

export default function HeroBanner() {
  const [slides, setSlides] = useState<Banner[]>([]);
  const [sideBanners, setSideBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("/api/banners?activeOnly=true");
        const data: Banner[] = await res.json();
        setSlides(data.filter((b) => b.type === "hero"));
        setSideBanners(data.filter((b) => b.type === "side").slice(0, 2));
      } catch (err) {
        console.error("Failed to load banners", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  if (!isLoading && slides.length === 0 && sideBanners.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* Left — Big Slider (2/3 width) */}
      <div className="lg:col-span-2 relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#2c2769] to-[#1a1a4e] group/slider">
        {slides.length > 0 && (
          <>
            <div
              className="h-full flex transition-transform duration-700 ease-in-out"
              style={{
                width: `${slides.length * 100}%`,
                transform: `translateX(-${(current * 100) / slides.length}%)`,
              }}
            >
              {slides.map((slide) => (
                <Link
                  key={slide._id}
                  href={slide.href}
                  className="relative h-full block cursor-pointer"
                  style={{ width: `${100 / slides.length}%` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.imageUrl}
                    alt={slide.title || "Banner"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>

            {slides.length > 1 && (
              <>
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
              </>
            )}
          </>
        )}
      </div>

      {/* Right — Side Banners (max 2, upper + lower) */}
      {sideBanners.length > 0 && (
        <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4 lg:h-48 sm:lg:h-64 md:lg:h-80 lg:h-96">
          {sideBanners.map((banner) => (
            <Link
              key={banner._id}
              href={banner.href}
              className="relative rounded-2xl overflow-hidden block cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 h-24 sm:h-32 lg:h-auto lg:flex-1 lg:min-h-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.imageUrl}
                alt={banner.title || "Banner"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}