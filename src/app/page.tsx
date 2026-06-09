import type { Metadata } from "next";
import Header from "@/components/Header";
import CinematicPanjabiHero from "@/components/CinematicPanjabiHero";
import KineticHero from "@/components/KineticHero";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import CalligraphyTshirts from "@/components/CalligraphyTshirts";
import NewArrivals from "@/components/NewArrivals";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MobileCartBar from "@/components/MobileCartBar";

export const metadata: Metadata = {
  title: "Sunnah for Ummah — Premium Islamic Clothing, Thobe, Panjabi & Attar",
  description:
    "Shop premium Islamic clothing: thobes, panjabis, dawah t-shirts, hijabs, attar perfume oils and Hajj essentials. SUNNAH: THE LEGACY OF THE BEST.",
  openGraph: {
    type: "website",
    title: "Sunnah for Ummah — Premium Islamic Clothing, Thobe, Panjabi & Attar",
    description:
      "Shop premium Islamic clothing: thobes, panjabis, dawah t-shirts, hijabs, attar perfume oils and Hajj essentials.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CinematicPanjabiHero />
      <KineticHero />
      <TrustBadges />
      <CategoryGrid />
      <CalligraphyTshirts />
      <NewArrivals />
      <NewsletterSignup />
      <Footer />
      <WhatsAppFloat />
      <MobileCartBar />
    </div>
  );
}
