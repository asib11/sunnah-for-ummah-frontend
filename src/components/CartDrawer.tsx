"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { cart, isLoading, isError, updateItem, isUpdating, removeItem, isRemoving, totalItems, totalPrice } = useCart();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-cart", handleOpen);
    return () => window.removeEventListener("open-cart", handleOpen);
  }, []);

  const handleQuantityChange = (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem(
      { lineId, quantity: newQuantity },
      {
        onSuccess: () => toast.success("Cart updated"),
        onError: () => toast.error("Failed to update quantity")
      }
    );
  };

  const handleRemove = (lineId: string) => {
    removeItem(
      { lineId },
      {
        onSuccess: () => toast.success("Item removed"),
        onError: () => toast.error("Failed to remove item")
      }
    );
  };

  const hasItems = cart?.items && cart.items.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background font-body p-0 border-l border-border">
        <SheetHeader className="border-b border-border pb-4 pt-6 px-6">
          <SheetTitle className="font-display text-2xl text-primary flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            Your Bag
            <span className="text-sm font-body text-muted-foreground">({totalItems})</span>
          </SheetTitle>
          <SheetDescription className="font-body text-xs uppercase tracking-[0.25em] text-emerald-light">
            Sunnah: the legacy of the best.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 px-6">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <span className="animate-spin text-primary">
                 <ShoppingBag className="w-8 h-8 opacity-50" />
              </span>
            </div>
          ) : isError ? (
            <div className="text-center text-destructive py-12">Failed to load cart</div>
          ) : !hasItems ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-16">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
              <p className="font-display text-lg text-foreground">Your bag is empty</p>
              <p className="font-body text-sm text-muted-foreground max-w-xs">
                Discover modest essentials made for the journey of the believer.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item: any) => (
                <li
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-emerald-tint/40 hover:border-emerald-tint-deep/60 transition-colors bg-card relative"
                >
                  <img
                    src={item.thumbnail || ""}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-lg bg-emerald-tint/30"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h4 className="font-body text-sm font-semibold text-foreground line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      Variant: {item.variant?.title || 'Default'}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      ৳ {item.unit_price} each
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center border border-border rounded-full bg-background">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 hover:text-primary disabled:opacity-40 transition-colors"
                          disabled={item.quantity <= 1 || isUpdating}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-sm font-body font-semibold tabular-nums w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 hover:text-primary transition-colors"
                          disabled={isUpdating}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-primary tabular-nums">
                          ৳ {item.unit_price * item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                          disabled={isRemoving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasItems && (
          <div className="border-t border-border pt-4 pb-6 px-6 space-y-3 bg-background">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">
                Subtotal
              </span>
              <span className="font-display text-2xl font-bold text-primary tabular-nums">
                ৳ {cart.subtotal || totalPrice}
              </span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/cart");
              }}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold py-3 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              Review Cart
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/checkout");
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold py-3 rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              Checkout
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full text-xs font-body uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mt-2"
            >
              Continue shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
