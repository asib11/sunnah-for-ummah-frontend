"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
// HeroSlider removed — content moved to header overlay
import CalligraphyDropShoulder from "@/components/CalligraphyDropShoulder";
import CalligraphyShowcase from "@/components/CalligraphyShowcase";
import WearYourDeen from "@/components/WearYourDeen";
import TimesOfSuccess from "@/components/TimesOfSuccess";
import SabrShowcase from "@/components/SabrShowcase";
import BaggySweatpants from "@/components/BaggySweatpants";
import BaggySweatpantsWhite from "@/components/BaggySweatpantsWhite";
import BaggySweatpantsWashed from "@/components/BaggySweatpantsWashed";
const heroMasjidHaram = "/assets/hero-masjid-haram.jpg";
const heroMasjidNabawi = "/assets/hero-masjid-nabawi.jpg";
const heroQubaMosque = "/assets/hero-quba-mosque.jpg";
const heroUmayyadMosque = "/assets/hero-umayyad-mosque.jpg";
const heroKairouanMosque = "/assets/hero-kairouan-mosque.jpg";
const heroCordobaMezquita = "/assets/hero-cordoba-mezquita.jpg";
const heroAlhambra = "/assets/hero-alhambra.jpg";
const heroSamarraMinaret = "/assets/hero-samarra-minaret.jpg";
const heroBadshahiMosque = "/assets/hero-badshahi-mosque.jpg";
const hajjHeroBg = "/assets/hajj-hero-bg.jpg";

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
    image: hajjHeroBg,
    cta: "Explore the Kit",
  },
  {
    eyebrow: "Holy Sanctuary",
    title: "Masjid al-Haram",
    subtitle: "মসজিদুল হারাম",
    description: "Walk in the footsteps of the Prophet ﷺ. Garments crafted to honor the holiest of journeys.",
    image: heroMasjidHaram,
    cta: "Hajj Collection",
  },
  {
    eyebrow: "Prophetic City",
    title: "Masjid al-Nabawi",
    subtitle: "মসজিদে নববী",
    description: "Timeless thobes and panjabis inspired by the radiant city of Madinah.",
    image: heroMasjidNabawi,
    cta: "Madinah Edit",
  },
  {
    eyebrow: "First Foundation",
    title: "Masjid Quba",
    subtitle: "মসজিদ কুবা",
    description: "The first mosque built by the Prophet ﷺ — a quiet sanctuary where every prayer carries the reward of an Umrah.",
    image: heroQubaMosque,
    cta: "Discover Quba",
  },
  {
    eyebrow: "Umayyad Legacy",
    title: "Umayyad Mosque",
    subtitle: "উমাইয়া মসজিদ",
    description: "Damascus' ancient jewel — golden mosaics and arched courtyards echoing centuries of devotion.",
    image: heroUmayyadMosque,
    cta: "Damascus Heritage",
  },
  {
    eyebrow: "African Heart",
    title: "Mosque of Kairouan",
    subtitle: "কাইরাওয়ান মসজিদ",
    description: "The fourth holiest mosque in Islam — sandstone walls rising from the Tunisian desert with quiet majesty.",
    image: heroKairouanMosque,
    cta: "Kairouan Story",
  },
  {
    eyebrow: "Andalusian Light",
    title: "Mezquita of Córdoba",
    subtitle: "কর্ডোবা মসজিদ",
    description: "Infinite horseshoe arches in red and ivory — a forest of columns from the golden age of Al-Andalus.",
    image: heroCordobaMezquita,
    cta: "Al-Andalus",
  },
  {
    eyebrow: "Nasrid Refinement",
    title: "Alhambra",
    subtitle: "আলহাম্‌রা",
    description: "Granada's crowning palace — geometric tile, carved stucco, and still water reflecting Islamic artistry at its zenith.",
    image: heroAlhambra,
    cta: "Granada Heritage",
  },
  {
    eyebrow: "Abbasid Echo",
    title: "Spiral of Samarra",
    subtitle: "সামাররা মিনার",
    description: "The helical Malwiya minaret of Iraq — a sand-built spiral spiraling into history's earliest Islamic empires.",
    image: heroSamarraMinaret,
    cta: "Samarra Story",
  },
  {
    eyebrow: "Mughal Grandeur",
    title: "Badshahi Mosque",
    subtitle: "বাদশাহী মসজিদ",
    description: "Lahore's red sandstone giant — vast courtyards and white marble domes carrying the dignity of Mughal Islam.",
    image: heroBadshahiMosque,
    cta: "Mughal Edit",
  },
];

const KineticHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showShowcase, setShowShowcase] = useState(false);
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
      {/* Floating Islamic 3-dot toggle button — opens/closes the Sunnah Showcase panel */}
      <button
        type="button"
        onClick={() => setShowShowcase((v) => !v)}
        aria-label={showShowcase ? "Hide Sunnah Showcase" : "Show Sunnah Showcase"}
        aria-expanded={showShowcase}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-accent shadow-2xl border-2 border-accent/60 hover:bg-accent hover:text-accent-foreground hover:scale-110 hover:border-accent transition-all duration-300"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-6 h-6"
          fill="currentColor"
          aria-hidden="true"
        >
          {/* Three 8-point Islamic stars arranged vertically */}
          {[8, 16, 24].map((cy) => (
            <g key={cy} transform={`translate(16 ${cy})`}>
              <polygon
                points="0,-3 0.8,-0.8 3,0 0.8,0.8 0,3 -0.8,0.8 -3,0 -0.8,-0.8"
                transform="rotate(0)"
              />
              <polygon
                points="0,-3 0.8,-0.8 3,0 0.8,0.8 0,3 -0.8,0.8 -3,0 -0.8,-0.8"
                transform="rotate(45)"
              />
            </g>
          ))}
        </svg>
      </button>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* LEFT — sticky pinned panel (hidden on mobile; toggleable on desktop) */}
        {showShowcase && (
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-4 self-start h-[calc(100vh-2rem)] min-h-[480px]">
          <div className="relative w-full h-full overflow-hidden rounded-2xl bg-foreground">
            {/* Image stack — fades with active panel */}
            <div className="absolute inset-0">
              {showcases.map((s, i) => (
                <img
                  key={i}
                  src={s.image}
                  alt={s.title}
                  width={1920}
                  height={1080}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out"
                  style={{
                    opacity: i === activeIndex ? 1 : 0,
                    transform: i === activeIndex ? "scale(1.06)" : "scale(1)",
                  }}
                  {...(i === 0
                    ? { fetchPriority: "high" as const }
                    : { loading: "lazy" as const })}
                />
              ))}
            </div>

            {/* Cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-foreground/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />

            {/* Vertical accent rule */}
            <div className="absolute left-6 md:left-10 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-accent/60 to-transparent hidden md:block" />

            {/* Counter */}
            <div className="absolute top-6 right-6 md:top-8 md:right-10 flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary-foreground/70 z-10">
              <span className="text-accent">{String(activeIndex + 1).padStart(2, "0")}</span>
              <span className="w-8 h-px bg-primary-foreground/40" />
              <span>{String(showcases.length).padStart(2, "0")}</span>
            </div>

            {/* Brand label */}
            <div className="absolute top-6 left-6 md:top-8 md:left-10 z-10">
              <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-accent">
                Sunnah Showcase
              </p>
            </div>

            {/* Content */}
            <div className="relative h-full px-6 md:px-10 lg:px-14 flex flex-col justify-end pb-10 md:pb-14">
              <div className="max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-px bg-accent" />
                  <p
                    key={`eb-${activeIndex}`}
                    className="text-accent text-[10px] md:text-xs uppercase tracking-[0.35em] font-body font-medium animate-fade-in"
                  >
                    {active.eyebrow}
                  </p>
                </div>

                <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] text-primary-foreground/60 mb-3">
                  Explore the Kinetic Showcase
                </p>

                <h2
                  key={`t-${activeIndex}`}
                  className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground leading-[1.05] tracking-tight animate-fade-in"
                >
                  {active.title}
                </h2>
                <p
                  key={`s-${activeIndex}`}
                  className="font-display text-lg md:text-xl text-primary-foreground/70 mt-2 italic animate-fade-in"
                >
                  {active.subtitle}
                </p>

                <p
                  key={`d-${activeIndex}`}
                  className="font-body text-sm md:text-base text-primary-foreground/75 mt-5 leading-relaxed max-w-sm animate-fade-in"
                >
                  {active.description}
                </p>

                <div className="mt-7 flex items-center gap-4">
                  <button className="group inline-flex items-center gap-3 bg-accent text-accent-foreground pl-6 pr-2 py-2 rounded-full text-sm font-body font-semibold hover:bg-accent/90 transition-all">
                    {active.cta}
                    <span className="w-9 h-9 rounded-full bg-accent-foreground/10 group-hover:bg-accent-foreground/20 flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </button>
                </div>

                {/* Progress dots */}
                <div className="mt-8 flex items-center gap-2">
                  {showcases.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === activeIndex ? "w-8 bg-accent" : "w-3 bg-primary-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* RIGHT — vertically scrolling panels */}
        <div className={`${showShowcase ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col gap-3 sm:gap-4`}>
          {/* Hero slider removed — Sacred Steps now lives inside the "Hajj Mabroor" header overlay */}



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

          {showcases
            .map((s, i) => ({ s, i }))
            .filter(
              ({ i, s }) =>
                i >= 3 &&
                s.title !== "Masjid Quba" &&
                s.title !== "Umayyad Mosque" &&
                s.title !== "Mosque of Kairouan" &&
                s.title !== "Mezquita of Córdoba" &&
                s.title !== "Alhambra" &&
                s.title !== "Spiral of Samarra" &&
                s.title !== "Badshahi Mosque"
            )
            .map(({ s, i }) => {
            return (
              <div
                key={i}
                data-index={i}
                ref={(el) => (panelRefs.current[i] = el)}
                className="relative h-[55svh] sm:h-[60vh] min-h-[320px] sm:min-h-[400px] overflow-hidden rounded-2xl group"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                <div className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-3">
                  <span className="font-display text-2xl md:text-3xl text-primary-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="w-10 h-px bg-accent" />
                  <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary-foreground/80">
                    {s.eyebrow}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground leading-tight">
                    {s.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-body text-sm text-primary-foreground/80 max-w-sm">
                      {s.description}
                    </p>
                    <span className="hidden md:inline-flex w-12 h-12 rounded-full bg-accent text-accent-foreground items-center justify-center shrink-0 ml-4 transition-transform group-hover:rotate-45">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KineticHero;


