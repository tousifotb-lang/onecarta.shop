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
  userEmail?: string; // 🔑 কার আইটেম সেটা ট্র্যাক করার জন্য ইমেইল ট্যাগ
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "userEmail">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartItems: () => CartItem[]; // 🔒 শুধুমাত্র কারেন্ট ইউজারের আইটেমগুলো ফিল্টার করে গেট করার ফাংশন
  totalItems: () => number;
  totalPrice: () => number;
}

// 🔐 লোকালস্টোরেজ থেকে কারেন্ট ইউজারের ইমেইল রিড করার হেল্পার ফাংশন
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

      addItem: (newItem, quantity = 1) => {
        const currentUserEmail = getCurrentUserEmail();
        const allItems = get().items;
        
        // একই প্রোডাক্ট কিন্তু কারেন্ট ইউজারের কি না তা চেক করা হচ্ছে
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
          // নতুন আইটেমে ইউজারের ইমেইল ট্যাগ করে পুশ করা হচ্ছে
          set({ items: [...allItems, { ...newItem, quantity, userEmail: currentUserEmail }] });
        }
      },

      removeItem: (id) => {
        const currentUserEmail = getCurrentUserEmail();
        // শুধুমাত্র কারেন্ট ইউজারের ওই নির্দিষ্ট প্রোডাক্টটি রিমুভ হবে
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
        // শুধুমাত্র কারেন্ট ইউজারের আইটেমগুলো ক্লিয়ার হবে, অন্যদের ডাটা অক্ষত থাকবে
        set({ items: get().items.filter((i) => i.userEmail !== currentUserEmail) });
      },

      // 🔒 ভিউ বা পেজে কাস্টমারকে শুধু তার কার্ট দেখানোর জন্য ফিল্টারড মেথড
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
    }),
    {
      name: "onecarta-multi-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);