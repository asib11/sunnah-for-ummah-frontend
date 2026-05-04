"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, Star, CheckCircle2, Loader2, ShoppingCart } from "lucide-react";
import HajjKitDetails from "./HajjKitDetails";
import { storeApi } from "@/lib/api";
import { getProductPrices } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import hajjHeroBg from "@/assets/hajj-hero-bg.jpg";

// Fallback images for packages if no thumbnail is provided in Medusa
import pkgHajjCombo from "@/assets/pkg-hajj-combo.jpg";
import pkgHajjMen from "@/assets/pkg-hajj-men.jpg";
import pkgHajjMenPremium from "@/assets/pkg-hajj-men-premium.jpg";
import pkgHajjWomen from "@/assets/pkg-hajj-women.jpg";

const PACKAGES_HANDLE = "packages";

const fallbackImages = [
  pkgHajjCombo,
  pkgHajjMen,
  pkgHajjMenPremium,
  pkgHajjWomen,
];

const HajjPackages = () => {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  // ── Fetch Packages from Medusa ──────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["packages_category", PACKAGES_HANDLE],
    queryFn: () => storeApi.getProductsByCategoryHandle(PACKAGES_HANDLE),
    staleTime: 1000 * 60 * 5,
  });

  const apiProducts = data?.products ?? [];

  // ── Map Medusa products to the component's Package structure ────────────
  const displayPackages = useMemo(() => {
    return apiProducts.map((p: any, idx: number) => {
      const { price, oldPrice } = getProductPrices(p);
      
      return {
        id: p.id,
        title: p.title,
        bangla: p.metadata?.bn_name || p.title,
        price: price,
        oldPrice: oldPrice,
        badge: p.metadata?.badge,
        image: p.thumbnail || fallbackImages[idx % fallbackImages.length].src,
        handle: p.handle,
        variantId: p.variants?.[0]?.id,
      };
    });
  }, [apiProducts]);

  const handleSelectPackage = async (pkg: any) => {
    if (!pkg.variantId) {
      toast.error("This package is currently unavailable.");
      return;
    }

    try {
      setAddingId(pkg.id);
      await addToCart({ variantId: pkg.variantId, quantity: 1 });
      toast.success(`${pkg.title} added to cart!`, {
        description: "You can view it in your shopping cart.",
        icon: <ShoppingCart className="w-4 h-4 text-emerald-500" />,
      });
    } catch (error) {
      console.error("Error adding package to cart:", error);
      toast.error("Failed to add package to cart. Please try again.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="relative">
      {/* Hero banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hajjHeroBg.src}
            alt="Pilgrims at the Kaaba in Mecca"
            loading="lazy"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/85" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-accent/60 bg-primary/30 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-body text-sm font-medium text-accent">
              সম্পূর্ণ হজ্জ ও উমরাহ সামগ্রী
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mt-6 leading-tight">
            Hajj Mabroor
          </h2>
          <p className="font-display text-3xl md:text-5xl text-accent mt-2 italic">
            হজ্জ মাবরূর
          </p>

          <p className="font-body text-base md:text-lg text-primary-foreground/90 mt-6 max-w-2xl mx-auto leading-relaxed">
            Everything you need for a blessed journey — carefully curated,
            quality-assured, and packed in one convenient kit.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="font-display text-3xl md:text-5xl font-bold text-accent">21+</span>
              <span className="font-body text-xs md:text-sm text-primary-foreground/80 mt-1">Essential Items</span>
            </div>
            <div className="flex flex-col items-center border-x border-primary-foreground/20">
              <span className="font-display text-3xl md:text-5xl font-bold text-accent">6</span>
              <span className="font-body text-xs md:text-sm text-primary-foreground/80 mt-1">Package Options</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 md:w-11 md:h-11 text-accent" strokeWidth={1.8} />
              <span className="font-body text-xs md:text-sm text-primary-foreground/80 mt-1">Quality Assured</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Inside the Kit */}
      <div className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What&apos;s Inside the Kit
            </h3>
            <p className="font-body text-sm md:text-base text-muted-foreground mt-3">
              Premium items curated for a blessed journey
            </p>
            <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
          </div>
          <HajjKitDetails />
        </div>
      </div>

      {/* Packages grid */}
      <div className="py-16 md:py-20 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Choose Your Package
            </h3>
            <p className="font-body text-sm md:text-base text-muted-foreground mt-3">
              Click a package to see details and place your order
            </p>
            <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : displayPackages.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No packages found in Medusa category <strong>&quot;packages&quot;</strong>.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {displayPackages.map((pkg) => {
                const savings = pkg.oldPrice ? pkg.oldPrice - pkg.price : 0;
                const isAdding = addingId === pkg.id;
                
                return (
                  <article
                    key={pkg.id}
                    className="group relative flex flex-col rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-500 hover:-translate-y-2 p-5 overflow-hidden"
                  >
                    {/* Geometric decorative shapes */}
                    <span className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rotate-12 bg-accent/15 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] group-hover:rotate-45 transition-transform duration-700" />
                    <span className="pointer-events-none absolute -bottom-10 -left-10 w-28 h-28 border-2 border-dashed border-primary/20 rounded-full group-hover:scale-110 transition-transform duration-700" />
                    <span
                      className="pointer-events-none absolute top-1/2 -right-3 w-6 h-6 bg-primary/20"
                      style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                    />
                    <span
                      className="pointer-events-none absolute bottom-20 right-4 w-3 h-3 bg-accent/60"
                      style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                    />

                    {pkg.badge && (
                      <span className="absolute top-4 left-4 z-20 font-body text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-accent text-accent-foreground shadow-md">
                        {pkg.badge}
                      </span>
                    )}

                    {/* Amoeba image with layered shape-shifting blobs */}
                    <div className="relative z-10 mx-auto w-full">
                      <div className="relative aspect-square">
                        <span className="amoeba-blob-bg pointer-events-none absolute -inset-5 bg-[linear-gradient(135deg,#7c3aed_0%,#3b82f6_45%,#ec4899_100%)] opacity-90 blur-[1px]" />
                        <span className="amoeba-blob-accent pointer-events-none absolute -top-5 -right-6 w-20 h-20 bg-[linear-gradient(135deg,#ec4899,#a855f7)] opacity-90 blur-[1px]" />
                        <span className="amoeba-blob-accent pointer-events-none absolute -bottom-5 -left-5 w-16 h-16 bg-[linear-gradient(135deg,#06b6d4,#3b82f6)] opacity-85 blur-[1px]" style={{ animationDelay: "-2s" }} />
                        <span className="amoeba-blob-accent pointer-events-none absolute top-1/2 -left-7 w-10 h-10 bg-[linear-gradient(135deg,#f472b6,#fb7185)] opacity-90" style={{ animationDelay: "-3.5s" }} />

                        <div className="amoeba-img relative w-full h-full overflow-hidden bg-muted ring-4 ring-white shadow-xl">
                          <img
                            src={pkg.image}
                            alt={pkg.title}
                            loading="lazy"
                            width={800}
                            height={800}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="relative z-10 flex flex-col flex-1 mt-5">
                      <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                        {pkg.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        {pkg.bangla}
                      </p>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="font-display text-2xl font-bold text-primary">
                          ৳{pkg.price.toLocaleString()}
                        </span>
                        {pkg.oldPrice && (
                          <span className="font-body text-sm text-muted-foreground line-through">
                            ৳{pkg.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {savings > 0 && (
                        <span className="mt-1 inline-flex items-center gap-1 font-body text-xs font-semibold text-accent">
                          <Check className="w-3 h-3" /> Save ৳{savings.toLocaleString()}
                        </span>
                      )}

                      <Button
                        className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold"
                        size="sm"
                        onClick={() => handleSelectPackage(pkg)}
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Adding...
                          </>
                        ) : (
                          "Select Package"
                        )}
                      </Button>
                      
                      <a 
                        href={`/products/${pkg.handle}`}
                        className="mt-2 text-center text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                      >
                        View Details
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HajjPackages;
