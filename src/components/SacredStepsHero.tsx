"use client";

import { useEffect, useState } from "react";
import { Star, CheckCircle2, ChevronDown } from "lucide-react";
import kaaba from "@/assets/kaaba-hero.jpg";
import nabawi from "@/assets/masjid-nabawi-hero.jpg";
import arafat from "@/assets/mount-arafat.jpg";
import mina from "@/assets/mina-tents.jpg";

const slides = [
  { image: kaaba, label: "The Holy Kaaba — Mecca" },
  { image: nabawi, label: "Masjid an-Nabawi — Medina" },
  { image: arafat, label: "Mount Arafat" },
  { image: mina, label: "Mina — Tent City" },
];

const SacredStepsHero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full h-full min-h-[520px] overflow-hidden rounded-2xl">
      {/* Rotating background images */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.image.src}
            alt={s.label}
            className="absolute inset-0 w-full h-full object-cover transition-all transition-duration-[2000ms] ease-out"
            style={{
              opacity: i === active ? 1 : 0,
              transform: i === active ? "scale(1.08)" : "scale(1)",
            }}
            {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
          />
        ))}
      </div>

      {/* Emerald cinematic overlay — lighter so the image shows through */}
      <div className="absolute inset-0 bg-emerald/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald/20 via-transparent to-emerald/45" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-emerald-light/10" />

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, hsl(var(--foreground) / 0.35) 100%)",
        }}
      />

      {/* Thin accent frame */}
      <div className="absolute inset-3 md:inset-5 border border-accent/20 rounded-xl pointer-events-none" />

      {/* Soft blurred contrast panel behind content */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] max-w-xl h-[78%] rounded-3xl bg-foreground/10 backdrop-blur-[3px] shadow-[0_20px_60px_-20px_hsl(var(--foreground)/0.45)] ring-1 ring-primary-foreground/10 pointer-events-none" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 md:px-10 py-12 [text-shadow:0_2px_24px_hsl(var(--foreground)/0.85)]">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/70 bg-foreground/40 backdrop-blur-md mb-6 animate-fade-in shadow-[0_4px_18px_-6px_hsl(var(--foreground)/0.6)]">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="font-body text-[11px] md:text-xs font-semibold text-accent-foreground/95">
            সম্পূর্ণ হজ্জ ও উমরাহ সামগ্রী
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.05] tracking-tight animate-fade-in drop-shadow-[0_4px_18px_hsl(var(--foreground)/0.7)]">
          Hajj <span className="italic text-accent">Mabroor</span>
        </h1>
        <p className="font-display text-2xl md:text-3xl text-accent mt-2 italic animate-fade-in drop-shadow-[0_2px_12px_hsl(var(--foreground)/0.7)]">
          হজ্জ মাবরূর
        </p>

        {/* Description */}
        <p className="font-body text-sm md:text-base font-medium text-primary-foreground mt-6 leading-relaxed max-w-md animate-fade-in [text-shadow:0_1px_10px_hsl(var(--foreground)/0.85)]">
          Everything you need for a blessed journey — carefully curated,
          quality-assured, and packed in one convenient kit.
        </p>

        {/* Primary CTAs — glassmorphism */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("whats-inside-kit")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="group relative inline-flex items-center gap-3 rounded-full px-7 py-3 font-body text-sm font-semibold text-primary-foreground
              bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/25
              shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.5)]
              transition-all duration-300 ease-out
              hover:bg-accent/90 hover:text-accent-foreground hover:border-accent/60 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_hsl(var(--accent)/0.55)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Star className="relative w-3.5 h-3.5 fill-accent text-accent group-hover:fill-accent-foreground group-hover:text-accent-foreground transition-colors" />
            <span className="relative">Explore the Kit</span>
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("whats-inside-kit")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="group relative inline-flex items-center gap-3 rounded-full px-7 py-3 font-body text-sm font-semibold text-primary-foreground
              bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/25
              shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.5)]
              transition-all duration-300 ease-out
              hover:bg-accent/90 hover:text-accent-foreground hover:border-accent/60 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_hsl(var(--accent)/0.55)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Star className="relative w-3.5 h-3.5 fill-accent text-accent group-hover:fill-accent-foreground group-hover:text-accent-foreground transition-colors" />
            <span className="relative">হজ্জ প্যাকেজে যা যা থাকছে</span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 flex items-center gap-4 md:gap-8">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("whats-inside-kit")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="group text-center rounded-lg px-2 py-1 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label="Scroll to what's inside the kit"
          >
            <div className="font-display text-3xl md:text-4xl font-semibold text-accent leading-none group-hover:text-accent/90 transition-colors">
              21<span className="text-accent/80">+</span>
            </div>
            <div className="font-body text-[10px] md:text-xs text-primary-foreground/75 uppercase tracking-wider mt-1.5 group-hover:text-primary-foreground transition-colors">
              Essential Items
            </div>
          </button>
          <div className="w-px h-10 bg-primary-foreground/20" />
          <div className="text-center">
            <div className="font-display text-3xl md:text-4xl font-semibold text-accent leading-none">
              6
            </div>
            <div className="font-body text-[10px] md:text-xs text-primary-foreground/75 uppercase tracking-wider mt-1.5">
              Package Options
            </div>
          </div>
          <div className="w-px h-10 bg-primary-foreground/20" />
          <div className="text-center">
            <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8 text-accent mx-auto" />
            <div className="font-body text-[10px] md:text-xs text-primary-foreground/75 uppercase tracking-wider mt-1.5">
              Quality Assured
            </div>
          </div>
        </div>

        {/* Image label */}
        <p
          key={`lbl-${active}`}
          className="mt-10 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary-foreground/70 animate-fade-in"
        >
          {slides[active].label}
        </p>

        {/* Dots */}
        <div className="mt-4 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-8 bg-accent" : "w-3 bg-primary-foreground/40"
              }`}
            />
          ))}
        </div>

        {/* Scroll cue */}
        <ChevronDown className="mt-8 w-5 h-5 text-primary-foreground/60 animate-bounce" />
      </div>
    </section>
  );
};

export default SacredStepsHero;
