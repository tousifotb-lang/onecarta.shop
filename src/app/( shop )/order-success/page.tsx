"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { CheckCircle2, ShoppingBag, ArrowRight, Calendar } from "lucide-react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCartStore(); // Getting clear cart controller here
  const [orderId, setOrderId] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Clear the cart inside the success page render safely
    clearCart();

    // Generating a realistic mockup order ID
    const randomId = "OC" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);

    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(date);
  }, [clearCart]);

  return (
    <div className="container-main py-16 md:py-24 max-w-2xl text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center">
        
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          Thank You for Your Order!
        </h1>
        <p className="text-sm text-gray-500 max-w-md mb-8">
          Your order has been placed successfully. We are already preparing your package to be shipped out as soon as possible.
        </p>

        <div className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl p-4 md:p-6 mb-8 text-left grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Order ID</span>
            <span className="text-sm font-extrabold text-[#2c2769] font-mono">{orderId || "Loading..."}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Date Placed</span>
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" />
              {currentDate || "Loading..."}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Payment Method</span>
            <span className="text-sm font-bold text-gray-700">Cash on Delivery</span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-500 border border-orange-100 w-fit">
              Processing
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-8 max-w-sm">
          A confirmation SMS containing tracking details will be sent to your phone number shortly.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full sm:w-auto bg-[#2c2769] hover:bg-[#39378c] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-[#2c2769]/10 flex items-center justify-center gap-2 group"
        >
          <ShoppingBag size={16} />
          <span>Continue Shopping</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>

      </div>
    </div>
  );
}