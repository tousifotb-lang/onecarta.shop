"use client";

export default function PromoBanner() {
  return (
    /* 🛠️ ফিক্সড: hidden md:flex যোগ করা হয়েছে যাতে মোবাইলে পুরোপুরি হাইড থাকে এবং ডেস্কটপে দেখায় */
    <div className="hidden md:flex items-center justify-center bg-white rounded-3xl px-6 py-4 shadow-sm border border-gray-100/50">
      {[
        { title: "Free Delivery", subtitle: "Above ৳999", icon: "🚚" },
        { title: "Secure Payment", subtitle: "bKash, Nagad, COD", icon: "🔒" },
        { title: "Easy Returns", subtitle: "7-day return", icon: "↩️" },
      ].map((item, i) => (
        <div
          key={item.title}
          className={`flex items-center justify-center gap-3.5 flex-1 min-w-0 ${
            i !== 0 ? "border-l border-gray-100 pl-4 ml-4" : ""
          }`}
        >
          <span className="text-2xl flex-shrink-0 select-none">{item.icon}</span>
          <div className="min-w-0">
            <p className="text-xs font-black text-gray-800 tracking-tight leading-tight">{item.title}</p>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}