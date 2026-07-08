"use client";

import { useState } from "react";
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Crown, Star } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
const product1 = "/assets/product-1.jpg";
const product4 = "/assets/product-4.jpg";
const product6 = "/assets/product-6.jpg";
const catPanjabi = "/assets/cat-panjabi.jpg";

type Panjabi = {
  id: string;
  name: string;
  tag: string;
  fabric: string;
  price: number;
  original?: number;
  image: string;
  accent: string; // hsl color
};

const PANJABIS: Panjabi[] = [
  {
    id: "noor-onyx",
    name: "Noor — Onyx Black",
    tag: "Signature",
    fabric: "Hand-loom Cotton Silk",
    price: 3490,
    original: 3990,
    image: product1,
    accent: "hsl(41 64% 56%)",
  },
  {
    id: "shahi-midnight",
    name: "Shahi — Midnight Navy",
    tag: "Limited",
    fabric: "Embroidered Pure Cotton",
    price: 2990,
    original: 3490,
    image: product4,
    accent: "hsl(159 58% 45%)",
  },
  {
    id: "rawda-sand",
    name: "Rawda — Warm Sand",
    tag: "Classic",
    fabric: "Breathable Soft Cotton",
    price: 2490,
    image: product6,
    accent: "hsl(30 35% 45%)",
  },
];

const PremiumPanjabiShowcase = () => {
  const [active, setActive] = useState(0);
  const { addToCart, isAdding } = useCart();
  const featured = PANJABIS[active];

  const handleAdd = () => {
    toast.info("Visit the product page to add this item to your cart.");
    window.dispatchEvent(new Event("open-cart"));
  };

  return (
    <section className="relative overflow-hidden border-y border-[hsl(41_64%_56%/0.18)] bg-gradient-to-b from-[hsl(35_25%_97%)] via-[hsl(40_28%_95%)] to-[hsl(35_25%_97%)]">
      {/* Ornamental backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 viewBox=%220 0 120 120%22><path fill=%22none%22 stroke=%22%23064E3B%22 stroke-width=%220.6%22 d=%22M60 4 L72 48 L116 60 L72 72 L60 116 L48 72 L4 60 L48 48 Z%22/></svg>')] bg-[length:120px_120px]"
      />
      <div
        aria-hidden
        className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, hsl(41 64% 56% / 0.35), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, hsl(157 86% 21% / 0.3), transparent 65%)" }}
      />

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        {/* Eyebrow header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[hsl(41_64%_56%)]" />
            <Crown className="w-4 h-4 text-[hsl(41_64%_56%)]" />
            <span className="font-body text-[11px] uppercase tracking-[0.5em] text-[hsl(157_86%_21%)]">
              The Royal Atelier
            </span>
            <Crown className="w-4 h-4 text-[hsl(41_64%_56%)]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[hsl(41_64%_56%)]" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-[hsl(157_86%_15%)] tracking-tight">
            Premium <span className="italic text-[hsl(41_64%_46%)]">Panjabi</span> Showcase
          </h2>
          <p className="mt-4 max-w-2xl mx-auto font-body text-sm md:text-base text-[hsl(157_30%_28%)]">
            Hand-tailored heirlooms in noble fabrics — woven for the days of celebration and the legacy of the best.
          </p>
        </div>

        {/* Stage: Featured + thumbnails */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Featured */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] md:aspect-[5/6] rounded-[28px] overflow-hidden bg-gradient-to-br from-[hsl(157_86%_21%)] via-[hsl(157_60%_15%)] to-[hsl(157_86%_10%)] shadow-[0_30px_80px_-30px_hsl(157_86%_15%/0.6)]">
              {/* gold frame */}
              <div className="absolute inset-3 rounded-[22px] border border-[hsl(41_64%_56%/0.45)] pointer-events-none z-20" />
              <div className="absolute inset-5 rounded-[18px] border border-[hsl(41_64%_56%/0.18)] pointer-events-none z-20" />

              {/* Corner crowns */}
              {([
                "top-4 left-4",
                "top-4 right-4 rotate-90",
                "bottom-4 left-4 -rotate-90",
                "bottom-4 right-4 rotate-180",
              ] as const).map((p) => (
                <Sparkles key={p} className={`absolute ${p} w-4 h-4 text-[hsl(41_64%_56%)] z-20`} />
              ))}

              {/* spotlight */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 35%, hsl(41 64% 56% / 0.18), transparent 60%)",
                }}
              />

              {/* product image (animated swap) */}
              <img
                key={featured.id}
                src={featured.image}
                alt={featured.name}
                className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-[1200ms] ease-out animate-fade-in"
              />

              {/* Tag pill */}
              <div className="absolute top-8 left-8 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(41_64%_56%)] text-[hsl(157_86%_12%)] text-[10px] font-body font-bold uppercase tracking-[0.25em] shadow-lg">
                <Crown className="w-3 h-3" /> {featured.tag}
              </div>

              {/* Price ribbon */}
              <div className="absolute bottom-8 left-8 right-8 z-30 flex items-end justify-between gap-4">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.35em] text-[hsl(41_64%_70%)]">
                    {featured.fabric}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-[hsl(35_30%_95%)] mt-1 leading-tight">
                    {featured.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[hsl(41_64%_56%)] text-[hsl(41_64%_56%)]"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  {featured.original && (
                    <p className="font-body text-xs line-through text-[hsl(41_30%_70%)]">
                      ৳{featured.original.toLocaleString()}
                    </p>
                  )}
                  <p className="font-display text-3xl md:text-4xl font-bold text-[hsl(41_64%_60%)] leading-none">
                    ৳{featured.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side: thumbnails + CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.4em] text-[hsl(157_86%_21%)] mb-3">
                Choose Your Heirloom
              </p>
              <div className="grid grid-cols-3 gap-3">
                {PANJABIS.map((p, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                        isActive
                          ? "border-[hsl(41_64%_56%)] shadow-[0_15px_40px_-15px_hsl(41_64%_46%/0.6)] scale-[1.03]"
                          : "border-[hsl(41_64%_56%/0.2)] hover:border-[hsl(41_64%_56%/0.6)] hover:scale-[1.02]"
                      }`}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          isActive
                            ? "bg-gradient-to-t from-[hsl(157_86%_15%/0.85)] via-transparent to-transparent opacity-100"
                            : "bg-[hsl(157_86%_15%/0.4)] opacity-100"
                        }`}
                      />
                      <span
                        className={`absolute bottom-2 left-2 right-2 font-body text-[9px] uppercase tracking-[0.18em] text-center leading-tight transition-all ${
                          isActive ? "text-[hsl(41_64%_70%)] font-bold" : "text-[hsl(35_25%_90%)]"
                        }`}
                      >
                        {p.name.split("—")[1]?.trim() || p.tag}
                      </span>
                      {isActive && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[hsl(41_64%_56%)] shadow-[0_0_8px_hsl(41_64%_56%)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lifestyle card */}
            <div
              className="relative overflow-hidden rounded-2xl border border-[hsl(41_64%_56%/0.25)] p-5 md:p-6 bg-gradient-to-br from-[hsl(35_25%_98%)] to-[hsl(40_28%_94%)]"
            >
              <div
                aria-hidden
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20"
                style={{ background: `radial-gradient(circle, ${featured.accent}, transparent 70%)` }}
              />
              <div className="relative">
                <p className="font-body text-[10px] uppercase tracking-[0.35em] text-[hsl(41_64%_46%)] mb-2">
                  Crafted With Care
                </p>
                <h4 className="font-display text-xl md:text-2xl font-semibold text-[hsl(157_86%_15%)] leading-tight">
                  Tailored for the days of <span className="italic">celebration</span>.
                </h4>
                <ul className="mt-4 space-y-2 font-body text-[12px] text-[hsl(157_30%_25%)]">
                  {[
                    "Hand-finished embroidery on chest & cuff",
                    "Premium mother-of-pearl button placket",
                    "Pre-washed, pre-shrunk · ready to wear",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[hsl(41_64%_56%)] mt-0.5 shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="group/btn inline-flex items-center gap-2 bg-[hsl(157_86%_21%)] text-[hsl(35_30%_96%)] pl-5 pr-2 py-2 rounded-full text-xs font-body font-semibold uppercase tracking-[0.2em] hover:bg-[hsl(157_86%_15%)] transition-all shadow-lg shadow-[hsl(157_86%_15%/0.3)]"
                  >
                    Add to Cart
                    <span className="w-7 h-7 rounded-full bg-[hsl(41_64%_56%)] text-[hsl(157_86%_15%)] flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                  <Link
                    href="/panjabi-collection"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[hsl(157_86%_21%/0.3)] text-[hsl(157_86%_18%)] text-xs font-body font-semibold uppercase tracking-[0.2em] hover:border-[hsl(41_64%_56%)] hover:text-[hsl(41_64%_40%)] transition-all"
                  >
                    Full Collection
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Trust strip */}
            <div className="flex items-center justify-between gap-4 px-2">
              {[
                { k: "1000+", v: "Happy Wearers" },
                { k: "4.9★", v: "Avg. Rating" },
                { k: "7 Day", v: "Easy Return" },
              ].map((s) => (
                <div key={s.v} className="text-center flex-1">
                  <p className="font-display text-lg md:text-xl font-bold text-[hsl(157_86%_15%)]">
                    {s.k}
                  </p>
                  <p className="font-body text-[9px] uppercase tracking-[0.25em] text-[hsl(157_30%_35%)]">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumPanjabiShowcase;


