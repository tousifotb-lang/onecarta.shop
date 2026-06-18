"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button & Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-[#1a1a2e] border-b-2 border-gray-100 pb-5 uppercase">
            Privacy Policy 🛡️
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">Last Updated: June 2026</p>
        </div>

        {/* Quick Highlights Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Secure SSL</p>
              <p className="text-xs text-gray-500 font-medium">Encrypted data transfer</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Data Safety</p>
              <p className="text-xs text-gray-500 font-medium">Never sold to third-parties</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <EyeOff size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">No Spam</p>
              <p className="text-xs text-gray-500 font-medium">Only essential notifications</p>
            </div>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-10 bg-gray-50/60 border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-xs">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ১. তথ্য সংগ্রহ (Information We Collect)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              ওয়ানকার্টায় (`onecarta.shop`) অর্ডার করার সময় বা অ্যাকাউন্ট খোলার সময় আমরা কাস্টমারের কিছু প্রয়োজনীয় তথ্য সংগ্রহ করি। যেমন: নাম, ইমেল অ্যাড্রেস, ফোন নম্বর, ডেলিভারি ঠিকানা এবং ব্রাউজিং হিস্ট্রি। আপনার শপিং অভিজ্ঞতা আরও স্মুথ করতেই শুধুমাত্র এই তথ্যগুলো নেওয়া হয়।
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ২. তথ্যের ব্যবহার (How We Use Your Data)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              আপনার সংগৃহীত তথ্যগুলো আমরা মূলত নিচের কাজগুলোতে ব্যবহার করে থাকি:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 font-medium pl-4 sm:pl-10 space-y-2">
              <li>আপনার অর্ডার প্রসেস, প্যাকেজিং এবং সফলভাবে ডেলিভারি করার জন্য।</li>
              <li>অর্ডারের আপডেট বা ট্র্যাকিং ইনফরমেশন এসএমএস ও ইমেইলের মাধ্যমে জানানোর জন্য।</li>
              <li>ভবিষ্যতে কাস্টমার সাপোর্ট এবং যেকোনো কারিগরি সমস্যা দ্রুত সমাধান করার জন্য।</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ৩. ডেটা সিকিউরিটি ও পেমেন্ট (Data Security & Payments)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              আমরা আপনার ব্যক্তিগত তথ্যের সর্বোচ্চ নিরাপত্তা নিশ্চিত করি। আমাদের ওয়েবসাইটটি **SSL এনক্রিপশন** দ্বারা সুরক্ষিত, যা আপনার ব্রাউজার এবং আমাদের সার্ভারের মধ্যকার তথ্য আদান-প্রদানকে হ্যাকারদের থেকে নিরাপদ রাখে। তাছাড়া, বিকাশ, নগদ বা কার্ডের মাধ্যমে পেমেন্ট করার সময় আপনার পেমেন্ট ক্রেডেন্সিয়ালগুলো সরাসরি সিকিউর পেমেন্ট গেটওয়ে দ্বারা প্রসেস হয়, ওয়ানকার্টা কোনো কার্ড বা পিন নম্বর সেভ করে না।
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
              ৪. থার্ড-পার্টি ডিসক্লোজার (Third-Party Disclosure)
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed pl-0 sm:pl-6">
              আমরা কাস্টমারের কোনো ব্যক্তিগত ডেটা বা ফোন নম্বর কোনো থার্ড-পার্টি কোম্পানির কাছে বিক্রি, ট্রেড বা লিজ দিই না। তবে আপনার পার্সেলটি আপনার ঠিকানায় পৌঁছে দেওয়ার স্বার্থে শুধুমাত্র প্রয়োজনীয় তথ্য (নাম, ফোন নম্বর ও ঠিকানা) আমাদের রেজিস্টার্ড কুরিয়ার পার্টনারদের (যেমন: পাথao, স্টিডফাস্ট) সাথে শেয়ার করা হয়।
            </p>
          </section>

          {/* Important Note Box */}
          <div className="bg-amber-50/50 border-2 border-amber-500/20 p-5 rounded-2xl flex gap-4 text-amber-900">
            <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <div className="text-sm sm:text-base font-semibold leading-relaxed">
              <span className="font-black uppercase tracking-wider block mb-1 text-amber-800 text-base">কুকি পলিসি (Cookies):</span>
              আমাদের সাইটের পারফরম্যান্স ও ইউজার এক্সপেরিয়েন্স উন্নত করার জন্য আমরা কুকিজ (Cookies) ব্যবহার করতে পারি। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে যেকোনো সময় কুকিজ ডিজেবল করে রাখতে পারেন।
            </div>
          </div>

        </div>

        {/* Footer Contact — মোবাইলে ১ লাইনে ফিক্সড */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500 font-medium">প্রাইভেসি পলিসি নিয়ে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন</p>
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