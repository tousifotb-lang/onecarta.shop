"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, Gift } from "lucide-react";
import { useAuthModalStore } from "@/store/authModalStore";

const STORAGE_KEY = "onecarta_new_user_popup_seen";
const SHOW_DELAY_MS = 4000;

export default function NewUserSignupPopup() {
  const { status } = useSession();
  const { openModal } = useAuthModalStore();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Shudhu logged-out visitor-der jonno, ar ekbar dismiss/sign-up korle
  // ei browser-e ar kokhono dekhabe na (localStorage flag diye track kora hocche)
  useEffect(() => {
    if (!mounted || status !== "unauthenticated") return;

    const alreadySeen = localStorage.getItem(STORAGE_KEY);
    if (alreadySeen) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [mounted, status]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleSignUpClick = () => {
    dismiss();
    openModal("signup");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7 text-center animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#2c2769] to-[#39378c] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#2c2769]/20">
          <Gift size={28} className="text-white" />
        </div>

        <h2 className="text-lg font-black text-gray-900 mb-1.5">Are You a New User?</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Sign up now and get <span className="font-extrabold text-[#2c2769]">10% instant discount</span> on your first order!
        </p>

        <button
          onClick={handleSignUpClick}
          className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
        >
          Sign Up & Get 10% Off
        </button>

        <button
          onClick={dismiss}
          className="w-full text-xs font-semibold text-gray-400 hover:text-gray-600 mt-3 cursor-pointer"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}