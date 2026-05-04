"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Fallback images
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const fallbackProducts = [
  { name: "Premium Black Embroidered Panjabi", price: 2490, image: product1.src, badge: "New" as const },
  { name: "Classic White Thobe - Premium Cotton", price: 1990, image: product2.src },
  { name: "Dawah T-Shirt - Calligraphy Edition", price: 590, image: product3.src, badge: "New" as const },
  { name: "Navy Blue Embroidered Panjabi", price: 2290, originalPrice: 2790, image: product4.src },
];

export default function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = React.use(params);

  // Fetch category first
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category", handle],
    queryFn: () => storeApi.getCategoryByHandle(handle),
  });

  // Then fetch products if category ID exists
  const { data: productsData, isLoading: isProductsLoading, isError: isProductsError } = useQuery({
    queryKey: ["category_products", category?.id],
    queryFn: () => storeApi.getProductsByCategory(category?.id as string),
    enabled: !!category?.id,
  });

  const isLoading = isCategoryLoading || (!!category?.id && isProductsLoading);

  // If there's an error fetching products (like the sales channel config issue), or if empty, use fallbacks
  const displayProducts = (!isLoading && (!productsData || productsData.products?.length === 0 || isProductsError)) 
    ? fallbackProducts 
    : (productsData?.products?.map((p: any) => ({
        name: p.title,
        price: p.variants?.[0]?.prices?.find((pr: any) => pr.currency_code === "bdt")?.amount || 
               p.variants?.[0]?.prices?.[0]?.amount || 0,
        originalPrice: null,
        image: p.thumbnail || product1.src,
        variantId: p.variants?.[0]?.id,
      })) || fallbackProducts);

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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted rounded-xl aspect-[4/5]" />
              ))}
            </div>
          ) : (
            <>
              {isProductsError && (
                <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-center max-w-2xl mx-auto">
                  <p className="text-yellow-700 dark:text-yellow-400 font-body text-sm">
                    <strong>Note:</strong> Showing placeholder products. To see real products, please configure your Medusa Publishable Key with a Sales Channel in the admin dashboard.
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
