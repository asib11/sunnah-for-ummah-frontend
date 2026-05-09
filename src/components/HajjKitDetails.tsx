"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, Shirt, Droplets, Backpack, Sparkles, BedDouble, Crown, Loader2, ArrowRight, ShoppingCart } from "lucide-react";
import { storeApi } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

// ── Shared constants (must match hajj-kit/page.tsx) ─────────────────────────
export const HAJJ_KIT_QUERY_KEY = ["hajj_kit_products", "hajj-kit"] as const;
export const HAJJ_KIT_HANDLE = "hajj-kit";

const KIT_TYPE_KEYS = {
  men:           "mens-kit",
  "men-premium": "mens-kit-premium",
  women:         "womens-kit",
} as const;

type Kit = keyof typeof KIT_TYPE_KEYS;

const categories = [
  { key: "All",                  icon: null },
  { key: "Clothing & Wear",      icon: Shirt },
  { key: "Hygiene & Care",       icon: Droplets },
  { key: "Bags & Accessories",   icon: Backpack },
  { key: "Spiritual Essentials", icon: Sparkles },
  { key: "Comfort & Bedding",    icon: BedDouble },
] as const;

const kitOptions: { key: Kit; label: string; icon?: typeof Crown }[] = [
  { key: "men",          label: "🧔 Men's Kit" },
  { key: "men-premium",  label: "Men's Kit Premium", icon: Crown },
  { key: "women",        label: "🧕 Women's Kit" },
];

const getBdtPrice = (variant: any): number => {
  if (!variant?.prices?.length) return 0;
  const bdt = variant.prices.find((p: any) => p.currency_code === "bdt");
  return bdt?.amount ?? variant.prices[0]?.amount ?? 0;
};

const HajjKitDetails = () => {
  const [kit, setKit]             = useState<Kit>("men");
  const [activeCat, setActiveCat] = useState<string>("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { addToCart, removeItem, cart } = useCart();

  const { data, isLoading, isError } = useQuery({
    queryKey: HAJJ_KIT_QUERY_KEY,
    queryFn:  () => storeApi.getProductsByCategoryHandle(HAJJ_KIT_HANDLE),
    staleTime: 1000 * 60 * 5,
  });

  const allProducts: any[] = data?.products ?? [];

  const allItems = useMemo(() =>
    allProducts.map((p) => ({
      id:          p.id,
      name:        p.title,
      bangla:      p.metadata?.bn_name || p.title,
      price:       getBdtPrice(p.variants?.[0]),
      category:    p.metadata?.sub_category || "General",
      kitType:     p.metadata?.kit_type || "mens-kit",
      variantId:   p.variants?.[0]?.id || "",
    })),
    [allProducts]
  );

  const kitItems = useMemo(() => {
    const target = KIT_TYPE_KEYS[kit];
    return allItems.filter((i) => i.kitType === target);
  }, [allItems, kit]);

  const filtered = useMemo(() =>
    activeCat === "All" ? kitItems : kitItems.filter((i) => i.category === activeCat),
    [kitItems, activeCat]
  );

  const countFor = (cat: string) =>
    cat === "All" ? kitItems.length : kitItems.filter((i) => i.category === cat).length;

  const handleToggle = (item: (typeof allItems)[number]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        const lineItem = cart?.items?.find((li: any) => li.variant_id === item.variantId);
        if (lineItem) removeItem({ lineId: lineItem.id });
        next.delete(item.id);
        toast.info(`${item.name} removed`);
      } else {
        if (item.variantId) addToCart({ variantId: item.variantId, quantity: 1 });
        next.add(item.id);
        toast.success(`${item.name} added to kit`);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 mt-12 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-body text-muted-foreground animate-pulse tracking-widest uppercase">Loading Components...</p>
      </div>
    );
  }

  if (isError || allItems.length === 0) {
    return (
      <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-neutral-300 mt-12">
        <p className="text-sm font-body text-neutral-400">No kit items found. Check Medusa Category: <strong>hajj-kit</strong></p>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-6xl mx-auto px-4">
      {/* Kit toggle */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap p-1.5 rounded-full bg-white shadow-xl shadow-primary/5 border border-primary/10 gap-1">
          {kitOptions.map((opt) => {
            const Icon = opt.icon;
            const active = kit === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => { setKit(opt.key); setActiveCat("All"); }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-bold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-neutral-50"
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${active ? "text-accent" : "text-accent/60"}`} />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category filters */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => {
          const Icon = c.icon;
          const active = activeCat === c.key;
          const count = countFor(c.key);
          if (count === 0 && c.key !== "All") return null;
          return (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-body text-xs font-bold transition-all border ${
                active
                  ? "bg-foreground text-background border-foreground shadow-md"
                  : "bg-white/60 text-muted-foreground border-neutral-200 hover:border-primary/30"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{c.key} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Items grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const selected = selectedIds.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item)}
              className={`group relative flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border transition-all w-full text-left ${
                selected
                  ? "bg-white border-primary shadow-xl shadow-primary/5 -translate-y-0.5"
                  : "bg-white/40 border-neutral-100 hover:bg-white hover:border-primary/20 hover:shadow-lg"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  selected 
                    ? "bg-primary text-white" 
                    : "bg-neutral-100 text-neutral-300 group-hover:bg-primary/10 group-hover:text-primary/40"
                }`}>
                  {selected ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className={`font-body text-sm font-bold truncate leading-tight ${selected ? "text-primary" : "text-foreground"}`}>
                    {item.name}
                  </p>
                  {item.bangla !== item.name && (
                    <p className="font-body text-[11px] text-muted-foreground truncate leading-tight mt-1 opacity-70">
                      {item.bangla}
                    </p>
                  )}
                </div>
              </div>
              <span className={`font-body text-xs font-bold px-2.5 py-1 rounded-full shrink-0 transition-colors ${
                selected ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"
              }`}>
                {item.price > 0 ? `৳${item.price.toLocaleString()}` : "—"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sticky CTA replacement / Footer link */}
      <div className="mt-12 text-center">
        <a
          href="/hajj-kit"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-bold text-sm hover:bg-accent transition-all shadow-xl shadow-primary/25 hover:scale-105"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Build Your Full Kit</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </a>
        <p className="mt-4 font-body text-[11px] text-muted-foreground uppercase tracking-widest">
          Choose from 21+ essentials for your journey
        </p>
      </div>
    </div>
  );
};

export default HajjKitDetails;
