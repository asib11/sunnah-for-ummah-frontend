"use client";

import { useState } from "react";
import { ArrowUpRight, Eye, RotateCcw, Sparkles, Star } from "lucide-react";
import tshirtImage from "@/assets/muslim-tshirt-front-back.png";
import { useSectionMedia } from "@/components/SectionMediaEditor";
import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";
import { getProductPrices } from "@/lib/utils";
import { useRouter } from "next/navigation";

type View = "front" | "back";

const CalligraphyShowcase = () => {

  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["product", "front-calligraphy"],
    queryFn: () => storeApi.getProductByHandle("front-calligraphy"),
  });
  const { price } = getProductPrices(data);
  const [view, setView] = useState<View>("front");
  const { urls } = useSectionMedia("calligraphy-showcase", [
    { key: "video", label: "Background video", kind: "video", defaultUrl: "/calligraphy-showcase.mp4" },
    { key: "image", label: "T-shirt (front+back)", kind: "image", defaultUrl: tshirtImage.src },
  ]);

  return (
    <section
      className="relative h-full w-full overflow-hidden rounded-2xl bg-foreground group"
      onMouseLeave={() => setView("front")}
    >
      {/* Looping cinematic video */}
      <video
        src={urls.video}
        key={urls.video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform transition-duration-[2000ms] ease-out group-hover:scale-110"
      />

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-foreground/70" />

      {/* Animated spotlight */}
      <div className="absolute inset-0 opacity-60 mix-blend-overlay pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-[radial-gradient(circle_at_center,_hsl(var(--accent)/0.35),_transparent_60%)] animate-pulse" />
      </div>

      {/* Watermark */}
      <div className="absolute -top-10 -right-10 font-display text-[12rem] md:text-[18rem] leading-none text-accent/[0.07] italic select-none pointer-events-none">
        مسلم
      </div>

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-accent/60 m-4 md:m-6" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-accent/60 m-4 md:m-6" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-accent/60 m-4 md:m-6" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-accent/60 m-4 md:m-6" />

      {/* Top eyebrow */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 flex items-center gap-3 z-20">
        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
        <span className="w-10 h-px bg-accent" />
        <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-accent">
          360° View · Hover to Flip
        </span>
      </div>

      {/* Detail badge */}
      <div className="absolute top-6 right-6 md:top-10 md:right-12 z-20 flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2">
        <Eye className="w-3.5 h-3.5 text-accent" />
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-primary-foreground/80">
          {view === "front" ? "Front View" : "Back View"}
        </span>
      </div>

      {/* Price tag */}
      <div className="hidden md:block absolute top-24 right-6 md:right-12 z-20 text-right">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary-foreground/60">Starting at</p>
        <p className="font-display text-2xl md:text-3xl font-semibold text-accent">{isLoading ? "..." : price ? `৳${price}` : "৳..."}</p>
        <div className="flex items-center justify-end gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-accent text-accent" />
          ))}
        </div>
      </div>

      {/* Carousel stage — hover halves to preview front/back */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pt-16 pb-28 md:pb-24">
        <div className="relative h-full w-full max-w-3xl mx-auto">
          {/* Glow halo behind active tshirt */}
          <div
            className="absolute inset-0 transition-all transition-duration-[1200ms] ease-out"
            style={{
              background:
                "radial-gradient(circle at center, hsl(var(--accent) / 0.3), transparent 60%)",
              filter: "blur(40px)",
              transform: view === "front" ? "translateX(-8%)" : "translateX(8%)",
            }}
          />

          {/* Front view (left half of source image) */}
          <img
            src={urls.image}
            alt="Muslim Calligraphy T-Shirt — front view"
            className="absolute inset-0 w-full h-full object-contain transition-all transition-duration-[900ms] ease-out drop-shadow-[0_30px_70px_hsl(var(--accent)/0.4)]"
            style={{
              clipPath: "inset(0 50% 0 0)",
              transform:
                view === "front"
                  ? "translateX(25%) scale(1.05)"
                  : "translateX(-30%) scale(0.85)",
              opacity: view === "front" ? 1 : 0.25,
              filter: view === "front" ? "blur(0px)" : "blur(2px)",
            }}
          />

          {/* Back view (right half of source image) */}
          <img
            src={urls.image}
            alt="Muslim Calligraphy T-Shirt — back view"
            className="absolute inset-0 w-full h-full object-contain transition-all transition-duration-[900ms] ease-out drop-shadow-[0_30px_70px_hsl(var(--accent)/0.4)]"
            style={{
              clipPath: "inset(0 0 0 50%)",
              transform:
                view === "back"
                  ? "translateX(-25%) scale(1.05)"
                  : "translateX(30%) scale(0.85)",
              opacity: view === "back" ? 1 : 0.25,
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

      {/* Bottom strip — labels + toggle dots + CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-30 bg-gradient-to-t from-foreground via-foreground/80 to-transparent">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-accent/90 mb-1">
              Calligraphy Collection · 02
            </p>
            <h3 className="font-display text-lg md:text-2xl font-semibold text-primary-foreground leading-tight">
              {view === "front" ? (
                <>
                  Front · <span className="italic text-accent">Calligraphy</span>
                </>
              ) : (
                <>
                  Back · <span className="italic text-accent">Skyline</span>
                </>
              )}
            </h3>
            <p className="font-body text-[11px] md:text-xs text-primary-foreground/70 mt-1 max-w-md leading-snug">
              {view === "front"
                ? "Hand-drawn 'Muslim' calligraphy in flowing Arabic script."
                : "A delicate single-line masjid skyline at the hem."}
            </p>

            {/* View toggle dots */}
            <div className="mt-2.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setView("front")}
                className={`flex items-center gap-2 transition-all ${
                  view === "front" ? "opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                <span
                  className={`h-0.5 rounded-full transition-all duration-500 ${
                    view === "front" ? "w-6 bg-accent" : "w-2.5 bg-primary-foreground/30"
                  }`}
                />
                <span className="font-body text-[9px] uppercase tracking-[0.3em] text-primary-foreground/80">
                  Front
                </span>
              </button>
              <button
                type="button"
                onClick={() => setView("back")}
                className={`flex items-center gap-2 transition-all ${
                  view === "back" ? "opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                <RotateCcw className="w-2.5 h-2.5 text-accent" />
                <span
                  className={`h-0.5 rounded-full transition-all duration-500 ${
                    view === "back" ? "w-6 bg-accent" : "w-2.5 bg-primary-foreground/30"
                  }`}
                />
                <span className="font-body text-[9px] uppercase tracking-[0.3em] text-primary-foreground/80">
                  Back
                </span>
              </button>
            </div>
          </div>

          <button onClick={(e) => { e.stopPropagation(); router.push("/products/front-calligraphy"); }} className="group/btn inline-flex items-center gap-2 bg-accent text-accent-foreground pl-4 pr-1.5 py-1.5 rounded-full text-xs font-body font-semibold hover:bg-accent/90 transition-all shadow-lg shadow-accent/30 shrink-0">
            View Product
            <span className="w-7 h-7 rounded-full bg-accent-foreground/10 group-hover/btn:bg-accent-foreground/20 flex items-center justify-center transition-all group-hover/btn:rotate-45">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CalligraphyShowcase;
