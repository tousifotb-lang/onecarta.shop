import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  category: string;
  brand: string;
  stock: number;
  quantity: number;
  userEmail?: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean; // ✅ drawer visibility — global
  addItem: (item: Omit<CartItem, "quantity" | "userEmail">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartItems: () => CartItem[];
  totalItems: () => number;
  totalPrice: () => number;
  openCart: () => void;   // ✅
  closeCart: () => void;  // ✅
  toggleCart: () => void; // ✅
}

const getCurrentUserEmail = (): string => {
  if (typeof window !== "undefined") {
    const email = localStorage.getItem("userEmail");
    return email ? email.trim().toLowerCase() : "guest_user";
  }
  return "guest_user";
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (newItem, quantity = 1) => {
        const currentUserEmail = getCurrentUserEmail();
        const allItems = get().items;

        const existing = allItems.find(
          (i) => i._id === newItem._id && i.userEmail === currentUserEmail
        );

        if (existing) {
          set({
            items: allItems.map((i) =>
              i._id === newItem._id && i.userEmail === currentUserEmail
                ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...allItems, { ...newItem, quantity, userEmail: currentUserEmail }] });
        }
      },

      removeItem: (id) => {
        const currentUserEmail = getCurrentUserEmail();
        set({
          items: get().items.filter((i) => !(i._id === id && i.userEmail === currentUserEmail)),
        });
      },

      updateQuantity: (id, quantity) => {
        const currentUserEmail = getCurrentUserEmail();

        if (quantity < 1) {
          set({
            items: get().items.filter((i) => !(i._id === id && i.userEmail === currentUserEmail)),
          });
          return;
        }

        set({
          items: get().items.map((i) =>
            i._id === id && i.userEmail === currentUserEmail
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        });
      },

      clearCart: () => {
        const currentUserEmail = getCurrentUserEmail();
        set({ items: get().items.filter((i) => i.userEmail !== currentUserEmail) });
      },

      getCartItems: () => {
        const currentUserEmail = getCurrentUserEmail();
        return get().items.filter((i) => i.userEmail === currentUserEmail);
      },

      totalItems: () => {
        return get().getCartItems().reduce((sum, i) => sum + i.quantity, 0);
      },

      totalPrice: () => {
        return get().getCartItems().reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: "onecarta-multi-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // ✅ isCartOpen persist hobe na — refresh e drawer auto-open hobe na
    }
  )
);