"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, DollarSign, Smartphone, ShieldCheck, AlertCircle } from "lucide-react";

export default function PaymentMethods() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button & Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-[#1a1a2e] border-b-2 border-gray-100 pb-5 uppercase">
            Payment Methods 💳
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">Safe & Secure Transaction Guidelines</p>
        </div>

        {/* Quick Highlights Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Mobile Banking</p>
              <p className="text-xs text-gray-500 font-medium">bKash & Nagad active</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Cash On Delivery</p>
              <p className="text-xs text-gray-500 font-medium">Pay after checking parcel</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">SSL Secured</p>
              <p className="text-xs text-gray-500 font-medium">100% encrypted gateway</p>
            </div>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-10 bg-gray-50/60 border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-xs">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ১. ক্যাশ অন ডেলিভারি (Cash On Delivery - COD)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              ওয়ানকার্টায় আমরা সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা দিয়ে থাকি। এই নিয়মে আপনি অর্ডার প্লেস করার পর কোনো অগ্রিম পেমেন্ট ছাড়াই প্রোডাক্ট হাতে পাবেন। ডেলিভারি ম্যানের সামনে প্রোডাক্টটি দেখে ও চেক করে তারপর মূল্য পরিশোধ করতে পারবেন।
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ২. মোবাইল ব্যাংকিং (Mobile Financial Services - MFS)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              দ্রুত এবং ঝামেলাহীন কেনাকাটার জন্য আপনি আমাদের সিকিউর পেমেন্ট গেটওয়ের মাধ্যমে মোবাইল ব্যাংকিং ব্যবহার করে পেমেন্ট করতে পারবেন:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 font-medium pl-4 sm:pl-10 space-y-2">
              <li><strong>বিকাশ (bKash):</strong> চেকআউট পেজে বিকাশ সিলেক্ট করে আপনার নম্বর এবং ওটিপি (OTP) দিয়ে ইনস্ট্যান্ট পেমেন্ট করতে পারবেন।</li>
              <li><strong>নগদ (Nagad):</strong> একইভাবে নগদের অফিশিয়াল গেটওয়ে ব্যবহার করে অত্যন্ত নিরাপদে বিল পে করা সম্ভব।</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ৩. ডেবিট ও ক্রেডিট কার্ড (Card Payments)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              আমরা দেশী ও বিদেশী সব ধরনের প্রধান ব্যাংক কার্ড সাপোর্ট করি। আমাদের এনক্রিপ্টেড পেমেন্ট সিস্টেমে আপনি নিচের কার্ডগুলো ব্যবহার করতে পারবেন:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 font-medium pl-4 sm:pl-10 space-y-2">
              <li>ভিসা কার্ড (Visa)</li>
              <li>माস্টারকার্ড (MasterCard)</li>
              <li>ডিবিবিএল নেক্সটজিপে বা অন্যান্য লোকাল ব্যাংক কার্ড।</li>
            </ul>
          </section>

          {/* Important Note Box */}
          <div className="bg-amber-50/50 border-2 border-amber-500/20 p-5 rounded-2xl flex gap-4 text-amber-900">
            <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <div className="text-sm sm:text-base font-semibold leading-relaxed">
              <span className="font-black uppercase tracking-wider block mb-1 text-amber-800 text-base">নিরাপত্তা সতর্কতা:</span>
              ওয়ানকার্টা কাস্টমারের কোনো পিন (PIN) নম্বর, ওটিপি (OTP) বা কার্ডের পেছনের সিভিভি (CVV) কোড কখনোই জানতে চায় না বা সার্ভারে সেভ করে না। কোনো প্রতারক চক্র ওয়ানকার্টার নাম করে আপনার কাছে পিন বা ওটিপি চাইলে অনুগ্রহ করে তা প্রদান করবেন না।
            </div>
          </div>

        </div>

        {/* Footer Contact — মোবাইলে ১ লাইনে ফিক্সড */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500 font-medium">পেমেন্ট করতে কোনো সমস্যা বা ফেইলড হলে সরাসরি আমাদের সাপোর্ট লাইনে কল দিন</p>
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