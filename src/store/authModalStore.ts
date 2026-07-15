import { create } from "zustand";

type AuthModalMode = "login" | "signup";

interface AuthModalStore {
  isOpen: boolean;
  initialMode: AuthModalMode;
  openModal: (mode?: AuthModalMode) => void;
  closeModal: () => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false,
  initialMode: "login",
  // mode optional — tai purono shob jaygay-r openModal() call (Navbar LOGIN
  // button, checkout "Sign In" button, wishlist button etc.) age-r moto-i
  // kaj korbe, default "login" mode-e open hobe.
  openModal: (mode = "login") => set({ isOpen: true, initialMode: mode }),
  closeModal: () => set({ isOpen: false }),
}));