"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Shirt, Droplets, Backpack, Sparkles, BedDouble, Crown } from "lucide-react";

type Kit = "men" | "men-premium" | "women";

type Item = {
  name: string;
  bangla: string;
  price: number;
  category: "Clothing & Wear" | "Hygiene & Care" | "Bags & Accessories" | "Spiritual Essentials" | "Comfort & Bedding";
  kit: Kit | "both" | "men-all";
};

const items: Item[] = [
  { name: "Premium Towel Ihram (1 set)", bangla: "প্রিমিয়াম টাওয়েল ইহরাম", price: 1200, category: "Clothing & Wear", kit: "men-all" },
  { name: "Hajj Bedding", bangla: "হজ বেডিং", price: 450, category: "Comfort & Bedding", kit: "both" },
  { name: "Hajji Umbrella", bangla: "হাজী ছাতা", price: 400, category: "Bags & Accessories", kit: "both" },
  { name: "Air Pillow", bangla: "হওয়ায় বালিশ", price: 350, category: "Comfort & Bedding", kit: "both" },
  { name: "Hajji Moisturizing Cream", bangla: "হাজী ময়েশ্চারাইজিং", price: 310, category: "Hygiene & Care", kit: "both" },
  { name: "Waist Foam Belt", bangla: "কোমরের ফোম বেল্ট", price: 290, category: "Clothing & Wear", kit: "men-all" },
  { name: "Unscented Hajji Shampoo", bangla: "গন্ধবিহীন হাজী শ্যাম্পু", price: 280, category: "Hygiene & Care", kit: "both" },
  { name: "Waterproof Pocket Prayer Mat", bangla: "ওয়াটারপ্রুফ পকেট জায়নামাজ", price: 270, category: "Spiritual Essentials", kit: "both" },
  { name: "Hajji Soap (Unscented)", bangla: "হাজী সাবান", price: 240, category: "Hygiene & Care", kit: "both" },
  { name: "Premium Back Bag", bangla: "প্রিমিয়াম পিঠের ব্যাগ", price: 210, category: "Bags & Accessories", kit: "both" },
  { name: "Rope", bangla: "রশি", price: 180, category: "Bags & Accessories", kit: "both" },
  { name: "Miswak", bangla: "মিসওয়াক", price: 70, category: "Hygiene & Care", kit: "both" },
  { name: "Foot Socks", bangla: "পা মোজা", price: 70, category: "Clothing & Wear", kit: "women" },
  { name: "Waterproof Shoe Bag", bangla: "ওয়াটারপ্রুফ জুতার ব্যাগ", price: 60, category: "Bags & Accessories", kit: "both" },
  { name: "Umrah Guidebook", bangla: "উমরা গাইডবুক", price: 50, category: "Spiritual Essentials", kit: "both" },
  { name: "Tawaf Tasbih", bangla: "তাওয়াফ তাসবিহ", price: 40, category: "Spiritual Essentials", kit: "both" },
  { name: "Tayammum Soil", bangla: "তায়াম্মুমের মাটি", price: 40, category: "Spiritual Essentials", kit: "both" },
  { name: "Stone Keeping Bag", bangla: "পাথর রাখার ব্যাগ", price: 40, category: "Bags & Accessories", kit: "both" },
  { name: "Head Shaving Razor", bangla: "মাথা মুন্ডানোর রেজার", price: 35, category: "Hygiene & Care", kit: "men-all" },
  { name: "Dhikr Book", bangla: "জিকিরের বই", price: 35, category: "Spiritual Essentials", kit: "both" },
  { name: "Luggage Sticker", bangla: "লাগেজ স্টিকার", price: 20, category: "Bags & Accessories", kit: "both" },
  // Men's Premium exclusive add-ons
  { name: "Premium Ihram Belt (Leather)", bangla: "প্রিমিয়াম ইহরাম বেল্ট (চামড়া)", price: 650, category: "Clothing & Wear", kit: "men-premium" },
  { name: "Premium Travel Toiletry Kit", bangla: "প্রিমিয়াম ট্রাভেল টয়লেট্রি কিট", price: 550, category: "Hygiene & Care", kit: "men-premium" },
  { name: "Premium Leather Tasbih", bangla: "প্রিমিয়াম চামড়ার তাসবিহ", price: 320, category: "Spiritual Essentials", kit: "men-premium" },
  { name: "Premium Neck Travel Pillow", bangla: "প্রিমিয়াম নেক পিলো", price: 280, category: "Comfort & Bedding", kit: "men-premium" },
  { name: "Premium Crossbody Sling Bag", bangla: "প্রিমিয়াম ক্রসবডি ব্যাগ", price: 480, category: "Bags & Accessories", kit: "men-premium" },
];

const categories = [
  { key: "All", icon: null },
  { key: "Clothing & Wear", icon: Shirt },
  { key: "Hygiene & Care", icon: Droplets },
  { key: "Bags & Accessories", icon: Backpack },
  { key: "Spiritual Essentials", icon: Sparkles },
  { key: "Comfort & Bedding", icon: BedDouble },
] as const;

const HajjKitDetails = () => {
  const [kit, setKit] = useState<Kit>("men");
  const [activeCat, setActiveCat] = useState<string>("All");

  const kitItems = useMemo(
    () =>
      items.filter((i) => {
        if (i.kit === "both") return true;
        if (kit === "men") return i.kit === "men" || i.kit === "men-all";
        if (kit === "men-premium") return i.kit === "men-premium" || i.kit === "men-all";
        return i.kit === "women";
      }),
    [kit]
  );

  const filtered = useMemo(
    () => (activeCat === "All" ? kitItems : kitItems.filter((i) => i.category === activeCat)),
    [kitItems, activeCat]
  );

  const countFor = (cat: string) =>
    cat === "All" ? kitItems.length : kitItems.filter((i) => i.category === cat).length;

  const kitOptions: { key: Kit; label: string; icon?: typeof Crown }[] = [
    { key: "men", label: "🧔 Men's Kit" },
    { key: "men-premium", label: "Men's Kit Premium", icon: Crown },
    { key: "women", label: "🧕 Women's Kit" },
  ];

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
                onClick={() => setKit(opt.key)}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-body text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${active ? "text-accent" : "text-accent"}`} />}
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

      {/* Items grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-background/95 backdrop-blur-sm border border-border shadow-sm hover:shadow-md hover:border-accent/50 transition-all text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="font-body text-sm font-semibold text-foreground truncate">
                  {item.name}
                </p>
                <p className="font-body text-xs text-muted-foreground truncate">
                  {item.bangla}
                </p>
              </div>
            </div>
            <span className="font-body text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-foreground shrink-0">
              ৳{item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HajjKitDetails;
