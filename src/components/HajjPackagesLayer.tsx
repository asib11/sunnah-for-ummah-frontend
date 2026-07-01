"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowUpRight, Moon, Star } from "lucide-react";


import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";

type Pkg = {
  slug: string;
  title: string;
  bangla: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  image: string;
};

type ItemRow = { package_slug: string; image_url: string; label: string | null; sort_order: number };

type Props = { onNavigateToKit?: () => void };

type Pos = { x: number; y: number };
const POS_STORAGE_KEY = "hajj-pkg-bubble-positions-v1";

const HajjPackagesLayer = ({ onNavigateToKit }: Props = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["hajj-packages"],
    queryFn: () => storeApi.getProductsByCategoryHandle("packages"),
  });

  const packages: Pkg[] = useMemo(() => {
    if (!data?.products) return [];
    return data.products.map((p: any) => {
      const v = p.variants?.[0];
      let price = 0;
      if (v?.prices) {
        const bdt = v.prices.find((pr: any) => pr.currency_code === "bdt");
        const raw = bdt?.amount ?? v.prices[0]?.amount ?? 0;
        price = raw > 10000 ? Math.round(raw / 100) : raw;
      }
      return {
        slug: p.handle,
        title: p.title,
        bangla: p.subtitle || p.metadata?.bangla || "",
        price: price,
        oldPrice: p.metadata?.oldPrice ? parseInt(p.metadata.oldPrice, 10) : undefined,
        badge: p.metadata?.badge,
        image: p.thumbnail || "/assets/pkg-hajj-combo.jpg",
      };
    });
  }, [data]);

  const [itemsBySlug, setItemsBySlug] = useState<Record<string, ItemRow[]>>({});
  const [positions, setPositions] = useState<Record<string, Pos>>(() => {
    try {
      const raw = localStorage.getItem(POS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const draggedRef = useRef(false);

  const savePositions = (next: Record<string, Pos>) => {
    setPositions(next);
    try {
      localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const scrollToKit = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    if (onNavigateToKit) return onNavigateToKit();
    document.getElementById("whats-inside-kit")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  useEffect(() => {
    // TODO: connect to backend API for package_items when ready
    // For now, star bubbles display without product images
  }, []);

  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald to-primary">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-emerald-light/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-3 md:inset-5 border border-accent/20 rounded-2xl pointer-events-none" />

      <div className="relative flex flex-col px-5 md:px-10 py-10 md:py-14">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/10 backdrop-blur-sm mb-3">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            <span className="font-body text-[10px] md:text-xs font-semibold text-accent uppercase tracking-[0.25em]">
              All Hajj &amp; Umrah Packages
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream leading-[1.05] tracking-tight">
            Choose Your <span className="italic text-accent">Package</span>
          </h2>
          <div className="mt-4 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto w-full">
          {isLoading && (
            <div className="col-span-full py-12 flex justify-center items-center">
              <Star className="w-8 h-8 text-accent animate-spin" />
            </div>
          )}
          {!isLoading && packages.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground font-body">
              No packages found.
            </div>
          )}
          {packages.map((p, idx) => {
            const items = itemsBySlug[p.slug] ?? [];
            // Elegantly scattered orbit — uneven spacing, varied radii for a hand-placed feel
            const STAR_LAYOUT: { angle: number; radius: number }[] = [
              { angle: -95, radius: 48 },
              { angle: -40, radius: 52 },
              { angle: 20, radius: 49 },
              { angle: 70, radius: 53 },
              { angle: 130, radius: 50 },
              { angle: 188, radius: 52 },
              { angle: 245, radius: 49 },
            ];
            const STAR_ANGLES = STAR_LAYOUT.map((s) => s.angle);
            const slots = STAR_ANGLES.map((_, i) => items[i] ?? null);

            return (
              <button
                key={p.slug}
                onClick={scrollToKit}
                className="group relative flex flex-col rounded-[2rem] p-6 md:p-7 pt-9 text-center shadow-[0_30px_60px_-30px_hsl(var(--foreground)/0.4)] ring-1 ring-[hsl(159_58%_37%/0.18)] hover:ring-[hsl(159_58%_37%/0.4)] hover:-translate-y-1.5 transition-all duration-500"
                style={{ background: "linear-gradient(180deg, hsl(80 23% 96%) 0%, hsl(140 22% 95%) 55%, hsl(143 26% 90%) 100%)" }}
              >
                {p.badge ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 font-body text-[10px] md:text-[11px] font-extrabold tracking-[0.28em] uppercase px-5 py-2 rounded-full text-[hsl(30_35%_15%)] shadow-[0_10px_24px_-8px_hsl(41_64%_56%/0.7)] ring-1 ring-[hsl(41_64%_40%/0.25)] whitespace-nowrap inline-flex items-center gap-1.5"
                    style={{ background: "linear-gradient(90deg, hsl(41 64% 56%) 0%, hsl(43 78% 65%) 50%, hsl(41 64% 56%) 100%)" }}>
                    <Star className="w-3 h-3 fill-current" />
                    {p.badge}
                  </span>
                ) : (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 font-body text-[10px] font-bold tracking-[0.28em] uppercase px-5 py-2 rounded-full bg-[hsl(80_23%_96%)] text-[hsl(157_86%_21%)] ring-1 ring-[hsl(159_58%_37%/0.3)] shadow-[0_8px_20px_-6px_hsl(var(--foreground)/0.2)] whitespace-nowrap inline-flex items-center gap-1.5">
                    <Moon className="w-3 h-3" />
                    Package
                  </span>
                )}

                <div className="relative w-full aspect-square mx-auto mt-2 overflow-visible">
                  {/* Concentric halos — pale mint outer, warm cream inner (matches reference) */}
                  <span className="pointer-events-none absolute inset-[1%] rounded-full bg-[hsl(143_26%_92%)]" />
                  <span className="pointer-events-none absolute inset-[3%] rounded-full ring-[1px] ring-[hsl(143_41%_70%/0.55)]" />
                  <span className="pointer-events-none absolute inset-[7%] rounded-full ring-[1.5px] ring-[hsl(159_58%_45%/0.5)]" />

                  {/* Decorative dashed broken arcs — mid emerald, matches ref */}
                  <svg aria-hidden className="pointer-events-none absolute -top-3 -right-3 w-20 h-20 md:w-24 md:h-24 text-[hsl(159_58%_45%)]" viewBox="0 0 40 40" fill="none">
                    <path d="M3 20 A17 17 0 0 1 20 3" stroke="currentColor" strokeWidth="1" strokeDasharray="1.8 3.2" strokeLinecap="round" opacity="0.75" />
                  </svg>
                  <svg aria-hidden className="pointer-events-none absolute bottom-1 -left-2 w-14 h-14 text-[hsl(159_58%_45%)]" viewBox="0 0 40 40" fill="none">
                    <path d="M20 37 A17 17 0 0 1 3 20" stroke="currentColor" strokeWidth="1" strokeDasharray="1.8 3.2" strokeLinecap="round" opacity="0.5" />
                  </svg>

                  {/* Organic dark-emerald leaf + small square accents (ref colors) */}
                  <svg aria-hidden className="pointer-events-none absolute -bottom-1 right-[20%] w-7 h-7 text-[hsl(157_86%_21%)] rotate-[18deg]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c2.2 4 5.2 6 5.2 10a5.2 5.2 0 1 1-10.4 0c0-4 2.8-6 5.2-10z" />
                  </svg>
                  <svg aria-hidden className="pointer-events-none absolute top-[42%] -right-3 w-4 h-4 text-[hsl(159_58%_37%)] rotate-45" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>

                  {/* Main circular product image — warm cream backdrop */}
                  <div className="absolute inset-[10%] rounded-full overflow-hidden ring-1 ring-[hsl(159_58%_37%/0.3)] shadow-[inset_0_3px_10px_hsl(var(--foreground)/0.08),0_22px_44px_-14px_hsl(var(--foreground)/0.28)] bg-[hsl(32_30%_90%)]">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    />
                  </div>


                  {/* Star bubbles — draggable, positions persisted in localStorage */}
                  {STAR_LAYOUT.map(({ angle, radius }, i) => {
                    const slot = slots[i];
                    const isEmerald = i % 2 === 0;
                    const sizeBig = i === 1 || i === 4;
                    const key = `${p.slug}-${i}`;
                    const rad = (angle * Math.PI) / 180;
                    const defX = 50 + Math.cos(rad) * radius;
                    const defY = 50 + Math.sin(rad) * radius;
                    const pos = positions[key] ?? { x: defX, y: defY };

                    return (
                      <div
                        key={`bubble-${i}`}
                        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none select-none"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const target = e.currentTarget;
                          const box = target.parentElement as HTMLElement;
                          const rect = box.getBoundingClientRect();
                          target.setPointerCapture(e.pointerId);
                          const startX = e.clientX;
                          const startY = e.clientY;
                          let moved = false;
                          const onMove = (ev: PointerEvent) => {
                            const dx = ev.clientX - startX;
                            const dy = ev.clientY - startY;
                            if (!moved && Math.hypot(dx, dy) > 3) moved = true;
                            const nx = ((ev.clientX - rect.left) / rect.width) * 100;
                            const ny = ((ev.clientY - rect.top) / rect.height) * 100;
                            setPositions((prev) => ({
                              ...prev,
                              [key]: {
                                x: Math.max(-10, Math.min(110, nx)),
                                y: Math.max(-10, Math.min(110, ny)),
                              },
                            }));
                          };
                          const onUp = () => {
                            target.removeEventListener("pointermove", onMove as any);
                            target.removeEventListener("pointerup", onUp);
                            target.removeEventListener("pointercancel", onUp);
                            if (moved) {
                              draggedRef.current = true;
                              setPositions((prev) => {
                                try {
                                  localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(prev));
                                } catch {}
                                return prev;
                              });
                            }
                          };
                          target.addEventListener("pointermove", onMove as any);
                          target.addEventListener("pointerup", onUp);
                          target.addEventListener("pointercancel", onUp);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          const next = { ...positions };
                          delete next[key];
                          savePositions(next);
                        }}
                      >
                        <div
                          title={slot?.label ?? "Drag to move · double-click to reset"}
                          className={`relative ${sizeBig ? "w-11 h-11 md:w-12 md:h-12" : "w-8 h-8 md:w-9 md:h-9"} rounded-full bg-[hsl(80_23%_97%)] flex items-center justify-center overflow-hidden shadow-[0_8px_18px_-6px_hsl(var(--foreground)/0.28)] ring-2 ${
                            isEmerald ? "ring-[hsl(159_58%_45%)]" : "ring-[hsl(143_41%_70%)]"
                          }`}
                        >
                          {slot && (
                            <img
                              src={slot.image_url}
                              alt={slot.label ?? "item"}
                              loading="lazy"
                              draggable={false}
                              className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none"
                            />
                          )}
                          <Star
                            className={`relative ${sizeBig ? "w-[20px] h-[20px]" : "w-[15px] h-[15px]"} text-accent fill-accent drop-shadow-[0_1px_1.5px_hsl(var(--foreground)/0.35)] pointer-events-none`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>


                <div className="relative mt-8 space-y-1.5">
                  <h3 className="font-display text-[17px] md:text-[19px] font-bold text-foreground leading-snug tracking-tight px-2">
                    {p.title}
                  </h3>
                  <p className="font-body text-[11px] md:text-xs text-foreground/55 leading-relaxed">{p.bangla}</p>
                  <div className="mx-auto mt-3 h-px w-10 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                  <div className="flex items-baseline justify-center gap-2 pt-2">
                    <span className="font-display text-[22px] md:text-2xl font-bold text-emerald tracking-tight">
                      ৳{p.price.toLocaleString()}
                    </span>
                    {p.oldPrice && (
                      <span className="font-body text-[11px] text-foreground/40 line-through">
                        ৳{p.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <span className="relative mt-5 inline-flex items-center justify-center gap-1.5 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-emerald group-hover:text-accent transition-colors">
                  View Details
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={scrollToKit}
            className="group inline-flex items-center gap-2 bg-accent text-accent-foreground pl-6 pr-2 py-2 rounded-full text-xs md:text-sm font-body font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
          >
            View All Packages
            <span className="w-8 h-8 rounded-full bg-accent-foreground/10 group-hover:bg-accent-foreground/20 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HajjPackagesLayer;


