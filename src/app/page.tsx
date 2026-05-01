import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import TrustBadges from "@/components/TrustBadges";
import HajjPackages from "@/components/HajjPackages";
import CategoryGrid from "@/components/CategoryGrid";
import NewArrivals from "@/components/NewArrivals";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <TrustBadges />
      <HajjPackages />
      <CategoryGrid />
      <NewArrivals />
      <Footer />
    </div>
  );
}
