"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthModalStore } from "@/store/authModalStore";

interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  category?: string;
  brand?: string;
  stock?: number;
}

interface WishlistButtonProps {
  product: WishlistProduct;
  className?: string;
  size?: number;
}

export default function WishlistButton({ product, className = "", size = 16 }: WishlistButtonProps) {
  const { status } = useSession();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { openModal } = useAuthModalStore();

  const inWishlist = isInWishlist(product._id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      openModal();
      return;
    }

    toggleWishlist(product);
  };

  return (
    <button onClick={handleClick} className={className} type="button">
      <Heart size={size} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
    </button>
  );
}