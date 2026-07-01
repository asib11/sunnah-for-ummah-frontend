"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const openCartDrawer = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("open-cart"));
  }
};

const MobileCartBar = () => {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 pt-2 pointer-events-none"
      style={{
        paddingLeft: "calc(0.75rem + env(safe-area-inset-left))",
        paddingRight: "calc(0.75rem + env(safe-area-inset-right))",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <button
        type="button"
        onClick={openCartDrawer}
        style={{ touchAction: "manipulation" }}
        className="pointer-events-auto w-full flex items-center justify-between gap-3 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_hsl(var(--primary)/0.6)] active:scale-[0.98] transition-transform border border-accent/40 select-none"
      >
        <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground/15">
          <ShoppingBag className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold ring-2 ring-primary">
            {totalItems}
          </span>
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70 font-body">
            Your bag
          </span>
          <span className="text-sm font-display font-bold tabular-nums">
            ৳ {totalPrice.toFixed(2)}
          </span>
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-body font-bold uppercase tracking-wider">
          View
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </button>
    </div>
  );
};

export default MobileCartBar;
