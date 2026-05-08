"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { storeApi } from "@/lib/api";
import { getProductPrices } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

// Fallback local images (used only when a product has no thumbnail)
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const fallbackImages = [
  product1.src, product2.src, product3.src, product4.src,
  product5.src, product6.src, product7.src, product8.src,
];

const NewArrivals = () => {
  const router = useRouter();
  const [shuffleKey, setShuffleKey] = useState(0);

  // Uses the same BASE_URL, API key, and headers as every other API call
  const { data, isLoading } = useQuery({
    queryKey: ["new_arrivals"],
    queryFn:  () => storeApi.getProducts(12), // Fetch more so shuffle feels real
    staleTime: 1000 * 60 * 5,
  });

  const apiProducts: any[] = data?.products ?? [];

  const displayProducts = apiProducts.map((p, i) => {
    const { price, oldPrice } = getProductPrices(p);
    return {
      id:            p.id,
      name:          p.title,
      price:         price,
      originalPrice: oldPrice,
      image:         p.thumbnail || fallbackImages[i % fallbackImages.length],
      variantId:     p.variants?.[0]?.id,
      handle:        p.handle,
    };
  });

  // Get 8 random products
  const shuffled = [...displayProducts]
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-px bg-primary" />
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary">Explore Latest</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            New Arrivals
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShuffleKey(k => k + 1)}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="font-body text-sm font-semibold">Shuffle Selection</span>
          </button>
          <a
            href="/shop"
            className="font-body text-sm font-semibold text-foreground/70 hover:text-primary transition-colors underline underline-offset-4"
          >
            View All Collection
          </a>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : displayProducts.length === 0 ? (
        <p className="text-center text-muted-foreground py-20 bg-secondary/20 rounded-3xl border border-dashed border-primary/20">
          No products found. Add products in your Medusa Admin.
        </p>
      ) : (
        <div 
          key={shuffleKey}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in"
        >
          {shuffled.map((product) => (
            <ProductCard 
              key={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              variantId={product.variantId}
              handle={product.handle}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
