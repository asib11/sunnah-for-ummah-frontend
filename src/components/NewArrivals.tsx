"use client";

import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag } from "lucide-react";

const NewArrivals = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: () => storeApi.getProducts(8),
    staleTime: 1000 * 60 * 5,
  });

  const products = data?.products ?? [];

  return (
    <section id="new-arrivals" className="container mx-auto px-3 sm:px-4 py-10 md:py-12 scroll-mt-28">
      <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
          New Arrivals
        </h2>
        <a
          href="/eid-collection"
          className="font-body text-xs sm:text-sm font-medium text-primary hover:text-emerald-light transition-colors underline underline-offset-4"
        >
          View All
        </a>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-xl bg-secondary animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="py-12 text-center text-muted-foreground font-body text-sm">
          Failed to load products. Please try again later.
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
          <ShoppingBag className="w-10 h-10 opacity-30" />
          <p className="font-body text-sm">No products available yet.</p>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product: any) => {
            const firstVariant = product.variants?.[0];
            const price = firstVariant?.prices?.[0]?.amount ?? 0;
            return (
              <ProductCard
                key={product.id}
                name={product.title}
                subtitle={product.subtitle ?? undefined}
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

export default NewArrivals;
