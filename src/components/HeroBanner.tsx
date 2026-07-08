"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
const heroMasjidHaram = "/assets/hero-masjid-haram.jpg";
const heroMasjidNabawi = "/assets/hero-masjid-nabawi.jpg";
const heroAlAqsa = "/assets/hero-al-aqsa.jpg";
const heroBlueMosque = "/assets/hero-blue-mosque.jpg";
const heroSheikhZayed = "/assets/hero-sheikh-zayed.jpg";

const heroImages = [
  heroMasjidHaram,
  heroMasjidNabawi,
  heroAlAqsa,
  heroBlueMosque,
  heroSheikhZayed,
];

const taglines = [
  "Sunnah Is The Best Lifestyle",
  "Created By The Best Men Ever Lived",
  "Follow The Path Of The Prophet ﷺ",
];

const headlines = [
  { before: "Follow the Sunnah, ", highlight: "Elevate", after: " Your Style" },
  { before: "Dress with ", highlight: "Purpose", after: " & Faith" },
  { before: "Embrace the ", highlight: "Sunnah", after: " Lifestyle" },
];

const useTypingText = (words: string[], typingSpeed = 80, deleteSpeed = 40, pauseMs = 1500) => {
  const [text, setText] = useState("");
  const idx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    const tick = () => {
      const current = words[idx.current];
      if (!deleting.current) {
        charIdx.current++;
        setText(current.slice(0, charIdx.current));
        if (charIdx.current === current.length) {
          deleting.current = true;
          return pauseMs;
        }
        return typingSpeed;
      } else {
        charIdx.current--;
        setText(current.slice(0, charIdx.current));
        if (charIdx.current === 0) {
          deleting.current = false;
          idx.current = (idx.current + 1) % words.length;
          return typingSpeed;
        }
        return deleteSpeed;
      }
    };
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => { const delay = tick(); timer = setTimeout(loop, delay); };
    timer = setTimeout(loop, typingSpeed);
    return () => clearTimeout(timer);
  }, [words, typingSpeed, deleteSpeed, pauseMs]);

  return text;
};

const useHeadlineRotation = (items: typeof headlines, intervalMs = 4000) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(timer);
  }, [items, intervalMs]);
  return { item: items[index], index };
};

const useImageRotation = (images: string[], intervalMs = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(timer);
  }, [images, intervalMs]);
  return currentIndex;
};

const HeroBanner = () => {
  const typingText = useTypingText(taglines);
  const { item: headline, index: headlineIdx } = useHeadlineRotation(headlines);
  const currentImageIndex = useImageRotation(heroImages, 5000);

  return (
    <section className="relative w-full overflow-hidden rounded-2xl h-full min-h-[440px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[600px]">
      {/* Image stack with slow ken-burns */}
      <div className="absolute inset-0">
        {heroImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Islamic Holy Place"
            width={1920}
            height={800}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out"
            style={{
              opacity: i === currentImageIndex ? 1 : 0,
              transform: i === currentImageIndex ? "scale(1.08)" : "scale(1)",
              transition: "opacity 1500ms ease-in-out, transform 8000ms ease-out",
            }}
            {...(i === 0
              ? { fetchPriority: "high" as const, decoding: "async" as const }
              : { loading: "lazy" as const, decoding: "async" as const })}
          />
        ))}
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-foreground/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-transparent to-primary/85 pointer-events-none" />

      {/* Vertical accent rule */}
      <div className="absolute left-6 md:left-10 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-accent/60 to-transparent hidden md:block" />

      {/* Image counter (editorial) */}
      <div className="absolute top-6 right-6 md:top-8 md:right-10 flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary-foreground/70 z-10">
        <span className="text-accent">{String(currentImageIndex + 1).padStart(2, "0")}</span>
        <span className="w-8 h-px bg-primary-foreground/40" />
        <span>{String(heroImages.length).padStart(2, "0")}</span>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-5 sm:px-6 md:px-10 flex items-center py-10 md:py-0">
        <div className="max-w-xl w-full">
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <span className="w-8 md:w-10 h-px bg-accent" />
            <p className="text-accent text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.35em] font-body font-medium min-h-[1em]">
              {typingText || "\u00A0"}<span className="ml-0.5 animate-pulse">|</span>
            </p>
          </div>

          <h2
            key={headlineIdx}
            className="font-display text-[2rem] leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground tracking-tight mb-5 md:mb-6 animate-fade-in"
          >
            {headline.before}
            <span className="italic text-accent">{headline.highlight}</span>
            {headline.after}
          </h2>

          <p className="font-body text-sm md:text-base text-primary-foreground/80 leading-relaxed mb-6 md:mb-8 max-w-md">
            Timeless garments and essentials, crafted with intention — honoring tradition, designed for today.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button className="group inline-flex items-center justify-between sm:justify-start gap-3 bg-accent text-accent-foreground pl-6 pr-2 py-2 rounded-full text-sm font-body font-semibold hover:bg-accent/90 transition-all w-full sm:w-auto">
              Shop Collection
              <span className="w-9 h-9 rounded-full bg-accent-foreground/10 group-hover:bg-accent-foreground/20 flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
            <a href="#new-arrivals" className="text-primary-foreground/85 hover:text-accent text-sm font-body underline-offset-4 underline sm:no-underline hover:underline transition-colors text-center sm:text-left">
              New Arrivals
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;


