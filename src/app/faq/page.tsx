"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "আমি কীভাবে ওয়ানকার্টায় অর্ডার করব?",
      a: "ওয়ানকার্টায় অর্ডার করা একদম সহজ! আপনার পছন্দের প্রোডাক্টের পেজে গিয়ে 'Buy Now' বা 'Add to Cart' বাটনে ক্লিক করুন। এরপর আপনার নাম, ফোন নম্বর এবং সঠিক ডেলিভারি ঠিকানা দিয়ে চেকআউট সম্পন্ন করলেই আপনার অর্ডারটি প্লেস হয়ে যাবে।"
    },
    {
      q: "ডেলিভারি চার্জ কত এবং কতদিন সময় লাগে?",
      a: "আমাদের ডেলিভারি চার্জ ঢাকার ভেতরে ৮০ টাকা এবং ঢাকার বাইরে ১২০ টাকা। সাধারণত ঢাকা ও রাজশাহী সিটির ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং অন্যান্য জেলায় ৩ থেকে ৫ কার্যদিবসের মধ্যে পার্সেল ডেলিভারি করা হয়।"
    },
    {
      q: "আমি কি পার্সেল চেক করে রিসিভ করতে পারব?",
      a: "জি অবশ্যই! ওয়ানকার্টায় আমরা শতভাগ ক্যাশ অন ডেলিভারি (COD) সুবিধা দিই। ডেলিভারি ম্যান থাকা অবস্থায় আপনি পার্সেলটি খুলে চেক করে তারপর পেমেন্ট করতে পারবেন।"
    },
    {
      q: "প্রোডাক্টে সমস্যা থাকলে রিটার্ন করার নিয়ম কী?",
      a: "যদি প্রোডাক্টে কোনো ডিফেক্ট বা সমস্যা থাকে, তবে ডেলিভারি পাওয়ার ৭ দিনের মধ্যে আমাদের সাপোর্ট লাইনে (+8809611576269) অথবা ইমেইলে যোগাযোগ করুন। আমরা সম্পূর্ণ ফ্রিতে প্রোডাক্টটি এক্সচেঞ্জ বা রিটার্ন করে দেব।"
    },
    {
      q: "আপনারা কি কি পেমেন্ট মেথড সাপোর্ট করেন?",
      a: "আমরা ক্যাশ অন ডেলিভারি (COD) ছাড়াও বিকাশ, নগদ এবং যেকোনো ব্যাংকের ভিসা বা মাস্টারকার্ডের মাধ্যমে সম্পূর্ণ নিরাপদ পেমেন্ট গেটওয়ে দিয়ে পেমেন্ট গ্রহণ করি।"
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button & Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-[#1a1a2e] border-b-2 border-gray-100 pb-5 uppercase">
            Frequently Asked Questions ❓
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">Common questions and helpful answers</p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 bg-gray-50/60 border border-gray-100 p-4 sm:p-8 rounded-3xl shadow-xs">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-black text-[#1a1a2e] text-sm sm:text-base hover:bg-gray-50/50 transition-colors focus:outline-hidden gap-4"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={20} className="text-[#1a1a2e]/60 flex-shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={18} className="flex-shrink-0" /> : <ChevronDown size={18} className="flex-shrink-0" />}
                </button>
                
                {isOpen && (
                  <div className="p-5 pt-0 border-t border-gray-50 text-sm sm:text-base text-gray-600 font-medium leading-relaxed animate-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Contact */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500 font-medium">আপনার প্রশ্নের উত্তর এখানে না পেলে সরাসরি যোগাযোগ করুন</p>
          <div className="flex items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-lg font-black text-[#1a1a2e] flex-nowrap whitespace-nowrap">
            <span>📞 +8809611576269</span>
            <span className="text-gray-300 font-normal">|</span>
            <span>✉️ support@onecarta.shop</span>
          </div>
        </div>

      </div>
    </div>
  );
}