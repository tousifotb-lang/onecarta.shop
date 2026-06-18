"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert, Scale, Landmark, AlertCircle } from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button & Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-[#1a1a2e] border-b-2 border-gray-100 pb-5 uppercase">
            Terms & Conditions 📜
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">Last Updated: June 2026</p>
        </div>

        {/* Quick Highlights Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Scale size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Legal Agreement</p>
              <p className="text-xs text-gray-500 font-medium">Terms of using Onecarta</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Data Privacy</p>
              <p className="text-xs text-gray-500 font-medium">100% secure user data</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Landmark size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Govt Policy</p>
              <p className="text-xs text-gray-500 font-medium">Compliant with BD laws</p>
            </div>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-10 bg-gray-50/60 border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-xs">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ১. সাধারণ নিয়মাবলী (General Terms)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              ওয়ানকার্টায় (`onecarta.shop`) আপনাকে স্বাগতম। এই ওয়েবসাইটটি ব্যবহার করার মাধ্যমে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন বলে গণ্য হবে। যদি আপনি এই শর্তাবলীতে দ্বিমত পোষণ করেন, তবে অনুগ্রহ করে সাইটটি ব্যবহার করা থেকে বিরত থাকুন। আমরা যেকোনো সময় পূর্ব নোটিশ ছাড়াই এই নিয়মাবলী পরিবর্তন করার অধিকার সংরক্ষণ করি।
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ২. অ্যাকাউন্ট ও নিরাপত্তা (User Account & Security)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              আমাদের সাইটে অর্ডার করার জন্য কাস্টমারকে সঠিক নাম, ফোন নম্বর এবং সঠিক ডেলিভারি অ্যাড্রেস প্রদান করতে হবে। আপনার অ্যাকাউন্টের পাসওয়ার্ড ও ক্রেডেন্সিয়ালের গোপনীয়তা রক্ষা করার দায়িত্ব সম্পূর্ণ আপনার। যেকোনো ভুয়া বা ফেক ইনফরমেশন দিয়ে অ্যাকাউন্ট তৈরি করা হলে ওয়ানকার্টা সেই অ্যাকাউন্টটি টার্মিনেট করার অধিকার রাখে।
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ৩. মূল্য এবং পেমেন্ট পলিসি (Pricing & Payments)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              ওয়েবসাইটে প্রদর্শিত প্রতিটি প্রোডাক্টের মূল্য বাংলাদেশ টাকায় (BDT) নির্ধারিত। ভুলবশত কোনো প্রোডাক্টের প্রাইস ভুল লিস্টিং হলে, অর্ডার প্লেস হওয়ার পরেও ওয়ানকার্টা সেই অর্ডারটি বাতিল বা সংশোধন করার ক্ষমতা রাখে। কাস্টমাররা ক্যাশ অন ডেলিভারি (COD), বিকাশ, নগদ বা কার্ডের মাধ্যমে পেমেন্ট করতে পারবেন।
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ৪. অর্ডার বাতিলকরণ (Order Cancellation)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              কোনো প্রোডাক্টের স্টক শেষ হয়ে গেলে অথবা কোনো অনিবার্য কারণে ওয়ানকার্টা যেকোনো অর্ডার বাতিল করার পূর্ণ অধিকার রাখে। এই ক্ষেত্রে কাস্টমার যদি অগ্রিম পেমেন্ট করে থাকেন, তবে সর্বোচ্চ ৭ কর্মদিবসের মধ্যে রিফান্ড দেওয়া হবে।
            </p>
          </section>

          {/* Important Note Box */}
          <div className="bg-amber-50/50 border-2 border-amber-500/20 p-5 rounded-2xl flex gap-4 text-amber-900">
            <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <div className="text-sm sm:text-base font-semibold leading-relaxed">
              <span className="font-black uppercase tracking-wider block mb-1 text-amber-800 text-base">আইনি নোটিশ:</span>
              এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের ই-কমার্স আইন ও ডিজিটাল কমার্স পরিচালনা নির্দেশিকা মোতাবেক পরিচালিত এবং ব্যাখ্যা করা হবে। যেকোনো অনাকাঙ্ক্ষিত আইনি বিবাদের ক্ষেত্রে ঢাকা আদালতের এখতিয়ার প্রযোজ্য হবে।
            </div>
          </div>

        </div>

        {/* Footer Contact — মোবাইলে ১ লাইনে ফিক্সড */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500 font-medium">শর্তাবলী নিয়ে কোনো জিজ্ঞাসা থাকলে আমাদের সাথে যোগাযোগ করুন</p>
          <div className="flex items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-lg font-black text-[#1a1a2e] flex-nowrap whitespace-nowrap">
            <span className="flex items-center gap-1">📞 01303223513</span>
            <span className="text-gray-300 font-normal">|</span>
            <span className="flex items-center gap-1">✉️ support@onecarta.shop</span>
          </div>
        </div>

      </div>
    </div>
  );
}