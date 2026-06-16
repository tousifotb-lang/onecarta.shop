"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import { Product, FilterState } from "@/types";

const SORT_OPTIONS = [
  { label: "Newest First", sort: "createdAt", order: "desc" },
  { label: "Price: Low to High", sort: "price", order: "asc" },
  { label: "Price: High to Low", sort: "price", order: "desc" },
  { label: "Best Selling", sort: "sold", order: "desc" },
  { label: "Top Rated", sort: "rating", order: "desc" },
];

const DEFAULT_FILTERS: FilterState = {
  category: "",
  minPrice: "",
  maxPrice: "",
  brand: "",
  sort: "createdAt",
  order: "desc",
  search: "",
  tag: "",
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: searchParams.get("category") || "",
    tag: searchParams.get("tag") || "",
    search: searchParams.get("search") || "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.tag) params.set("tag", filters.tag);
      if (filters.search) params.set("search", filters.search);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.brand) params.set("brand", filters.brand);
      params.set("sort", filters.sort);
      params.set("order", filters.order);
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = SORT_OPTIONS[parseInt(e.target.value)];
    setFilters((prev) => ({ ...prev, sort: selected.sort, order: selected.order }));
  };

  const currentSortIndex = SORT_OPTIONS.findIndex(
    (o) => o.sort === filters.sort && o.order === filters.order
  );

  return (
    <div className="container-main py-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span
          className="hover:text-[#2c2769] cursor-pointer"
          onClick={() => router.push("/")}
        >
          Home
        </span>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">
          {filters.category
            ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
            : filters.tag
            ? filters.tag.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
            : "All Products"}
        </span>
      </div>

      <div className="flex gap-6">
        {/* Sidebar — Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#2c2769]"
                onClick={() => setShowMobileFilter(true)}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{total}</span> products found
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={currentSortIndex === -1 ? 0 : currentSortIndex}
                onChange={handleSortChange}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2c2769] cursor-pointer"
              >
                {SORT_OPTIONS.map((opt, i) => (
                  <option key={i} value={i}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setGridView("grid")}
                  className={`p-2 transition-colors ${
                    gridView === "grid"
                      ? "bg-[#2c2769] text-white"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setGridView("list")}
                  className={`p-2 transition-colors ${
                    gridView === "list"
                      ? "bg-[#2c2769] text-white"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(filters.category || filters.brand || filters.minPrice) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.category && (
                <span className="flex items-center gap-1 bg-[#eeedf5] text-[#2c2769] text-xs font-medium px-3 py-1 rounded-full">
                  {filters.category}
                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() => handleFilterChange({ category: "" })}
                  />
                </span>
              )}
              {filters.brand && (
                <span className="flex items-center gap-1 bg-[#eeedf5] text-[#2c2769] text-xs font-medium px-3 py-1 rounded-full">
                  {filters.brand}
                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() => handleFilterChange({ brand: "" })}
                  />
                </span>
              )}
              {filters.minPrice && (
                <span className="flex items-center gap-1 bg-[#eeedf5] text-[#2c2769] text-xs font-medium px-3 py-1 rounded-full">
                  ৳{filters.minPrice} - ৳{filters.maxPrice}
                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() => handleFilterChange({ minPrice: "", maxPrice: "" })}
                  />
                </span>
              )}
            </div>
          )}

          {/* Product Grid / List */}
          {loading ? (
            <div
              className={`grid gap-4 ${
                gridView === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {[...Array(12)].map((_, i) => (
                <div key={i} className="card p-3 animate-pulse">
                  <div className="bg-gray-200 h-44 rounded-lg mb-3" />
                  <div className="bg-gray-200 h-3 rounded mb-2" />
                  <div className="bg-gray-200 h-3 w-2/3 rounded mb-2" />
                  <div className="bg-gray-200 h-5 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
              <p className="text-sm text-gray-500 mt-1">Try changing your filters</p>
              <button onClick={handleReset} className="mt-4 btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                gridView === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  listView={gridView === "list"}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#2c2769] hover:text-[#2c2769] transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${
                    page === i + 1
                      ? "bg-[#2c2769] text-white"
                      : "border border-gray-200 hover:border-[#2c2769] hover:text-[#2c2769]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#2c2769] hover:text-[#2c2769] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)}>
                <X size={20} />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-main py-6">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}