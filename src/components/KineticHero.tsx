"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X, Menu } from "lucide-react";
import SacredStepsHero from "@/components/SacredStepsHero";
import HajjPackages from "@/components/HajjPackages";
import CalligraphyDropShoulder from "@/components/CalligraphyDropShoulder";
import CalligraphyShowcase from "@/components/CalligraphyShowcase";
import WearYourDeen from "@/components/WearYourDeen";
import TimesOfSuccess from "@/components/TimesOfSuccess";
import SabrShowcase from "@/components/SabrShowcase";
import BaggySweatpants from "@/components/BaggySweatpants";
import BaggySweatpantsWhite from "@/components/BaggySweatpantsWhite";
import BaggySweatpantsWashed from "@/components/BaggySweatpantsWashed";
import heroMasjidHaram from "@/assets/hero-masjid-haram.jpg";
import heroMasjidNabawi from "@/assets/hero-masjid-nabawi.jpg";
import heroQubaMosque from "@/assets/hero-quba-mosque.jpg";
import heroUmayyadMosque from "@/assets/hero-umayyad-mosque.jpg";
import heroKairouanMosque from "@/assets/hero-kairouan-mosque.jpg";
import heroCordobaMezquita from "@/assets/hero-cordoba-mezquita.jpg";
import heroAlhambra from "@/assets/hero-alhambra.jpg";
import heroSamarraMinaret from "@/assets/hero-samarra-minaret.jpg";
import heroBadshahiMosque from "@/assets/hero-badshahi-mosque.jpg";
import hajjHeroBg from "@/assets/hajj-hero-bg.jpg";

type Showcase = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
};

const showcases: Showcase[] = [
  {
    eyebrow: "Hajj Mabroor",
    title: "Hajj Mabroor",
    subtitle: "হজ্জ মাবরূর",
    description: "Everything you need for a blessed journey — carefully curated, quality-assured, and packed in one convenient kit. 21+ essentials, 6 package options, fully quality assured.",
    image: hajjHeroBg.src,
    cta: "Explore the Kit",
  },
  {
    eyebrow: "Holy Sanctuary",
    title: "Masjid al-Haram",
    subtitle: "মসজিদুল হারাম",
    description: "Walk in the footsteps of the Prophet ﷺ. Garments crafted to honor the holiest of journeys.",
    image: heroMasjidHaram.src,
    cta: "Hajj Collection",
  },
  {
    eyebrow: "Prophetic City",
    title: "Masjid al-Nabawi",
    subtitle: "মসজিদে নববী",
    description: "Timeless thobes and panjabis inspired by the radiant city of Madinah.",
    image: heroMasjidNabawi.src,
    cta: "Madinah Edit",
  },
  {
    eyebrow: "First Foundation",
    title: "Masjid Quba",
    subtitle: "মসজিদ কুবা",
    description: "The first mosque built by the Prophet ﷺ — a quiet sanctuary where every prayer carries the reward of an Umrah.",
    image: heroQubaMosque.src,
    cta: "Discover Quba",
  },
  {
    eyebrow: "Umayyad Legacy",
    title: "Umayyad Mosque",
    subtitle: "উমাইয়া মসজিদ",
    description: "Damascus' ancient jewel — golden mosaics and arched courtyards echoing centuries of devotion.",
    image: heroUmayyadMosque.src,
    cta: "Damascus Heritage",
  },
  {
    eyebrow: "African Heart",
    title: "Mosque of Kairouan",
    subtitle: "কাইরাওয়ান মসজিদ",
    description: "The fourth holiest mosque in Islam — sandstone walls rising from the Tunisian desert with quiet majesty.",
    image: heroKairouanMosque.src,
    cta: "Kairouan Story",
  },
  {
    eyebrow: "Andalusian Light",
    title: "Mezquita of Córdoba",
    subtitle: "কর্ডোবা মসজিদ",
    description: "Infinite horseshoe arches in red and ivory — a forest of columns from the golden age of Al-Andalus.",
    image: heroCordobaMezquita.src,
    cta: "Al-Andalus",
  },
  {
    eyebrow: "Nasrid Refinement",
    title: "Alhambra",
    subtitle: "আলহাম্‌রা",
    description: "Granada's crowning palace — geometric tile, carved stucco, and still water reflecting Islamic artistry at its zenith.",
    image: heroAlhambra.src,
    cta: "Granada Heritage",
  },
  {
    eyebrow: "Abbasid Echo",
    title: "Spiral of Samarra",
    subtitle: "সামাররা মিনার",
    description: "The helical Malwiya minaret of Iraq — a sand-built spiral spiraling into history's earliest Islamic empires.",
    image: heroSamarraMinaret.src,
    cta: "Samarra Story",
  },
  {
    eyebrow: "Mughal Grandeur",
    title: "Badshahi Mosque",
    subtitle: "বাদশাহী মসজিদ",
    description: "Lahore's red sandstone giant — vast courtyards and white marble domes carrying the dignity of Mughal Islam.",
    image: heroBadshahiMosque.src,
    cta: "Mughal Edit",
  },
];

const KineticHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    panelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-cycle through all showcase sites in a loop
  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % showcases.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);


  const active = showcases[activeIndex] ?? showcases[0];

  return (
    <section className="relative w-full px-3 sm:px-4 py-3 sm:py-4">

      {/* ── Burger Button ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Open Sunnah Showcase"
        className="fixed left-4 bottom-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-foreground/90 backdrop-blur-sm border border-accent/30 shadow-lg hover:bg-foreground transition-all hover:scale-105 active:scale-95"
      >
        <Menu className="w-5 h-5 text-accent" />
      </button>





      {/* ── Drawer Panel ── */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[90vw] max-w-sm flex flex-col overflow-hidden bg-foreground shadow-2xl transition-transform duration-500 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer image background */}
        <div className="absolute inset-0">
          {showcases.map((s, i) => (
            <img
              key={i}
              src={s.image}
              alt={s.title}
              className="absolute inset-0 w-full h-full object-cover transition-all transition-duration-[1200ms] ease-out"
              style={{
                opacity: i === activeIndex ? 1 : 0,
                transform: i === activeIndex ? "scale(1.06)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Close Showcase"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center transition-all border border-primary-foreground/20"
        >
          <X className="w-4 h-4 text-primary-foreground" />
        </button>

        {/* Counter */}
        <div className="absolute top-6 left-6 flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.3em] text-primary-foreground/70 z-10">
          <span className="text-accent">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="w-6 h-px bg-primary-foreground/40" />
          <span>{String(showcases.length).padStart(2, "0")}</span>
        </div>

        {/* Brand label */}
        <div className="absolute top-14 left-6 z-10">
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-accent">
            Sunnah Showcase
          </p>
        </div>

        {/* Drawer Content */}
        <div className="relative flex-1 flex flex-col justify-end px-6 pb-10 pt-24">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-px bg-accent" />
            <p
              key={`deb-${activeIndex}`}
              className="text-accent text-[10px] uppercase tracking-[0.35em] font-body font-medium animate-fade-in"
            >
              {active.eyebrow}
            </p>
          </div>

          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary-foreground/60 mb-3">
            Explore the Kinetic Showcase
          </p>

          <h2
            key={`dt-${activeIndex}`}
            className="font-display text-4xl font-semibold text-primary-foreground leading-[1.05] tracking-tight animate-fade-in"
          >
            {active.title}
          </h2>
          <p
            key={`ds-${activeIndex}`}
            className="font-display text-lg text-primary-foreground/70 mt-2 italic animate-fade-in"
          >
            {active.subtitle}
          </p>

          <p
            key={`dd-${activeIndex}`}
            className="font-body text-sm text-primary-foreground/75 mt-4 leading-relaxed animate-fade-in"
          >
            {active.description}
          </p>

          <div className="mt-6">
            <button
              onClick={() => {
                setDrawerOpen(false);
                if (activeIndex === 0) {
                  setTimeout(() => {
                    document.getElementById("whats-inside-kit")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 300);
                }
              }}
              className="group inline-flex items-center gap-3 bg-accent text-accent-foreground pl-5 pr-2 py-2 rounded-full text-sm font-body font-semibold hover:bg-accent/90 transition-all"
            >
              {active.cta}
              <span className="w-8 h-8 rounded-full bg-accent-foreground/10 group-hover:bg-accent-foreground/20 flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          {/* Showcase item list */}
          <div className="mt-8 flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-none">
            {showcases.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`flex items-center gap-3 text-left px-3 py-2 rounded-xl transition-all ${
                  i === activeIndex
                    ? "bg-accent/20 border border-accent/40"
                    : "hover:bg-primary-foreground/10 border border-transparent"
                }`}
              >
                <span
                  className={`text-xs font-body font-semibold ${
                    i === activeIndex ? "text-accent" : "text-primary-foreground/40"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-xs font-body ${
                    i === activeIndex ? "text-primary-foreground" : "text-primary-foreground/60"
                  }`}
                >
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Progress dots */}
          <div className="mt-5 flex items-center gap-2">
            {showcases.map((_, i) => (
              <span
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1 rounded-full cursor-pointer transition-all duration-500 ${
                  i === activeIndex ? "w-6 bg-accent" : "w-2 bg-primary-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="relative">
        {/* Scrolling panels — full width */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* First panel: Sacred Steps Hero */}
          <div
            data-index={0}
            ref={(el) => (panelRefs.current[0] = el)}
            className="relative h-[calc(100svh-1.5rem)] sm:h-[calc(100vh-2rem)] min-h-[420px] sm:min-h-[520px]"
          >
            <SacredStepsHero />
          </div>

          {/* Second panel: Hajj Packages */}
          <div className="relative min-h-[420px] sm:min-h-[520px] overflow-hidden rounded-2xl bg-background">
            <HajjPackages />
          </div>

          {/* Calligraphy Drop Shoulder feature */}
          <div className="relative h-[60svh] sm:h-[65vh] min-h-[360px] sm:min-h-[440px]">
            <CalligraphyDropShoulder />
          </div>

          {/* Calligraphy Showcase — front & back cinematic detail */}
          <div className="relative h-[65svh] sm:h-[70vh] min-h-[420px] sm:min-h-[500px]">
            <CalligraphyShowcase />
          </div>

          {/* Wear Your Deen — Tawakkul cinematic film */}
          <div className="relative h-[70svh] sm:h-[75vh] min-h-[460px] sm:min-h-[540px]">
            <WearYourDeen />
          </div>

          {/* Times of Success — Five Daily Prayers cinematic film */}
          <div className="relative h-[70svh] sm:h-[75vh] min-h-[460px] sm:min-h-[540px]">
            <TimesOfSuccess />
          </div>

          {/* Sabr — Patience cinematic film */}
          <div className="relative h-[70svh] sm:h-[75vh] min-h-[460px] sm:min-h-[540px]">
            <SabrShowcase />
          </div>

          {/* Baggy Sweatpants — cinematic streetwear film */}
          <div className="relative h-[70svh] sm:h-[75vh] min-h-[460px] sm:min-h-[540px]">
            <BaggySweatpants />
          </div>

          {/* Baggy Sweatpants Ivory — cinematic streetwear film */}
          <div className="relative h-[70svh] sm:h-[75vh] min-h-[460px] sm:min-h-[540px]">
            <BaggySweatpantsWhite />
          </div>

          {/* Baggy Sweatpants Washed — cinematic streetwear film */}
          <div className="relative h-[70svh] sm:h-[75vh] min-h-[460px] sm:min-h-[540px]">
            <BaggySweatpantsWashed />
          </div>

        </div>
      </div>
    </section>
  );
};

export default KineticHero;
