"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { storeApi } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShoppingCart, Check, ChevronRight, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const getPrices = (variant: any) => {
  if (!variant?.prices) return { current: 0, old: null };
  const bdtPrices = variant.prices
    .filter((p: any) => p.currency_code === "bdt")
    .map((p: any) => p.amount)
    .sort((a: number, b: number) => a - b);

  if (bdtPrices.length >= 2) {
    return { current: bdtPrices[0], old: bdtPrices[bdtPrices.length - 1] };
  }
  return { current: bdtPrices[0] || 0, old: null };
};

export default function ProductDetailsPage() {
  const { handle } = useParams();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => storeApi.getProductByHandle(handle as string),
    enabled: !!handle,
  });

  const variants = product?.variants || [];
  const options = product?.options || [];

  // Initialize selected variant
  useMemo(() => {
    if (variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(variants[0].id);
    }
  }, [variants, selectedVariantId]);

  const selectedVariant = useMemo(() => 
    variants.find((v: any) => v.id === selectedVariantId) || variants[0],
    [variants, selectedVariantId]
  );

  const prices = useMemo(() => getPrices(selectedVariant), [selectedVariant]);

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      toast.error("Please select a variant");
      return;
    }
    setAdding(true);
    try {
      await addToCart({ variantId: selectedVariantId, quantity: 1 });
      toast.success(`${product.title} added to cart!`, {
        icon: <ShoppingCart className="w-4 h-4 text-emerald-500" />,
      });
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Button asChild className="mt-4 rounded-full" variant="outline">
            <a href="/">Return to Home</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted border border-border shadow-sm group">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {/* Gallery placeholder if needed */}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-body text-[10px] font-bold uppercase tracking-wider w-fit mb-4">
              <Star className="w-3 h-3 fill-primary" />
              Top Rated Choice
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {product.title}
            </h1>
            
            {product.metadata?.bn_name && (
              <p className="font-body text-xl text-muted-foreground mt-2 italic" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                {product.metadata.bn_name}
              </p>
            )}

            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-display text-4xl font-bold text-primary">
                ৳{prices.current.toLocaleString()}
              </span>
              {prices.old && (
                <span className="font-display text-2xl text-muted-foreground line-through opacity-60">
                  ৳{prices.old.toLocaleString()}
                </span>
              )}
              {prices.old && (
                <span className="bg-accent/20 text-accent font-bold text-xs px-2 py-1 rounded-md">
                  SAVE ৳{(prices.old - prices.current).toLocaleString()}
                </span>
              )}
            </div>

            <div className="mt-8 border-t border-border pt-8 space-y-6">
              {/* Variant Selectors */}
              {variants.length > 1 && (
                <div className="space-y-4">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Style / Size</Label>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-4 py-2.5 rounded-xl border-2 transition-all font-body text-sm font-semibold ${
                          selectedVariantId === v.id
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border bg-background text-foreground/70 hover:border-accent"
                        }`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 h-auto py-5 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  {adding ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Shopping Cart
                    </>
                  )}
                </Button>
                <Button variant="outline" className="h-auto py-5 px-8 rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary/5 font-bold">
                  Buy Now
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/50">
                  <Truck className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-[11px] font-body font-medium leading-tight">Fast Delivery Worldwide</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/50">
                  <RotateCcw className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-[11px] font-body font-medium leading-tight">7-Day Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-12 space-y-4">
              <h3 className="font-display text-xl font-bold text-foreground">Product Description</h3>
              <div className="font-body text-muted-foreground leading-relaxed prose prose-sm max-w-none">
                {product.description || "No description available for this product yet."}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
