"use client";
import { useState } from "react";

import { useCart } from "@/hooks/useCart";
import { storeApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/hooks/useCustomer";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, isError, updateItem, isUpdating, removeItem, isRemoving, addPromotion, isAddingPromotion, removePromotion, isRemovingPromotion } = useCart();
  const { customer, isAuthenticated, isLoading: isAuthLoading } = useCustomer();
  const [promoCodeInput, setPromoCodeInput] = useState("");

  async function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    try {
      if (customer?.email && cart && !cart.email) {
        await storeApi.updateCart(cart.id, { email: customer.email });
      }
      await addPromotion({ promoCode: promoCodeInput });
      toast.success("Discount applied!");
      setPromoCodeInput("");
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("customer_email")) {
        toast.error("Please login to use this discount code.");
      } else {
        toast.error(msg || "Invalid or expired discount code");
      }
    }
  }

  async function handleRemovePromo(code: string) {
    try {
      await removePromotion({ promoCode: code });
      toast.success("Discount removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove discount");
    }
  }

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

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const hasItems = cart?.items && cart.items.length > 0;
  
  // Medusa stores amounts in cents/smallest currency unit.
  // For BDT 200, it might be 200. We'll divide by 100 if needed, but in our JSON it was just 200.
  // We'll assume the cart.subtotal is the correct amount to display.
  // We use item_subtotal to exclude shipping costs from the item list sum.
  const subtotal = cart?.item_subtotal ?? cart?.subtotal ?? 0;
  const total = cart?.total ?? 0;
  const shipping = cart?.shipping_subtotal ?? cart?.shipping_total ?? 0;
  const discountTotal = cart?.discount_total ?? 0;

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Shopping Cart</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">There was an error loading your cart.</p>
            <Link href="/" className="text-primary hover:underline">Return to Shop</Link>
          </div>
        ) : !hasItems ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items yet.</p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {cart.items.map((item: any) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border border-border relative">
                  {/* Item Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ShoppingBag className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start pr-8 sm:pr-0">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Variant: {item.variant?.title || 'Default'}</p>
                      </div>
                      <p className="font-bold text-lg text-primary">৳ {item.unit_price}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 sm:mt-0">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="p-2 hover:bg-muted text-muted-foreground disabled:opacity-50 transition-colors rounded-l-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="p-2 hover:bg-muted text-muted-foreground disabled:opacity-50 transition-colors rounded-r-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => handleRemove(item.id)}
                        disabled={isRemoving}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2 absolute top-2 right-2 sm:relative sm:top-0 sm:right-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">৳ {subtotal}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span>- ৳ {discountTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Calculated at checkout" : `৳ ${shipping}`}</span>
                  </div>
                  
                  {/* Discount Code */}
                  <div className="pt-4 border-t border-border">
                    <form onSubmit={handleApplyPromo} className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Promo code"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!promoCodeInput.trim() || isAddingPromotion}
                        className="px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[80px]"
                      >
                        {isAddingPromotion ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                      </button>
                    </form>
                    
                    {/* Applied Promotions */}
                    {cart.promotions && cart.promotions.length > 0 && (
                      <div className="space-y-2">
                        {cart.promotions.map((promo: any) => (
                          <div key={promo.id} className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-sm">
                            <div className="flex items-center gap-2 text-emerald-700 font-medium">
                              <Tag className="w-4 h-4" />
                              <span>{promo.code}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePromo(promo.code)}
                              disabled={isRemovingPromotion}
                              className="p-1 hover:bg-emerald-100 rounded text-emerald-600 transition-colors disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">৳ {total}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={!hasItems || isAuthLoading}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:gap-3 group disabled:opacity-50"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 transition-all group-hover:translate-x-1" />
                </button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Taxes and shipping calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
