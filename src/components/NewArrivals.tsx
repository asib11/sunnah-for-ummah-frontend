"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { storeApi } from "@/lib/api";
import { getProductPrices } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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

  // Uses the same BASE_URL, API key, and headers as every other API call
  const { data, isLoading } = useQuery({
    queryKey: ["new_arrivals"],
    queryFn:  () => storeApi.getProducts(8),
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

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          New Arrivals
        </h2>
        <a
          href="#"
          className="font-body text-sm font-medium text-primary hover:text-emerald-light transition-colors underline underline-offset-4"
        >
          View All
        </a>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : displayProducts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No products found. Add products in your Medusa Admin.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
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
