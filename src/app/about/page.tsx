"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Users, Zap, Award } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button & Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-[#1a1a2e] border-b-2 border-gray-100 pb-5 uppercase">
            About Onecarta.com
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">Your Ultimate Shopping Destination</p>
        </div>

        {/* Brand Mission Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">100% Authentic</p>
              <p className="text-xs text-gray-500 font-medium">Genuine global brands</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Fast Delivery</p>
              <p className="text-xs text-gray-500 font-medium">Super swift shipping</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Happy Clients</p>
              <p className="text-xs text-gray-500 font-medium">Top tier customer support</p>
            </div>
          </div>
        </div>

        {/* Main Content Story */}
        <div className="space-y-10 bg-gray-50/60 border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-xs">
          
          {/* Section 1: Our Journey */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              আমাদের গল্প (Our Journey)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              ওয়ানকার্টা (`onecarta.shop`) বাংলাদেশের অন্যতম উঠতি এবং বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম। আধুনিক জীবনযাত্রার সাথে তাল মিলিয়ে গ্যাজেট, লাইফস্টাইল এবং নিত্যপ্রয়োজনীয় প্রিমিয়াম কোয়ালিটি প্রোডাক্ট কাস্টমারদের হাতের নাগালে পৌঁছে দেওয়ার লক্ষ্য নিয়েই আমাদের এই পথচলা শুরু। আমরা বিশ্বাস করি, অনলাইন কেনাকাটা শুধু প্রোডাক্ট পাওয়ার নাম নয়, এটি একটি চমৎকার অভিজ্ঞতার নাম।
            </p>
          </section>

          {/* Section 2: Why Choose Us */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              কেন ওয়ানকার্টা সেরা? (Why Choose Onecarta)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              অনলাইনে হাজারো অপশনের মাঝে ওয়ানকার্টা কাস্টমারদের সর্বোচ্চ সততা এবং স্বচ্ছতার নিশ্চয়তা দেয়:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 font-medium pl-4 sm:pl-10 space-y-2">
              <li><strong>সরাসরি সোর্সিং:</strong> কোনো থার্ড-পার্টি ভেন্ডর ছাড়া সরাসরি ব্র্যান্ড বা অফিশিয়াল ডিস্ট্রিবিউটর থেকে প্রোডাক্ট আনা হয়।</li>
              <li><strong>সহজ রিটার্ন সুবিধা:</strong> প্রোডাক্টে কোনো সমস্যা থাকলে ৭ দিনের ভেতর সহজ রিটার্ন পলিসি।</li>
              <li><strong>নিরাপদ পেমেন্ট:</strong> বিকাশ, নগদ বা ক্যাশ অন ডেলিভারিতে ঝামেলাহীন পেমেন্ট গেটওয়ে সুবিধা।</li>
            </ul>
          </section>

          {/* Section 3: Location and Origin */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              আমাদের অবস্থান (Our Roots)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              রাজশাহীর ঐতিহ্য এবং আধুনিক ই-কমার্স টেকনোলজির সমন্বয়ে ওয়ানকার্টা পরিচালিত হচ্ছে সরাসরি নওদাপাড়া, রাজশাহী সদর থেকে। আমরা দেশের যেকোনো প্রান্তে অত্যন্ত দ্রুততার সাথে পার্সেল ডেলিভারি নিশ্চিত করতে বদ্ধপরিকর।
            </p>
          </section>

          {/* Vision Box */}
          <div className="bg-[#1a1a2e]/5 border-2 border-[#1a1a2e]/10 p-5 rounded-2xl flex gap-4 text-gray-900">
            <Award size={24} className="flex-shrink-0 mt-0.5 text-[#1a1a2e]" />
            <div className="text-sm sm:text-base font-semibold leading-relaxed">
              <span className="font-black uppercase tracking-wider block mb-1 text-[#1a1a2e] text-base">আমাদের লক্ষ্য (Our Vision):</span>
              কোয়ালিটির সাথে কোনো আপস না করে বাংলাদেশের ১ নম্বর ই-কমার্স ডেস্টিনেশন হিসেবে নিজেদের প্রতিষ্ঠিত করা এবং দেশের ই-কমার্স সেক্টরে শতভাগ স্বচ্ছতা বজায় রাখা।
            </div>
          </div>

        </div>

        {/* Footer Contact */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500 font-medium">আমাদের সম্পর্কে বিস্তারিত জানতে বা ক্যারিয়ারের জন্য যোগাযোগ করুন</p>
          <div className="flex items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-lg font-black text-[#1a1a2e] flex-nowrap whitespace-nowrap">
            <span className="flex items-center gap-1">📞 +8809611576269</span>
            <span className="text-gray-300 font-normal">|</span>
            <span className="flex items-center gap-1">✉️ support@onecarta.shop</span>
          </div>
        </div>

      </div>
    </div>
  );
}