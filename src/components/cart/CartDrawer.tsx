"use client";

import { useState, useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Home } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle smooth animation delay during open/close stages
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted || !isRendered) return null;

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const handleBackToHome = () => {
    onClose();
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with transition */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer Container with sliding animation logic */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className={`w-screen max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
              <ShoppingBag size={20} className="text-[#2c2769]" />
              <span>My Cart ({items.length})</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center pb-12">
                <p className="text-5xl mb-4">🛒</p>
                <h3 className="font-semibold text-gray-700">Your cart is empty</h3>
                <p className="text-xs text-gray-400 mt-1">Add some products to get started</p>
                
                {/* Back to home inside empty cart as well */}
                <button 
                  onClick={handleBackToHome}
                  className="mt-4 flex items-center gap-2 text-xs font-bold text-[#2c2769] hover:underline"
                >
                  <Home size={14} />
                  <span>Shop Our Products</span>
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="flex gap-4 p-3 border border-gray-50 rounded-xl bg-gray-50/50">
                  <div className="relative w-20 h-20 bg-white rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.image || "https://placehold.co/400x400/2c2769/white?text=No+Image"} 
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.brand || item.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 px-2 hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-700 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 px-2 hover:bg-gray-50 text-gray-500 transition-colors"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#2c2769]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeItem(item._id)}
                    className="self-start text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Section with Both Buttons */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between font-bold text-gray-900 mb-1">
                <span>Subtotal</span>
                <span className="text-xl text-[#2c2769]">{formatPrice(totalPrice())}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#2c2769] hover:bg-[#39378c] text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-[#2c2769]/10"
                >
                  Proceed to Checkout
                </button>

                <button 
                  onClick={handleBackToHome}
                  className="w-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Home size={14} className="text-gray-500" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}