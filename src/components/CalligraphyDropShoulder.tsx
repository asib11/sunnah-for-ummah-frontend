"use client";

import { useState } from "react";
import Link from 'next/link';
import { ArrowUpRight, Eye, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
const frontImage = "/assets/calligraphy-drop-shoulder-front.png";
const backImage = "/assets/calligraphy-drop-shoulder-back.png";
import { useSectionMedia } from "@/components/SectionMediaEditor";
import { useCart } from "@/hooks/useCart";

const DROP_SHOULDER = { id: "calligraphy-drop-shoulder", name: "Calligraphy Drop-Shoulder Tee", price: 1490 };

const CalligraphyDropShoulder = () => {
  const [view, setView] = useState<"front" | "back">("front");
  const { urls, editor } = useSectionMedia("calligraphy-drop-shoulder", [
    { key: "video", label: "Background video", kind: "video", defaultUrl: "/calligraphy-drop-shoulder.mp4" },
    { key: "front", label: "Front image", kind: "image", defaultUrl: frontImage },
    { key: "back", label: "Back image", kind: "image", defaultUrl: backImage },
  ]);
  const { addToCart, isAdding } = useCart();
  const handleShop = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = "/calligraphy-dropshoulder";
  };

  return (
    <section
      className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald/30 via-emerald-light/15 to-emerald/40 group"
      onMouseLeave={() => setView("front")}
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
      {/* Looping cinematic video — same hover-scale system as underneath section */}
      
      {/* Subtle emerald cinematic glaze — lets the video breathe through */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald/55 via-emerald/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald/25 via-transparent to-emerald-light/15 mix-blend-multiply" />
      {/* Vignette for elegance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_hsl(var(--emerald)/0.55)_100%)]" />

      {/* Animated spotlight */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[80%] h-[120%] bg-[radial-gradient(circle_at_center,_hsl(var(--accent)/0.15),_transparent_60%)] animate-pulse" />
      </div>

      {/* Cinematic corner brackets */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-accent/60 m-4 md:m-6" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-accent/60 m-4 md:m-6" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-accent/60 m-4 md:m-6" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-accent/60 m-4 md:m-6" />

      {/* Top eyebrow */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 flex items-center gap-3 z-20">
        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
        <span className="w-10 h-px bg-accent" />
        <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-cream/90">
          New Drop · Hover to Flip
        </span>
      </div>

      {/* View badge */}
      <div className="absolute top-6 right-6 md:top-10 md:right-12 z-20 flex items-center gap-2 bg-emerald/40 backdrop-blur-md border border-accent/40 rounded-full px-4 py-2">
        <Eye className="w-3.5 h-3.5 text-accent" />
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-cream/90">
          {view === "front" ? "Front View" : "Back View"}
        </span>
      </div>

      {/* Price tag */}
      <div className="hidden md:block absolute top-24 right-6 md:right-12 z-20 text-right">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-cream/70">Starting at</p>
        <p className="font-display text-2xl md:text-3xl font-semibold text-accent drop-shadow-[0_2px_8px_hsl(var(--emerald)/0.6)]">৳1,290</p>
        <div className="flex items-center justify-end gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-accent text-accent" />
          ))}
        </div>
      </div>

      {/* Product stage — hover halves to preview front/back */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pt-20 pb-40 md:pb-32">
        <div className="relative h-full w-full max-w-2xl mx-auto">
          <div
            className="absolute inset-0 transition-all duration-[1200ms] ease-out"
            style={{
              background:
                "radial-gradient(circle at center, hsl(var(--accent) / 0.3), transparent 60%)",
              filter: "blur(40px)",
              transform: view === "front" ? "translateX(-4%)" : "translateX(4%)",
            }}
          />
          <img
            src={urls.front}
            alt="Calligraphy Drop Shoulder — front view"
            className="absolute inset-0 w-full h-full object-contain transition-all duration-[900ms] ease-out drop-shadow-[0_30px_70px_hsl(var(--accent)/0.4)]"
            style={{
              transform:
                view === "front"
                  ? "translateX(0%) scale(1.02)"
                  : "translateX(-12%) scale(0.88)",
              opacity: view === "front" ? 1 : 0.2,
              filter: view === "front" ? "blur(0px)" : "blur(2px)",
            }}
          />
          <img
            src={urls.back}
            alt="Calligraphy Drop Shoulder — back view"
            className="absolute inset-0 w-full h-full object-contain transition-all duration-[900ms] ease-out drop-shadow-[0_30px_70px_hsl(var(--accent)/0.4)]"
            style={{
              transform:
                view === "back"
                  ? "translateX(0%) scale(1.02)"
                  : "translateX(12%) scale(0.88)",
              opacity: view === "back" ? 1 : 0.2,
              filter: view === "back" ? "blur(0px)" : "blur(2px)",
            }}
          />

          {/* Hover hit areas */}
          <button
            type="button"
            aria-label="Show front view"
            onMouseEnter={() => setView("front")}
            onFocus={() => setView("front")}
            className="absolute inset-y-0 left-0 w-1/2 z-20 cursor-pointer"
          />
          <button
            type="button"
            aria-label="Show back view"
            onMouseEnter={() => setView("back")}
            onFocus={() => setView("back")}
            className="absolute inset-y-0 right-0 w-1/2 z-20 cursor-pointer"
          />
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 z-30 max-w-[48%]">
        <p className="font-body text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-gold-light/90 mb-1">
          Calligraphy Collection · 01
        </p>
        <h3 className="font-display text-base md:text-xl lg:text-2xl font-semibold text-cream leading-[0.95] tracking-tight drop-shadow-[0_2px_10px_hsl(var(--emerald)/0.7)]">
          Calligraphy <span className="italic text-accent">Drop Shoulder</span>
        </h3>
        <p className="font-display text-[10px] md:text-xs text-cream/70 mt-0.5 italic">
          (Unisex)
        </p>

        <div className="mt-1.5">
          <p className="font-body text-[10px] md:text-[11px] text-cream/80 leading-snug max-w-xs">
            Hand-drawn Arabic calligraphy on premium oversized cotton.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[8px] uppercase tracking-[0.25em] text-cream/60">
            <span>240 GSM</span>
            <span className="w-1 h-1 rounded-full bg-accent" />
            <span>Oversized Fit</span>
            <span className="w-1 h-1 rounded-full bg-accent" />
            <span>Premium Print</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" onClick={handleShop} className="group/btn inline-flex items-center gap-1.5 bg-accent text-accent-foreground pl-3 pr-1 py-1 rounded-full text-[10px] md:text-xs font-body font-semibold hover:bg-accent/90 transition-all shadow-lg shadow-accent/30">
              Shop the Drop
              <span className="w-5 h-5 rounded-full bg-accent-foreground/10 group-hover/btn:bg-accent-foreground/20 flex items-center justify-center transition-all group-hover/btn:rotate-45">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>
            <Link
              href="/eid-collection"
              className="group/link inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cream/40 text-cream text-[10px] md:text-xs font-body font-semibold uppercase tracking-wider backdrop-blur-sm bg-emerald/20 hover:bg-accent/15 hover:border-accent/60 hover:text-accent transition-all"
            >
              View Eid Collection
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:rotate-45" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalligraphyDropShoulder;


