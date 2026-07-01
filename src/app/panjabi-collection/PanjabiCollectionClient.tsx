"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Crown, Star, Moon, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Seo from "@/components/Seo";
import { storeApi } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
const blueCollar = "/assets/panjabi-blue-collar.jpg";
const blueCuff = "/assets/panjabi-blue-cuff.jpg";
const whitePlacket = "/assets/panjabi-white-placket.jpg";
const whiteDetail = "/assets/panjabi-white-detail.jpg";
const whiteCollar = "/assets/panjabi-white-collar.jpg";

type Panjabi = {
  id: string;
  variantId?: string;
  name: string;
  arabic: string;
  fabric: string;
  story: string;
  image: string;
  tag: string;
  price: number;
  originalPrice?: number;
};

// Static fallback shown until API responds
const STATIC_PANJABIS: Panjabi[] = [
  { id: "azraq-noor",  variantId: "", name: "Azraq Noor",      arabic: "أزرق النور",  fabric: "Hand-loom Cotton Silk · Slate Blue",   story: "Embroidered placket with mother-of-pearl buttons — inspired by the tiles of Isfahan.", image: blueCollar,   tag: "Signature", price: 4500, originalPrice: 5000 },
  { id: "azraq-shahi", variantId: "", name: "Azraq Shahi",     arabic: "أزرق شاهي",  fabric: "Premium Pure Cotton · Royal Blue",      story: "Cuff calligraphy stitched in silver thread — a quiet echo of Andalusia.",             image: blueCuff,     tag: "Royal",     price: 4500, originalPrice: 5000 },
  { id: "abyad-haram", variantId: "", name: "Abyad Al-Haram",  arabic: "أبيض الحرم", fabric: "Egyptian Cotton · Pure White",          story: "Pearl-white panjabi with silver embroidery — for the days of Jumu'ah and Eid.",       image: whitePlacket, tag: "Sacred",    price: 4500, originalPrice: 5000 },
  { id: "abyad-noor",  variantId: "", name: "Abyad Noor",      arabic: "أبيض النور",  fabric: "Egyptian Cotton · Ivory White",        story: "Sunnah-cut placket with Arabesque trim — modest, regal, timeless.",                  image: whiteDetail,  tag: "Heritage", price: 4500, originalPrice: 5000 },
  { id: "abyad-rawda", variantId: "", name: "Abyad Ar-Rawda",  arabic: "أبيض الروضة", fabric: "Hand-finished Cotton · Soft White",    story: "Embroidered collar with floral Khatm motif — a tribute to the gardens of Madinah.",  image: whiteCollar,  tag: "Limited",  price: 4500, originalPrice: 5000 },
];

const getBdtPrice = (variant: any): number => {
  if (!variant?.prices) return 0;
  const bdtPrices = variant.prices
    .filter((p: any) => p.currency_code === "bdt")
    .map((p: any) => p.amount);
  if (bdtPrices.length > 0) {
    return Math.min(...bdtPrices);
  }
  return variant.prices[0]?.amount ?? 0;
};

const medusaToPanjabi = (p: any, idx: number): Panjabi => {
  const fallback = STATIC_PANJABIS[idx % STATIC_PANJABIS.length];
  const variant = p.variants?.[0];
  const price = getBdtPrice(variant) || fallback.price;
  return {
    id: p.id,
    variantId: variant?.id,
    name: p.title,
    arabic: (p.metadata?.arabic as string) || fallback.arabic,
    fabric: p.subtitle || (p.metadata?.fabric as string) || fallback.fabric,
    story: p.description || fallback.story,
    image: p.thumbnail || p.images?.[0]?.url || fallback.image,
    tag: (p.metadata?.tag as string) || fallback.tag,
    price,
    originalPrice: p.metadata?.original_price ? Number(p.metadata.original_price) : undefined,
  };
};

const PanjabiCollection = () => {
  const { addToCart, isAdding } = useCart();
  const [active, setActive] = useState(0);

  // Fetch live Medusa products from 'punjabi' category
  const { data, isLoading } = useQuery({
    queryKey: ["products", "category", "punjabi"],
    queryFn: () => storeApi.getProductsByCategoryHandle("punjabi"),
    staleTime: 1000 * 60 * 5,
  });

  const PANJABIS: Panjabi[] = useMemo(() => {
    const apiProducts: any[] = data?.products ?? [];
    if (apiProducts.length === 0) return STATIC_PANJABIS;
    return apiProducts.map((p, i) => medusaToPanjabi(p, i));
  }, [data]);

  const safeActive = Math.min(active, Math.max(0, PANJABIS.length - 1));
  const featured = PANJABIS[safeActive];

  const handleAdd = (p: Panjabi) => {
    if (p.variantId) {
      addToCart({ variantId: p.variantId, quantity: 1 });
      toast.success("Added to cart", { description: `${p.name} · ৳${p.price.toLocaleString()}` });
    } else {
      toast.info(`Visit the store to order ${p.name}.`);
      window.dispatchEvent(new Event("open-cart"));
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(35_25%_97%)]">
      <Seo
        title="Panjabi & Kurta Collection — Islamic Heritage | Sunnah for Ummah"
        description="A heritage collection of premium panjabi and kurta — hand-embroidered, rooted in the rich Islamic tradition. 10% off across the entire collection."
        type="website"
      />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[hsl(157_86%_10%)] text-[hsl(35_30%_96%)]">
        {/* Background video — subtle, elegant */}
        <video
          src="/videos/panjabi-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Emerald wash for legibility */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[hsl(157_86%_10%)]/85 via-[hsl(157_86%_12%)]/70 to-[hsl(157_86%_15%)]/90"
        />
        {/* Soft vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, hsl(157 86% 8% / 0.6) 100%)" }}
        />
        {/* Islamic geometric pattern overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22 viewBox=%220 0 140 140%22><g fill=%22none%22 stroke=%22%23E8C97A%22 stroke-width=%220.7%22><path d=%22M70 5 L95 35 L130 45 L105 75 L115 110 L70 95 L25 110 L35 75 L10 45 L45 35 Z%22/><circle cx=%2270%22 cy=%2270%22 r=%2228%22/><circle cx=%2270%22 cy=%2270%22 r=%2218%22/></g></svg>')] bg-[length:160px_160px]"
        />
        {/* gold radial glow */}
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(41 64% 56% / 0.4), transparent 65%)" }}
        />


        <div className="container relative mx-auto px-4 pt-6 md:pt-8 pb-10 md:pb-12">
          <Link
            href="/eid-collection"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[hsl(41_64%_70%)] hover:text-[hsl(41_64%_56%)] transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Eid Collection
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[hsl(41_64%_56%)]" />
              <Moon className="w-4 h-4 text-[hsl(41_64%_56%)]" />
              <span className="font-display italic text-base text-[hsl(41_64%_70%)]" dir="rtl">
                البنجابي
              </span>
              <Moon className="w-4 h-4 text-[hsl(41_64%_56%)]" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[hsl(41_64%_56%)]" />
            </div>

            <p className="font-body text-[10px] uppercase tracking-[0.45em] text-[hsl(41_64%_70%)] mb-1.5">
              The Heritage Atelier · 1447 H
            </p>
            <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight leading-tight">
              Panjabi <span className="italic text-[hsl(41_64%_56%)]">&amp;</span> Kurta{" "}
              <span className="text-[hsl(41_64%_56%)]">Collection</span>
            </h1>

            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(41_64%_56%)]/10 border border-[hsl(41_64%_56%)]/40 backdrop-blur">
              <Sparkles className="w-3 h-3 text-[hsl(41_64%_56%)]" />
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-[hsl(41_64%_70%)]">
                Eid Blessing · 10% Off the entire collection
              </span>
            </div>
          </div>
        </div>

        {/* ornamental arch divider */}
        <svg
          className="absolute bottom-0 left-0 w-full text-[hsl(35_25%_97%)]"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60 L0 30 Q 60 0 120 30 T 240 30 T 360 30 T 480 30 T 600 30 T 720 30 T 840 30 T 960 30 T 1080 30 T 1200 30 T 1320 30 T 1440 30 L 1440 60 Z"
            fill="currentColor"
          />
        </svg>
      </section>

      {/* FEATURED STAGE */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Big featured */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-[hsl(157_86%_12%)] shadow-[0_40px_100px_-40px_hsl(157_86%_15%/0.7)]">
              {/* Gold frame */}
              <div className="absolute inset-3 rounded-[24px] border border-[hsl(41_64%_56%/0.45)] z-20 pointer-events-none" />
              <div className="absolute inset-5 rounded-[20px] border border-[hsl(41_64%_56%/0.18)] z-20 pointer-events-none" />

              {(["top-4 left-4", "top-4 right-4 rotate-90", "bottom-4 left-4 -rotate-90", "bottom-4 right-4 rotate-180"] as const).map(
                (p) => (
                  <Sparkles key={p} className={`absolute ${p} w-4 h-4 text-[hsl(41_64%_56%)] z-20`} />
                )
              )}

              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[hsl(157_86%_12%)]">
                  <Loader2 className="w-10 h-10 animate-spin text-[hsl(41_64%_56%)]" />
                </div>
              ) : (
                <img
                  key={featured.id}
                  src={featured.image}
                  alt={featured.name}
                  className="absolute inset-0 w-full h-full object-cover animate-fade-in"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(157_86%_10%/0.85)] via-transparent to-transparent" />

              <div className="absolute top-8 left-8 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(41_64%_56%)] text-[hsl(157_86%_12%)] text-[10px] font-body font-bold uppercase tracking-[0.25em] shadow-lg">
                <Crown className="w-3 h-3" /> {featured.tag}
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-30">
                <p className="font-display italic text-lg text-[hsl(41_64%_70%)]" dir="rtl">
                  {featured.arabic}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-[hsl(35_30%_96%)] mt-1">
                  {featured.name}
                </h2>
                <p className="mt-2 font-body text-[11px] uppercase tracking-[0.3em] text-[hsl(41_64%_70%)]">
                  {featured.fabric}
                </p>
                <p className="mt-3 font-body text-sm text-[hsl(35_25%_85%)] max-w-md leading-relaxed">
                  {featured.story}
                </p>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div className="flex items-end gap-3">
                    <span className="font-display text-4xl md:text-5xl font-bold text-[hsl(41_64%_60%)] leading-none">
                      ৳{featured.price.toLocaleString()}
                    </span>
                    {featured.originalPrice && (
                      <>
                        <span className="font-body text-sm line-through text-[hsl(41_30%_60%)] pb-1">
                          ৳{featured.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-body font-bold uppercase tracking-widest text-[hsl(157_86%_12%)] bg-[hsl(41_64%_56%)] px-2 py-1 rounded-full pb-1.5">
                          -{Math.round((1 - featured.price / featured.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleAdd(featured)}
                    className="group inline-flex items-center gap-2 bg-[hsl(41_64%_56%)] text-[hsl(157_86%_12%)] pl-5 pr-2 py-2 rounded-full text-xs font-body font-bold uppercase tracking-[0.2em] hover:bg-[hsl(41_64%_66%)] transition-all shadow-lg"
                  >
                    Add to Cart
                    <span className="w-7 h-7 rounded-full bg-[hsl(157_86%_15%)] text-[hsl(41_64%_56%)] flex items-center justify-center transition-transform group-hover:rotate-45">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side selector */}
          <div className="lg:col-span-5 space-y-3">
            <p className="font-body text-[11px] uppercase tracking-[0.4em] text-[hsl(157_86%_21%)] mb-4">
              Browse the Collection
            </p>
            {PANJABIS.map((p, i) => {
              const isActive = i === safeActive;
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(i)}
                  className={`w-full group flex items-center gap-4 p-3 rounded-2xl border transition-all duration-500 text-left ${
                    isActive
                      ? "border-[hsl(41_64%_56%)] bg-gradient-to-r from-[hsl(157_86%_15%)] to-[hsl(157_86%_21%)] text-[hsl(35_30%_96%)] shadow-[0_15px_40px_-15px_hsl(157_86%_15%/0.5)]"
                      : "border-[hsl(41_64%_56%/0.2)] bg-white hover:border-[hsl(41_64%_56%/0.5)] hover:bg-[hsl(35_25%_98%)]"
                  }`}
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    {isActive && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[hsl(41_64%_56%)] shadow-[0_0_8px_hsl(41_64%_56%)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display italic text-sm text-[hsl(41_64%_56%)]" dir="rtl">
                      {p.arabic}
                    </p>
                    <h3 className={`font-display text-base md:text-lg font-semibold leading-tight ${isActive ? "text-[hsl(35_30%_96%)]" : "text-[hsl(157_86%_15%)]"}`}>
                      {p.name}
                    </h3>
                    <p className={`font-body text-[10px] uppercase tracking-[0.2em] mt-0.5 ${isActive ? "text-[hsl(41_64%_70%)]" : "text-[hsl(157_30%_40%)]"}`}>
                      {p.tag}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-lg font-bold ${isActive ? "text-[hsl(41_64%_60%)]" : "text-[hsl(157_86%_18%)]"}`}>
                      ৳{p.price.toLocaleString()}
                    </p>
                    {p.originalPrice && (
                      <p className={`text-[9px] line-through ${isActive ? "text-[hsl(41_30%_70%)]" : "text-muted-foreground"}`}>
                        ৳{p.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FULL GRID */}
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-[hsl(35_25%_97%)] via-[hsl(40_28%_94%)] to-[hsl(35_25%_97%)]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><path fill=%22none%22 stroke=%22%23064E3B%22 stroke-width=%220.6%22 d=%22M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z%22/></svg>')] bg-[length:100px_100px]"
        />
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[hsl(41_64%_56%)]" />
              <Crown className="w-4 h-4 text-[hsl(41_64%_56%)]" />
              <span className="font-body text-[11px] uppercase tracking-[0.5em] text-[hsl(157_86%_21%)]">
                The Full Atelier
              </span>
              <Crown className="w-4 h-4 text-[hsl(41_64%_56%)]" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[hsl(41_64%_56%)]" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[hsl(157_86%_15%)] tracking-tight">
              Every Piece, A <span className="italic text-[hsl(41_64%_46%)]">Heritage</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {PANJABIS.map((p) => (
              <article
                key={p.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-[hsl(41_64%_56%/0.18)] shadow-[0_15px_50px_-25px_hsl(157_86%_15%/0.25)] hover:shadow-[0_25px_60px_-25px_hsl(157_86%_15%/0.4)] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[hsl(35_25%_94%)]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(41_64%_56%)] text-[hsl(157_86%_12%)] text-[9px] font-bold uppercase tracking-[0.2em]">
                    <Crown className="w-2.5 h-2.5" /> {p.tag}
                  </div>
                  {p.originalPrice && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[hsl(157_86%_15%)] text-[hsl(41_64%_60%)] text-[9px] font-bold uppercase tracking-[0.2em]">
                      -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="font-display italic text-base text-[hsl(41_64%_46%)]" dir="rtl">
                    {p.arabic}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-[hsl(157_86%_15%)] mt-0.5">
                    {p.name}
                  </h3>
                  <p className="font-body text-[10px] uppercase tracking-[0.25em] text-[hsl(157_30%_40%)] mt-1">
                    {p.fabric}
                  </p>

                  <div className="mt-3 flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[hsl(41_64%_56%)] text-[hsl(41_64%_56%)]" />
                    ))}
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      {p.originalPrice && (
                        <p className="font-body text-xs line-through text-muted-foreground">
                          ৳{p.originalPrice.toLocaleString()}
                        </p>
                      )}
                      <p className="font-display text-2xl font-bold text-[hsl(157_86%_15%)] leading-none">
                        ৳{p.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[hsl(157_86%_18%)] text-[hsl(35_30%_96%)] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[hsl(157_86%_12%)] transition-all"
                    >
                      <ShoppingBag className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HERITAGE STRIP */}
      <section className="bg-[hsl(157_86%_12%)] text-[hsl(35_30%_96%)] py-14">
        <div className="container mx-auto px-4 grid sm:grid-cols-3 gap-8 text-center">
          {[
            { ar: "صناعة يدوية", k: "Hand-Crafted", v: "Each stitch placed by master tailors" },
            { ar: "تراث", k: "Heritage Cuts", v: "Sunnah-inspired silhouettes" },
            { ar: "أصالة", k: "Pure Fabrics", v: "Egyptian cotton & hand-loom silk" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display italic text-xl text-[hsl(41_64%_60%)]" dir="rtl">
                {s.ar}
              </p>
              <p className="font-display text-lg font-bold mt-1">{s.k}</p>
              <p className="font-body text-xs text-[hsl(35_25%_75%)] uppercase tracking-[0.2em] mt-1">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default PanjabiCollection;

