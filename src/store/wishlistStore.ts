import { create } from "zustand";

interface WishlistItem {
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

interface WishlistState {
  items: WishlistItem[];
  loaded: boolean;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistItem) => Promise<void>;
  getWishlistItems: () => WishlistItem[];
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loaded: false,

  fetchWishlist: async () => {
    try {
      const res = await fetch("/api/users/wishlist");
      if (!res.ok) {
        set({ items: [], loaded: true });
        return;
      }
      const data = await res.json();
      const mapped: WishlistItem[] = Array.isArray(data)
        ? data.map((p: any) => ({
            _id: p._id,
            name: p.title || p.name,
            slug: p.slug,
            image: p.images?.[0] || "",
            price: p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price,
            originalPrice: p.price,
            category: p.category,
            brand: p.brand,
            stock: p.stock,
          }))
        : [];
      set({ items: mapped, loaded: true });
    } catch {
      set({ items: [], loaded: true });
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((item) => item._id === productId);
  },

  toggleWishlist: async (product: WishlistItem) => {
    const isCurrentlyIn = get().isInWishlist(product._id);

    if (isCurrentlyIn) {
      set({ items: get().items.filter((i) => i._id !== product._id) });
      await fetch("/api/users/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
    } else {
      set({ items: [...get().items, product] });
      await fetch("/api/users/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
    }
  },

  getWishlistItems: () => get().items,

  clearWishlist: () => set({ items: [], loaded: false }),
}));