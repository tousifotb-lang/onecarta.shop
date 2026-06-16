"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const frontendProductsDB = [
  { _id: "1", name: "Men's Casual Polo Shirt", price: 599, image: "https://placehold.co/400x400/2c2769/white?text=Polo+Shirt", category: "fashion" },
  { _id: "2", name: "Bashundhara A4 Paper (500 sheets)", price: 450, image: "https://placehold.co/400x400/2c2769/white?text=A4+Paper", category: "books" },
  { _id: "3", name: "Wireless Bluetooth Headphones", price: 1250, image: "https://placehold.co/400x400/2c2769/white?text=Headphones", category: "electronics" },
  { _id: "4", name: "Premium Leather Wallet", price: 890, image: "https://placehold.co/400x400/2c2769/white?text=Wallet", category: "fashion" }
];

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
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Track if user clicked inside input
  
  // Advanced Animation States
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [dotLoopCount, setDotLoopCount] = useState(0);
  const [animationMode, setAnimationMode] = useState<"typing" | "dots" | "deleting">("typing");

  const searchRef = useRef<HTMLDivElement>(null);

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

  // Quick live filtering engine
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }

    const matchedProducts = frontendProductsDB.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(matchedProducts);
    setIsOpen(true);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Compile full placeholder string dynamically (If focused, return empty to hide instantly)
  const baseText = placeholderPhrases[phraseIndex].substring(0, charIndex);
  const currentPlaceholder = isFocused ? "" : baseText + ".".repeat(dotCount);

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
            if (searchTerm.trim()) setIsOpen(true);
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

      {/* Live Search Popup Results Grid */}
      {isOpen && searchTerm.trim() && (
        <div className="absolute left-0 right-0 top-[115%] bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden z-50 max-h-80 flex flex-col text-left">
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {filteredResults.length > 0 ? (
              filteredResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchTerm("");
                    setIsFocused(false);
                    router.push(`/products/${product._id}`);
                  }}
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-10 h-10 border border-gray-100 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <Image src={product.image} alt={product.name} fill className="object-contain p-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-800 truncate">{product.name}</p>
                    <p className="text-[10px] text-gray-400 capitalize mt-0.5">{product.category}</p>
                  </div>
                  <span className="text-xs font-extrabold text-[#2c2769] whitespace-nowrap">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-xs text-gray-400 text-center">
                No products match &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
          
          {filteredResults.length > 0 && (
            <div 
              onClick={handleSearchSubmit}
              className="bg-gray-50 p-2.5 text-center text-xs font-bold text-[#2c2769] border-t border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              View all search results ({filteredResults.length})
            </div>
          )}
        </div>
      )}
    </div>
  );
}