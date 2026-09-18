"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Shirt, Droplets, Backpack, Sparkles,
  BedDouble, Crown, Plus, ShoppingCart, ArrowRight, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { storeApi } from "@/lib/api";
import HajjKitItemSkeleton from "@/components/skeletons/HajjKitItemSkeleton";

// ── Public constants (used by hajj-kit page too) ──────────────────────────────
export const HAJJ_KIT_HANDLE = "hajj-kit";
export const HAJJ_KIT_QUERY_KEY = ["products", "category", HAJJ_KIT_HANDLE];

// ── Types ────────────────────────────────────────────────────────────────────
type Kit = "men" | "men-premium" | "women";

type Item = {
  id: string;          // Medusa product id
  variantId: string;   // for direct add-to-cart
  name: string;
  bangla: string;
  price: number;       // BDT taka
  category: string;
  thumbnail: string;
  /** Which UI tab this item belongs to */
  kit: Kit;
};

// ── Kit-type mapping: Medusa metadata.kit_type → UI Kit tab ──────────────────
const KIT_TYPE_MAP: Record<string, Kit> = {
  "mens-kit":         "men",
  "mens-kit-premium": "men-premium",
  "womens-kit":       "women",
};

// Sub-category emoji fallbacks for when no thumbnail exists
const CAT_EMOJI: Record<string, string> = {
  "Clothing & Wear":      "👘",
  "Hygiene & Care":       "🧴",
  "Bags & Accessories":   "👜",
  "Spiritual Essentials": "📿",
  "Comfort & Bedding":    "🛏️",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
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

const medusaToItem = (p: any): Item => ({
  id: p.id,
  variantId: p.variants?.[0]?.id ?? "",
  thumbnail: p.thumbnail || p.images?.[0]?.url || "",
  name: p.title,
  bangla: p.subtitle || p.metadata?.bangla || p.title,
  price: getBdtPrice(p.variants?.[0]),
  category: (p.metadata?.sub_category as string) || "General",
  kit: KIT_TYPE_MAP[p.metadata?.kit_type as string] ?? "men",
});

// ── Category filter config ────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, typeof Shirt | null> = {
  "All":                 null,
  "Clothing & Wear":     Shirt,
  "Hygiene & Care":      Droplets,
  "Bags & Accessories":  Backpack,
  "Spiritual Essentials":Sparkles,
  "Comfort & Bedding":   BedDouble,
};

// ── Component ────────────────────────────────────────────────────────────────
const HajjKitDetails = () => {
  const [kit, setKit] = useState<Kit>("men");
  const [activeCat, setActiveCat] = useState<string>("All");
  const { addToCart } = useCart();

  // ── Fetch from Medusa ──────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: HAJJ_KIT_QUERY_KEY,
    queryFn: ({ signal }) => storeApi.getProductsByCategoryHandle(HAJJ_KIT_HANDLE, { signal }),
    staleTime: 1000 * 60 * 5,
  });

  // Map API → Item[]
  const allItems: Item[] = useMemo(() => {
    const apiProducts: any[] = data?.products ?? [];
    return apiProducts.map(medusaToItem);
  }, [data]);

  // ── Derive totals for the subtitle ────────────────────────────────────────
  const { totalCount, totalValue } = useMemo(() => {
    const forKit = allItems.filter((i) => i.kit === kit);
    return {
      totalCount: forKit.length,
      totalValue: forKit.reduce((s, i) => s + i.price, 0),
    };
  }, [allItems, kit]);

  // ── Filter by kit tab ──────────────────────────────────────────────────────
  const kitItems = useMemo(
    () => allItems.filter((i) => i.kit === kit),
    [allItems, kit]
  );

  // ── Filter by category pill ────────────────────────────────────────────────
  const filtered = useMemo(
    () => (activeCat === "All" ? kitItems : kitItems.filter((i) => i.category === activeCat)),
    [kitItems, activeCat]
  );

  // Unique categories present in this kit
  const presentCategories = useMemo(() => {
    const cats = new Set(kitItems.map((i) => i.category));
    return Object.keys(CATEGORY_ICONS).filter((k) => k === "All" || cats.has(k));
  }, [kitItems]);

  const countFor = (cat: string) =>
    cat === "All" ? kitItems.length : kitItems.filter((i) => i.category === cat).length;

  // ── Cart handler ──────────────────────────────────────────────────────────
  const handleAddItem = (item: Item) => {
    if (item.variantId) {
      addToCart({ variantId: item.variantId, quantity: 1 });
      toast.success(`${item.name} added to cart!`);
    } else {
      toast.info(`View ${item.name} in our store to add it to your cart.`);
      window.dispatchEvent(new Event("open-cart"));
    }
  };

  const kitOptions: { key: Kit; label: string; icon?: typeof Crown }[] = [
    { key: "men",         label: "Men's Kit" },
    { key: "men-premium", label: "Men's Kit Premium", icon: Crown },
    { key: "women",       label: "Women's Kit" },
  ];

  return (
    <div className="mt-12 max-w-6xl mx-auto">

      {/* ── Kit toggle ── */}
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
                  active ? "bg-primary text-cream shadow-md" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-accent" />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Live item count + value ── */}
      {!isLoading && (
        <p className="text-center font-body text-sm text-muted-foreground mt-4">
          {totalCount} items — Total value{" "}
          <span className="font-bold text-primary">৳{totalValue.toLocaleString()}</span>
        </p>
      )}

      {/* ── Category filters ── */}
      {!isLoading && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {presentCategories.map((catKey) => {
            const Icon = CATEGORY_ICONS[catKey];
            const active = activeCat === catKey;
            const count = countFor(catKey);
            return (
              <button
                key={catKey}
                onClick={() => setActiveCat(catKey)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-body text-xs sm:text-sm font-medium transition-all border ${
                  active
                    ? "bg-primary text-cream border-primary shadow-md"
                    : "bg-background/90 text-foreground/80 border-border hover:bg-background"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{catKey} ({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Item grid ── */}
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => (
            <HajjKitItemSkeleton key={i} />
          ))}
        </div>
      ) : (
        <TooltipProvider delayDuration={150}>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-background/95 backdrop-blur-sm border border-border shadow-sm hover:shadow-md hover:border-accent/50 transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail / emoji fallback */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-secondary border border-border shrink-0 flex items-center justify-center">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg select-none">
                        {CAT_EMOJI[item.category] || "📦"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground truncate">
                      {item.bangla}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-body text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-foreground">
                    ৳{item.price}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleAddItem(item)}
                        aria-label={`Add ${item.name} to cart`}
                        className="w-7 h-7 rounded-full bg-primary text-cream flex items-center justify-center hover:bg-emerald-light hover:scale-110 active:scale-95 transition-all shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="end"
                      className="w-[220px] p-3 rounded-xl bg-background border border-primary/30 shadow-lg"
                    >
                      <p className="font-display text-sm font-semibold text-foreground leading-tight">
                        {item.name}
                      </p>
                      <p className="font-body text-[11px] text-muted-foreground mt-0.5 truncate">
                        {item.bangla}
                      </p>
                      <p className="font-body text-base font-bold text-accent mt-1.5">
                        ৳{item.price}
                      </p>
                      <div className="my-2 h-px bg-border" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new Event("open-cart")); }}
                        className="w-full inline-flex items-center justify-center gap-1.5 font-body text-xs font-semibold text-primary hover:text-emerald-light transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        View cart
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
};

export default HajjKitDetails;
