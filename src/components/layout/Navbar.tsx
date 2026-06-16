"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Heart, User, Menu, X,
  Gift, BookOpen, CreditCard, Store, Package, Phone,
  ChevronDown, Settings, LogOut, LayoutDashboard
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/cart/CartDrawer"; 
import SearchBar from "./SearchBar"; 
import LoginModal from "@/components/auth/LoginModal"; 

const categories = [
  { name: "Electronics", slug: "electronics", icon: "📱" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Home & Living", slug: "home-living", icon: "🏠" },
  { name: "Groceries", slug: "groceries", icon: "🛒" },
  { name: "Sports", slug: "sports", icon: "⚽" },
  { name: "Beauty", slug: "beauty", icon: "💄" },
  { name: "Toys", slug: "toys", icon: "🧸" },
  { name: "Books", slug: "books", icon: "📚" },
];

export default function Navbar() {
  const router = useRouter();
  
  // 🔑 Zustand থেকে ইউনিক মাল্টি-ইউজার কার্ট ডাটা নেওয়া হলো অনুপাত ঠিক রাখতে
  const { getCartItems } = useCartStore();
  const currentCartItems = getCartItems();
  
  // 🔒 শুধুমাত্র কারেন্ট ইউজারের প্রোডাক্টের টোটাল সংখ্যা হিসাব করার ডাইনামিক লজিক
  const totalItems = currentCartItems.reduce((sum, i) => sum + i.quantity, 0);

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  
  const [cartOpen, setCartOpen] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  
  // 🔐 Authentication & Dropdown States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(""); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const userSession = localStorage.getItem("isLoggedIn");
    const storedName = localStorage.getItem("userName");
    
    if (userSession === "true") {
      setIsLoggedIn(true);
      setUserName(storedName && storedName !== "undefined" && storedName !== "User" ? storedName : "Tousif"); 
    }
  }, []);

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

      {/* Top Bar — desktop only */}
      <div className="hidden md:block bg-white border-b border-gray-100 text-xs py-1.5">
        <div className="container-main flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-600 font-medium">
            <Phone size={12} />
            <span>09638001122</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600 font-medium">
            <Link href="/track-order" className="flex items-center gap-1 hover:text-[#2c2769]">
              <Package size={12} /> ORDER TRACKING
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
        <div className="container-main flex items-center gap-2 md:gap-4 py-2.5">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5 text-white flex-shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img 
              src="/logo/logo.png" 
              alt="onecarta logo" 
              className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-105" 
            />
          </Link>

          {/* Search Bar */}
          <SearchBar />

          {/* Action Icons */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">

            {/* Offer — desktop only */}
            <Link
              href="/offers"
              className="hidden lg:flex items-center gap-1.5 border border-[#a8a6d9] text-white hover:bg-[#a8a6d9] hover:text-[#1a1a2e] px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              <Gift size={13} /> OFFER
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-1.5 md:flex md:items-center md:gap-1.5 md:border md:border-[#a8a6d9] md:text-white md:hover:bg-[#a8a6d9] md:hover:text-[#1a1a2e] md:px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#a8a6d9]"
            >
              <Heart size={18} />
              <span className="hidden lg:block text-xs font-bold">WISHLIST</span>
            </Link>

            {/* Cart Button with Drawer Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className={`relative p-1.5 flex items-center gap-1.5 md:border md:border-[#a8a6d9] md:text-white md:hover:bg-[#a8a6d9] md:hover:text-[#1a1a2e] md:px-3 md:py-1.5 md:rounded-lg md:text-xs md:font-bold text-[#a8a6d9] transition-all duration-300 ${
                isAnimate ? "scale-110 bg-white/10" : "scale-100"
              }`}
            >
              <ShoppingCart size={18} className={`${isAnimate ? "animate-bounce" : ""}`} />
              <span className="hidden lg:block text-xs font-bold">CART</span>
              {mounted && totalItems > 0 && (
                <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isAnimate ? "scale-125" : "scale-100"
                }`}>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {!isLoggedIn ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-1.5 md:flex md:items-center md:gap-1.5 md:border md:border-[#a8a6d9] md:text-white md:hover:bg-[#a8a6d9] hover:text-[#1a1a2e] px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#a8a6d9] cursor-pointer"
              >
                <User size={18} />
                <span className="hidden lg:block text-xs font-bold">LOGIN</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 md:px-2.5 md:py-1.5 border border-[#a8a6d9]/40 rounded-full hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#a8a6d9] text-[#1a1a2e] flex items-center justify-center font-bold text-xs shadow-inner uppercase">
                    {userName ? userName[0] : "T"} 
                  </div>
                  <ChevronDown size={12} className={`text-gray-300 transition-transform duration-200 hidden md:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-[9999] text-gray-800 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Welcome back</p>
                      <p className="text-xs font-extrabold text-gray-700 truncate capitalize">
                        {userName}
                      </p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => { setIsDropdownOpen(false); router.push("/dashboard"); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2c2769] rounded-xl transition-colors text-left"
                      >
                        <User size={14} className="text-gray-400" />
                        View Profile
                      </button>

                      <button
                        onClick={() => { setIsDropdownOpen(false); router.push("/dashboard"); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2c2769] rounded-xl transition-colors text-left"
                      >
                        <LayoutDashboard size={14} className="text-gray-400" />
                        Manage Account
                      </button>

                      <button
                        onClick={() => { setIsDropdownOpen(false); router.push("/dashboard"); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2c2769] rounded-xl transition-colors text-left"
                      >
                        <Settings size={14} className="text-gray-400" />
                        Settings
                      </button>
                    </div>

                    <div className="p-1 border-t border-gray-50 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Category Nav — desktop only */}
      <div className="bg-white border-b border-gray-200 hidden md:block shadow-sm">
        <div className="container-main flex items-center">

          {/* Hamburger */}
          <div
            className="relative flex-shrink-0"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className="flex items-center px-4 py-3 border-r border-gray-200 text-gray-700 hover:text-[#2c2769] transition-colors">
              <Menu size={16} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 rounded-b-xl shadow-xl z-50 py-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#eeedf5] hover:text-[#2c2769] transition-colors"
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-1 items-center justify-between">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="px-3 py-3 text-[14px] font-semibold text-gray-700 hover:text-[#2c2769] transition-colors uppercase tracking-wide whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/products?tag=featured"
              className="flex items-center bg-[#2c2769] hover:bg-[#39378c] text-white text-[11px] font-extrabold px-5 py-3 tracking-wider transition-colors uppercase whitespace-nowrap"
            >
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
              <img 
                src="/logo/logo.png" 
                alt="onecarta logo" 
                className="h-8 w-auto object-contain" 
              />
              <button onClick={() => setMobileOpen(false)} className="text-white">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Authentication Area */}
            {!isLoggedIn ? (
              <div className="flex gap-2 p-4 border-b border-white/10">
                <button
                  className="flex-1 text-center border border-[#a8a6d9] text-[#a8a6d9] py-2 rounded-lg text-sm font-bold cursor-pointer"
                  onClick={() => { setMobileOpen(false); setIsAuthModalOpen(true); }}
                >
                  Login
                </button>
                <button
                  className="flex-1 text-center bg-[#2c2769] text-white py-2 rounded-lg text-sm font-bold cursor-pointer"
                  onClick={() => { setMobileOpen(false); setIsAuthModalOpen(true); }}
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#a8a6d9] text-[#1a1a2e] flex items-center justify-center font-bold text-xs uppercase">
                    {userName ? userName[0] : "T"}
                  </div>
                  <span className="text-sm font-bold text-white max-w-[120px] truncate capitalize">{userName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1.5 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}

            <div className="py-2">
              <p className="px-4 py-2 text-xs text-gray-500 uppercase font-bold tracking-wider">
                Categories
              </p>
              {categories.map((cat) => (
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
              <p className="px-4 py-2 text-xs text-gray-500 uppercase font-bold tracking-wider">
                Quick Links
              </p>
              {[
                { name: "Order Tracking", href: "/track-order", icon: "📦" },
                { name: "EMI Policy", href: "/emi", icon: "💳" },
                { name: "Store Location", href: "/store", icon: "📍" },
                { name: "Blogs", href: "/blog", icon: "📝" },
                { name: "My Dashboard", href: "/dashboard", icon: "👤" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Pop-up Auth Modal */}
      <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}