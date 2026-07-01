"use client";

import { useRef, useState, useMemo } from "react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Crown, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";

const imgNoor  = "/assets/panjabi-white-collar.jpg";
const imgShahi = "/assets/panjabi-white-placket.jpg";
const imgRawda = "/assets/panjabi-blue-cuff.jpg";
const imgQamar = "/assets/panjabi-blue-collar.jpg";
const imgZahra = "/assets/panjabi-maroon-embroidery.jpg";
const imgAbyad = "/assets/panjabi-white-embroidery.jpg";
const imgLayl  = "/assets/panjabi-navy-embroidery.jpg";

type Look = {
  id: string;
  name: string;
  word: string;
  fabric: string;
  price: number;
  image: string;
  swatches: string[];
};

const STATIC_LOOKS: Look[] = [
  { id: "noor",   name: "Noor — Onyx",         word: "NOOR",   fabric: "Hand-loom Cotton Silk",     price: 3490, image: imgNoor,  swatches: ["#0d0d0d", "#1f2937", "#6b7280"] },
  { id: "zahra",  name: "Zahra — Maroon",      word: "ZAHRA",  fabric: "Crinkle Silk · Aari Work",  price: 3690, image: imgZahra, swatches: ["#6b1f2a", "#8b2a3a", "#c9a857"] },
  { id: "shahi",  name: "Shahi — Silver",      word: "SHAHI",  fabric: "Embroidered Pure Cotton",   price: 2990, image: imgShahi, swatches: ["#e5e7eb", "#94a3b8", "#475569"] },
  { id: "abyad",  name: "Abyad — Ivory",       word: "ABYAD",  fabric: "Cotton · Pearl Embroidery", price: 3190, image: imgAbyad, swatches: ["#f5f0e6", "#d9c9a8", "#b89968"] },
  { id: "rawda",  name: "Rawda — Warm Sand",   word: "RAWDA",  fabric: "Breathable Soft Cotton",    price: 2490, image: imgRawda, swatches: ["#c9b99a", "#a8896b", "#6b4f3a"] },
  { id: "layl",   name: "Layl — Midnight",     word: "LAYL",   fabric: "Crepe · Silver Threadwork", price: 3590, image: imgLayl,  swatches: ["#0b1c3a", "#1e2a4a", "#cbd5e1"] },
  { id: "qamar",  name: "Qamar — Moonlight",   word: "QAMAR",  fabric: "Royal Linen Blend",         price: 3290, image: imgQamar, swatches: ["#0b1c3a", "#0f3460", "#1e3a8a"] },
];

// Swatch palettes cycled for API products that have no colour data
const SWATCH_PALETTE = [
  ["#0d9488", "#0f766e", "#c9a857"],
  ["#166534", "#15803d", "#86efac"],
  ["#1e3a5f", "#1d4ed8", "#93c5fd"],
  ["#7c2d12", "#b45309", "#fcd34d"],
  ["#374151", "#6b7280", "#d1d5db"],
  ["#4c1d95", "#7c3aed", "#c4b5fd"],
  ["#0c4a6e", "#0369a1", "#7dd3fc"],
];

const getBdtPrice = (variant: any): number => {
  if (!variant?.prices) return 0;
  const bdtPrices = variant.prices
    .filter((p: any) => p.currency_code === "bdt")
    .map((p: any) => p.amount);
  if (bdtPrices.length > 0) {
    return Math.min(...bdtPrices);
  }
  return variant.prices[0]?.amount ?? 0;
};

const medusaToLook = (p: any, idx: number): Look & { variantId?: string } => {
  const variant = p.variants?.[0];
  const image = p.thumbnail || p.images?.[0]?.url || imgNoor;
  const subCat: string = p.metadata?.sub_category || "";
  const bangla: string = p.subtitle || "";
  // Use sub-category or bangla name as the right-column "word"
  const word = (p.title as string).split(" ")[0].toUpperCase().slice(0, 6);
  return {
    id: p.id,
    name: p.title,
    word,
    fabric: bangla || subCat || "Hajj Essential",
    price: getBdtPrice(variant),
    image,
    swatches: SWATCH_PALETTE[idx % SWATCH_PALETTE.length],
    variantId: variant?.id,
  };
};

const ImageTile = ({ src, alt, className, dim = false }: { src: string; alt: string; className?: string; dim?: boolean }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative w-full h-full overflow-hidden ${className ?? ""}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[hsl(157_40%_10%)] via-[hsl(157_30%_14%)] to-[hsl(41_30%_18%)]" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${dim ? "opacity-70 blur-[1px]" : ""}`}
      />
    </div>
  );
};

const LookCard = ({ look }: { look: Look }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={look.id}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full"
      >
        <div
          ref={ref}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMove}
          className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border border-[hsl(41_64%_56%/0.5)] shadow-[0_30px_80px_-20px_hsl(0_0%_0%/0.7)] cursor-zoom-in bg-[hsl(157_60%_5%)]"
        >
          <img
            src={look.image}
            alt={look.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out"
            style={{
              transformOrigin: `${pos.x}% ${pos.y}%`,
              transform: zoom ? "scale(2.4)" : "scale(1)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(157_60%_4%/0.7)] via-transparent to-transparent pointer-events-none" />

          {zoom && (
            <div
              aria-hidden
              className="pointer-events-none absolute w-32 h-32 rounded-full border-2 border-[hsl(41_64%_56%)] shadow-[0_0_24px_hsl(41_64%_56%/0.6)] hidden md:block"
              style={{
                left: `calc(${pos.x}% - 4rem)`,
                top: `calc(${pos.y}% - 4rem)`,
                background:
                  "radial-gradient(circle, hsl(41 64% 56% / 0.15) 0%, transparent 70%)",
              }}
            />
          )}

          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3">
            <div>
              <p className="font-body text-[9px] uppercase tracking-[0.4em] text-[hsl(41_64%_70%)]">
                {look.fabric}
              </p>
              <h4 className="mt-1 font-display text-xl sm:text-2xl font-bold text-[hsl(35_30%_95%)]">
                {look.name}
              </h4>
              <span className="mt-1 inline-block font-display text-xl sm:text-2xl font-bold text-[hsl(41_64%_60%)]">
                ৳{look.price.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(157_60%_5%/0.8)] backdrop-blur border border-[hsl(41_64%_56%/0.4)] shrink-0">
              <Search className="w-3 h-3 text-[hsl(41_64%_70%)]" />
              <span className="font-body text-[9px] uppercase tracking-[0.25em] text-[hsl(41_64%_70%)]">
                Hover to zoom
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const CinematicPanjabiHero = () => {
  const [active, setActive] = useState(0);
  const { addToCart, isAdding } = useCart();

  // Fetch live Hajj Kit products from Medusa
  const { data } = useQuery({
    queryKey: ["products", "category", "hajj-kit"],
    queryFn: () => storeApi.getProductsByCategoryHandle("hajj-kit"),
    staleTime: 1000 * 60 * 5,
  });

  const LOOKS = useMemo(() => {
    const apiProducts: any[] = data?.products ?? [];
    if (apiProducts.length === 0) return STATIC_LOOKS;
    return apiProducts.slice(0, 10).map((p, i) => medusaToLook(p, i));
  }, [data]);

  // Clamp active index if list length changes
  const safeActive = Math.min(active, LOOKS.length - 1);
  const look = LOOKS[safeActive] as Look & { variantId?: string };

  const handleAddToCart = () => {
    if ((look as any).variantId) {
      addToCart({ variantId: (look as any).variantId, quantity: 1 });
      toast.success(`${look.name} added to cart!`);
    } else {
      toast.info(`Visit the Hajj Kit page to order ${look.name}.`);
      window.dispatchEvent(new Event("open-cart"));
    }
  };

  



  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(40_40%_96%)] via-[hsl(40_30%_92%)] to-[hsl(157_18%_88%)] py-10 sm:py-16 md:py-24">
      {/* Warm golden halo */}
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.22] blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(41 70% 70%), transparent 60%)" }} />
      {/* Soft sage glow lower-right */}
      <div aria-hidden className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(157 35% 55%), transparent 60%)" }} />
      {/* White vignette to lift product imagery */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, hsl(40 50% 99% / 0.55) 0%, transparent 55%)" }} />
      <div aria-hidden className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 viewBox=%220 0 120 120%22><path fill=%22none%22 stroke=%22%23b8924a%22 stroke-width=%220.5%22 d=%22M60 4 L72 48 L116 60 L72 72 L60 116 L48 72 L4 60 L48 48 Z%22/></svg>')] bg-[length:120px_120px]" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2">
          <span className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent to-[hsl(41_64%_56%)]" />
          <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[hsl(41_64%_56%)] shrink-0" />
          <span className="font-body text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.6em] text-[hsl(157_35%_28%)] text-center">
            The Falling Drop · Panjabi Atelier
          </span>
          <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[hsl(41_64%_56%)] shrink-0" />
          <span className="hidden sm:block h-px w-10 bg-gradient-to-l from-transparent to-[hsl(41_64%_56%)]" />
        </div>


        {/* Stage — cinematic browser */}
        <div className="relative mx-auto max-w-6xl rounded-2xl sm:rounded-[28px] overflow-hidden border border-[hsl(41_50%_70%/0.4)] bg-gradient-to-br from-[hsl(40_50%_98%)] via-[hsl(40_35%_95%)] to-[hsl(157_18%_92%)] shadow-[0_40px_120px_-30px_hsl(157_40%_25%/0.35)] backdrop-blur-sm">
          {/* fake browser top */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 border-b border-[hsl(41_50%_70%/0.3)] bg-gradient-to-r from-[hsl(40_40%_96%)] via-[hsl(40_35%_94%)] to-[hsl(40_40%_96%)]">

            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[hsl(0_60%_55%)]" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[hsl(41_64%_56%)]" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[hsl(157_60%_50%)]" />
            <Link
              href="/hajj-mabroor"
              className="no-sparkle mx-auto inline-flex items-center gap-1.5 sm:gap-2 pl-3 sm:pl-4 pr-1 py-1.5 rounded-full bg-[hsl(41_64%_56%)] text-[hsl(157_60%_8%)] hover:bg-[hsl(41_64%_64%)] transition-all shadow-[0_0_24px_hsl(41_64%_56%/0.45)]"
            >
              <span className="font-body text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                HAJJ MABROOR Collection
              </span>
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[hsl(157_60%_8%)] text-[hsl(41_64%_56%)] flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </span>
            </Link>

          </div>

          <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Details — left */}
            <div className="md:col-span-4 order-2 md:order-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={look.id + safeActive}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[hsl(41_55%_38%)]">
                    {look.fabric}
                  </p>
                  <h3 className="mt-2 font-display text-xl sm:text-2xl md:text-3xl font-bold text-[hsl(157_45%_15%)] tracking-tight">
                    {look.name}
                  </h3>
                  <p className="mt-3 font-body text-xs sm:text-sm text-[hsl(157_20%_30%)]">
                    Cut from noble cloth, finished by hand. Drops from the heavens of our atelier — wear the legacy of the best.
                  </p>


                  <div className="mt-4 flex items-center gap-2">
                    {look.swatches.map(c => (
                      <span key={c} className="w-5 h-5 rounded-full border-2 border-[hsl(41_64%_56%/0.5)]" style={{ background: c }} />
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="font-display text-xl sm:text-2xl font-bold text-[hsl(41_60%_42%)]">
                      ৳{look.price.toLocaleString()}
                    </span>
                    <button onClick={handleAddToCart} className="group inline-flex items-center gap-2 bg-[hsl(41_64%_56%)] text-[hsl(157_60%_8%)] pl-4 pr-1.5 py-1.5 rounded-full text-[10px] font-body font-bold uppercase tracking-[0.25em] hover:bg-[hsl(41_64%_64%)] transition-all">
                      Add to Cart
                      <span className="w-6 h-6 rounded-full bg-[hsl(157_60%_8%)] text-[hsl(41_64%_56%)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-3 h-3" />
                      </span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* LookCard — center */}
            <div className="md:col-span-5 order-1 md:order-2">
              <LookCard look={look} />
            </div>

            {/* Selector — right */}
            <div className="md:col-span-3 order-3 space-y-1.5 md:max-h-[480px] md:overflow-y-auto pr-1">
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[hsl(41_55%_38%)] mb-2">
                Drop the next look
              </p>
              {LOOKS.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => setActive(i)}
                  className={`no-sparkle group w-full flex items-center gap-2.5 p-1.5 rounded-lg border transition-all ${
                    i === safeActive
                      ? "border-[hsl(41_60%_55%)] bg-[hsl(40_50%_98%)] shadow-[0_4px_18px_-6px_hsl(41_50%_50%/0.35)]"
                      : "border-[hsl(41_40%_70%/0.3)] hover:border-[hsl(41_55%_55%/0.6)] hover:bg-[hsl(40_40%_96%)]"
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                    <ImageTile src={l.image} alt={l.name} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className={`font-body text-[11px] font-bold uppercase tracking-[0.2em] ${i === safeActive ? "text-[hsl(41_55%_38%)]" : "text-[hsl(157_25%_25%)]"}`}>
                      {l.word}
                    </p>
                    <p className="font-body text-[9px] text-[hsl(157_15%_45%)] truncate">{l.fabric}</p>
                  </div>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === safeActive ? "bg-[hsl(41_64%_56%)] shadow-[0_0_8px_hsl(41_64%_56%)]" : "bg-[hsl(41_64%_56%/0.25)]"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinematicPanjabiHero;


