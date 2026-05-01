"use client";

import { useState, useEffect, useRef } from "react";
import heroMasjidHaram from "@/assets/hero-masjid-haram.jpg";
import heroMasjidNabawi from "@/assets/hero-masjid-nabawi.jpg";
import heroAlAqsa from "@/assets/hero-al-aqsa.jpg";
import heroBlueMosque from "@/assets/hero-blue-mosque.jpg";
import heroSheikhZayed from "@/assets/hero-sheikh-zayed.jpg";

const heroImages = [
  heroMasjidHaram,
  heroMasjidNabawi,
  heroAlAqsa,
  heroBlueMosque,
  heroSheikhZayed,
];

const taglines = [
  "Sunnah Is The Best Lifestyle",
  "Created By The Best Men Ever Lived On Earth",
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
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items, intervalMs]);
  return items[index];
};

const useImageRotation = (images: typeof heroImages, intervalMs = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images, intervalMs]);
  return currentIndex;
};

const HeroBanner = () => {
  const typingText = useTypingText(taglines);
  const headline = useHeadlineRotation(headlines);
  const currentImageIndex = useImageRotation(heroImages, 5000);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative">
        {/* Stacked images with crossfade */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          {heroImages.map((imgSrc, i) => (
            <img
              key={i}
              src={imgSrc.src}
              alt="Islamic Holy Place"
              width={1920}
              height={800}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === currentImageIndex ? 1 : 0 }}
              {...(i === 0
                ? { fetchPriority: "high" as const, decoding: "async" as const }
                : { loading: "lazy" as const, decoding: "async" as const })}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-lg">
              <p className="text-primary-foreground/80 text-xs md:text-sm uppercase tracking-[0.3em] font-body mb-2 min-h-[1.5em]">
                {typingText || "\u00A0"}
              </p>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-4 min-h-[4.5rem] md:min-h-[7rem] lg:min-h-[9rem]">
                {headline.before}
                <span className="text-gold">{headline.highlight}</span>
                {headline.after}
              </h2>
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-body font-semibold hover:bg-emerald-light transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
