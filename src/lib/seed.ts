import connectDB from "./mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

const categories = [
  { name: "Electronics", slug: "electronics", icon: "💻", image: "" },
  { name: "Fashion", slug: "fashion", icon: "👗", image: "" },
  { name: "Home & Living", slug: "home-living", icon: "🏠", image: "" },
  { name: "Groceries", slug: "groceries", icon: "🛒", image: "" },
  { name: "Sports", slug: "sports", icon: "⚽", image: "" },
  { name: "Beauty", slug: "beauty", icon: "💄", image: "" },
  { name: "Toys", slug: "toys", icon: "🧸", image: "" },
  { name: "Books", slug: "books", icon: "📚", image: "" },
];

const products = [
  {
    name: "Samsung Galaxy A55 5G",
    slug: "samsung-galaxy-a55-5g",
    description: "6.6-inch Super AMOLED display, 50MP camera, 5000mAh battery",
    price: 42999, originalPrice: 49999, discount: 14,
    images: ["https://placehold.co/400x400/2c2769/white?text=Samsung+A55"],
    category: "electronics", brand: "Samsung",
    stock: 50, sold: 120, rating: 4.5, reviewCount: 89,
    tags: ["smartphone", "5g", "samsung"],
    isActive: true, isFeatured: true, isFlashSale: false,
  },
  {
    name: "Apple iPhone 15",
    slug: "apple-iphone-15",
    description: "6.1-inch Super Retina XDR, A16 Bionic chip, 48MP camera",
    price: 119999, originalPrice: 129999, discount: 8,
    images: ["https://placehold.co/400x400/2c2769/white?text=iPhone+15"],
    category: "electronics", brand: "Apple",
    stock: 30, sold: 200, rating: 4.8, reviewCount: 156,
    tags: ["iphone", "apple", "smartphone"],
    isActive: true, isFeatured: true, isFlashSale: true,
    flashSalePrice: 109999,
    flashSaleEnds: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    name: "Sony WH-1000XM5 Headphone",
    slug: "sony-wh-1000xm5",
    description: "Industry leading noise cancellation, 30hr battery",
    price: 28999, originalPrice: 35000, discount: 17,
    images: ["https://placehold.co/400x400/39378c/white?text=Sony+XM5"],
    category: "electronics", brand: "Sony",
    stock: 25, sold: 67, rating: 4.7, reviewCount: 43,
    tags: ["headphone", "sony", "noise-cancelling"],
    isActive: true, isFeatured: false, isFlashSale: true,
    flashSalePrice: 24999,
    flashSaleEnds: new Date(Date.now() + 12 * 60 * 60 * 1000),
  },
  {
    name: "Men's Casual Polo Shirt",
    slug: "mens-casual-polo-shirt",
    description: "100% cotton premium polo shirt, available in multiple colors",
    price: 799, originalPrice: 1200, discount: 33,
    images: ["https://placehold.co/400x400/2c2769/white?text=Polo+Shirt"],
    category: "fashion", brand: "RichMan",
    stock: 200, sold: 450, rating: 4.2, reviewCount: 234,
    tags: ["shirt", "men", "casual"],
    isActive: true, isFeatured: true, isFlashSale: true,
    flashSalePrice: 599,
    flashSaleEnds: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
  {
    name: "Women's Embroidery Kurti",
    slug: "womens-embroidery-kurti",
    description: "Beautiful hand-embroidered kurti, perfect for all occasions",
    price: 1299, originalPrice: 1800, discount: 28,
    images: ["https://placehold.co/400x400/39378c/white?text=Kurti"],
    category: "fashion", brand: "Aarong",
    stock: 150, sold: 320, rating: 4.6, reviewCount: 178,
    tags: ["kurti", "women", "embroidery"],
    isActive: true, isFeatured: true, isFlashSale: false,
  },
  {
    name: "Walton Frost-Free Refrigerator 350L",
    slug: "walton-refrigerator-350l",
    description: "Energy efficient, frost-free technology, 350 liter capacity",
    price: 52000, originalPrice: 60000, discount: 13,
    images: ["https://placehold.co/400x400/2c2769/white?text=Walton+Fridge"],
    category: "home-living", brand: "Walton",
    stock: 15, sold: 45, rating: 4.4, reviewCount: 32,
    tags: ["refrigerator", "walton", "home"],
    isActive: true, isFeatured: false, isFlashSale: false,
  },
  {
    name: "Bashundhara A4 Paper (500 sheets)",
    slug: "bashundhara-a4-paper",
    description: "High quality A4 printing paper, 80gsm, 500 sheets per ream",
    price: 550, originalPrice: 650, discount: 15,
    images: ["https://placehold.co/400x400/39378c/white?text=A4+Paper"],
    category: "groceries", brand: "Bashundhara",
    stock: 500, sold: 1200, rating: 4.3, reviewCount: 567,
    tags: ["paper", "office", "stationery"],
    isActive: true, isFeatured: false, isFlashSale: true,
    flashSalePrice: 450,
    flashSaleEnds: new Date(Date.now() + 8 * 60 * 60 * 1000),
  },
  {
    name: "Nike Air Max 270",
    slug: "nike-air-max-270",
    description: "Iconic Air Max sole, breathable mesh upper, all-day comfort",
    price: 12999, originalPrice: 15000, discount: 13,
    images: ["https://placehold.co/400x400/2c2769/white?text=Nike+Air+Max"],
    category: "sports", brand: "Nike",
    stock: 40, sold: 89, rating: 4.6, reviewCount: 67,
    tags: ["nike", "shoes", "sports"],
    isActive: true, isFeatured: true, isFlashSale: false,
  },
  {
    name: "Maybelline Fit Me Foundation",
    slug: "maybelline-fit-me-foundation",
    description: "Lightweight foundation, natural finish, SPF 18",
    price: 899, originalPrice: 1100, discount: 18,
    images: ["https://placehold.co/400x400/39378c/white?text=Foundation"],
    category: "beauty", brand: "Maybelline",
    stock: 80, sold: 234, rating: 4.4, reviewCount: 145,
    tags: ["makeup", "foundation", "beauty"],
    isActive: true, isFeatured: false, isFlashSale: true,
    flashSalePrice: 699,
    flashSaleEnds: new Date(Date.now() + 10 * 60 * 60 * 1000),
  },
  {
    name: "LEGO Classic Creative Bricks",
    slug: "lego-classic-creative-bricks",
    description: "790 pieces, multiple colors, endless creative possibilities",
    price: 4500, originalPrice: 5500, discount: 18,
    images: ["https://placehold.co/400x400/2c2769/white?text=LEGO"],
    category: "toys", brand: "LEGO",
    stock: 35, sold: 78, rating: 4.9, reviewCount: 56,
    tags: ["lego", "toys", "kids"],
    isActive: true, isFeatured: true, isFlashSale: false,
  },
];

async function seed() {
  await connectDB();
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Category.insertMany(categories);
  await Product.insertMany(products);
  console.log("✅ Seed complete! Categories:", categories.length, "Products:", products.length);
  process.exit(0);
}

seed().catch(console.error);