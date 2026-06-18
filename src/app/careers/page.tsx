"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Mail, Sparkles, Send } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto text-center space-y-8">
        
        {/* Back button */}
        <div className="text-left">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#2c2769] transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>

        {/* Premium Announcement Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-xs space-y-6 relative overflow-hidden">
          
          {/* Decorative Sparkle Icon */}
          <div className="w-16 h-16 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-2xl flex items-center justify-center mx-auto mb-2 animate-pulse">
            <Briefcase size={32} />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1a1a2e] uppercase">
            Join Our Team 🚀
          </h1>
          
          <div className="w-16 h-1 bg-[#1a1a2e] mx-auto rounded-full"></div>

          <div className="space-y-4 text-base sm:text-lg text-gray-600 font-medium leading-relaxed pt-2">
            <p className="text-gray-900 font-black text-lg sm:text-xl">
              নমস্কার/সালাম! ওয়ানকার্টায় আপনার আগ্রহের জন্য ধন্যবাদ।
            </p>
            <p>
              এই মুহূর্তে আমাদের টিমে নতুন কোনো Vacancy ফাঁকা নেই। তবে আমরা সবসময়ই প্রতিভাবান ও কঠোর পরিশ্রমী মানুষদের সাথে কানেক্টেড থাকতে পছন্দ করি।
            </p>
            <p className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 text-sm sm:text-base text-amber-900 font-semibold">
              <Sparkles size={16} className="inline mr-1.5 text-amber-600 mb-0.5" />
              If you are still interested in joining us in the future, don't hesitate!
            </p>
            <p>
              আপনার আপডেট করা রিজিউমি/সিভি (CV) মেইল করে রাখুন আমাদের অফিশিয়াল ইনবক্সে:
            </p>
          </div>

          {/* Email Box Area */}
          <div className="pt-4">
            <a 
              href="mailto:info@onecarta.shop"
              className="inline-flex items-center gap-2.5 bg-[#1a1a2e] hover:bg-[#2c2769] text-white font-black text-sm sm:text-base tracking-wider px-6 sm:px-8 py-4 rounded-xl transition-all duration-200 shadow-md hover:-translate-y-0.5 group"
            >
              <Mail size={18} /> info@onecarta.shop <Send size={14} className="opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Good Luck Wish */}
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest pt-4 italic">
            — Best of Luck! ✨
          </p>

        </div>

        {/* Small Footer Info */}
        <p className="text-xs text-gray-400 font-medium">
          © 2026 Onecarta Ltd. Nawdapara, Rajshahi Sadar, Bangladesh.
        </p>

      </div>
    </div>
  );
}