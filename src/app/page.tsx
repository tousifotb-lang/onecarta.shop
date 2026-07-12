import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ProductSection from "@/components/home/FeaturedProducts";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";

export default function HomePage() {
  return (
    <div className="container-main py-6 space-y-10">
      {/* Hero Banner — Auto sliding */}
      <HeroBanner />

      {/* Shop by Category */}
      <CategoryGrid />

      {/* Flash Sale with Countdown */}
      <FlashSaleSection />

      {/* Featured Products */}
      <ProductSection
        title="Featured Products"
        tag="featured"
        viewAllHref="/products?tag=featured"
      />

      {/* Best Selling */}
      <ProductSection
        title="Best Selling"
        tag="best-selling"
        viewAllHref="/products?tag=best-selling"
      />

      {/* Recently Restocked — hidden entirely if nothing has been restocked recently */}
      <ProductSection
        title="Recently Restocked"
        tag="restocked"
        viewAllHref="/products?tag=restocked"
        // hideWhenEmpty prop removed to match ProductSection props
      />

      {/* Recently Viewed — shopper's own browsing history (localStorage) */}
      <RecentlyViewedSection />
    </div>
  );
}