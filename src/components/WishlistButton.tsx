"use client";

import { Heart } from "lucide-react";
import { useWishlistStore, WishlistItem } from "@/store/wishlistStore";
import { useAuthModalStore } from "@/store/authModalStore";
import { useState, useEffect } from "react";

interface Props {
  product: Omit<WishlistItem, "userEmail">;
  className?: string;
  size?: number;
}

export default function WishlistButton({ product, className = "", size = 16 }: Props) {
  const [mounted, setMounted] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { openModal } = useAuthModalStore();

  useEffect(() => setMounted(true), []);

  const active = mounted && isInWishlist(product._id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔐 Login check
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      openModal(); // Login modal খুলবে
      return;
    }

    toggleWishlist(product);
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-all duration-200 ${className}`}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={size}
        className={`transition-colors duration-200 ${
          active
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-400"
        }`}
      />
    </button>
  );
}