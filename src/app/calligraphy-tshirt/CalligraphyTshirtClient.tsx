"use client";

import { useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import QuickViewDialog, { type QuickViewProduct } from "@/components/QuickViewDialog";
import { storeApi } from "@/lib/api";

import { dropShoulderProducts, newArrivalsProducts } from "@/data/products";

const staticProducts = [
  ...dropShoulderProducts,
  ...newArrivalsProducts.filter((p) => /t-?shirt|tee/i.test(p.name)),
];

function useCalligraphyTshirts() {
  return useQuery<QuickViewProduct[]>({
    queryKey: ["products-category", "calligraphy-shirts"],
    queryFn: async () => {
      const candidateHandles = [
        "calligraphy-shirts",
        "calligraphy-t-shirts",
        "calligraphy-tshirts",
        "shirts",
      ];

      for (const handle of candidateHandles) {
        try {
          const data = await storeApi.getProductsByCategoryHandle(handle);
          const products: any[] = data.products ?? [];
          if (products.length > 0) {
            return mapMedusaProducts(products);
          }
        } catch {
          // try next handle
        }
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

function mapMedusaProducts(products: any[]): QuickViewProduct[] {
  return products.map((p) => {
    const variants: any[] = p.variants ?? [];
    const sizes = variants
      .map((v: any) => {
        const sizeOpt = v.options?.find((o: any) =>
          ["s", "m", "l", "xl", "xxl"].includes(o.value?.toLowerCase())
        );
        return sizeOpt?.value ?? v.title;
      })
      .filter(Boolean);

    const gallery: string[] = p.images?.map((i: any) => i.url) ?? [];
    if (!gallery.length && p.thumbnail) gallery.push(p.thumbnail);

    const bdtPrices = variants[0]?.prices?.filter(
      (pr: any) => pr.currency_code === "bdt"
    ) ?? [];
    let price = 0;
    let originalPrice: number | undefined = undefined;
    if (bdtPrices.length > 0) {
      const amounts = bdtPrices.map((pr: any) => pr.amount);
      price = Math.min(...amounts);
      const maxPrice = Math.max(...amounts);
      if (maxPrice > price) {
        originalPrice = maxPrice;
      }
    } else {
      price = variants[0]?.prices?.[0]?.amount ?? 0;
    }

    return {
      id: p.id,
      name: p.title,
      price,
      originalPrice,
      description: p.description ?? p.subtitle,
      image: gallery[0] ?? "",
      backImage: gallery[1],
      images: gallery.length ? gallery : undefined,
      sizes: sizes.length ? sizes : undefined,
      slug: p.handle,
      handle: p.handle,
      variantId: variants.length === 1 ? variants[0].id : undefined,
      variants: variants.length > 1 ? variants : undefined,
    } satisfies QuickViewProduct;
  });
}

const QuickViewCard = ({
  product,
  onQuickView,
}: {
  product: QuickViewProduct;
  onQuickView: (p: QuickViewProduct) => void;
}) => (
  <div className="group/qv relative">
    <ProductCard {...product} />
    <button
      type="button"
      onClick={() => onQuickView(product)}
      className="absolute left-1/2 -translate-x-1/2 bottom-[5.5rem] md:bottom-[6rem] inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-background/90 backdrop-blur border border-emerald-tint text-foreground text-xs font-body font-semibold uppercase tracking-widest opacity-0 translate-y-2 group-hover/qv:opacity-100 group-hover/qv:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary z-[3] shadow-md"
      aria-label={`Quick view ${product.name}`}
    >
      <Eye className="w-3.5 h-3.5" /> Quick View
    </button>
  </div>
);

const CalligraphyTshirt = () => {
  const [active, setActive] = useState<QuickViewProduct | null>(null);
  const [open, setOpen] = useState(false);

  const { data: liveProducts, isLoading } = useCalligraphyTshirts();

  const displayProducts =
    liveProducts && liveProducts.length > 0 ? liveProducts : staticProducts;

  const handleQuickView = (p: QuickViewProduct) => {
    setActive(p);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Calligraphy T-Shirts | Sunnah for Ummah"
        description="Wearable Arabic calligraphy on premium cotton tees — the complete Calligraphy T-Shirt collection."
        type="website"
      />
      <Header />

      <section className="relative overflow-hidden border-b border-emerald-tint/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.18),_transparent_60%)]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block uppercase tracking-[0.4em] text-[11px] font-body font-semibold text-accent mb-4">
            Men's · Calligraphy Series
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary tracking-tight">
            Calligraphy T-Shirts
          </h1>
          <p className="mt-4 max-w-2xl mx-auto font-body text-sm md:text-lg text-muted-foreground">
            Hand-rendered Arabic calligraphy printed on premium cotton — wear your deen with elegance.
          </p>
          <p className="mt-6 inline-block font-body text-xs uppercase tracking-[0.35em] text-emerald-light">
            Sunnah: The Legacy of the Best.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-xl aspect-[4/5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {displayProducts.map((p) => (
              <QuickViewCard key={p.id ?? p.name} product={p} onQuickView={handleQuickView} />
            ))}
          </div>
        )}
      </section>

      <Footer />
      <WhatsAppFloat />
      <QuickViewDialog product={active} open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default CalligraphyTshirt;
