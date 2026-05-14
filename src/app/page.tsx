import Header from "@/components/Header";
import KineticHero from "@/components/KineticHero";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import CalligraphyCollection from "@/components/CalligraphyCollection";
import NewArrivals from "@/components/NewArrivals";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <KineticHero />
        <TrustBadges />
        <CategoryGrid />
        <CalligraphyCollection />
        <NewArrivals />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
