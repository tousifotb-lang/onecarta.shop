"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Truck, CreditCard, User, RefreshCw, MessageCircle, Phone } from "lucide-react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "অর্ডার ও ডেলিভারি",
      englishTitle: "Orders & Delivery",
      icon: <Truck size={32} className="text-[#1a1a2e]" />,
      desc: "ডেলিভারি চার্জ, সময়সীমা এবং পার্সেল ট্র্যাকিং সংক্রান্ত তথ্যাবলী।",
      link: "/shipping-info"
    },
    {
      title: "পেমেন্ট ও রিফান্ড",
      englishTitle: "Payments & Refunds",
      icon: <CreditCard size={32} className="text-[#1a1a2e]" />,
      desc: "বিকাশ, নগদ, কার্ড পেমেন্ট এবং রিফান্ড পাওয়ার নিয়মাবলী।",
      link: "/payment-methods"
    },
    {
      title: "রিটার্ন ও এক্সচেঞ্জ",
      englishTitle: "Returns & Exchanges",
      icon: <RefreshCw size={32} className="text-[#1a1a2e]" />,
      desc: "ভুল বা নষ্ট প্রোডাক্ট পেলে ৭ দিনের মধ্যে পরিবর্তন করার প্রসেস।",
      link: "/return-policy"
    },
    {
      title: "সচরাচর জিজ্ঞাসা",
      englishTitle: "Account & FAQs",
      icon: <User size={32} className="text-[#1a1a2e]" />,
      desc: "অর্ডার ক্যানসেল বা অ্যাকাউন্ট নিয়ে সাধারণ প্রশ্ন ও উত্তর।",
      link: "/faq"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button & Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-[#1a1a2e] border-b-2 border-gray-100 pb-5 uppercase">
            Help Center 💡
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">How can we help you today?</p>
        </div>

        {/* Big Search Bar Area */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-10 text-center mb-10 shadow-xs">
          <h2 className="text-lg sm:text-2xl font-black text-[#1a1a2e] mb-4 uppercase tracking-wide">
            আপনার জিজ্ঞাসাটি এখানে সার্চ করুন
          </h2>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="যেমন: ডেলিভারি চার্জ, রিফান্ড প্রসেস..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] text-sm font-medium transition-all shadow-xs"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {categories.map((cat, idx) => (
            <Link 
              href={cat.link} 
              key={idx}
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-[#1a1a2e]/20 transition-all duration-200 group flex items-start gap-4"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a1a2e]/5 transition-colors">
                {cat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-[#1a1a2e] text-base sm:text-lg group-hover:text-[#2c2769] transition-colors flex items-center gap-2">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{cat.englishTitle}</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed pt-1">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Still Need Help Section */}
        <div className="border-t border-gray-100 pt-10 text-center space-y-4">
          <h3 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide">
            সরাসরি আমাদের সাথে কথা বলতে চান?
          </h3>
          <p className="text-sm text-gray-600 font-medium max-w-md mx-auto">
            আমাদের কাস্টমার কেয়ার এক্সিকিউটিভরা আপনার যেকোনো সমস্যার তাৎক্ষণিক সমাধানে প্রস্তুত।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a 
              href="tel:+8809611576269"
              className="w-full sm:w-auto bg-[#1a1a2e] hover:bg-[#2c2769] text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Phone size={16} /> কল করুন: +৮৮০৯৬১১৫৭৬২৬৯
            </a>
            <Link 
              href="/contact"
              className="w-full sm:w-auto bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={16} /> টিকিট বা মেসেজ পাঠান
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}