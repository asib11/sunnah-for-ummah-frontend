"use client";

import { useState } from "react";
import { ShoppingCart, Repeat2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  backImage?: string;
  badge?: string;
  subtitle?: string;
  variantId?: string;
  handle?: string;
}

const ProductCard = ({ name, price, originalPrice, image, backImage, badge, subtitle, variantId, handle }: ProductCardProps) => {
  const router = useRouter();
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const [view, setView] = useState<"front" | "back">("front");
  const hasBack = Boolean(backImage);
  const currentImage = view === "back" && backImage ? backImage : image;
  const { addToCart, isAdding } = useCart();

  const handleAdd = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!variantId) {
      if (handle) {
        router.push(`/products/${handle}`);
      } else {
        toast.error("This product is currently unavailable via quick-add. View the product page to shop.");
      }
      return;
    }
    addToCart(
      { variantId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success(`${name} added to cart!`);
          window.dispatchEvent(new Event("open-cart"));
        },
        onError: () => toast.error("Failed to add to cart. Please try again."),
      }
    );
  };

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-emerald-tint/50 hover:border-emerald-tint-deep/60 transition-all duration-300 hover:shadow-[0_8px_30px_-6px_hsl(var(--emerald-tint-glow)/0.12)]">
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-xs font-body font-semibold px-2.5 py-1 rounded-full">
          {badge}
        </span>
      )}
      {discount && (
        <span className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground text-xs font-body font-semibold px-2.5 py-1 rounded-full">
          {discount}% OFF
        </span>
      )}

      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden relative bg-emerald-tint/30">
        {/* Soft emerald ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--emerald-tint-deep)/0.30),_transparent_70%)] pointer-events-none z-[1]" />
        {/* Soft emerald wash overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-tint/25 via-transparent to-emerald-tint/10 pointer-events-none z-[1]" />

        {/* Cross-fade front / back when backImage is provided */}
        {hasBack ? (
          <>
            <img
              src={image}
              alt={`${name} — front view`}
              loading="lazy"
              className={`absolute inset-0 z-[2] w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                view === "front" ? "opacity-100" : "opacity-0"
              }`}
            />
            <img
              src={backImage}
              alt={`${name} — back view`}
              loading="lazy"
              className={`absolute inset-0 z-[2] w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                view === "back" ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <img
            src={currentImage}
            alt={name}
            loading="lazy"
            className="relative z-[2] w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Front / Back indicator */}
        {hasBack && (
          <div className="absolute bottom-3 left-3 z-[4] pointer-events-none flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur-md border border-emerald-tint/70 px-2 py-0.5 text-[9px] font-body font-semibold uppercase tracking-[0.18em] text-foreground/80 shadow-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                view === "front" ? "bg-primary" : "bg-accent"
              }`}
            />
            {view === "front" ? "Front" : "Back"}
          </div>
        )}

        {/* Flip toggle */}
        {hasBack && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setView((v) => (v === "front" ? "back" : "front"));
            }}
            aria-label={`Show ${view === "front" ? "back" : "front"} view`}
            className="absolute bottom-3 right-3 z-[4] w-9 h-9 rounded-full bg-background/85 backdrop-blur-md border border-emerald-tint shadow-md flex items-center justify-center text-foreground/80 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110 active:scale-95"
          >
            <Repeat2
              className={`w-4 h-4 transition-transform duration-500 ${
                view === "back" ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        {handle ? (
          <Link href={`/products/${handle}`}>
            <h3 className="font-body text-[13px] sm:text-sm font-medium text-foreground line-clamp-2 mb-0.5 min-h-[2.4rem] sm:min-h-[2.5rem] leading-snug hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
        ) : (
          <h3 className="font-body text-[13px] sm:text-sm font-medium text-foreground line-clamp-2 mb-0.5 min-h-[2.4rem] sm:min-h-[2.5rem] leading-snug">
            {name}
          </h3>
        )}
        {subtitle && (
          <p className="font-body text-[11px] sm:text-xs text-emerald-light font-semibold mb-1.5">
            {subtitle}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
            <span className="font-body font-bold text-primary text-base sm:text-lg tabular-nums">৳ {price}</span>
            {originalPrice && (
              <span className="font-body text-xs sm:text-sm text-muted-foreground line-through tabular-nums">
                ৳ {originalPrice}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            aria-label={`Add ${name} to cart`}
            className="hidden sm:inline-flex bg-primary text-primary-foreground p-2 rounded-full hover:bg-emerald-light transition-colors active:scale-95 shrink-0 disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isAdding}
          aria-label={`Shop ${name}`}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-body text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] py-3 sm:py-2.5 rounded-full hover:bg-accent/90 transition-all duration-300 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          Shop Your Drop
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
