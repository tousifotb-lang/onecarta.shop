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
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className={`${cat.color} rounded-2xl p-3 flex flex-col items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 group`}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">
              {cat.icon}
            </span>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}