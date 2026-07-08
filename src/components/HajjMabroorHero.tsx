"use client";

import { Sparkles, ArrowUpRight } from "lucide-react";
const hajjHeroBg = "/assets/hajj-hero-bg.jpg";

const HajjMabroorHero = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={hajjHeroBg}
          alt="Pilgrims at the Kaaba in Mecca"
          loading="lazy"
          width={1920}
          height={1080}
          className="w-full h-full object-cover scale-110"
          style={{ animation: "amoeba-float 12s ease-in-out infinite" }}
        />
        {/* Match HeroBanner's right-side gradient — seamless seam */}
        <div className="absolute inset-0 bg-primary/75" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-primary/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
      </div>

      {/* Vertical accent rule on right */}
      <div className="absolute right-6 md:right-10 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-accent/60 to-transparent hidden md:block" />

      {/* Editorial label top-right */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-cream/70 z-10">
        <span className="w-8 h-px bg-primary-foreground/40" />
        <span>Featured Kit</span>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 md:px-10 flex items-center">
        <div className="max-w-md ml-auto text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/50 bg-accent/10 backdrop-blur-sm mb-5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="font-body text-[10px] md:text-xs font-medium text-accent uppercase tracking-[0.2em]">
              Hajj &amp; Umrah Essentials
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-cream leading-[1.05] tracking-tight">
            Hajj <span className="italic text-accent">Mabroor</span>
          </h2>
          <p className="font-display text-lg md:text-xl text-cream/70 mt-1 italic">
            হজ্জ মাবরূর
          </p>

          <p className="font-body text-sm md:text-base text-cream/75 mt-5 leading-relaxed">
            A blessed journey, thoughtfully prepared. Every essential — curated, quality-assured, and ready in one kit.
          </p>

          {/* Editorial stat row */}
          <div className="mt-7 flex items-center justify-end gap-6 text-right">
            <div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-accent leading-none">21<span className="text-accent/70">+</span></div>
              <div className="font-body text-[10px] md:text-xs text-cream/70 uppercase tracking-[0.2em] mt-1.5">Essentials</div>
            </div>
            <div className="w-px h-10 bg-primary-foreground/20" />
            <div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-accent leading-none">06</div>
              <div className="font-body text-[10px] md:text-xs text-cream/70 uppercase tracking-[0.2em] mt-1.5">Packages</div>
            </div>
          </div>

          <button className="group inline-flex items-center gap-3 mt-7 bg-primary-foreground/10 hover:bg-primary-foreground/15 backdrop-blur-md border border-cream/20 text-cream pl-5 pr-2 py-2 rounded-full text-sm font-body font-medium transition-all">
            Explore the Kit
            <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HajjMabroorHero;


