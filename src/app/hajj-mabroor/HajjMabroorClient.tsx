"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Seo from "@/components/Seo";
import { storeApi } from "@/lib/api";

import SacredStepsHero from "@/components/SacredStepsHero";
import HajjPackagesLayer from "@/components/HajjPackagesLayer";
import HajjKitDetails, { HAJJ_KIT_HANDLE, HAJJ_KIT_QUERY_KEY } from "@/components/HajjKitDetails";

const HajjMabroor = () => {
  useEffect(() => {
    if (window.location.hash === "#whats-inside-kit") {
      setTimeout(() => {
        document
          .getElementById("whats-inside-kit")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  const goToKit = () => {
    const el = document.getElementById("whats-inside-kit");
    if (!el) return;
    const headerOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Live kit stats
  const { data } = useQuery({
    queryKey: HAJJ_KIT_QUERY_KEY,
    queryFn: () => storeApi.getProductsByCategoryHandle(HAJJ_KIT_HANDLE),
    staleTime: 1000 * 60 * 5,
  });

  const { kitCount, kitTotal } = useMemo(() => {
    const products: any[] = data?.products ?? [];
    // Count only mens-kit items for the default subtitle
    const mens = products.filter(
      (p) => !p.metadata?.kit_type || p.metadata.kit_type === "mens-kit"
    );
    const getBdt = (v: any) => {
      if (!v?.prices) return 0;
      const bdtPrices = v.prices
        .filter((p: any) => p.currency_code === "bdt")
        .map((p: any) => p.amount);
      if (bdtPrices.length > 0) {
        return Math.min(...bdtPrices);
      }
      return v.prices[0]?.amount ?? 0;
    };
    const total = mens.reduce((s, p) => s + getBdt(p.variants?.[0]), 0);
    return { kitCount: mens.length || 21, kitTotal: total || 4640 };
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Hajj Mabroor — Complete Hajj & Umrah Kit | Sunnah For Ummah"
        description="Explore our complete Hajj and Umrah packages — carefully curated essentials for a blessed journey."
        canonical="/hajj-mabroor"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 space-y-8">
        <SacredStepsHero onNavigateToKit={goToKit} />
        <HajjPackagesLayer onNavigateToKit={goToKit} />

        <section
          id="whats-inside-kit"
          className="py-16 md:py-20 bg-gradient-to-b from-background via-emerald-tint/20 to-secondary/30 rounded-3xl scroll-mt-24"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-4">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                What's Inside the Kit
              </h3>
              <p className="font-body text-sm md:text-base text-muted-foreground mt-3">
                {kitCount} premium items — Total value{" "}
                <span className="font-bold text-primary">৳{kitTotal.toLocaleString()}</span>
              </p>
              <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
            </div>
            <HajjKitDetails />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default HajjMabroor;

