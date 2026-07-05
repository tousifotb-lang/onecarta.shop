"use client";

import { useState, useEffect } from "react";
import { FilterState } from "@/types";
import { X } from "lucide-react";

interface CategoryOption {
  label: string;
  value: string; // slug
}

const BRANDS = ["Apple", "Samsung", "Sony", "Nike", "Walton", "Aarong", "Maybelline", "LEGO"];

const PRICE_RANGES = [
  { label: "Under ৳500", min: "0", max: "500" },
  { label: "৳500 - ৳2,000", min: "500", max: "2000" },
  { label: "৳2,000 - ৳10,000", min: "2000", max: "10000" },
  { label: "৳10,000 - ৳50,000", min: "10000", max: "50000" },
  { label: "Above ৳50,000", min: "50000", max: "999999" },
];

interface Props {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  hideCategoryFilter?: boolean;
}

export default function FilterSidebar({ filters, onChange, onReset, hideCategoryFilter }: Props) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    if (hideCategoryFilter) return;
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((c: any) => ({ label: c.name, value: c.slug })));
        }
      })
      .catch(() => setCategories([]));
  }, [hideCategoryFilter]);

  const hasActiveFilters = filters.category || filters.minPrice || filters.brand;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-base">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-[#2c2769] hover:underline flex items-center gap-1"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      {!hideCategoryFilter && (
        <>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ""}
                  onChange={() => onChange({ category: "" })}
                  className="accent-[#2c2769]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#2c2769] transition-colors">
                  All Categories
                </span>
              </label>
              {categories.map((cat) => (
                <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={filters.category === cat.value}
                    onChange={() => onChange({ category: cat.value })}
                    className="accent-[#2c2769]"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-[#2c2769] transition-colors">
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-gray-100" />
        </>
      )}

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                onChange={() => onChange({ minPrice: range.min, maxPrice: range.max })}
                className="accent-[#2c2769]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#2c2769] transition-colors">
                {range.label}
              </span>
            </label>
          ))}
          {filters.minPrice && (
            <button
              onClick={() => onChange({ minPrice: "", maxPrice: "" })}
              className="text-xs text-red-400 hover:underline mt-1"
            >
              Clear price filter
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#2c2769]"
          />
          <span className="text-gray-400 text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#2c2769]"
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Brand</h4>
        <div className="space-y-1.5">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brand === brand}
                onChange={() => onChange({ brand: filters.brand === brand ? "" : brand })}
                className="accent-[#2c2769]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#2c2769] transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Min Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="rating" className="accent-[#2c2769]" />
              <span className="text-sm text-gray-600">{"⭐".repeat(r)} & above</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}