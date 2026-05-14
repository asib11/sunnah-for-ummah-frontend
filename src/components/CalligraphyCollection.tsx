"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { storeApi } from "@/lib/api";
import { getProductPrices } from "@/lib/utils";
import { Loader2, ShoppingCart, RefreshCw } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import Link from "next/link";

interface CalligraphyProductCardProps {
  product: any;
}

const CalligraphyProductCard = ({ product }: CalligraphyProductCardProps) => {
  const { addToCart, isAdding } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const { price, oldPrice } = getProductPrices(product);
  const variantId = product.variants?.[0]?.id;
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  const images = product.images || [];
  const frontImage = product.thumbnail || images[0]?.url;
  // Use the second image for back view if available, otherwise fallback to front
  const backImage = images.length > 1 ? images[1]?.url : frontImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variantId) {
      toast.error("This product is currently unavailable.");
      return;
    }
    
    addToCart(
      { variantId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success(`${product.title} added to cart!`);
          window.dispatchEvent(new CustomEvent("open-cart"));
        },
        onError: () => {
          toast.error("Failed to add to cart. Please try again.");
        }
      }
    );
  };

  return (
    <div 
      className="group relative bg-card rounded-xl overflow-hidden border border-emerald-tint/50 hover:border-emerald-tint-deep/60 transition-all duration-300 hover:shadow-[0_8px_30px_-6px_hsl(var(--emerald-tint-glow)/0.12)] flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.metadata?.is_new === "true" && (
          <span className="bg-accent text-accent-foreground text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            New
          </span>
        )}
        {product.metadata?.is_bestseller === "true" && (
          <span className="bg-amber-500 text-white text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Best Seller
          </span>
        )}
        {product.metadata?.is_limited === "true" && (
          <span className="bg-amber-500 text-white text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Limited
          </span>
        )}
      </div>

      {discount && (
        <span className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          {discount}% OFF
        </span>
      )}

      {/* Image Container */}
      <Link href={`/products/${product.handle}`} className="block relative aspect-[4/5] overflow-hidden bg-emerald-tint/10 flex-shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--emerald-tint-deep)/0.2),_transparent_70%)] pointer-events-none z-[1]" />
        
        {/* Front Image */}
        <img
          src={frontImage}
          alt={`${product.title} - Front`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isHovered && images.length > 1 ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* Back Image (Hover) */}
        {images.length > 1 && (
          <img
            src={backImage}
            alt={`${product.title} - Back`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* View Indicator Badge inside image area */}
        <div className="absolute bottom-3 left-3 z-10 bg-background/80 backdrop-blur-sm text-foreground text-[9px] font-body font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm border border-border/50 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          {isHovered && images.length > 1 ? "BACK" : "FRONT"}
        </div>
        
        {/* Rotate icon */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white text-[#1b4332] group-hover:bg-[#1b4332] group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-md">
            <RefreshCw className="w-4 h-4" />
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.handle}`} className="mb-2">
          <h3 className="font-body text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="font-body text-[11px] font-semibold text-primary/70 mt-1 uppercase tracking-wider">(Unisex)</p>
        </Link>
        
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-body font-bold text-primary text-base sm:text-lg">৳ {price}</span>
              {oldPrice && (
                <span className="font-body text-xs text-muted-foreground line-through opacity-70">
                  ৳ {oldPrice}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-9 h-9 rounded-full bg-[#1b4332] flex items-center justify-center text-white active:scale-90 shadow-sm"
              aria-label="Add to cart"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-body text-[11px] font-bold uppercase tracking-[0.2em] py-2.5 rounded-full hover:bg-accent/90 transition-all duration-300 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            Shop Your Drop
          </button>
        </div>
      </div>
    </div>
  );
};

const CalligraphyCollection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["category", "front-calligraphy"],
    queryFn: () => storeApi.getProductsByCategoryHandle("front-calligraphy"),
    staleTime: 1000 * 60 * 5,
  });

  const products = data?.products ?? [];

  return (
    <section className="container mx-auto px-4 py-12 md:py-20 bg-cream/10 border-t border-b border-border/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/80">
              Men's - Calligraphy Collection
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Calligraphy <span className="italic text-primary font-serif">T-shirts</span>
          </h2>
          <p className="font-body text-sm md:text-base text-muted-foreground">
            Wearable Arabic calligraphy — hover any product to flip between front and back views.
          </p>
        </div>
        
        <div className="flex items-center gap-3 hidden md:flex">
          <span className="w-12 h-px bg-border" />
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Hover to flip
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground py-20 bg-secondary/20 rounded-3xl border border-dashed border-primary/20">
          No calligraphy products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
          {products.slice(0, 4).map((product: any) => (
            <CalligraphyProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CalligraphyCollection;
