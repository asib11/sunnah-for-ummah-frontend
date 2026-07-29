"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

export default function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = React.use(params);

  // Fetch category first
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category", handle],
    queryFn: ({ signal }) => storeApi.getCategoryByHandle(handle, { signal }),
  });

  // Then fetch products if category ID exists
  const { data: productsData, isLoading: isProductsLoading, isError: isProductsError } = useQuery({
    queryKey: ["category_products", category?.id],
    queryFn: ({ signal }) => storeApi.getProductsByCategory(category?.id as string, { signal }),
    enabled: !!category?.id,
  });

  const isLoading = isCategoryLoading || (!!category?.id && isProductsLoading);

  const displayProducts = productsData?.products?.map((p: any) => {
        const variants = p.variants ?? [];
        const lowestVariant = variants[0];
        const bdtPrices = lowestVariant?.prices?.filter((pr: any) => pr.currency_code === "bdt") ?? [];
        let price = 0;
        let originalPrice = null;
        if (bdtPrices.length > 0) {
          const amounts = bdtPrices.map((pr: any) => pr.amount);
          price = Math.min(...amounts);
          const maxPrice = Math.max(...amounts);
          if (maxPrice > price) {
            originalPrice = maxPrice;
          }
        } else {
          price = lowestVariant?.prices?.[0]?.amount || 0;
        }
        return {
          name: p.title,
          price,
          originalPrice,
          image: p.thumbnail,
          variantId: lowestVariant?.id,
          handle: p.handle,
        };
      }) ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-body text-sm font-semibold tracking-[0.2em] uppercase text-accent">
              Collection
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 capitalize">
              {category?.name || handle.replace(/-/g, " ")}
            </h1>
            {category?.description && (
              <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <div className="w-16 h-1 bg-accent mx-auto mt-6 rounded-full" />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {isProductsError && (
                <div className="mb-8 p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-center max-w-2xl mx-auto">
                  <p className="text-destructive font-body text-sm">
                    <strong>Error:</strong> Failed to load products. Please check your connection.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayProducts.map((product: any, i: number) => (
                  <ProductCard key={i} {...product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
