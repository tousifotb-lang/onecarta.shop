"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Logo */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <img 
                src="/logo/logo.png" 
                alt="onecarta logo" 
                className="h-8 md:h-9 w-auto object-contain transition-transform hover:scale-105" 
              />
            </Link>

            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Bangladesh er number one online shopping destination. Quality
              products, best prices, fast delivery.
            </p>

            {/* 🛠️ [LINKED]: কাস্টম ফোল্ডার পাথ ও ৪টি সোশ্যাল লাইভ লিংক */}
            <div className="flex items-center gap-3 mt-4">
              {[
                { name: "Facebook", src: "/images/socials/fb.png", href: "https://www.facebook.com/onecarta" },
                { name: "Instagram", src: "/images/socials/instagram.png", href: "https://www.instagram.com/onecarta" },
                { name: "Linkedin", src: "/images/socials/linkedin.png", href: "https://www.linkedin.com/company/onecarta-com" },
                { name: "TikTok", src: "/images/socials/tiktok.png", href: "https://www.tiktok.com/@onecarta.comm" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 text-gray-300 hover:text-white hover:-translate-y-0.5 shadow-sm p-1.5 overflow-hidden border border-transparent hover:border-gray-700"
                >
                  <img
                    src={social.src}
                    alt={social.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        parent.className = "bg-gray-800 text-[10px] uppercase font-bold text-gray-400 flex items-center justify-center w-9 h-9 rounded-xl";
                        parent.innerText = social.name.substring(0, 2);
                      }
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-2 text-sm">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "Careers", href: "/careers" }, // 🛠️ [CONNECTED]: ক্যারিয়ার পেজটি এখানে কানেক্ট করা হলো ভাই
                { name: "Press", href: "#" },
                { name: "Blog", href: "/blog" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#a8a6d9] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Customer Service
            </h3>

            <ul className="space-y-2 text-sm">
              {[
                { name: "Help Center", href: "/help-center" }, // 🛠️ [CONNECTED]: হেল্প সেন্টার পেজটি এখানে কানেক্ট করা হলো ভাই
                { name: "Track My Order", href: "/track-order" },
                { name: "Returns & Refunds", href: "/return-policy" },
                { name: "Payment Methods", href: "/payment-methods" },
                { name: "Shipping Info", href: "/shipping-info" },
                { name: "FAQ", href: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#a8a6d9] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "#a8a6d9" }}
                />
                <span>Nawdapara, Rajshahi Sadar, Rajshahi 6000, Bangladesh</span>
              </li>

              <li className="flex items-center gap-2">
                <Phone
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: "#a8a6d9" }}
                />
                <span>+8801303223513 (10am - 10pm)</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: "#a8a6d9" }}
                />
                <span>support@onecarta.shop</span>
              </li>
            </ul>

            {/* We Accept Grid */}
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2.5 uppercase tracking-wider font-bold">We Accept</p>

              <div className="flex flex-wrap gap-2">
                {[
                  { name: "bKash", src: "/images/payments/bkash.png" },
                  { name: "Nagad", src: "/images/payments/nagad.png" },
                  { name: "Visa", src: "/images/payments/visa.png" },
                  { name: "MasterCard", src: "/images/payments/mastercard.png" },
                  { name: "COD", src: "/images/payments/cod.png" }
                ].map((m) => (
                  <div
                    key={m.name}
                    className="bg-white border border-gray-700/30 p-1 rounded-md flex items-center justify-center w-14 h-8 shadow-xs transition-transform hover:scale-105 overflow-hidden"
                  >
                    <img
                      src={m.src}
                      alt={m.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          parent.className = "bg-gray-800 border border-gray-700 text-[10px] px-1.5 py-1 rounded text-gray-300 font-bold flex items-center justify-center w-14 h-8";
                          parent.innerText = m.name;
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-main py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 Onecarta. All rights reserved.</p>

          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-[#a8a6d9] transition-colors">
              Privacy Policy
            </Link>

            <Link href="/terms-conditions" className="hover:text-[#a8a6d9] transition-colors">
              Terms & Conditions
            </Link>

            <Link href="#" className="hover:text-[#a8a6d9]">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}