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
              {/* 🎨 [UPDATED]: ফুটারে পুরোনো টেক্সট লোগো সরিয়ে আপনার পার্সোনাল ইমেজ লোগো বসানো হলো */}
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

            <div className="flex items-center gap-3 mt-4">
              {["f", "in", "tw", "yt"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-gray-800 hover:bg-[#2c2769] w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-xs font-bold text-gray-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-2 text-sm">
              {["About Us", "Contact Us", "Careers", "Press", "Blog"].map(
                (l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="hover:text-[#a8a6d9] transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Customer Service
            </h3>

            <ul className="space-y-2 text-sm">
              {[
                "Help Center",
                "Track My Order",
                "Returns & Refunds",
                "Payment Methods",
                "Shipping Info",
                "FAQ",
              ].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="hover:text-[#a8a6d9] transition-colors"
                  >
                    {l}
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
                <span>Dhaka, Bangladesh</span>
              </li>

              <li className="flex items-center gap-2">
                <Phone
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: "#a8a6d9" }}
                />
                <span>16500 (10am - 10pm)</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: "#a8a6d9" }}
                />
                <span>support@onecarta.com.bd</span>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">We Accept</p>

              <div className="flex flex-wrap gap-2">
                {["bKash", "Nagad", "Visa", "MasterCard", "COD"].map((m) => (
                  <span
                    key={m}
                    className="bg-gray-800 border border-gray-700 text-xs px-2 py-1 rounded text-gray-300"
                  >
                    {m}
                  </span>
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
            <Link href="#" className="hover:text-[#a8a6d9]">
              Privacy Policy
            </Link>

            <Link href="#" className="hover:text-[#a8a6d9]">
              Terms of Service
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