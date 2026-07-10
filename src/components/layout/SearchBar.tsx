"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2, Clock, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SearchProduct {
  _id: string;
  name?: string;
  title?: string;
  slug: string;
  price: number;
  category?: string;
  images?: unknown[];
}

function getImageUrl(img: unknown): string {
  if (typeof img === "string") return img;
  if (img && typeof img === "object" && "url" in img) {
    return (img as { url: string }).url;
  }
  return "";
}

const RECENT_SEARCHES_KEY = "onecarta_recent_searches";
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  if (typeof window === "undefined") return;
  const trimmed = term.trim();
  if (!trimmed) return;

  const existing = getRecentSearches().filter(
    (t) => t.toLowerCase() !== trimmed.toLowerCase()
  );
  const updated = [trimmed, ...existing].slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function clearRecentSearches() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

const placeholderPhrases = [
  "Men's Casual Polo Shirt",
  "Bashundhara A4 Paper",
  "Wireless Headphones",
  "Premium Leather Wallet",
  "All Products"
];

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchProduct[]>([]);
  const [suggestedResults, setSuggestedResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Track if user clicked inside input

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);

  // Advanced Animation States
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [dotLoopCount, setDotLoopCount] = useState(0);
  const [animationMode, setAnimationMode] = useState<"typing" | "dots" | "deleting">("typing");

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load recent searches once on mount, and fetch trending terms once.
  useEffect(() => {
    setRecentSearches(getRecentSearches());
    fetch("/api/search-log")
      .then((r) => r.json())
      .then((d) => setTrendingSearches(d.trending || []))
      .catch(() => setTrendingSearches([]));
  }, []);

  const logSearch = (term: string) => {
    saveRecentSearch(term);
    setRecentSearches(getRecentSearches());
    fetch("/api/search-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ term }),
    }).catch(() => {});
  };

  // Core Hybrid Typewriter & Bouncing Dots State Machine
  useEffect(() => {
    // If user has focused/clicked inside the input, pause the background processing
    if (isFocused) return;

    const currentFullText = placeholderPhrases[phraseIndex];
    let timer: NodeJS.Timeout;

    if (animationMode === "typing") {
      if (charIndex < currentFullText.length) {
        timer = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, 80);
      } else {
        setAnimationMode("dots");
      }
    } 
    else if (animationMode === "dots") {
      if (dotLoopCount < 3) {
        timer = setTimeout(() => {
          if (dotCount < 3) {
            setDotCount((prev) => prev + 1);
          } else {
            setDotCount(0);
            setDotLoopCount((prev) => prev + 1);
          }
        }, 350);
      } else {
        setDotCount(0);
        setDotLoopCount(0);
        setAnimationMode("deleting");
      }
    } 
    else if (animationMode === "deleting") {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex((prev) => prev - 1);
        }, 40);
      } else {
        setAnimationMode("typing");
        setPhraseIndex((prev) => (prev + 1) % placeholderPhrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, dotCount, dotLoopCount, animationMode, phraseIndex, isFocused]);

  // Click outside listener handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live search — debounced real API call against the actual product database.
  // If the search term matches nothing, we fall back to a small set of
  // best-selling products so the box is never a dead end for the shopper.
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      setSuggestedResults([]);
      setIsSearching(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    setIsOpen(true);
    setIsSearching(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}&limit=6`);
        const data = await res.json();
        const matches: SearchProduct[] = data.products || [];
        setFilteredResults(matches);

        // No direct matches — fetch a fallback set of popular products so
        // the shopper always sees something they can act on.
        if (matches.length === 0) {
          const fallbackRes = await fetch(`/api/products?tag=best-selling&limit=4`);
          const fallbackData = await fallbackRes.json();
          setSuggestedResults(fallbackData.products || []);
        } else {
          setSuggestedResults([]);
        }
      } catch (err) {
        console.error("Search fetch failed", err);
        setFilteredResults([]);
        setSuggestedResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      logSearch(searchTerm.trim());
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const goToProduct = (slug: string) => {
    if (searchTerm.trim()) logSearch(searchTerm.trim());
    setIsOpen(false);
    setSearchTerm("");
    setIsFocused(false);
    router.push(`/products/${slug}`);
  };

  const applyQuickTerm = (term: string) => {
    setSearchTerm(term);
    setIsOpen(true);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Compile full placeholder string dynamically (If focused, return empty to hide instantly)
  const baseText = placeholderPhrases[phraseIndex].substring(0, charIndex);
  const currentPlaceholder = isFocused ? "" : baseText + ".".repeat(dotCount);

  const showQuickPanel = isOpen && !searchTerm.trim() && (recentSearches.length > 0 || trendingSearches.length > 0);
  const showResultsPanel = isOpen && searchTerm.trim();

  const renderProductRow = (product: SearchProduct) => {
    const productName = product.name || product.title || "Unknown Product";
    const imageUrl = product.images && product.images.length > 0
      ? getImageUrl(product.images[0])
      : `https://placehold.co/100x100/2c2769/white?text=${encodeURIComponent(productName[0] || "P")}`;

    return (
      <div
        key={product._id}
        onClick={() => goToProduct(product.slug)}
        className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="relative w-10 h-10 border border-gray-100 rounded-lg overflow-hidden bg-white flex-shrink-0">
          <Image src={imageUrl} alt={productName} fill className="object-contain p-0.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-800 truncate">{productName}</p>
          {product.category && (
            <p className="text-[10px] text-gray-400 capitalize mt-0.5">{product.category}</p>
          )}
        </div>
        <span className="text-xs font-extrabold text-[#2c2769] whitespace-nowrap">
          {formatPrice(product.price)}
        </span>
      </div>
    );
  };

  return (
    <div className="relative flex-1 min-w-0" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full bg-white rounded-lg overflow-hidden min-w-0">
        <input
          type="text"
          placeholder={currentPlaceholder} 
          className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-800 focus:outline-none min-w-0 placeholder-gray-400 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            setIsFocused(true); // Hide placeholder instantly when cursor comes in
            setIsOpen(true);
          }}
          onBlur={() => {
            // Restore animation only if the input field is completely empty
            if (!searchTerm.trim()) {
              setIsFocused(false);
            }
          }}
        />
        
        {searchTerm && (
          <button 
            type="button" 
            onClick={() => {
              setSearchTerm("");
              setIsFocused(false); // Restart animation loop if cleared manually
            }}
            className="absolute right-12 text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={16} />
          </button>
        )}

        <button type="submit" className="group bg-[#2c2769] hover:bg-[#a8a6d9] px-3 py-2 flex-shrink-0 transition-colors">
          <Search size={20} className="text-white group-hover:text-[#1a1a2e] transition-colors" />
        </button>
      </form>

      {/* Quick Panel — Recent + Trending searches, shown when input is focused but empty */}
      {showQuickPanel && (
        <div className="absolute left-0 right-0 top-[115%] bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto text-left p-3 space-y-4">
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock size={11} /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={handleClearRecent}
                  className="text-[10px] font-semibold text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => applyQuickTerm(term)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {trendingSearches.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <TrendingUp size={11} /> Trending Now
              </span>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => applyQuickTerm(term)}
                    className="px-3 py-1.5 bg-[#eeedf5] hover:bg-[#e0ddf2] text-[#2c2769] text-xs font-semibold rounded-full transition-colors capitalize"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Search Popup Results Grid */}
      {showResultsPanel && (
        <div className="absolute left-0 right-0 top-[115%] bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden z-50 max-h-96 flex flex-col text-left">
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {isSearching ? (
              <div className="p-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Loader2 size={14} className="animate-spin" /> Searching...
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((product) => renderProductRow(product))
            ) : (
              <>
                <div className="p-4 text-xs text-gray-400 text-center border-b border-gray-50">
                  No products match &quot;{searchTerm}&quot;
                </div>
                {suggestedResults.length > 0 && (
                  <>
                    <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      You might like
                    </div>
                    {suggestedResults.map((product) => renderProductRow(product))}
                  </>
                )}
              </>
            )}
          </div>
          
          {!isSearching && filteredResults.length > 0 && (
            <div 
              onClick={handleSearchSubmit}
              className="bg-gray-50 p-2.5 text-center text-xs font-bold text-[#2c2769] border-t border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              View all search results
            </div>
          )}
        </div>
      )}
    </div>
  );
}