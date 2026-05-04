"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, Shirt, Droplets, Backpack, Sparkles, BedDouble, Crown, Loader2 } from "lucide-react";
import { storeApi } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

// ── Shared constants (must match hajj-kit/page.tsx) ─────────────────────────
// Both this component and /hajj-kit page use the SAME query key so React Query
// returns cached data instantly on the second render — no duplicate network call.
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

  // Shared query key — if /hajj-kit page already loaded this, it's instant from cache
  const { data, isLoading, isError } = useQuery({
    queryKey: HAJJ_KIT_QUERY_KEY,
    queryFn:  () => storeApi.getProductsByCategoryHandle(HAJJ_KIT_HANDLE),
    staleTime: 1000 * 60 * 5,   // 5 min — don't refetch unless stale
    gcTime:    1000 * 60 * 15,  // keep in memory for 15 min
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

  // ── Cart toggle ────────────────────────────────────────────────────────────
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
      <div className="flex justify-center items-center h-48 mt-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || allItems.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12 mt-12">
        No kit items found. Add products to the <strong>Hajj Kit</strong> category in Medusa Admin.
      </p>
    );
  }

  return (
    <div className="mt-12 max-w-6xl mx-auto">
      {/* Kit toggle */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap p-1.5 rounded-full bg-background/95 backdrop-blur-sm shadow-lg border border-border gap-1">
          {kitOptions.map((opt) => {
            const Icon = opt.icon;
            const active = kit === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => { setKit(opt.key); setActiveCat("All"); }}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-body text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-accent" />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category filters */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {categories.map((c) => {
          const Icon = c.icon;
          const active = activeCat === c.key;
          const count = countFor(c.key);
          if (count === 0 && c.key !== "All") return null;
          return (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-body text-xs sm:text-sm font-medium transition-all border ${
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-background/90 text-foreground/80 border-border hover:bg-background"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{c.key} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Items grid — now selectable */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8 mt-6">
          No items in this kit. Set <code>kit_type</code> in product metadata.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item) => {
            const selected = selectedIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleToggle(item)}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-sm w-full text-left transition-all group ${
                  selected
                    ? "bg-primary/5 border-primary shadow-md"
                    : "bg-background/95 border-border hover:shadow-md hover:border-accent/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {selected
                    ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    : <Circle className="w-5 h-5 text-neutral-300 group-hover:text-primary/40 transition-colors shrink-0" />
                  }
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">
                      {item.name}
                    </p>
                    {item.bangla !== item.name && (
                      <p
                        className="font-body text-xs text-muted-foreground truncate"
                        style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                      >
                        {item.bangla}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`font-body text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                  selected ? "bg-primary text-white" : "bg-secondary text-foreground"
                }`}>
                  {item.price > 0 ? `৳${item.price}` : "—"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* View Full Kit Builder link */}
      <div className="mt-8 text-center">
        <a
          href="/hajj-kit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-md"
        >
          🛒 Build Your Full Kit →
        </a>
      </div>
    </div>
  );
};

export default HajjKitDetails;
