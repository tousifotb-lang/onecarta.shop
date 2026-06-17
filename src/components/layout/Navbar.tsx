"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Heart, User, Menu, X,
  Gift, BookOpen, CreditCard, Store, Package, Phone,
  ChevronDown, Settings, LogOut, LayoutDashboard, ChevronRight, Home, Info, HelpCircle, Search
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/cart/CartDrawer"; 
import SearchBar from "./SearchBar"; 
import LoginModal from "@/components/auth/LoginModal"; 

// (Main -> Sub -> Child)
const categoriesData = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: "📱",
    subCategories: [
      {
        name: "Smartphones",
        slug: "smartphones",
        childCategories: [
          { name: "Apple iPhones", slug: "apple-iphones" },
          { name: "Samsung Galaxy", slug: "samsung-galaxy" },
          { name: "Google Pixel", slug: "google-pixel" },
          { name: "Xiaomi Phones", slug: "xiaomi-phones" },
        ]
      },
      {
        name: "Smart Watches",
        slug: "smart-watches",
        childCategories: [
          { name: "Apple Watch Series", slug: "apple-watch" },
          { name: "Galaxy Active", slug: "galaxy-active" },
          { name: "Amazfit Smart", slug: "amazfit" },
        ]
      },
      {
        name: "Power Banks",
        slug: "power-banks",
        childCategories: [
          { name: "Anker Fast Charge", slug: "anker" },
          { name: "Baseus Power", slug: "baseus" },
        ]
      },
      {
        name: "Charging Cables",
        slug: "charging-cables",
        childCategories: [
          { name: "Type-C Premium", slug: "type-c" },
          { name: "Lightning Cables", slug: "lightning" },
        ]
      },
      {
        name: "Bluetooth Speakers",
        slug: "bluetooth-speakers",
        childCategories: [
          { name: "JBL Portable", slug: "jbl" },
          { name: "Anker Soundcore", slug: "soundcore" },
        ]
      },
    ]
  },
  {
    name: "Fashion",
    slug: "fashion",
    icon: "👗",
    subCategories: [
      {
        name: "Men's Casual Polo",
        slug: "mens-polo",
        childCategories: [
          { name: "Slim Fit Polo", slug: "slim-fit" },
          { name: "Oversized Polo", slug: "oversized" },
        ]
      },
      {
        name: "Gents Watches",
        slug: "gents-watches",
        childCategories: [
          { name: "Casio Edifice", slug: "casio" },
          { name: "Curren Analogue", slug: "curren" },
        ]
      },
      {
        name: "Leather Wallets",
        slug: "leather-wallets",
        childCategories: [
          { name: "Bi-Fold Wallets", slug: "bifold" },
          { name: "Card Holders", slug: "card-holders" },
        ]
      },
    ]
  },
  {
    name: "Home & Living",
    slug: "home-living",
    icon: "🏠",
    subCategories: [
      {
        name: "Smart Lights",
        slug: "smart-lights",
        childCategories: [
          { name: "Philips Hue", slug: "philips-hue" },
          { name: "RGB LED Strips", slug: "rgb-strips" },
        ]
      },
      {
        name: "Kitchen Tools",
        slug: "kitchen-tools",
        childCategories: [
          { name: "Blenders & Juicers", slug: "blenders" },
          { name: "Air Fryers", slug: "air-fryers" },
        ]
      },
    ]
  },
  {
    name: "Groceries",
    slug: "groceries",
    icon: "🛒",
    subCategories: [
      {
        name: "Fresh Fruits",
        slug: "fresh-fruits",
        childCategories: [
          { name: "Imported Apples", slug: "apples" },
          { name: "Organic Bananas", slug: "bananas" },
        ]
      },
    ]
  },
  {
    name: "Sports",
    slug: "sports",
    icon: "⚽",
    subCategories: [
      {
        name: "Football Jerseys",
        slug: "football-jerseys",
        childCategories: [
          { name: "Bangladesh National", slug: "bd-jersey" },
          { name: "Club Jerseys", slug: "club-jersey" },
        ]
      },
    ]
  },
  { name: "Beauty", slug: "beauty", icon: "💄", subCategories: [] },
  { name: "Toys", slug: "toys", icon: "🧸", subCategories: [] },
  { name: "Books", slug: "books", icon: "📚", subCategories: [] },
];

export default function Navbar() {
  const router = useRouter();
  
  const { getCartItems } = useCartStore();
  const currentCartItems = getCartItems();
  const totalItems = currentCartItems.reduce((sum, i) => sum + i.quantity, 0);

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]); 
  const [activeSubCategory, setActiveSubCategory] = useState<any>(categoriesData[0].subCategories[0] || null);
  
  const [cartOpen, setCartOpen] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(""); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  // মোবাইল সার্চ ড্রপডাউন কন্ট্রোল করার জন্য নতুন স্টেট
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userSession = localStorage.getItem("isLoggedIn");
    const storedName = localStorage.getItem("userName");
    
    if (userSession === "true") {
      setIsLoggedIn(true);
      setUserName(storedName && storedName !== "undefined" && storedName !== "User" ? storedName : "Tousif"); 
    }
  }, []);

  const handleCategoryHover = (cat: any) => {
    setActiveCategory(cat);
    if (cat.subCategories && cat.subCategories.length > 0) {
      setActiveSubCategory(cat.subCategories[0]);
    } else {
      setActiveSubCategory(null);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (totalItems === 0) return;
    setIsAnimate(true);
    const timer = setTimeout(() => setIsAnimate(false), 400);
    return () => clearTimeout(timer);
  }, [totalItems]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName"); 
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    window.location.href = "/"; 
  };

  return (
    <header className="w-full sticky top-0 z-50">

      {/* Top Bar — desktop only (পয়েন্ট ১ ফিক্সড) */}
      <div className="hidden md:block bg-white border-b border-gray-100 text-xs py-1.5">
        <div className="container-main flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-600 font-medium">
            <Phone size={12} />
            <span>01303223513</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600 font-medium">
            <Link href="/track-order" className="flex items-center gap-1 hover:text-[#2c2769]">
              <Package size={12} /> ORDER STATUS
            </Link>
            <Link href="/gifts" className="flex items-center gap-1 hover:text-[#2c2769]">
              <Gift size={12} /> GIFT
            </Link>
            <Link href="/blog" className="flex items-center gap-1 hover:text-[#2c2769]">
              <BookOpen size={12} /> BLOGS
            </Link>
            <Link href="/emi" className="flex items-center gap-1 hover:text-[#2c2769]">
              <CreditCard size={12} /> EMI POLICY
            </Link>
            <Link href="/store" className="flex items-center gap-1 hover:text-[#2c2769]">
              <Store size={12} /> STORE LOCATION
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#1a1a2e] shadow-lg">
        <div className="container-main flex items-center justify-between py-2.5">

          {/* Left Side: Hamburger Menu + Logo (পয়েন্ট ২ ফিক্সড) */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button (≡ Icon) */}
            <button className="md:hidden p-1 text-white flex-shrink-0" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img src="/logo/logo.png" alt="onecarta logo" className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-105" />
            </Link>
          </div>

          {/* Search Bar — desktop only (মোবাইলে হেডার থেকে হাইড) */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Link href="/offers" className="hidden lg:flex items-center gap-1.5 border border-[#a8a6d9] text-white hover:bg-[#a8a6d9] hover:text-[#1a1a2e] px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
              <Gift size={13} /> OFFER
            </Link>

            {/* Wishlist Button (মোবাইলে এবং ডেক্সটপে দুইখানেই রেডি) */}
            <Link href="/wishlist" className="relative p-1.5 flex items-center gap-1.5 md:border md:border-[#a8a6d9] text-white md:hover:bg-[#a8a6d9] md:hover:text-[#1a1a2e] md:px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#a8a6d9]">
              <Heart size={20} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden lg:block text-xs font-bold">WISHLIST</span>
            </Link>

            {/* Cart Button — desktop only (মোবাইলে নিচে চলে গেছে, বাট হেডারেও ব্যাকআপ ব্যাকগ্রাউন্ডেড) */}
            <button
              onClick={() => setCartOpen(true)}
              className={`relative p-1.5 flex items-center gap-1.5 md:border md:border-[#a8a6d9] text-white md:hover:bg-[#a8a6d9] md:hover:text-[#1a1a2e] md:px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                isAnimate ? "scale-110" : "scale-100"
              }`}
            >
              <ShoppingCart size={20} className={`md:w-[18px] md:h-[18px] ${isAnimate ? "animate-bounce" : ""}`} />
              <span className="hidden lg:block text-xs font-bold">CART</span>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Login / Profile (মোবাইল হেডারেও ড্রপডাউন যেন ঠিক থাকে) */}
            {!isLoggedIn ? (
              <button onClick={() => setIsAuthModalOpen(true)} className="p-1.5 flex items-center gap-1.5 md:border md:border-[#a8a6d9] text-white md:hover:bg-[#a8a6d9] hover:text-[#1a1a2e] md:px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#a8a6d9] cursor-pointer">
                <User size={20} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden lg:block text-xs font-bold">LOGIN</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => { setIsDropdownOpen(!isDropdownOpen); setMobileOpen(false); }} className="flex items-center gap-1.5 p-1 md:px-2.5 md:py-1.5 border border-[#a8a6d9]/40 rounded-full hover:bg-white/10 transition-all cursor-pointer">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#a8a6d9] text-[#1a1a2e] flex items-center justify-center font-bold text-xs shadow-inner uppercase">
                    {userName[0]} 
                  </div>
                  <ChevronDown size={12} className={`text-gray-300 transition-transform duration-200 hidden md:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-[9999] text-gray-800 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Welcome back</p>
                      <p className="text-xs font-extrabold text-gray-700 truncate capitalize">{userName}</p>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <button onClick={() => { setIsDropdownOpen(false); router.push("/dashboard"); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2c2769] rounded-xl transition-colors text-left">
                        <User size={14} className="text-gray-400" />View Profile
                      </button>
                      <button onClick={() => { setIsDropdownOpen(false); router.push("/dashboard"); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2c2769] rounded-xl transition-colors text-left">
                        <LayoutDashboard size={14} className="text-gray-400" />Manage Account
                      </button>
                    </div>
                    <div className="p-1 border-t border-gray-50 mt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left">
                        <LogOut size={14} />Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ওপরে সার্চে ক্লিক করলে মোবাইলে যে এক্সপ্যান্ডেড সার্চ বার ওপেন হবে (পয়েন্ট ২ ফিক্সড) */}
      {mobileSearchOpen && (
        <div className="md:hidden w-full bg-[#1a1a2e] p-3 border-t border-white/10 animate-in slide-in-from-top duration-200">
          <SearchBar />
        </div>
      )}

      {/* 🟦 [3-LEVEL MEGAMENU BAR] — Desktop Only */}
      <div className="bg-white text-gray-700 hidden md:block shadow-sm relative border-b border-gray-100">
        <div className="container-main flex items-center">
          <div className="relative" onMouseEnter={() => setMegaMenuOpen(true)} onMouseLeave={() => setMegaMenuOpen(false)}>
            <button className="flex items-center gap-2.5 px-5 py-3.5 bg-[#1a1a2e] font-bold text-sm tracking-wide text-white transition-colors cursor-pointer select-none">
              <Menu size={16} />
              <span>All Category</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {megaMenuOpen && (
              <div className="absolute top-full left-0 w-[960px] lg:w-[1140px] bg-white border border-gray-100 shadow-2xl rounded-b-2xl z-[99999] flex text-gray-800 animate-in fade-in duration-200 select-none">
                <div className="w-60 bg-gray-50/80 p-2 border-r border-gray-100 flex-shrink-0">
                  <p className="px-3 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">All Categories</p>
                  <div className="space-y-0.5">
                    {categoriesData.map((cat) => (
                      <div
                        key={cat.slug}
                        onMouseEnter={() => handleCategoryHover(cat)}
                        onClick={() => { setMegaMenuOpen(false); router.push(`/products?category=${cat.slug}`); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          activeCategory.slug === cat.slug 
                            ? "bg-white border-l-4 border-[#1a1a2e] text-[#1a1a2e] shadow-sm pl-4" 
                            : "text-gray-600 hover:bg-gray-100/70"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm">{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                        <ChevronRight size={12} className={activeCategory.slug === cat.slug ? "text-[#1a1a2e]" : "text-gray-300"} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-64 p-3 border-r border-gray-100 min-h-[380px] bg-white flex-shrink-0">
                  <p className="px-2 py-1 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2 mb-2">
                    {activeCategory.name} Sub-items
                  </p>
                  {activeCategory.subCategories && activeCategory.subCategories.length > 0 ? (
                    <div className="space-y-0.5">
                      {activeCategory.subCategories.map((sub: any) => (
                        <div
                          key={sub.slug}
                          onMouseEnter={() => setActiveSubCategory(sub)}
                          onClick={() => { setMegaMenuOpen(false); router.push(`/products?category=${activeCategory.slug}&sub=${sub.slug}`); }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            activeSubCategory && activeSubCategory.slug === sub.slug 
                              ? "bg-[#eeedf5] text-[#1a1a2e]" 
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span className="truncate">{sub.name}</span>
                          {sub.childCategories && sub.childCategories.length > 0 && (
                            <ChevronRight size={11} className={activeSubCategory && activeSubCategory.slug === sub.slug ? "text-[#1a1a2e]" : "text-gray-300"} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic p-2">No sub-items available</p>
                  )}
                </div>

                <div className="flex-1 p-4 bg-gray-50/30 min-h-[380px] animate-in fade-in duration-300">
                  {activeSubCategory ? (
                    <div>
                      <p className="text-[10px] font-black text-[#1a1a2e] uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
                        ⚡ {activeSubCategory.name} Collections
                      </p>
                      {activeSubCategory.childCategories && activeSubCategory.childCategories.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {activeSubCategory.childCategories.map((child: any) => (
                            <Link
                              key={child.slug}
                              href={`/products?category=${activeCategory.slug}&sub=${activeSubCategory.slug}&child=${child.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="text-xs font-semibold text-gray-600 hover:text-[#1a1a2e] hover:bg-white p-2 rounded-lg border border-transparent hover:border-gray-100 shadow-sm/none hover:shadow-sm transition-all flex items-center gap-1.5 group/child"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/child:bg-[#1a1a2e] transition-colors" />
                              <span>{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-400 italic p-1">No deeper classifications found</p>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center text-gray-300 text-xs font-medium p-4">
                      Hover over any sub-item to unveil specific micro-genres
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-1 items-center gap-1 pl-4">
            <Link href="/" className="px-4 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#1a1a2e] transition-all flex items-center gap-1.5 uppercase">
              <Home size={13} className="text-gray-400" />
              <span>Home</span>
            </Link>
            <Link href="/offers" className="px-4 py-3.5 text-xs font-bold text-red-500 hover:bg-gray-50 transition-all flex items-center gap-1.5 uppercase">
              <Gift size={13} className="text-red-400" />
              <span>Special Offers</span>
            </Link>
            <Link href="/products" className="px-4 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#1a1a2e] transition-all flex items-center gap-1.5 uppercase">
              <Store size={13} className="text-gray-400" />
              <span>Shop</span>
            </Link>
            <Link href="/about" className="px-4 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#1a1a2e] transition-all flex items-center gap-1.5 uppercase">
              <Info size={13} className="text-gray-400" />
              <span>Our Story</span>
            </Link>
            <Link href="/contact" className="px-4 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#1a1a2e] transition-all flex items-center gap-1.5 uppercase">
              <HelpCircle size={13} className="text-gray-400" />
              <span>Support</span>
            </Link>
          </div>

          <div className="flex-shrink-0">
            <Link href="/products?tag=featured" className="flex items-center bg-[#1a1a2e] hover:bg-[#111122] text-white text-xs font-black px-6 py-[15px] tracking-wider transition-colors uppercase">
              NEW ARRIVALS
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-[#1a1a2e] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <img src="/logo/logo.png" alt="onecarta logo" className="h-8 w-auto object-contain" />
              <button onClick={() => setMobileOpen(false)} className="text-white"><X size={20} /></button>
            </div>

            {!isLoggedIn ? (
              <div className="flex gap-2 p-4 border-b border-white/10">
                <button className="flex-1 text-center border border-[#a8a6d9] text-[#a8a6d9] py-2 rounded-lg text-sm font-bold cursor-pointer" onClick={() => { setMobileOpen(false); setIsAuthModalOpen(true); }}>Login</button>
                <button className="flex-1 text-center bg-[#2c2769] text-white py-2 rounded-lg text-sm font-bold cursor-pointer" onClick={() => { setMobileOpen(false); setIsAuthModalOpen(true); }}>Register</button>
              </div>
            ) : (
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#a8a6d9] text-[#1a1a2e] flex items-center justify-center font-bold text-xs uppercase">{userName[0]}</div>
                  <span className="text-sm font-bold text-white max-w-[120px] truncate capitalize">{userName}</span>
                </div>
                <button onClick={handleLogout} className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1.5 rounded-lg">Logout</button>
              </div>
            )}

            <div className="py-2">
              <p className="px-4 py-2 text-xs text-gray-500 uppercase font-bold tracking-wider">Categories</p>
              {categoriesData.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white border-b border-white/5 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>

            <div className="py-2 border-t border-white/10">
              <p className="px-4 py-2 text-xs text-gray-500 uppercase font-bold tracking-wider">Quick Links</p>
              {[
                { name: "Order Status", href: "/track-order", icon: "📦" },
                { name: "EMI Policy", href: "/emi", icon: "💳" },
                { name: "Store Location", href: "/store", icon: "📍" },
                { name: "Blogs", href: "/blog", icon: "📝" },
                { name: "My Dashboard", href: "/dashboard", icon: "👤" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📱 📱 [MOBILE FIXED BOTTOM NAVIGATION BAR] — ফেসবুক/দারাজ স্টাইল */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-white/10 shadow-2xl py-2 px-4 flex items-center justify-between z-[9999]">
        
        {/* ১. Home Button */}
        <Link href="/" className="flex flex-col items-center justify-center text-[#a8a6d9] hover:text-white transition-colors">
          <Home size={20} />
          <span className="text-[10px] mt-0.5 font-bold">Home</span>
        </Link>

        {/* ২. Search Expand Toggle Button */}
        <button 
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)} 
          className={`flex flex-col items-center justify-center transition-colors ${mobileSearchOpen ? 'text-white' : 'text-[#a8a6d9] hover:text-white'}`}
        >
          <Search size={20} />
          <span className="text-[10px] mt-0.5 font-bold">Search</span>
        </button>

        {/* ৩. Categories Button (সাইডবার ড্রয়ার ট্রিগার করবে ভাই) */}
        <button 
          onClick={() => { setMobileOpen(true); setMobileSearchOpen(false); }} 
          className="flex flex-col items-center justify-center text-[#a8a6d9] hover:text-white transition-colors"
        >
          <Menu size={20} />
          <span className="text-[10px] mt-0.5 font-bold">Categories</span>
        </button>

        {/* ৪. Cart Button (ডাউন কাউন্টার ব্যাজ সহ) */}
        <button 
          onClick={() => { setCartOpen(true); setMobileSearchOpen(false); }} 
          className="flex flex-col items-center justify-center text-[#a8a6d9] hover:text-white transition-colors relative"
        >
          <ShoppingCart size={20} />
          <span className="text-[10px] mt-0.5 font-bold">Cart</span>
          {mounted && totalItems > 0 && (
            <span className="absolute top-0 right-1 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        {/* ৫. Account Button (লগইন থাকলে প্রোফাইল অ্যাকশন, না থাকলে লগইন পপআপ) */}
        <button 
          onClick={() => {
            if (isLoggedIn) {
              setIsDropdownOpen(!isDropdownOpen);
            } else {
              setIsAuthModalOpen(true);
            }
            setMobileSearchOpen(false);
          }} 
          className="flex flex-col items-center justify-center text-[#a8a6d9] hover:text-white transition-colors"
        >
          <User size={20} />
          <span className="text-[10px] mt-0.5 font-bold">Account</span>
        </button>

      </div>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Pop-up Auth Modal */}
      <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}