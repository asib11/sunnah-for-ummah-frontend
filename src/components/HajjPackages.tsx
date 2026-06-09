"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, CheckCircle2, Upload, X, ChevronLeft, ChevronRight, Settings, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import HajjKitDetails from "./HajjKitDetails";
const hajjHeroBg = "/assets/hajj-hero-bg.jpg";
const pkgHajjCombo = "/assets/pkg-hajj-combo.jpg";
const pkgHajjMen = "/assets/pkg-hajj-men.jpg";
const pkgHajjMenPremium = "/assets/pkg-hajj-men-premium.jpg";
const pkgHajjWomen = "/assets/pkg-hajj-women.jpg";
const pkgUmrahCombo = "/assets/pkg-umrah-combo.jpg";
const pkgUmrahMen = "/assets/pkg-umrah-men.jpg";
const pkgUmrahWomen = "/assets/pkg-umrah-women.jpg";

type Package = {
  title: string;
  bangla: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  image: string;
  // Satellite product images shown inside the floating circles around the main blob.
  // Edit these to upload/replace product pictures for each star bubble.
  satellites?: string[];
};

const packages: Package[] = [
  {
    title: "Hajj Package (Men & Women)",
    bangla: "হজ্জ প্যাকেজ (পুরুষ ও মহিলা)",
    price: 10500,
    oldPrice: 12000,
    badge: "Best Value",
    image: pkgHajjCombo,
  },
  {
    title: "Hajj Package (Men)",
    bangla: "হজ্জ প্যাকেজ (পুরুষ)",
    price: 6000,
    image: pkgHajjMen,
  },
  {
    title: "Hajj Package (Men) Premium",
    bangla: "হজ্জ প্যাকেজ (পুরুষ) প্রিমিয়াম",
    price: 8000,
    badge: "Premium",
    image: pkgHajjMenPremium,
  },
  {
    title: "Hajj Package (Women)",
    bangla: "হজ্জ প্যাকেজ (মহিলা)",
    price: 6000,
    image: pkgHajjWomen,
  },
  {
    title: "Umrah Package (Men & Women)",
    bangla: "উমরা প্যাকেজ (পুরুষ ও মহিলা)",
    price: 4700,
    oldPrice: 4900,
    badge: "Popular",
    image: pkgUmrahCombo,
  },
  {
    title: "Umrah Package (Men)",
    bangla: "উমরা প্যাকেজ (পুরুষ)",
    price: 2500,
    image: pkgUmrahMen,
  },
  {
    title: "Umrah Package (Women)",
    bangla: "উমরা প্যাকেজ (মহিলা)",
    price: 2400,
    image: pkgUmrahWomen,
  },
];

const STORAGE_KEY = "sfu:hajj-satellites";
const POS_STORAGE_KEY = "sfu:hajj-satellite-positions";

type Offset = { x: number; y: number };

const HajjPackages = () => {
  // Per-package satellite overrides: { [pkgTitle]: (string|null)[5] }
  const [satelliteOverrides, setSatelliteOverrides] = useState<Record<string, (string | null)[]>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Drag offsets (px) per { [pkgTitle]: Offset[5] }
  const [satellitePositions, setSatellitePositions] = useState<Record<string, Offset[]>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(POS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const { addToCart, isAdding } = useCart();
  const [editing, setEditing] = useState<{ pkg: string; index: number } | null>(null);
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const PER_PAGE = 2;
  const totalPages = Math.ceil(packages.length / PER_PAGE);
  const visiblePackages = packages.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  // Auto-slide settings (persisted)
  const SETTINGS_KEY = "sfu:hajj-pkg-slide-settings";
  const [slideDirection, setSlideDirection] = useState<"rtl" | "ltr">(() => {
    if (typeof window === "undefined") return "rtl";
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      return (raw ? JSON.parse(raw).direction : "rtl") || "rtl";
    } catch {
      return "rtl";
    }
  });
  const [slideIntervalSec, setSlideIntervalSec] = useState<number>(() => {
    if (typeof window === "undefined") return 4;
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      const v = raw ? JSON.parse(raw).intervalSec : 4;
      return typeof v === "number" && v >= 1 ? v : 4;
    } catch {
      return 4;
    }
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ direction: slideDirection, intervalSec: slideIntervalSec }),
      );
    } catch {
      /* ignore */
    }
  }, [slideDirection, slideIntervalSec]);

  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const ms = Math.max(1000, slideIntervalSec * 1000);
    const id = window.setInterval(() => {
      setPage((p) =>
        slideDirection === "rtl"
          ? (p + 1) % totalPages
          : (p - 1 + totalPages) % totalPages,
      );
    }, ms);
    return () => window.clearInterval(id);
  }, [isPaused, totalPages, slideDirection, slideIntervalSec]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{
    pkg: string;
    index: number;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(satelliteOverrides));
    } catch {
      /* ignore quota errors */
    }
  }, [satelliteOverrides]);

  useEffect(() => {
    try {
      window.localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(satellitePositions));
    } catch {
      /* ignore */
    }
  }, [satellitePositions]);

  const getSatellite = (pkg: Package, i: number): string | undefined =>
    satelliteOverrides[pkg.title]?.[i] ?? pkg.satellites?.[i];

  const getOffset = (pkgTitle: string, i: number): Offset =>
    satellitePositions[pkgTitle]?.[i] ?? { x: 0, y: 0 };

  const openPicker = (pkgTitle: string, index: number) => {
    setEditing({ pkg: pkgTitle, index });
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editing) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSatelliteOverrides((prev) => {
        const arr = [...(prev[editing.pkg] ?? [null, null, null, null, null])];
        arr[editing.index] = dataUrl;
        return { ...prev, [editing.pkg]: arr };
      });
      setEditing(null);
    };
    reader.readAsDataURL(file);
  };

  const clearSatellite = (pkgTitle: string, i: number) => {
    setSatelliteOverrides((prev) => {
      const arr = [...(prev[pkgTitle] ?? [null, null, null, null, null])];
      arr[i] = null;
      return { ...prev, [pkgTitle]: arr };
    });
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    pkgTitle: string,
    index: number,
  ) => {
    const base = getOffset(pkgTitle, index);
    dragRef.current = {
      pkg: pkgTitle,
      index,
      startX: e.clientX,
      startY: e.clientY,
      baseX: base.x,
      baseY: base.y,
      moved: false,
    };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    d.moved = true;
    const nx = d.baseX + dx;
    const ny = d.baseY + dy;
    setSatellitePositions((prev) => {
      const arr = [...(prev[d.pkg] ?? [
        { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
      ])];
      arr[d.index] = { x: nx, y: ny };
      return { ...prev, [d.pkg]: arr };
    });
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    pkgTitle: string,
    index: number,
  ) => {
    const d = dragRef.current;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    dragRef.current = null;
    if (!d || !d.moved) {
      // Treat as click → open picker
      openPicker(pkgTitle, index);
    }
  };

  return (
    <section className="relative">
      {/* What's Inside the Kit */}
      <div id="whats-inside-kit" className="py-16 md:py-20 bg-gradient-to-b from-background via-emerald-tint/20 to-secondary/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What's Inside the Kit
            </h3>
            <p className="font-body text-sm md:text-base text-muted-foreground mt-3">
              21 premium items — Total value <span className="font-bold text-primary">৳4,640</span>
            </p>
            <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
          </div>
          <HajjKitDetails />
        </div>
      </div>

      {/* Packages grid */}
      <div className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-emerald-tint/30 via-background to-emerald-tint-deep/25">
        {/* Decorative background blobs */}
        <span className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-[62%_38%_54%_46%/48%_56%_44%_52%] bg-[radial-gradient(circle_at_30%_30%,hsl(var(--emerald-tint-deep)/0.45),transparent_70%)] blur-2xl" />
        <span className="pointer-events-none absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-[40%_60%_70%_30%/50%_30%_70%_50%] bg-[radial-gradient(circle_at_50%_50%,hsl(var(--emerald)/0.10),transparent_70%)] blur-2xl" />
        <span className="pointer-events-none absolute -bottom-20 left-1/4 w-80 h-80 rounded-[70%_30%_46%_54%/38%_62%_38%_62%] bg-[radial-gradient(circle_at_50%_50%,hsl(var(--emerald-light)/0.12),transparent_70%)] blur-2xl" />

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-body text-xs font-semibold tracking-widest uppercase text-primary">
                Curated Packages
              </span>
            </span>
            <h3 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
              Choose Your <span className="italic text-primary">Package</span>
            </h3>
            <p className="font-body text-sm md:text-base text-muted-foreground mt-3 max-w-xl mx-auto">
              Click a package to see details and place your order
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <span className="w-12 h-[2px] bg-gradient-to-r from-transparent to-accent rounded-full" />
              <span className="w-2 h-2 rotate-45 bg-accent" />
              <span className="w-12 h-[2px] bg-gradient-to-l from-transparent to-accent rounded-full" />
            </div>
          </div>

          <div
            className="overflow-hidden max-w-3xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
          <div
            key={page}
            className={`grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 ${
              slideDirection === "rtl"
                ? "animate-[slide-in-right_0.6s_ease-out]"
                : "animate-[slide-in-left_0.6s_ease-out]"
            }`}
          >
            {visiblePackages.map((pkg, idx) => {
              const savings = pkg.oldPrice ? pkg.oldPrice - pkg.price : 0;
              return (
                <article
                  key={pkg.title}
                  className="group relative flex flex-col rounded-[2rem] bg-card/80 backdrop-blur-sm border border-primary/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-500 hover:-translate-y-3 p-6 overflow-visible"
                >
                  {/* Creative geometric decorations — green palette */}
                  <span className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 border-2 border-dashed border-primary/30 rounded-full" />
                  <span className="pointer-events-none absolute -bottom-4 -left-4 w-14 h-14 border border-accent/40 rounded-[40%_60%_60%_40%/50%_40%_60%_50%]" />
                  <span
                    className="pointer-events-none absolute top-12 -right-2 w-4 h-4 bg-emerald-500/40"
                    style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                  />
                  <span
                    className="pointer-events-none absolute bottom-24 -left-2 w-3 h-3 bg-accent/70"
                    style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  />
                  <span className="pointer-events-none absolute top-3 right-10 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="pointer-events-none absolute bottom-32 right-3 w-1 h-1 rounded-full bg-emerald-600" />

                  {/* Connector dotted line for visual flow */}
                  <span className="pointer-events-none absolute top-1/2 left-0 w-full h-[1px] bg-[repeating-linear-gradient(90deg,hsl(var(--primary)/0.15)_0_4px,transparent_4px_10px)] opacity-50" />

                  {pkg.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 font-body text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full bg-gradient-to-r from-accent to-amber-400 text-accent-foreground shadow-lg ring-2 ring-background">
                      ★ {pkg.badge}
                    </span>
                  )}

                  {/* Creative morphing main blob with glow, rotating ring & sparkles */}
                  <div className="relative z-10 mx-auto w-full aspect-square">
                    {/* Outer glow halo */}
                    <span className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,hsl(var(--emerald-tint-deep)/0.50)_0%,hsl(var(--emerald-tint)/0.30)_45%,transparent_75%)] blur-2xl animate-pulse" />

                    {/* Rotating dashed orbit ring */}
                    <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] rounded-full border border-dashed border-emerald-400/25 amoeba-spin-slow" />
                    {/* Counter-rotating thin ring */}
                    <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[108%] h-[108%] rounded-full border border-emerald-300/20 [animation:amoeba-spin_30s_linear_infinite_reverse]" />

                    {/* Soft morphing gradient backdrop */}
                    <span className="pointer-events-none absolute -inset-3 bg-[linear-gradient(135deg,hsl(var(--emerald)/0.12)_0%,hsl(var(--emerald-light)/0.14)_50%,hsl(160_50%_45%/0.12)_100%)] amoeba-blob-bg" />

                    {/* Orbiting accent dots/sparkles around the blob */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] orbit-container">
                      {[0, 72, 144, 216, 288].map((angle, i) => (
                        <div
                          key={`dot-${i}`}
                          className="absolute top-1/2 left-1/2"
                          style={{ transform: `rotate(${angle}deg) translateY(-50%)` }}
                        >
                          <span
                            className={`block rounded-full shadow-[0_0_10px_hsl(152_70%_50%/0.8)] ${
                              i % 2 === 0
                                ? "w-2.5 h-2.5 bg-accent"
                                : "w-1.5 h-1.5 bg-emerald-400"
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Counter-orbit tiny sparkles */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[108%] h-[108%] orbit-container-reverse">
                      {[36, 180, 300].map((angle, i) => (
                        <div
                          key={`spark-${i}`}
                          className="absolute top-1/2 left-1/2"
                          style={{ transform: `rotate(${angle}deg) translateY(-50%)` }}
                        >
                          <span className="block w-1 h-1 rounded-full bg-lime-300 shadow-[0_0_8px_hsl(85_90%_60%)]" />
                        </div>
                      ))}
                    </div>

                    {/* The main morphing blob */}
                    <div className="relative w-full h-full overflow-hidden rounded-full bg-muted ring-2 ring-emerald-400/40 shadow-[0_15px_45px_-10px_hsl(var(--emerald-tint-glow)/0.18)] group-hover:ring-accent transition-all duration-500">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        loading="lazy"
                        width={800}
                        height={800}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Shimmer sweep on hover */}
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      {/* Inner color wash */}
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/0 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Floating product bubbles around the blob — replace pkg.satellites[i] to upload product pictures */}
                    {(() => {
                      const bubbles = [
                        { pos: "-top-3 -right-3", size: "w-14 h-14", ring: "from-accent to-amber-400", delay: "0s", dur: "4s" },
                        { pos: "top-1/4 -left-5", size: "w-12 h-12", ring: "from-emerald-400 to-emerald-600", delay: "0.5s", dur: "5s" },
                        { pos: "-bottom-3 left-1/4", size: "w-11 h-11", ring: "from-amber-300 to-accent", delay: "1s", dur: "4.5s" },
                        { pos: "bottom-1/4 -right-5", size: "w-12 h-12", ring: "from-lime-300 to-emerald-500", delay: "1.5s", dur: "5.5s" },
                        { pos: "-top-4 left-1/3", size: "w-11 h-11", ring: "from-accent to-amber-500", delay: "0.8s", dur: "4.2s" },
                      ];
                      return bubbles.map((b, i) => {
                        const img = getSatellite(pkg, i);
                        const offset = getOffset(pkg.title, i);
                        const dragged = offset.x !== 0 || offset.y !== 0;
                        return (
                          <div
                            key={`bubble-${i}`}
                            className={`group/bubble absolute ${b.pos} ${b.size} z-20 touch-none select-none`}
                            style={{
                              transform: `translate(${offset.x}px, ${offset.y}px)`,
                              animation: dragged
                                ? "none"
                                : `amoeba-float ${b.dur} ease-in-out infinite ${b.delay}`,
                            }}
                            onPointerDown={(e) => handlePointerDown(e, pkg.title, i)}
                            onPointerMove={handlePointerMove}
                            onPointerUp={(e) => handlePointerUp(e, pkg.title, i)}
                            onPointerCancel={(e) => {
                              try {
                                (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
                              } catch { /* ignore */ }
                              dragRef.current = null;
                            }}
                          >
                            <div
                              role="button"
                              tabIndex={0}
                              aria-label={`Drag to move or click to upload product image ${i + 1} for ${pkg.title}`}
                              className={`relative block w-full h-full rounded-full p-[2px] bg-gradient-to-br ${b.ring} shadow-lg overflow-hidden cursor-grab active:cursor-grabbing hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-accent`}
                            >
                              <span className="flex w-full h-full rounded-full overflow-hidden bg-background items-center justify-center pointer-events-none">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={`${pkg.title} highlight ${i + 1}`}
                                    loading="lazy"
                                    draggable={false}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Star className="w-1/2 h-1/2 fill-accent text-accent" />
                                )}
                              </span>
                              {/* Hover upload overlay */}
                              <span className="pointer-events-none absolute inset-[2px] rounded-full bg-black/55 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="w-1/3 h-1/3 text-white" />
                              </span>
                            </div>
                            {img && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearSatellite(pkg.title, i);
                                }}
                                aria-label="Remove image"
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground shadow opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Details */}
                  <div className="relative z-10 flex flex-col flex-1 mt-6 text-center">
                    <h3 className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {pkg.bangla}
                    </p>

                    <div className="mt-4 flex items-baseline justify-center gap-2">
                      <span className="font-display text-3xl font-bold bg-gradient-to-br from-primary to-emerald-light bg-clip-text text-transparent">
                        ৳{pkg.price.toLocaleString()}
                      </span>
                      {pkg.oldPrice && (
                        <span className="font-body text-sm text-muted-foreground line-through">
                          ৳{pkg.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <span className="mt-1 inline-flex items-center justify-center gap-1 font-body text-xs font-semibold text-emerald-700">
                        <Check className="w-3 h-3" /> Save ৳{savings.toLocaleString()}
                      </span>
                    )}

                    <Button
                      onClick={() => {
                        const id = `pkg-${pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                        toast.info("Visit the product page to add this item to your cart.");
                        window.dispatchEvent(new Event("open-cart"));
                      }}
                      className="mt-5 w-full bg-gradient-to-r from-primary to-emerald-light hover:from-emerald-light hover:to-primary text-cream rounded-full shadow-md hover:shadow-lg transition-all"
                      size="sm"
                    >
                      Select Package
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous packages"
              className="w-10 h-10 rounded-full bg-card border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === page ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Next packages"
              className="w-10 h-10 rounded-full bg-card border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-center font-body text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </p>

          {/* Auto-slide settings */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSettings((s) => !s)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 font-body text-xs font-semibold text-primary hover:bg-primary hover:text-cream transition-colors"
            >
              <Settings className="w-4 h-4" />
              {showSettings ? "Hide slide settings" : "Slide settings"}
            </button>

            {showSettings && (
              <div className="w-full max-w-md rounded-2xl bg-card/90 backdrop-blur border border-primary/15 shadow-md p-5 flex flex-col gap-4 animate-fade-in">
                {/* Direction */}
                <div className="flex flex-col gap-2">
                  <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Slide direction
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSlideDirection("rtl")}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border text-xs font-semibold font-body transition-colors ${
                        slideDirection === "rtl"
                          ? "bg-primary text-cream border-primary"
                          : "bg-background text-foreground border-primary/20 hover:bg-primary/10"
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" /> Right → Left
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlideDirection("ltr")}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border text-xs font-semibold font-body transition-colors ${
                        slideDirection === "ltr"
                          ? "bg-primary text-cream border-primary"
                          : "bg-background text-foreground border-primary/20 hover:bg-primary/10"
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" /> Left → Right
                    </button>
                  </div>
                </div>

                {/* Interval */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Auto-slide interval
                    </span>
                    <span className="font-body text-xs font-semibold text-primary">
                      {slideIntervalSec}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={1}
                    value={slideIntervalSec}
                    onChange={(e) => setSlideIntervalSec(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={slideIntervalSec}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!Number.isNaN(v) && v >= 1) setSlideIntervalSec(v);
                      }}
                      className="w-20 px-2 py-1 rounded-md border border-primary/20 bg-background text-foreground text-sm font-body"
                    />
                    <span className="font-body text-xs text-muted-foreground">seconds between slides</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Hidden file picker shared by all satellite bubbles */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </section>
  );
};

export default HajjPackages;


