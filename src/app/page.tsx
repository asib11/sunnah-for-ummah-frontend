import Header from "@/components/Header";
import KineticHero from "@/components/KineticHero";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import NewArrivals from "@/components/NewArrivals";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <KineticHero />
        <TrustBadges />
        <CategoryGrid />
        <NewArrivals />
      </main>
      <Footer />
    </div>
  );
}
