"use client";

import { useState } from "react";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import frontImage from "@/assets/calligraphy-drop-shoulder-front.png";
import backImage from "@/assets/calligraphy-drop-shoulder-back.png";
import { useSectionMedia } from "@/components/SectionMediaEditor";
import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";
import { getProductPrices } from "@/lib/utils";
import { useRouter } from "next/navigation";

const CalligraphyDropShoulder = () => {

  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["product", "calligraphy-drop-shoulder"],
    queryFn: () => storeApi.getProductByHandle("calligraphy-drop-shoulder"),
  });
  const { price } = getProductPrices(data);
  const [revealed, setRevealed] = useState(true);
  const [view, setView] = useState<"front" | "back">("front");
  const { urls } = useSectionMedia("calligraphy-drop-shoulder", [
    { key: "video", label: "Background video", kind: "video", defaultUrl: "/calligraphy-drop-shoulder.mp4" },
    { key: "front", label: "Front image", kind: "image", defaultUrl: frontImage.src },
    { key: "back", label: "Back image", kind: "image", defaultUrl: backImage.src },
  ]);

  return (
    <section
      className="relative h-full w-full overflow-hidden rounded-2xl bg-foreground group cursor-pointer"
      onClick={() => setRevealed(true)}
    >
      {/* Cinematic video — loops in background */}
      <video
        src={urls.video}
        key={urls.video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity transition-duration-[1500ms] ease-out"
        style={{ opacity: 0.25 }}
      />

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-foreground/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/20 to-foreground/40" />

      {/* Animated spotlight */}
      <div className="absolute inset-0 opacity-60 mix-blend-overlay pointer-events-none">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[80%] h-[120%] bg-[radial-gradient(circle_at_center,_hsl(var(--accent)/0.3),_transparent_60%)] animate-pulse" />
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
        <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-accent">
          New Drop · Limited Edition
        </span>
      </div>

      {/* Top right price tag */}
      <div className="absolute top-6 right-6 md:top-10 md:right-12 z-20 text-right">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary-foreground/60">Starting at</p>
        <p className="font-display text-2xl md:text-3xl font-semibold text-accent">{isLoading ? "..." : price ? `৳${price}` : "৳..."}</p>
        <div className="flex items-center justify-end gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-accent text-accent" />
          ))}
        </div>
      </div>

      {/* Product reveal — appears after video ends */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10 pt-20 pb-40 md:pb-32 transition-all transition-duration-[1400ms] ease-out pointer-events-none"
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
            src={view === "front" ? urls.front : urls.back}
            alt={`Calligraphy Drop Shoulder — ${view} view`}
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_30px_70px_hsl(var(--accent)/0.4)] transition-opacity duration-500"
            key={view}
          />
        </div>
      </div>

      {/* Front / Back toggle — appears after reveal */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[42%] md:translate-y-[38%] z-30 flex items-center gap-2 transition-all duration-700 ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? "auto" : "none",
          transform: `translate(-50%, ${revealed ? "38%" : "60%"})`,
        }}
      >
        {(["front", "back"] as const).map((v) => (
          <button
            key={v}
            onClick={(e) => {
              e.stopPropagation();
              setView(v);
            }}
            className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-body uppercase tracking-[0.3em] border transition-all ${
              view === v
                ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/30"
                : "bg-foreground/40 text-primary-foreground/80 border-primary-foreground/20 hover:bg-foreground/60 hover:border-accent/50"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 z-20 max-w-[48%]">
        <p className="font-body text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-accent/90 mb-1">
          Calligraphy Collection · 01
        </p>
        <h3 className="font-display text-base md:text-xl lg:text-2xl font-semibold text-primary-foreground leading-[0.95] tracking-tight">
          Calligraphy <span className="italic text-accent">Drop Shoulder</span>
        </h3>
        <p className="font-display text-[10px] md:text-xs text-primary-foreground/70 mt-0.5 italic">
          ক্যালিগ্রাফি ড্রপ শোল্ডার
        </p>

        <div className="mt-1.5">
          <p className="font-body text-[10px] md:text-[11px] text-primary-foreground/75 leading-snug max-w-xs">
            Hand-drawn Arabic calligraphy on premium oversized cotton.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[8px] uppercase tracking-[0.25em] text-primary-foreground/55">
            <span>240 GSM</span>
            <span className="w-1 h-1 rounded-full bg-accent" />
            <span>Oversized Fit</span>
            <span className="w-1 h-1 rounded-full bg-accent" />
            <span>Premium Print</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push("/products/calligraphy-drop-shoulder");
            }}
            className="group/btn mt-2 inline-flex items-center gap-1.5 bg-accent text-accent-foreground pl-3 pr-1.5 py-1.5 rounded-full text-[10px] md:text-xs font-body font-semibold hover:bg-accent/90 transition-all shadow-lg shadow-accent/30"
          >
            Shop the Drop
            <span className="w-5 h-5 rounded-full bg-accent-foreground/10 group-hover/btn:bg-accent-foreground/20 flex items-center justify-center transition-all group-hover/btn:rotate-45">
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CalligraphyDropShoulder;
