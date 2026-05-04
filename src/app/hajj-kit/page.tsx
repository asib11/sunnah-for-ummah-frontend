"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { storeApi } from "@/lib/api";
import { HAJJ_KIT_QUERY_KEY, HAJJ_KIT_HANDLE } from "@/components/HajjKitDetails";

// HAJJ_KIT_HANDLE and HAJJ_KIT_QUERY_KEY are imported from HajjKitDetails
// so both this page and the home page component share the SAME React Query
// cache entry — fetched once, reused everywhere.

const KIT_TABS = [
  { key: "mens-kit",         label: "Men's Kit",         emoji: "🕌" },
  { key: "mens-kit-premium", label: "Men's Kit Premium", emoji: "✨" },
  { key: "womens-kit",       label: "Women's Kit",        emoji: "🌸" },
];

// ── Sub-category icon map ────────────────────────────────────────────────────
const SUB_CAT_ICONS: Record<string, string> = {
  "Clothing & Wear":      "👘",
  "Hygiene & Care":       "🧴",
  "Bags & Accessories":   "👜",
  "Spiritual Essentials": "📿",
  "Comfort & Bedding":    "🛏️",
};

// ── Helper: extract BDT price from variant ───────────────────────────────────
const getBdtPrice = (variant: any): number => {
  if (!variant?.prices) return 0;
  const bdt = variant.prices.find((p: any) => p.currency_code === "bdt");
  return bdt?.amount ?? variant.prices[0]?.amount ?? 0;
};

// ── Map a raw Medusa product to a kit item ───────────────────────────────────
const toKitItem = (p: any) => {
  const firstVariant = p.variants?.[0];
  return {
    id:          p.id,
    en:          p.title,
    bn:          p.metadata?.bn_name || p.title,
    price:       getBdtPrice(firstVariant),
    subCategory: p.metadata?.sub_category || "General",
    // kit_type in metadata controls which tab this product belongs to
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

  // ── Fetch all Hajj Kit products once ───────────────────────────────
  // Uses the SAME query key as HajjKitDetails — cache is shared!
  const { data: productsData, isLoading } = useQuery({
    queryKey: HAJJ_KIT_QUERY_KEY,
    queryFn:  () => storeApi.getProductsByCategoryHandle(HAJJ_KIT_HANDLE),
    staleTime: 1000 * 60 * 5,
    gcTime:    1000 * 60 * 15,
  });

  // ── Map & filter by active kit tab (using metadata.kit_type) ─────────────
  const allKitItems = useMemo(() => {
    const apiProducts = productsData?.products ?? [];
    return apiProducts.map(toKitItem);
  }, [productsData]);

  const kitItems = useMemo(() => {
    return allKitItems.filter((item) => item.kitType === activeKit);
  }, [allKitItems, activeKit]);

  // ── Filter pills ─────────────────────────────────────────────────────────
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

  // ── Totals ───────────────────────────────────────────────────────────────
  const selectedItems = useMemo(
    () => kitItems.filter((item) => selectedIds.has(item.id)),
    [kitItems, selectedIds]
  );
  const totalValue = selectedItems.reduce((acc, item) => acc + item.price, 0);

  // ── Toggle selection ─────────────────────────────────────────────────────
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
    <div
      className="min-h-screen flex flex-col font-body"
      style={{ background: "linear-gradient(135deg, #fdfcf7 0%, #f0ede4 100%)" }}
    >
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 mt-20">
        {/* ── Summary Banner ─────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <p className="text-lg text-neutral-600">
            <span className="font-bold text-neutral-800">
              {selectedItems.length} premium item{selectedItems.length !== 1 ? "s" : ""}
            </span>
            {selectedItems.length > 0 ? (
              <>
                {" "}—{" "}
                <span className="text-neutral-500">Total value</span>{" "}
                <span className="font-extrabold text-primary text-xl">
                  ৳{totalValue.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-neutral-400 ml-2">— Select items to build your kit</span>
            )}
          </p>
          <div className="mt-2 mx-auto w-24 h-0.5 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        </div>

        {/* ── Kit Tabs ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
          {KIT_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleKitSwitch(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                activeKit === tab.key
                  ? "bg-primary text-white shadow-md scale-105"
                  : "bg-white text-neutral-600 hover:bg-primary/10 border border-neutral-200"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Loading ────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : kitItems.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg font-medium">No products found in this kit.</p>
            <p className="text-sm mt-1">Add products to the <strong>Hajj Kit</strong> category in your Medusa admin.</p>
          </div>
        ) : (
          <>
            {/* ── Filter Pills ──────────────────────────────────────────── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
              <button
                onClick={() => setActiveFilter("All")}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                  activeFilter === "All"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-primary/40"
                }`}
              >
                All ({kitItems.length})
              </button>
              {Object.entries(subCategories).map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                    activeFilter === cat
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-primary/40"
                  }`}
                >
                  <span>{SUB_CAT_ICONS[cat] || "📦"}</span>
                  {cat} ({count})
                </button>
              ))}
            </div>

            {/* ── Item Grid ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map((item) => {
                const selected = selectedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggle(item)}
                    className={`flex items-center gap-3 p-4 rounded-2xl text-left transition-all border-2 w-full group ${
                      selected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-neutral-100 bg-white hover:border-primary/30 hover:shadow-sm"
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="flex-shrink-0">
                      {selected ? (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      ) : (
                        <Circle className="w-6 h-6 text-neutral-300 group-hover:text-primary/40 transition-colors" />
                      )}
                    </div>

                    {/* Thumbnail (if exists) */}
                    {item.thumbnail && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img src={item.thumbnail} alt={item.en} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Names */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-800 truncate leading-tight">
                        {item.en}
                      </p>
                      {item.bn !== item.en && (
                        <p
                          className="text-xs text-neutral-400 truncate leading-tight mt-0.5"
                          style={{ fontFamily: "'Noto Sans Bengali', 'Hind Siliguri', sans-serif" }}
                        >
                          {item.bn}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0 text-right">
                      <p className={`text-sm font-extrabold ${selected ? "text-primary" : "text-neutral-700"}`}>
                        {item.price > 0 ? `৳${item.price}` : "—"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Sticky CTA ────────────────────────────────────────────────── */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md">
            <div className="bg-primary text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">
                  {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-xl font-extrabold">৳{totalValue.toLocaleString()}</p>
              </div>
              <a
                href="/cart"
                className="bg-white text-primary font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                View Cart →
              </a>
            </div>
          </div>
        )}
      </main>

      <div className={selectedItems.length > 0 ? "mb-24" : ""}>
        <Footer />
      </div>
    </div>
  );
}
