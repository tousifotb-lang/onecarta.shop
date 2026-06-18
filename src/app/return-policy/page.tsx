"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, ShieldCheck, Truck, AlertCircle } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button & Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={14} /> Back to Shop
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1a1a2e] border-b border-gray-200 pb-4 uppercase">
            Return & Refund Policy 🔄
          </h1>
          <p className="text-xs text-gray-500 mt-2 italic">Last Updated: June 2026</p>
        </div>

        {/* Quick Highlights Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-gray-900">7 Days Return</p>
              <p className="text-[11px] text-gray-500">Easy return within 7 days</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-gray-900">100% Refund</p>
              <p className="text-[11px] text-gray-500">Full money back guarantee</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-gray-900">Free Pickup</p>
              <p className="text-[11px] text-gray-500">For damaged or wrong items</p>
            </div>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 bg-gray-50/50 border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xs">
          
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ১. রিটার্ন পলিসি (Eligibility for Returns)
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-0 sm:pl-6">
              আমরা ওয়ানকার্টায় কাস্টমার স্যাটিসফ্যাকশনকে সবচেয়ে বেশি প্রাধান্য দিই। ডেলিভারি পাওয়ার পর সর্বোচ্চ <strong>৭ দিনের মধ্যে</strong> আপনি প্রোডাক্ট রিটার্ন করতে পারবেন। তবে রিটার্ন করার জন্য নিচের শর্তগুলো প্রযোজ্য হবে:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 pl-4 sm:pl-10 space-y-1">
              <li>Anker Fast Charge বা আইফোনের মতো গ্যাজেট বা ফ্যাশন প্রোডাক্টটি সম্পূর্ণ অব্যবহৃত (Unused) এবং অক্ষত থাকতে হবে।</li>
              <li>অরিজিনাল প্রোডাক্ট বক্স, ট্যাগ, ওয়ারেন্টি充 কার্ড এবং ইনভয়েস সাথে থাকতে হবে।</li>
              <li>ভুল প্রোডাক্ট, সাইজ বা ড্যামেজড প্রোডাক্টের ক্ষেত্রে কোনো এক্সট্রা চার্জ ছাড়াই রিটার্ন নেওয়া হবে।</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ২. রিফান্ড পলিসি (Refund Process)
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-0 sm:pl-6">
              আপনার রিটার্নকৃত প্রোডাক্টটি আমাদের অফিসে পৌঁছানোর পর কোয়ালিটি চেক করা হবে। প্রোডাক্ট সব ঠিকঠাক থাকলে সর্বোচ্চ <strong>৩ থেকে ৫ কার্যদিবসের (Working Days)</strong> মধ্যে রিফান্ড প্রসেস করা হবে।
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 pl-4 sm:pl-10 space-y-1">
              <li>বিকাশ/নগদ বা অনলাইন পেমেন্টের ক্ষেত্রে যে নম্বর থেকে টাকা এসেছে, সেই নম্বরেই রিফান্ড দেওয়া হবে।</li>
              <li>ক্যাশ অন ডেলিভারির ক্ষেত্রে কাস্টমারের দেওয়া নির্দিষ্ট বিকাশ/নগদ বা ব্যাংক অ্যাকাউন্টে টাকা পাঠিয়ে দেওয়া হবে।</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ৩. যেসকল ক্ষেত্রে রিটার্ন প্রযোজ্য নয় (Non-Returnable Items)
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-0 sm:pl-6">
              নিচের পরিস্থিতি বা প্রোডাক্টগুলোর ক্ষেত্রে আমরা রিটার্ন বা এক্সচেঞ্জ গ্রহণ করতে পারি না:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 pl-4 sm:pl-10 space-y-1">
              <li>প্রোডাক্ট বক্স বা ভেতরের কোনো এক্সেসরিজ হারিয়ে গেলে বা নষ্ট করলে।</li>
              <li>ক্লিয়ারেন্স সেল (Clearance Sale) বা স্পেশাল ডিসকাউন্টে কেনা প্রোডাক্ট।</li>
              <li>ডেলিভারি নেওয়ার ৭ দিন পার হয়ে যাওয়ার পর যোগাযোগ করলে।</li>
            </ul>
          </section>

          {/* Important Note Box */}
          <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex gap-3 text-amber-800">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold uppercase tracking-wider block mb-1 text-amber-700">বিশেষ দ্রষ্টব্য:</span>
              ডেলিভারি ম্যানের সামনেই প্রোডাক্ট চেক করে রিসিভ করার জন্য অনুরোধ করা হচ্ছে। কোনো প্রকার বাহ্যিক ক্ষতি (Physical Damage) বা ভুল প্রোডাক্ট থাকলে আমাদের হটলাইনে কল দিয়ে পার্সেলটি রিটার্ন করে দিন।
            </div>
          </div>

        </div>

        {/* Footer Contact */}
        <div className="text-center mt-10 space-y-2">
          <p className="text-xs text-gray-500">পলিসি নিয়ে কোনো প্রশ্ন থাকলে সরাসরি আমাদের সাপোর্ট টিমে যোগাযোগ করুন</p>
          <p className="text-sm font-bold text-[#1a1a2e]">📞 01303223513 &nbsp;|&nbsp; ✉️ support@onecarta.shop</p>
        </div>

      </div>
    </div>
  );
}