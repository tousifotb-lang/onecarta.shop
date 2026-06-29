import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  category: string;
  brand: string;
  stock: number;
  userEmail?: string; // 🔑 cartStore এর মতো user tracking
}

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (product: Omit<WishlistItem, "userEmail">) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (product: Omit<WishlistItem, "userEmail">) => void;
  getWishlistItems: () => WishlistItem[];
  clearWishlist: () => void;
}

// cartStore এর মতো same helper
const getCurrentUserEmail = (): string => {
  if (typeof window !== "undefined") {
    const email = localStorage.getItem("userEmail");
    return email ? email.trim().toLowerCase() : "guest_user";
  }
  return "guest_user";
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const currentUserEmail = getCurrentUserEmail();
        const exists = get().items.find(
          (i) => i._id === product._id && i.userEmail === currentUserEmail
        );
        if (!exists) {
          set((state) => ({
            items: [...state.items, { ...product, userEmail: currentUserEmail }],
          }));
        }
      },

      removeFromWishlist: (id) => {
        const currentUserEmail = getCurrentUserEmail();
        set((state) => ({
          items: state.items.filter(
            (i) => !(i._id === id && i.userEmail === currentUserEmail)
          ),
        }));
      },

      isInWishlist: (id) => {
        const currentUserEmail = getCurrentUserEmail();
        return get().items.some(
          (i) => i._id === id && i.userEmail === currentUserEmail
        );
      },

      toggleWishlist: (product) => {
        const currentUserEmail = getCurrentUserEmail();
        const exists = get().items.find(
          (i) => i._id === product._id && i.userEmail === currentUserEmail
        );
        if (exists) {
          set((state) => ({
            items: state.items.filter(
              (i) => !(i._id === product._id && i.userEmail === currentUserEmail)
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...product, userEmail: currentUserEmail }],
          }));
        }
      },

      getWishlistItems: () => {
        const currentUserEmail = getCurrentUserEmail();
        return get().items.filter((i) => i.userEmail === currentUserEmail);
      },

      clearWishlist: () => {
        const currentUserEmail = getCurrentUserEmail();
        set({ items: get().items.filter((i) => i.userEmail !== currentUserEmail) });
      },
    }),
    {
      name: "onecarta-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);