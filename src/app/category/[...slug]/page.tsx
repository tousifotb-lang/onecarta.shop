"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import { Product, FilterState } from "@/types";

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  bannerImage?: string;
  shortDescription?: string;
  parentId?: string | null;
}

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

function CategoryPageContent() {
  const params = useParams();
  const router = useRouter();
  const slugArray = (params.slug as string[]) || [];
  const currentSlug = slugArray[slugArray.length - 1];

  const [category, setCategory] = useState<CategoryData | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<CategoryData[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    if (!currentSlug) return;
    setLoadingCategory(true);
    setNotFound(false);
    fetch(`/api/categories?slug=${currentSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        setCategory(data.category);
        setBreadcrumb(data.breadcrumb || []);
        setSubCategories(data.subCategories || []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoadingCategory(false));
  }, [currentSlug]);

  const fetchProducts = useCallback(async () => {
    if (!category) return;
    setLoadingProducts(true);
    try {
      const p = new URLSearchParams();
      p.set("categoryId", category._id);
      if (filters.minPrice) p.set("minPrice", filters.minPrice);
      if (filters.maxPrice) p.set("maxPrice", filters.maxPrice);
      if (filters.brand) p.set("brand", filters.brand);
      p.set("sort", filters.sort);
      p.set("order", filters.order);
      p.set("page", page.toString());
      p.set("limit", "20");

      const res = await fetch(`/api/products?${p.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  }, [category, filters, page]);

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

  if (loadingCategory) {
    return (
      <div className="container-main py-6 animate-pulse">
        <div className="bg-gray-200 h-40 rounded-2xl mb-6" />
        <div className="flex gap-3 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-20 h-20 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-bold text-gray-700">Category not found</h2>
        <button onClick={() => router.push("/products")} className="mt-4 btn-primary">
          Browse All Products
        </button>
      </div>
    );
  }

  return (
    <div className="container-main py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
        <Link href="/" className="hover:text-[#2c2769]">Home</Link>
        {breadcrumb.map((node) => (
          <span key={node._id} className="flex items-center gap-2">
            <ChevronRight size={14} />
            <Link href={`/category/${node.slug}`} className="hover:text-[#2c2769]">
              {node.name}
            </Link>
          </span>
        ))}
      </nav>

      <div className="relative w-full h-40 sm:h-56 rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-[#2c2769] to-[#39378c]">
        {category.bannerImage && (
          <Image src={category.bannerImage} alt={category.name} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20 flex items-end p-5">
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold drop-shadow-md">
            {category.name}
          </h1>
        </div>
      </div>

      {subCategories.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Browse {category.name}</h2>
        <div className="flex items-start gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-hide">
          {subCategories.map((sub) => (
            <Link
              key={sub._id}
              href={`/category/${sub.slug}`}
              className="flex flex-col items-center gap-2 group flex-shrink-0 w-20 sm:w-24"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:shadow-md">
                {sub.image ? (
                  <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl">{sub.icon || "🛍️"}</span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight w-full truncate">
                {sub.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    )}

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={handleReset} mode="navigate" activeSlug={currentSlug} />
        </aside>

        <div className="flex-1 min-w-0">
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
            <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setGridView("grid")} className={`p-2 transition-colors ${gridView === "grid" ? "bg-[#2c2769] text-white" : "text-gray-400 hover:bg-gray-50"}`}>
                <Grid3X3 size={16} />
              </button>
              <button onClick={() => setGridView("list")} className={`p-2 transition-colors ${gridView === "list" ? "bg-[#2c2769] text-white" : "text-gray-400 hover:bg-gray-50"}`}>
                <List size={16} />
              </button>
            </div>
          </div>

          {loadingProducts ? (
            <div className={`grid gap-4 ${gridView === "grid" ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
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
              <button onClick={handleReset} className="mt-4 btn-primary">Clear Filters</button>
            </div>
          ) : (
            <div className={`grid gap-4 ${gridView === "grid" ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} listView={gridView === "list"} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#2c2769] hover:text-[#2c2769] transition-colors">Previous</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${page === i + 1 ? "bg-[#2c2769] text-white" : "border border-gray-200 hover:border-[#2c2769] hover:text-[#2c2769]"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#2c2769] hover:text-[#2c2769] transition-colors">Next</button>
            </div>
          )}
        </div>
      </div>

      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)}><X size={20} /></button>
            </div>
            <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={handleReset} mode="navigate" activeSlug={currentSlug} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="container-main py-6">Loading...</div>}>
      <CategoryPageContent />
    </Suspense>
  );
}