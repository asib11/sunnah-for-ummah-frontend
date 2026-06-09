"use client";

import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

const CalligraphyTshirts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "category", "calligraphy-tshirt"],
    queryFn: () => storeApi.getProductsByCategoryHandle("calligraphy-tshirt"),
    staleTime: 1000 * 60 * 5,
  });

  const products = data?.products ?? [];

  return (
    <section
      id="best-sellers"
      className="container mx-auto px-4 py-16 md:py-20 scroll-mt-28"
      aria-labelledby="best-sellers-heading"
    >
      <span id="calligraphy-showcase" className="sr-only" />
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-accent mb-2">
            Men's · Calligraphy Collection
          </p>
          <h2
            id="best-sellers-heading"
            className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-tight"
          >
            Calligraphy <span className="italic text-primary">T-shirts</span>
          </h2>
          <p className="font-body text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
            Wearable Arabic calligraphy — hover any product to flip between front and back views.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="w-8 h-px bg-accent" />
          Hover to flip
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-xl bg-secondary animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <p className="text-center font-body text-sm text-muted-foreground py-12">
          No calligraphy t-shirts found. Check back soon!
        </p>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product: any) => {
            const firstVariant = product.variants?.[0];
            const price = firstVariant?.prices?.[0]?.amount ?? 0;
            return (
              <ProductCard
                key={product.id}
                name={product.title}
                subtitle={product.subtitle ?? "(Unisex)"}
                price={price}
                image={product.thumbnail ?? ""}
                handle={product.handle}
                variantId={firstVariant?.id}
                badge={product.metadata?.badge as string | undefined}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CalligraphyTshirts;
