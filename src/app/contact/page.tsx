"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <div className="bg-gray-50/60 border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-xs">
          
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-[#1a1a2e] uppercase tracking-wide flex items-center gap-2">
                <MessageSquare size={22} /> আমাদের মেসেজ পাঠান (Send Message)
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                আপনার যেকোনো জিজ্ঞাসা, কমপ্লেইন বা সাজেশনের জন্য নিচের ফর্মটি পূরণ করে সাবমিট করুন।
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name & Phone Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Name Input */}
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder=" "
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block px-4 py-4 w-full text-sm font-medium text-gray-800 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-hidden focus:ring-0 focus:border-[#1a1a2e] peer transition-colors"
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-sm font-bold text-gray-400 bg-white px-2 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#1a1a2e] transition-all uppercase tracking-wider cursor-text"
                  >
                    আপনার নাম *
                  </label>
                </div>

                {/* Phone Input */}
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    required
                    placeholder=" "
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block px-4 py-4 w-full text-sm font-medium text-gray-800 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-hidden focus:ring-0 focus:border-[#1a1a2e] peer transition-colors"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute text-sm font-bold text-gray-400 bg-white px-2 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#1a1a2e] transition-all uppercase tracking-wider cursor-text"
                  >
                    ফোন নম্বর *
                  </label>
                </div>

              </div>

              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block px-4 py-4 w-full text-sm font-medium text-gray-800 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-hidden focus:ring-0 focus:border-[#1a1a2e] peer transition-colors"
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm font-bold text-gray-400 bg-white px-2 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#1a1a2e] transition-all uppercase tracking-wider cursor-text"
                >
                  ইমেইল অ্যাড্রেস
                </label>
              </div>

              {/* Message Input */}
              <div className="relative">
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder=" "
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="block px-4 py-4 w-full text-sm font-medium text-gray-800 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-hidden focus:ring-0 focus:border-[#1a1a2e] peer transition-colors resize-none"
                />
                <label
                  htmlFor="message"
                  className="absolute text-sm font-bold text-gray-400 bg-white px-2 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#1a1a2e] transition-all uppercase tracking-wider cursor-text"
                >
                  আপনার মেসেজ *
                </label>
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