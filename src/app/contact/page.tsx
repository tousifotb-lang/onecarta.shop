"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🛠️ পরবর্তীতে এখানে আপনার API বা মেসেজ সাবমিশন লজিক কানেক্ট করতে পারবেন ভাই
    console.log("Form submitted:", formData);
    alert("আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে! আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।");
    setFormData({ name: "", email: "", phone: "", message: "" });
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
            Contact Us ✉️
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">We'd Love to Hear From You</p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Our Office</p>
              <p className="text-xs text-gray-500 font-medium leading-tight">Nawdapara, Rajshahi Sadar</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Call Us</p>
              <p className="text-xs text-gray-500 font-medium">+8809611576269</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-gray-900">Email Support</p>
              <p className="text-xs text-gray-500 font-medium break-all">support@onecarta.shop</p>
            </div>
          </div>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 bg-gray-50/60 border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-xs">
          
          {/* Contact Form Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
                <MessageSquare size={22} /> আমাদের মেসেজ পাঠান (Send Message)
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                আপনার যেকোনো জিজ্ঞাসা, কমপ্লেইন বা সাজেশনের জন্য নিচের ফর্মটি পূরণ করে সাবমিট করুন।
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-[#1a1a2e] transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-[#1a1a2e] transition-colors"
                    placeholder="017XXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">ইমেইল অ্যাড্রেস</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-[#1a1a2e] transition-colors"
                  placeholder="example@mail.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">আপনার মেসেজ *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-[#1a1a2e] transition-colors resize-none"
                  placeholder="এখানে আপনার মেসেজটি বিস্তারিত লিখুন..."
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1a1a2e] hover:bg-[#2c2769] text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                Send Message <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom Note */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500 font-medium">সরাসরি কথা বলতে আমাদের হটলাইনে কল করুন (সকাল ১০টা - রাত ১০টা)</p>
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