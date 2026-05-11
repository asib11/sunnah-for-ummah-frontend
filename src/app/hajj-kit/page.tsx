"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { CheckCircle2, Circle, Loader2, Sparkles, ShoppingCart, ArrowRight, Package } from "lucide-react";
import { toast } from "sonner";
import { storeApi } from "@/lib/api";
import { HAJJ_KIT_QUERY_KEY, HAJJ_KIT_HANDLE } from "@/components/HajjKitDetails";

const KIT_TABS = [
  { key: "mens-kit",         label: "Men's Kit",         emoji: "🕌" },
  { key: "mens-kit-premium", label: "Men's Kit Premium", emoji: "✨" },
  { key: "womens-kit",       label: "Women's Kit",        emoji: "🌸" },
];

const SUB_CAT_ICONS: Record<string, string> = {
  "Clothing & Wear":      "👘",
  "Hygiene & Care":       "🧴",
  "Bags & Accessories":   "👜",
  "Spiritual Essentials": "📿",
  "Comfort & Bedding":    "🛏️",
};

const getBdtPrice = (variant: any): number => {
  if (!variant?.prices) return 0;
  const bdt = variant.prices.find((p: any) => p.currency_code === "bdt");
  return bdt?.amount ?? variant.prices[0]?.amount ?? 0;
};

const toKitItem = (p: any) => {
  const firstVariant = p.variants?.[0];
  return {
    id:          p.id,
    en:          p.title,
    bn:          p.subtitle || p.title,
    price:       getBdtPrice(firstVariant),
    subCategory: p.metadata?.sub_category || "General",
    kitType:     p.metadata?.kit_type || "mens-kit",
    variantId:   firstVariant?.id || "",
    thumbnail:   p.thumbnail || "",
  };
};

export default function HajjKitPage() {
  const [activeKit, setActiveKit]     = useState("mens-kit");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { addToCart, removeItem, cart } = useCart();

  const { data: productsData, isLoading } = useQuery({
    queryKey: HAJJ_KIT_QUERY_KEY,
    queryFn:  () => storeApi.getProductsByCategoryHandle(HAJJ_KIT_HANDLE),
    staleTime: 1000 * 60 * 5,
  });

  const allKitItems = useMemo(() => {
    const apiProducts = productsData?.products ?? [];
    return apiProducts.map(toKitItem);
  }, [productsData]);

  const kitItems = useMemo(() => {
    return allKitItems.filter((item) => item.kitType === activeKit);
  }, [allKitItems, activeKit]);

  const subCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    kitItems.forEach((item) => {
      counts[item.subCategory] = (counts[item.subCategory] || 0) + 1;
    });
    return counts;
  }, [kitItems]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return kitItems;
    return kitItems.filter((item) => item.subCategory === activeFilter);
  }, [kitItems, activeFilter]);

  const selectedItems = useMemo(
    () => kitItems.filter((item) => selectedIds.has(item.id)),
    [kitItems, selectedIds]
  );
  const totalValue = selectedItems.reduce((acc, item) => acc + item.price, 0);

  const handleToggle = (item: ReturnType<typeof toKitItem>) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        const lineItem = cart?.items?.find((li: any) => li.variant_id === item.variantId);
        if (lineItem) removeItem({ lineId: lineItem.id });
        next.delete(item.id);
        toast.info(`${item.en} removed from kit`);
      } else {
        if (item.variantId) addToCart({ variantId: item.variantId, quantity: 1 });
        next.add(item.id);
        toast.success(`${item.en} added to kit`);
      }
      return next;
    });
  };

  const handleKitSwitch = (key: string) => {
    setActiveKit(key);
    setActiveFilter("All");
    setSelectedIds(new Set());
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-body">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 md:py-20 mt-16 overflow-hidden">
        {/* ── Background Decoration ────────────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -ml-48 -mb-48" />
          <div 
            className="absolute inset-0 opacity-[0.02] grayscale"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Build Your Own</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
            The Interactive <span className="italic text-primary">Hajj Kit</span> Builder
          </h1>
          <p className="font-body text-sm md:text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
            Choose your preferred kit type and select exactly what you need for your blessed journey. Every item is quality-assured for your peace of mind.
          </p>

          {/* Live Status Dashboard */}
          <div className="mt-10 max-w-lg mx-auto bg-white/70 backdrop-blur-md border border-primary/15 rounded-3xl p-5 shadow-xl shadow-primary/5 flex items-center justify-between transition-all">
            <div className="text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Your Selection</p>
                <p className="text-lg font-bold text-foreground">
                  {selectedItems.length} <span className="text-sm font-normal text-muted-foreground">Items</span>
                </p>
              </div>
            </div>
            <div className="h-10 w-px bg-primary/10 mx-2" />
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Value</p>
              <p className="text-2xl font-display font-bold text-primary">
                ৳{totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ── Kit Tabs ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-neutral-200 shadow-inner flex items-center gap-1">
            {KIT_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleKitSwitch(tab.key)}
                className={`relative px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                  activeKit === tab.key
                    ? "bg-primary text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-neutral-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.emoji}</span>
                  {tab.label}
                </span>
                {activeKit === tab.key && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/40 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-body text-muted-foreground animate-pulse">Fetching kit components...</p>
          </div>
        ) : kitItems.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-neutral-300">
            <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-neutral-500">No products found in this kit.</p>
            <p className="text-sm mt-1 text-neutral-400">Add products to the <strong className="text-primary">Hajj Kit</strong> category in Medusa.</p>
          </div>
        ) : (
          <>
            {/* ── Filter Pills ──────────────────────────────────────────── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
              <button
                onClick={() => setActiveFilter("All")}
                className={`flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold transition-all border ${
                  activeFilter === "All"
                    ? "bg-foreground text-background border-foreground shadow-md"
                    : "bg-white text-muted-foreground border-neutral-200 hover:border-primary/40"
                }`}
              >
                All ({kitItems.length})
              </button>
              {Object.entries(subCategories).map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                    activeFilter === cat
                      ? "bg-foreground text-background border-foreground shadow-md"
                      : "bg-white text-muted-foreground border-neutral-200 hover:border-primary/40"
                  }`}
                >
                  <span>{SUB_CAT_ICONS[cat] || "📦"}</span>
                  {cat} ({count})
                </button>
              ))}
            </div>

            {/* ── Item Grid ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const selected = selectedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggle(item)}
                    className={`group relative flex items-center gap-4 p-5 rounded-[1.5rem] text-left transition-all border-2 w-full ${
                      selected
                        ? "border-primary bg-white shadow-xl shadow-primary/5 -translate-y-1"
                        : "border-neutral-100 bg-white/60 hover:bg-white hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Checkbox / Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        selected 
                          ? "bg-primary text-white" 
                          : "bg-neutral-100 text-neutral-300 group-hover:bg-primary/10 group-hover:text-primary/40"
                      }`}>
                        {selected ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className={`relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-100 border transition-all ${
                      selected ? "border-primary/30" : "border-neutral-100"
                    }`}>
                      <img 
                        src={item.thumbnail} 
                        alt={item.en} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          selected ? "scale-110" : "group-hover:scale-105"
                        }`} 
                      />
                      {selected && <div className="absolute inset-0 bg-primary/5" />}
                    </div>

                    {/* Names & Price */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate leading-tight ${selected ? "text-primary" : "text-foreground"}`}>
                        {item.en}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate leading-tight mt-1 opacity-70">
                        {item.bn !== item.en ? item.bn : item.subCategory}
                      </p>
                      <p className={`text-sm font-extrabold mt-2 ${selected ? "text-primary" : "text-neutral-700"}`}>
                        {item.price > 0 ? `৳${item.price.toLocaleString()}` : "—"}
                      </p>
                    </div>

                    {/* Subtle glow for selected items */}
                    {selected && (
                      <div className="absolute inset-0 -z-10 bg-primary/5 blur-xl rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Sticky CTA ────────────────────────────────────────────────── */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md animate-fade-in">
            <div className="bg-foreground text-background rounded-full shadow-2xl px-6 py-4 flex items-center justify-between border border-primary/20 ring-4 ring-white/10 backdrop-blur-lg">
              <div>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                  {selectedItems.length} items ready
                </p>
                <p className="text-xl font-display font-bold">৳{totalValue.toLocaleString()}</p>
              </div>
              <a
                href="/cart"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-full hover:bg-accent transition-all hover:scale-105 shadow-lg shadow-primary/25"
              >
                <span>Complete Kit</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        )}
      </main>

      <div className={selectedItems.length > 0 ? "mb-28" : ""}>
        <Footer />
      </div>
    </div>
  );
}
