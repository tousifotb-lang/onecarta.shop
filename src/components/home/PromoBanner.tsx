export default function PromoBanner() {
  return (
    <div className="flex items-center justify-center bg-white rounded-xl px-3 py-3 shadow-sm">
      {[
        { title: "Free Delivery", subtitle: "Above ৳999", icon: "🚚" },
        { title: "Secure Payment", subtitle: "bKash, Nagad, COD", icon: "🔒" },
        { title: "Easy Returns", subtitle: "7-day return", icon: "↩️" },
      ].map((item, i) => (
        <div
          key={item.title}
          className={`flex items-center gap-2 flex-1 min-w-0 ${
            i !== 0 ? "border-l border-gray-100 pl-3 ml-3" : ""
          }`}
        >
          <span className="text-lg flex-shrink-0">{item.icon}</span>
          <div className="min-w-0 overflow-hidden">
            <p className="text-[11px] font-bold text-gray-800 truncate">{item.title}</p>
            <p className="text-[10px] text-gray-500 truncate">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}