"use client";

import Link from "next/link";
import { ArrowLeft, Truck, Clock, ShieldCheck, MapPin, AlertCircle } from "lucide-react";

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button & Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-[#1a1a2e] border-b-2 border-gray-100 pb-5 uppercase">
            Shipping Info 🚛
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">Fast & Reliable Delivery Across Bangladesh</p>
        </div>

        {/* Quick Highlights Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Quick Delivery</p>
              <p className="text-xs text-gray-500 font-medium">2 - 5 Working Days</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">64 Districts</p>
              <p className="text-xs text-gray-500 font-medium">Nationwide coverage</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Secure Packing</p>
              <p className="text-xs text-gray-500 font-medium">Damage-proof bubble wrap</p>
            </div>
          </div>
        </div>

        {/* Shipping Content Sections */}
        <div className="space-y-10 bg-gray-50/60 border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-xs">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ১. ডেলিভারি চার্জ (Shipping Charges)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              ওয়ানকার্টায় আমরা অত্যন্ত সাশ্রয়ী মূল্যে সারা বাংলাদেশে প্রোডাক্ট ডেলিভারি নিশ্চিত করি। আমাদের বর্তমান শিপিং রেট নিচে দেওয়া হলো:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 font-medium pl-4 sm:pl-10 space-y-2">
              <li><strong>ঢাকার ভেতরে (Inside Dhaka):</strong> ৬০ টাকা</li>
              <li><strong>ঢাকার বাইরে (Outside Dhaka):</strong> ১২০ টাকা</li>
              <li>ক্যাম্পেইন বা বিশেষ কোনো অফারের ক্ষেত্রে নির্দিষ্ট শর্তে আমরা ফ্রি ডেলিভারি দিয়ে থাকি।</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ২. ডেলিভারির সময়সীমা (Delivery Timeline)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              অর্ডার কনফার্ম হওয়ার পর আমাদের নওদাপাড়া হেডকোয়ার্টার থেকে পার্সেলটি কুরিয়ারে হ্যান্ডওভার করা হয়:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 font-medium pl-4 sm:pl-10 space-y-2">
              <li><strong>ঢাকা ও রাজশাহী সিটির ভেতরে:</strong> সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়।</li>
              <li><strong>অন্যান্য জেলা ও থানা সদরে:</strong> কুরিয়ার সার্ভিসের রুট অনুযায়ী ৩ থেকে ৫ কার্যদিবস সময় লাগতে পারে।</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ৩. কুরিয়ার পার্টনার ও ট্র্যাকিং (Courier & Tracking)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              আপনার পার্সেলের সর্বোচ্চ নিরাপত্তা ও দ্রুত ডেলিভারির জন্য আমরা দেশের শীর্ষস্থানীয় লজিস্টিক পার্টনারদের (যেমন: Steadfast, Pathao) সাথে কাজ করি। আপনার অর্ডারটি শিপমেন্ট হওয়ার সাথে সাথে একটি ট্র্যাকিং নম্বর সহ এসএমএস চলে যাবে, যা দিয়ে আপনি আমাদের ওয়েবসাইট থেকেই লাইভ ট্র্যাক করতে পারবেন।
            </p>
          </section>

          {/* Important Note Box */}
          <div className="bg-amber-50/50 border-2 border-amber-500/20 p-5 rounded-2xl flex gap-4 text-amber-900">
            <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <div className="text-sm sm:text-base font-semibold leading-relaxed">
              <span className="font-black uppercase tracking-wider block mb-1 text-amber-800 text-base">গ্রাহকদের জন্য অনুরোধ:</span>
              প্রাকৃতিক দুর্যোগ, রাজনৈতিক পরিস্থিতি বা কুরিয়ারের অভ্যন্তরীণ সমস্যার কারণে কোনো কোনো সময় ডেলিভারি একটু বিলম্বিত হতে পারে। যেকোনো জরুরি আপডেটের জন্য আমাদের সাপোর্ট টিমের সাথে যোগাযোগ রাখতে পারেন।
            </div>
          </div>

        </div>

        {/* Footer Contact — মোবাইলে ১ লাইনে ফিক্সড */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500 font-medium">আপনার ডেলিভারি লোকেশন বা পার্সেল নিয়ে জানতে কল দিন</p>
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