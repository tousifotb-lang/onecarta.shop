import Link from "next/link";

const categories = [
  { name: "Electronics", slug: "electronics", icon: "💻", color: "bg-blue-50 hover:bg-blue-100" },
  { name: "Fashion", slug: "fashion", icon: "👗", color: "bg-pink-50 hover:bg-pink-100" },
  { name: "Home & Living", slug: "home-living", icon: "🏠", color: "bg-yellow-50 hover:bg-yellow-100" },
  { name: "Groceries", slug: "groceries", icon: "🛒", color: "bg-green-50 hover:bg-green-100" },
  { name: "Sports", slug: "sports", icon: "⚽", color: "bg-orange-50 hover:bg-orange-100" },
  { name: "Beauty", slug: "beauty", icon: "💄", color: "bg-rose-50 hover:bg-rose-100" },
  { name: "Toys", slug: "toys", icon: "🧸", color: "bg-purple-50 hover:bg-purple-100" },
  { name: "Books", slug: "books", icon: "📚", color: "bg-indigo-50 hover:bg-indigo-100" },
];

export default function CategoryGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold text-gray-800">Shop by Category</h2>
        <Link href="/products" className="text-sm text-[#2c2769] font-semibold hover:underline">
          View All →
        </Link>
      </div>
      
      {/* 🛠️ ফিক্সড: মোবাইলে নো-র‍্যাপ এবং ওয়ান-রো স্ক্রোলিং, ডেস্কটপে গ্রিড-৮ */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-8 md:overflow-x-visible scrollbar-hide snap-x snap-mandatory">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className={`${cat.color} rounded-2xl p-3 flex flex-col items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 group min-w-[85px] md:min-w-0 snap-center flex-shrink-0`}
          >
            <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">
              {cat.icon}
            </span>
            <span className="text-[11px] md:text-xs font-bold text-gray-700 text-center leading-tight whitespace-nowrap md:whitespace-normal">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}