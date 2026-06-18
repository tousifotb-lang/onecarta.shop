"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, ShieldCheck, Truck, AlertCircle } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button & Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1a1a2e] border-b-2 border-gray-100 pb-5 uppercase">
            Return & Refund Policy 🔄
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">Last Updated: June 2026</p>
        </div>

        {/* Quick Highlights Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <RotateCcw size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">7 Days Return</p>
              <p className="text-xs text-gray-500 font-medium">Easy return within 7 days</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">100% Refund</p>
              <p className="text-xs text-gray-500 font-medium">Full money back guarantee</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Free Pickup</p>
              <p className="text-xs text-gray-500 font-medium">For damaged or wrong items</p>
            </div>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-10 bg-gray-50/60 border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-xs">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ১. রিটার্ন পলিসি (Eligibility for Returns)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              আমরা ওয়ানকার্টায় কাস্টমার স্যাটিসফ্যাকশনকে সবচেয়ে বেশি প্রাধান্য দিই। ডেলিভারি পাওয়ার পর সর্বোচ্চ <strong className="text-gray-900">৭ দিনের মধ্যে</strong> আপনি প্রোডাক্ট রিটার্ন করতে পারবেন। তবে রিটার্ন করার জন্য নিচের শর্তগুলো প্রযোজ্য হবে:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 font-medium pl-4 sm:pl-10 space-y-2">
              <li>প্রোডাক্টটি সম্পূর্ণ অব্যবহৃত (Unused), ফ্রেশ এবং অক্ষত অবস্থায় থাকতে হবে।</li>
              <li>অরিজিনাল প্রোডাক্ট বক্স, ট্যাগ, ওয়ারেন্টি কার্ড এবং ইনভয়েস অবশ্যই সাথে থাকতে হবে।</li>
              <li>ভুল প্রোডাক্ট, সাইজ বা ড্যামেজড প্রোডাক্টের ক্ষেত্রে কোনো এক্সট্রা চার্জ ছাড়াই রিটার্ন নেওয়া হবে।</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ২. রিফান্ড পলিসি (Refund Process)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              আপনার রিটার্নকৃত প্রোডাক্টটি আমাদের অফিসে পৌঁছানোর পর কোয়ালিটি চেক করা হবে। প্রোডাক্টের সবকিছু ঠিকঠাক থাকলে সর্বোচ্চ <strong className="text-gray-900">৩ থেকে ৫ কার্যদিবসের (Working Days)</strong> মধ্যে রিফান্ড প্রসেস করা হবে।
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 font-medium pl-4 sm:pl-10 space-y-2">
              <li>বিকাশ/নগদ বা অনলাইন পেমেন্টের ক্ষেত্রে যে অ্যাকাউন্ট থেকে টাকা এসেছে, সেই নম্বরেই রিফান্ড প্রসেস করা হবে।</li>
              <li>ক্যাশ অন ডেলিভারির (COD) ক্ষেত্রে কাস্টমারের দেওয়া নির্দিষ্ট বিকাশ/নগদ বা ব্যাংক অ্যাকাউন্টে টাকা পাঠিয়ে দেওয়া হবে।</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ৩. যেসকল ক্ষেত্রে রিটার্ন প্রযোজ্য নয় (Non-Returnable Items)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              নিচের পরিস্থিতি বা প্রোডাক্টগুলোর ক্ষেত্রে আমরা রিটার্ন বা এক্সচেঞ্জ গ্রহণ করতে পারি না:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 font-medium pl-4 sm:pl-10 space-y-2">
              <li>প্রোডাক্ট বক্স বা ভেতরের কোনো এক্সেসরিজ/পলি হারিয়ে গেলে বা কোনোভাবে নষ্ট করলে।</li>
              <li>ক্লিয়ারেন্স সেল (Clearance Sale) বা স্পেশাল ধামাকা ডিসকাউন্টে কেনা কোনো প্রোডাক্ট।</li>
              <li>ডেলিভারি নেওয়ার পর ৭ দিন পার হয়ে যাওয়ার পর আমাদের সাথে যোগাযোগ করলে।</li>
            </ul>
          </section>

          {/* Important Note Box */}
          <div className="bg-amber-500/5 border-2 border-amber-500/20 p-5 rounded-2xl flex gap-4 text-amber-900">
            <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <div className="text-sm sm:text-base font-semibold leading-relaxed">
              <span className="font-black uppercase tracking-wider block mb-1 text-amber-800 text-base">বিশেষ দ্রষ্টব্য:</span>
              ডেলিভারি ম্যানের সামনেই প্রোডাক্ট চেক করে রিসিভ করার জন্য বিশেষভাবে অনুরোধ করা হচ্ছে। কোনো প্রকার বাহ্যিক ক্ষতি (Physical Damage) বা ভুল প্রোডাক্ট থাকলে ডেলিভারি ম্যানের সামনেই আমাদের হটলাইনে কল দিয়ে পার্সেলটি রিটার্ন করে দিন।
            </div>
          </div>

        </div>

        {/* Footer Contact */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500 font-medium">পলিসি নিয়ে কোনো প্রশ্ন থাকলে সরাসরি আমাদের সাপোর্ট টিমে যোগাযোগ করুন</p>
          <p className="text-base sm:text-lg font-black text-[#1a1a2e] tracking-wide">📞 01303223513 &nbsp;|&nbsp; ✉️ support@onecarta.shop</p>
        </div>

      </div>
    </div>
  );
}