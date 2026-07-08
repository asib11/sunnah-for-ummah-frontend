"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { useSectionMedia } from "@/components/SectionMediaEditor";
import { useCart } from "@/hooks/useCart";

const DEFAULT_VIDEO_URL = "/__l5e/assets-v1/f702bbd6-3828-4cff-b3a8-b2111b186ad0/baggy-sweatpants-washed-cinematic.mp4";
const sweatpantsImage = "/assets/baggy-sweatpants-washed.png";

const BAGGY_WASHED = { id: "baggy-sweatpants-washed", name: "Baggy Sweatpants — Washed", price: 1890 };

const BaggySweatpantsWashed = () => {
  const [revealed, setRevealed] = useState(false);

  // Auto-reveal after a short delay (video is looped so onEnded never fires)
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 800);
    return () => clearTimeout(t);
  }, []);
  const { urls, editor } = useSectionMedia("baggy-sweatpants-washed", [
    { key: "video", label: "Background video", kind: "video", defaultUrl: DEFAULT_VIDEO_URL },
    { key: "image", label: "Product image", kind: "image", defaultUrl: sweatpantsImage },
  ]);
  const { addToCart, isAdding } = useCart();
  const handleShop = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = "/baggy-sweatpants";
  };

  return (
    <section
      className="relative h-full w-full overflow-hidden rounded-2xl bg-foreground group cursor-pointer"
      onClick={() => setRevealed(true)}
    >
      {editor}
      <video
        src={urls.video}
        key={urls.video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-[2000ms] ease-out group-hover:scale-110"
      />
            
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-foreground/70" />

      <div className="absolute inset-0 opacity-60 mix-blend-overlay pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-[radial-gradient(circle_at_center,_hsl(var(--accent)/0.35),_transparent_60%)] animate-pulse" />
      </div>

      <div className="absolute -top-10 -right-10 font-display text-[10rem] md:text-[16rem] leading-none text-accent/[0.07] italic select-none pointer-events-none">
        Washed
      </div>

      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-accent/60 m-4 md:m-6" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-accent/60 m-4 md:m-6" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-accent/60 m-4 md:m-6" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-accent/60 m-4 md:m-6" />

      <div className="absolute top-6 left-6 md:top-10 md:left-12 flex items-center gap-3 z-20">
        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
        <span className="w-10 h-px bg-accent" />
        <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-accent">
          Streetwear · Acid Wash
        </span>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center z-10 pt-16 pb-32 md:pb-28 transition-all duration-[1400ms] ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "scale(1)" : "scale(0.92)",
          filter: revealed ? "blur(0px)" : "blur(8px)",
        }}
      >
        <div className="relative h-full w-full max-w-2xl mx-auto">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, hsl(var(--accent) / 0.3), transparent 60%)",
              filter: "blur(40px)",
            }}
          />
          <img
            src={urls.image}
            alt="Baggy Sweatpants — washed charcoal modest fit"
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_30px_70px_hsl(var(--accent)/0.4)]"
          />
        </div>
      </div>

      <div className="hidden md:block absolute top-24 right-6 md:right-12 z-10 text-right">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-cream/60">From</p>
        <p className="font-display text-2xl md:text-3xl font-semibold text-accent">৳1,290</p>
        <div className="flex items-center justify-end gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-accent text-accent" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-30 bg-gradient-to-t from-foreground via-foreground/85 to-transparent">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-xl">
            <p className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-accent/90 mb-1">
              Sunnah Streetwear · 08
            </p>
            <h3 className="font-display text-xl md:text-3xl font-semibold text-cream leading-tight">
              Washed <span className="italic text-accent">Baggy Sweatpants</span>
            </h3>
            <p className="font-body text-[10px] md:text-xs text-cream/65 mt-1 italic">
              (Unisex)
            </p>
            <p className="font-body text-[10px] md:text-xs text-cream/65 mt-1.5 leading-relaxed">
              Stone-washed charcoal grey with a relaxed oversized cut — heavyweight loopback fleece, drawstring waist, and a wide straight leg with a soft acid-wash finish that ages beautifully with every wear.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-cream/55">
              <span>320 GSM Loopback</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>Acid Wash Finish</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>Wide Straight Leg</span>
            </div>
          </div>

          <button type="button" onClick={handleShop} className="group/btn inline-flex items-center gap-2 bg-accent text-accent-foreground pl-4 pr-1.5 py-1.5 rounded-full text-xs font-body font-semibold hover:bg-accent/90 transition-all shadow-lg shadow-accent/30 shrink-0">
            Shop Washed
            <span className="w-7 h-7 rounded-full bg-accent-foreground/10 group-hover/btn:bg-accent-foreground/20 flex items-center justify-center transition-all group-hover/btn:rotate-45">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BaggySweatpantsWashed;


