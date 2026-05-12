"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ProductCard from "@/components/ProductCard";
import QuickViewDialog, { type QuickViewProduct } from "@/components/QuickViewDialog";
import {
  dropShoulderProducts as dropShoulder,
  baggyPantsProducts as baggyPants,
  newArrivalsProducts as newArrivals,
} from "@/data/products";

const SectionHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <div className="text-center mb-10">
    <span className="inline-block uppercase tracking-[0.4em] text-[11px] font-body font-semibold text-emerald-light mb-3">
      {eyebrow}
    </span>
    <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-3 max-w-2xl mx-auto font-body text-sm md:text-base text-muted-foreground">
        {subtitle}
      </p>
    )}
    <div className="mt-5 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
  </div>
);

const QuickViewCard = ({
  product,
  onQuickView,
}: {
  product: QuickViewProduct;
  onQuickView: (p: QuickViewProduct) => void;
}) => (
  <div className="group/qv relative">
    <ProductCard {...product as any} />
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

export default function EidCollection() {
  const [active, setActive] = useState<QuickViewProduct | null>(null);
  const [open, setOpen] = useState(false);

  const handleQuickView = (p: QuickViewProduct) => {
    setActive(p);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-emerald-tint/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.18),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(var(--accent)/0.08)_50%,transparent_70%)]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block uppercase tracking-[0.4em] text-[11px] font-body font-semibold text-accent mb-4">
            Eid 1447 · Limited Drop
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary tracking-tight">
            The Eid Collection
          </h1>
          <p className="mt-4 max-w-2xl mx-auto font-body text-sm md:text-lg text-muted-foreground">
            Drop shoulder calligraphy tees, baggy sweatpants and our newest arrivals — crafted for the days of celebration and the legacy of the best.
          </p>
          <p className="mt-6 inline-block font-body text-xs uppercase tracking-[0.35em] text-emerald-light">
            Sunnah: The Legacy of the Best.
          </p>
        </div>
      </section>

      {/* Drop Shoulder */}
      <section className="container mx-auto px-4 py-14" id="calligraphy-drop-shoulder">
        <SectionHeader
          eyebrow="Calligraphy Series"
          title="Drop Shoulder Tees"
          subtitle="Oversized silhouettes with hand-rendered Arabic calligraphy — front, back and studio editions."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {dropShoulder.map((p) => (
            <QuickViewCard key={p.name} product={p} onQuickView={handleQuickView} />
          ))}
        </div>
      </section>

      {/* Baggy Pants */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-tint/20 via-background to-background pointer-events-none" />
        <div className="container relative mx-auto px-4 py-14">
          <SectionHeader
            eyebrow="Comfort Fit"
            title="Baggy Sweatpants"
            subtitle="Relaxed, modest, and built for daily wear — in black, washed and pure white."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {baggyPants.map((p) => (
              <QuickViewCard key={p.name} product={p} onQuickView={handleQuickView} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-14">
        <SectionHeader
          eyebrow="Fresh In"
          title="New Arrivals"
          subtitle="The latest additions to the Sunnah For Ummah wardrobe."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((p) => (
            <QuickViewCard key={p.name} product={p} onQuickView={handleQuickView} />
          ))}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />

      <QuickViewDialog product={active} open={open} onOpenChange={setOpen} />
    </div>
  );
}
