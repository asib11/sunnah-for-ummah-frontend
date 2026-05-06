"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, Star, CheckCircle2, Loader2, ShoppingCart, Upload, X } from "lucide-react";
import HajjKitDetails from "./HajjKitDetails";
import { storeApi } from "@/lib/api";
import { getProductPrices } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import hajjHeroBg from "@/assets/hajj-hero-bg.jpg";

// Fallback images for packages if no thumbnail is provided in Medusa
import pkgHajjCombo from "@/assets/pkg-hajj-combo.jpg";
import pkgHajjMen from "@/assets/pkg-hajj-men.jpg";
import pkgHajjMenPremium from "@/assets/pkg-hajj-men-premium.jpg";
import pkgHajjWomen from "@/assets/pkg-hajj-women.jpg";

const PACKAGES_HANDLE = "packages";
const STORAGE_KEY = "sfu:hajj-satellites";
const POS_STORAGE_KEY = "sfu:hajj-satellite-positions";

type Offset = { x: number; y: number };

const fallbackImages = [
  pkgHajjCombo,
  pkgHajjMen,
  pkgHajjMenPremium,
  pkgHajjWomen,
];

const HajjPackages = () => {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Satellite image overrides per package
  const [satelliteOverrides, setSatelliteOverrides] = useState<Record<string, (string | null)[]>>(() => {
    if (typeof window === "undefined") return {};
    try { const r = window.localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
  });
  const [satellitePositions, setSatellitePositions] = useState<Record<string, Offset[]>>(() => {
    if (typeof window === "undefined") return {};
    try { const r = window.localStorage.getItem(POS_STORAGE_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
  });
  const [editing, setEditing] = useState<{ pkg: string; index: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ pkg: string; index: number; startX: number; startY: number; baseX: number; baseY: number; moved: boolean } | null>(null);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(satelliteOverrides)); } catch { /* ignore */ }
  }, [satelliteOverrides]);
  useEffect(() => {
    try { window.localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(satellitePositions)); } catch { /* ignore */ }
  }, [satellitePositions]);

  const getSatellite = (pkgId: string, i: number): string | undefined => satelliteOverrides[pkgId]?.[i] ?? undefined;
  const getOffset = (pkgId: string, i: number): Offset => satellitePositions[pkgId]?.[i] ?? { x: 0, y: 0 };
  const openPicker = (pkgId: string, index: number) => { setEditing({ pkg: pkgId, index }); setTimeout(() => fileInputRef.current?.click(), 0); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file || !editing) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSatelliteOverrides(prev => { const arr = [...(prev[editing.pkg] ?? [null,null,null,null,null])]; arr[editing.index] = dataUrl; return { ...prev, [editing.pkg]: arr }; });
      setEditing(null);
    };
    reader.readAsDataURL(file);
  };
  const clearSatellite = (pkgId: string, i: number) => {
    setSatelliteOverrides(prev => { const arr = [...(prev[pkgId] ?? [null,null,null,null,null])]; arr[i] = null; return { ...prev, [pkgId]: arr }; });
  };
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, pkgId: string, index: number) => {
    const base = getOffset(pkgId, index);
    dragRef.current = { pkg: pkgId, index, startX: e.clientX, startY: e.clientY, baseX: base.x, baseY: base.y, moved: false };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current; if (!d) return;
    const dx = e.clientX - d.startX, dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    d.moved = true;
    setSatellitePositions(prev => { const arr = [...(prev[d.pkg] ?? [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}])]; arr[d.index] = { x: d.baseX+dx, y: d.baseY+dy }; return { ...prev, [d.pkg]: arr }; });
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, pkgId: string, index: number) => {
    const d = dragRef.current;
    try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    dragRef.current = null;
    if (!d || !d.moved) openPicker(pkgId, index);
  };

  // ── Fetch Packages from Medusa ──────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["packages_category", PACKAGES_HANDLE],
    queryFn: () => storeApi.getProductsByCategoryHandle(PACKAGES_HANDLE),
    staleTime: 1000 * 60 * 5,
  });

  const apiProducts = data?.products ?? [];

  // ── Map Medusa products to the component's Package structure ────────────
  const displayPackages = useMemo(() => {
    return apiProducts.map((p: any, idx: number) => {
      const { price, oldPrice } = getProductPrices(p);
      
      return {
        id: p.id,
        title: p.title,
        bangla: p.metadata?.bn_name || p.title,
        price: price,
        oldPrice: oldPrice,
        badge: p.metadata?.badge,
        image: p.thumbnail || fallbackImages[idx % fallbackImages.length].src,
        handle: p.handle,
        variantId: p.variants?.[0]?.id,
      };
    });
  }, [apiProducts]);

  const handleSelectPackage = async (pkg: any) => {
    if (!pkg.variantId) {
      toast.error("This package is currently unavailable.");
      return;
    }

    try {
      setAddingId(pkg.id);
      await addToCart({ variantId: pkg.variantId, quantity: 1 });
      toast.success(`${pkg.title} added to cart!`, {
        description: "You can view it in your shopping cart.",
        icon: <ShoppingCart className="w-4 h-4 text-emerald-500" />,
      });
    } catch (error) {
      console.error("Error adding package to cart:", error);
      toast.error("Failed to add package to cart. Please try again.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="relative">
      {/* Hero banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hajjHeroBg.src}
            alt="Pilgrims at the Kaaba in Mecca"
            loading="lazy"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/85" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-accent/60 bg-primary/30 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-body text-sm font-medium text-accent">
              সম্পূর্ণ হজ্জ ও উমরাহ সামগ্রী
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mt-6 leading-tight">
            Hajj Mabroor
          </h2>
          <p className="font-display text-3xl md:text-5xl text-accent mt-2 italic">
            হজ্জ মাবরূর
          </p>

          <p className="font-body text-base md:text-lg text-primary-foreground/90 mt-6 max-w-2xl mx-auto leading-relaxed">
            Everything you need for a blessed journey — carefully curated,
            quality-assured, and packed in one convenient kit.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="font-display text-3xl md:text-5xl font-bold text-accent">21+</span>
              <span className="font-body text-xs md:text-sm text-primary-foreground/80 mt-1">Essential Items</span>
            </div>
            <div className="flex flex-col items-center border-x border-primary-foreground/20">
              <span className="font-display text-3xl md:text-5xl font-bold text-accent">6</span>
              <span className="font-body text-xs md:text-sm text-primary-foreground/80 mt-1">Package Options</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 md:w-11 md:h-11 text-accent" strokeWidth={1.8} />
              <span className="font-body text-xs md:text-sm text-primary-foreground/80 mt-1">Quality Assured</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Inside the Kit */}
      <div className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What&apos;s Inside the Kit
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
      <div className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-emerald-50/40">
        {/* Decorative background blobs */}
        <span className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-[62%_38%_54%_46%/48%_56%_44%_52%] bg-[radial-gradient(circle_at_30%_30%,hsl(152_60%_45%/0.25),transparent_70%)] blur-2xl" />
        <span className="pointer-events-none absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-[40%_60%_70%_30%/50%_30%_70%_50%] bg-[radial-gradient(circle_at_50%_50%,hsl(152_45%_25%/0.2),transparent_70%)] blur-2xl" />
        <span className="pointer-events-none absolute -bottom-20 left-1/4 w-80 h-80 rounded-[70%_30%_46%_54%/38%_62%_38%_62%] bg-[radial-gradient(circle_at_50%_50%,hsl(140_55%_55%/0.18),transparent_70%)] blur-2xl" />

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-body text-xs font-semibold tracking-widest uppercase text-primary">Curated Packages</span>
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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : displayPackages.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No packages found in Medusa category <strong>&quot;packages&quot;</strong>.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {displayPackages.map((pkg) => {
                const savings = pkg.oldPrice ? pkg.oldPrice - pkg.price : 0;
                const isAdding = addingId === pkg.id;
                return (
                  <article
                    key={pkg.id}
                    className="group relative flex flex-col rounded-[2rem] bg-card/80 backdrop-blur-sm border border-primary/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-500 hover:-translate-y-3 p-6 overflow-visible"
                  >
                    {/* Green geometric decorations */}
                    <span className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 border-2 border-dashed border-primary/30 rounded-full" />
                    <span className="pointer-events-none absolute -bottom-4 -left-4 w-14 h-14 border border-accent/40 rounded-[40%_60%_60%_40%/50%_40%_60%_50%]" />
                    <span className="pointer-events-none absolute top-12 -right-2 w-4 h-4 bg-emerald-500/40" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                    <span className="pointer-events-none absolute bottom-24 -left-2 w-3 h-3 bg-accent/70" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                    <span className="pointer-events-none absolute top-3 right-10 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="pointer-events-none absolute bottom-32 right-3 w-1 h-1 rounded-full bg-emerald-600" />
                    <span className="pointer-events-none absolute top-1/2 left-0 w-full h-[1px] bg-[repeating-linear-gradient(90deg,hsl(var(--primary)/0.15)_0_4px,transparent_4px_10px)] opacity-50" />

                    {pkg.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 font-body text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full bg-gradient-to-r from-accent to-amber-400 text-accent-foreground shadow-lg ring-2 ring-background">
                        ★ {pkg.badge}
                      </span>
                    )}

                    {/* Main blob with orbit rings, sparkle dots, and satellite bubbles */}
                    <div className="relative z-10 mx-auto w-full aspect-square">
                      {/* Outer glow halo */}
                      <span className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,hsl(152_70%_50%/0.35)_0%,hsl(140_60%_45%/0.15)_45%,transparent_75%)] blur-2xl animate-pulse" />
                      {/* Rotating dashed orbit ring */}
                      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] rounded-full border border-dashed border-emerald-500/40 amoeba-spin-slow" />
                      {/* Counter-rotating thin ring */}
                      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[108%] h-[108%] rounded-full border border-emerald-400/20 [animation:amoeba-spin_30s_linear_infinite_reverse]" />
                      {/* Soft morphing gradient backdrop */}
                      <span className="pointer-events-none absolute -inset-3 bg-[linear-gradient(135deg,hsl(152_55%_30%/0.25)_0%,hsl(140_60%_45%/0.22)_50%,hsl(165_70%_55%/0.25)_100%)] amoeba-blob-bg" />
                      {/* Orbiting accent dots */}
                      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] orbit-container">
                        {[0, 72, 144, 216, 288].map((angle, i) => (
                          <div key={`dot-${i}`} className="absolute top-1/2 left-1/2" style={{ transform: `rotate(${angle}deg) translateY(-50%)` }}>
                            <span className={`block rounded-full shadow-[0_0_10px_hsl(152_70%_50%/0.8)] ${i % 2 === 0 ? "w-2.5 h-2.5 bg-accent" : "w-1.5 h-1.5 bg-emerald-400"}`} />
                          </div>
                        ))}
                      </div>
                      {/* Counter-orbit sparkles */}
                      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[108%] h-[108%] orbit-container-reverse">
                        {[36, 180, 300].map((angle, i) => (
                          <div key={`spark-${i}`} className="absolute top-1/2 left-1/2" style={{ transform: `rotate(${angle}deg) translateY(-50%)` }}>
                            <span className="block w-1 h-1 rounded-full bg-lime-300 shadow-[0_0_8px_hsl(85_90%_60%)]" />
                          </div>
                        ))}
                      </div>
                      {/* The main blob image */}
                      <div className="relative w-full h-full overflow-hidden rounded-full bg-muted ring-2 ring-emerald-500/70 shadow-[0_15px_45px_-10px_hsl(152_50%_30%/0.55)] group-hover:ring-accent transition-all duration-500">
                        <img src={pkg.image} alt={pkg.title} loading="lazy" width={800} height={800} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/0 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      {/* Draggable satellite bubbles */}
                      {(() => {
                        const bubbles = [
                          { pos: "-top-3 -right-3", size: "w-14 h-14", ring: "from-accent to-amber-400", delay: "0s", dur: "4s" },
                          { pos: "top-1/4 -left-5",  size: "w-12 h-12", ring: "from-emerald-400 to-emerald-600", delay: "0.5s", dur: "5s" },
                          { pos: "-bottom-3 left-1/4", size: "w-11 h-11", ring: "from-amber-300 to-accent", delay: "1s", dur: "4.5s" },
                          { pos: "bottom-1/4 -right-5", size: "w-12 h-12", ring: "from-lime-300 to-emerald-500", delay: "1.5s", dur: "5.5s" },
                          { pos: "-top-4 left-1/3", size: "w-11 h-11", ring: "from-accent to-amber-500", delay: "0.8s", dur: "4.2s" },
                        ];
                        return bubbles.map((b, i) => {
                          const img = getSatellite(pkg.id, i);
                          const offset = getOffset(pkg.id, i);
                          const dragged = offset.x !== 0 || offset.y !== 0;
                          return (
                            <div
                              key={`bubble-${i}`}
                              className={`group/bubble absolute ${b.pos} ${b.size} z-20 touch-none select-none`}
                              style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, animation: dragged ? "none" : `amoeba-float ${b.dur} ease-in-out infinite ${b.delay}` }}
                              onPointerDown={(e) => handlePointerDown(e, pkg.id, i)}
                              onPointerMove={handlePointerMove}
                              onPointerUp={(e) => handlePointerUp(e, pkg.id, i)}
                              onPointerCancel={(e) => { try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ } dragRef.current = null; }}
                            >
                              <div
                                role="button" tabIndex={0}
                                aria-label={`Drag or click to upload product image ${i + 1}`}
                                className={`relative block w-full h-full rounded-full p-[2px] bg-gradient-to-br ${b.ring} shadow-lg overflow-hidden cursor-grab active:cursor-grabbing hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-accent`}
                              >
                                <span className="flex w-full h-full rounded-full overflow-hidden bg-background items-center justify-center pointer-events-none">
                                  {img ? <img src={img} alt={`highlight ${i + 1}`} loading="lazy" draggable={false} className="w-full h-full object-cover" /> : <Star className="w-1/2 h-1/2 fill-accent text-accent" />}
                                </span>
                                <span className="pointer-events-none absolute inset-[2px] rounded-full bg-black/55 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center justify-center">
                                  <Upload className="w-1/3 h-1/3 text-white" />
                                </span>
                              </div>
                              {img && (
                                <button type="button" onClick={(e) => { e.stopPropagation(); clearSatellite(pkg.id, i); }} aria-label="Remove image" className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground shadow opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center justify-center">
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
                      <h3 className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{pkg.title}</h3>
                      <p className="font-body text-sm text-muted-foreground mt-1">{pkg.bangla}</p>
                      <div className="mt-4 flex items-baseline justify-center gap-2">
                        <span className="font-display text-3xl font-bold bg-gradient-to-br from-primary to-emerald-light bg-clip-text text-transparent">৳{pkg.price.toLocaleString()}</span>
                        {pkg.oldPrice && <span className="font-body text-sm text-muted-foreground line-through">৳{pkg.oldPrice.toLocaleString()}</span>}
                      </div>
                      {savings > 0 && (
                        <span className="mt-1 inline-flex items-center justify-center gap-1 font-body text-xs font-semibold text-emerald-700">
                          <Check className="w-3 h-3" /> Save ৳{savings.toLocaleString()}
                        </span>
                      )}
                      <Button
                        className="mt-5 w-full bg-gradient-to-r from-primary to-emerald-light hover:from-emerald-light hover:to-primary text-primary-foreground rounded-full shadow-md hover:shadow-lg transition-all"
                        size="sm"
                        onClick={() => handleSelectPackage(pkg)}
                        disabled={isAdding}
                      >
                        {isAdding ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Adding...</>) : "Select Package"}
                      </Button>
                      <a href={`/products/${pkg.handle}`} className="mt-2 text-center text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">View Details</a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Hidden file picker for satellite bubbles */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </section>

  );
};

export default HajjPackages;
