"use client";

import { ShoppingCart, Loader2, Eye } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  variantId?: string;
  handle?: string;
}

const ProductCard = ({ name, price, originalPrice, image, badge, variantId, handle }: ProductCardProps) => {
  const { addToCart, isAdding } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

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
          toast.success(`${name} added to cart!`);
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
      className="group relative bg-card rounded-xl overflow-hidden border border-emerald-tint/50 hover:border-emerald-tint-deep/60 transition-all duration-300 hover:shadow-[0_8px_30px_-6px_hsl(var(--emerald-tint-glow)/0.12)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          {badge}
        </span>
      )}
      {discount && (
        <span className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          {discount}% OFF
        </span>
      )}

      {/* Image Container */}
      <Link href={handle ? `/products/${handle}` : "#"} className="block relative aspect-[4/5] overflow-hidden bg-emerald-tint/10">
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--emerald-tint-deep)/0.2),_transparent_70%)] pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-tint/10 via-transparent to-emerald-tint/5 pointer-events-none z-[1]" />
        
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Quick Add Overlay (Desktop) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2]" />
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col">
        <Link href={handle ? `/products/${handle}` : "#"}>
          <h3 className="font-body text-[13px] sm:text-sm font-semibold text-foreground line-clamp-2 mb-2 min-h-[2.5rem] leading-snug group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="font-body font-bold text-primary text-base sm:text-lg">৳ {price}</span>
            {originalPrice && (
              <span className="font-body text-xs text-muted-foreground line-through opacity-70">
                ৳ {originalPrice}
              </span>
            )}
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-90 shadow-sm border border-primary/20"
            aria-label="Add to cart"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-body text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] py-3 rounded-full hover:bg-accent/90 transition-all duration-300 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          Shop Your Drop
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

