"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FilterState } from "@/types";
import { X, ChevronRight } from "lucide-react";

interface RawCategory {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

interface TreeNode extends RawCategory {
  children: TreeNode[];
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
  mode?: "filter" | "navigate"; // "filter" = /products page, "navigate" = /category page
  activeSlug?: string;
}

function buildTree(flat: RawCategory[]): TreeNode[] {
  const byId: Record<string, TreeNode> = {};
  flat.forEach((c) => { byId[c._id] = { ...c, children: [] }; });
  const roots: TreeNode[] = [];
  flat.forEach((c) => {
    const node = byId[c._id];
    if (c.parentId && byId[c.parentId]) byId[c.parentId].children.push(node);
    else roots.push(node);
  });
  return roots;
}

function findPathToActive(nodes: TreeNode[], activeSlug: string | undefined, path: string[] = []): string[] {
  if (!activeSlug) return [];
  for (const node of nodes) {
    if (node.slug === activeSlug) return [...path, node._id];
    const childPath = findPathToActive(node.children, activeSlug, [...path, node._id]);
    if (childPath.length) return childPath;
  }
  return [];
}

function CategoryTreeNode({
  node, depth, mode, activeSlug, expandedIds, filters, onChange,
}: {
  node: TreeNode; depth: number; mode: "filter" | "navigate"; activeSlug?: string;
  expandedIds: Set<string>; filters: FilterState; onChange: (f: Partial<FilterState>) => void;
}) {
  const isActive = mode === "navigate" ? activeSlug === node.slug : filters.category === node.slug;
  const shouldShowChildren = node.children.length > 0 && (expandedIds.has(node._id) || isActive);

  const label = (
    <span className={`text-sm transition-colors ${isActive ? "text-[#2c2769] font-bold" : "text-gray-600 group-hover:text-[#2c2769]"}`}>
      {node.name}
    </span>
  );

  return (
    <div style={{ marginLeft: depth > 0 ? 14 : 0 }}>
      {mode === "navigate" ? (
        <Link href={`/category/${node.slug}`} className="flex items-center gap-1.5 py-1 group cursor-pointer">
          {depth > 0 && <ChevronRight size={11} className="text-gray-300 shrink-0" />}
          {label}
        </Link>
      ) : (
        <label className="flex items-center gap-2 py-1 cursor-pointer group">
          <input type="radio" name="category" checked={filters.category === node.slug} onChange={() => onChange({ category: node.slug })} className="accent-[#2c2769]" />
          {label}
        </label>
      )}
      {shouldShowChildren && (
        <div className="mt-0.5">
          {node.children.map((child) => (
            <CategoryTreeNode key={child._id} node={child} depth={depth + 1} mode={mode} activeSlug={activeSlug} expandedIds={expandedIds} filters={filters} onChange={onChange} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, onReset, mode = "filter", activeSlug }: Props) {
  const [categories, setCategories] = useState<RawCategory[]>([]);

  useEffect(() => {
    fetch("/api/categories?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((c: any) => ({
            _id: c._id, name: c.name, slug: c.slug,
            parentId: c.parentId ? String(c.parentId) : null,
          })));
        }
      })
      .catch(() => setCategories([]));
  }, []);

  const tree = useMemo(() => buildTree(categories), [categories]);
  const expandedIds = useMemo(() => new Set(findPathToActive(tree, activeSlug)), [tree, activeSlug]);

  const hasActiveFilters = filters.category || filters.minPrice || filters.brand;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-base">Filters</h3>
        {hasActiveFilters && (
          <button onClick={onReset} className="text-xs text-[#2c2769] hover:underline flex items-center gap-1">
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
        <div className="space-y-0.5">
          {mode === "navigate" ? (
            <Link href="/products" className="block text-sm text-gray-600 hover:text-[#2c2769] py-1">All Categories</Link>
          ) : (
            <label className="flex items-center gap-2 cursor-pointer group py-1">
              <input type="radio" name="category" checked={filters.category === ""} onChange={() => onChange({ category: "" })} className="accent-[#2c2769]" />
              <span className="text-sm text-gray-600 group-hover:text-[#2c2769]">All Categories</span>
            </label>
          )}
          {tree.map((node) => (
            <CategoryTreeNode key={node._id} node={node} depth={0} mode={mode} activeSlug={activeSlug} expandedIds={expandedIds} filters={filters} onChange={onChange} />
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="price" checked={filters.minPrice === range.min && filters.maxPrice === range.max} onChange={() => onChange({ minPrice: range.min, maxPrice: range.max })} className="accent-[#2c2769]" />
              <span className="text-sm text-gray-600 group-hover:text-[#2c2769] transition-colors">{range.label}</span>
            </label>
          ))}
          {filters.minPrice && (
            <button onClick={() => onChange({ minPrice: "", maxPrice: "" })} className="text-xs text-red-400 hover:underline mt-1">Clear price filter</button>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => onChange({ minPrice: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#2c2769]" />
          <span className="text-gray-400 text-sm">-</span>
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#2c2769]" />
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Brand</h4>
        <div className="space-y-1.5">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={filters.brand === brand} onChange={() => onChange({ brand: filters.brand === brand ? "" : brand })} className="accent-[#2c2769]" />
              <span className="text-sm text-gray-600 group-hover:text-[#2c2769] transition-colors">{brand}</span>
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