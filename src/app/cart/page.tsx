"use client";

import { useCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/hooks/useCustomer";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, isError, updateItem, isUpdating, removeItem, isRemoving } = useCart();
  const { isAuthenticated, isLoading: isAuthLoading } = useCustomer();

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
    if (isAuthenticated) {
      router.push("/checkout");
    } else {
      toast.info("Please login to proceed with your order");
      router.push("/login?callbackUrl=/checkout");
    }
  };

  const hasItems = cart?.items && cart.items.length > 0;
  
  // Medusa stores amounts in cents/smallest currency unit.
  // For BDT 200, it might be 200. We'll divide by 100 if needed, but in our JSON it was just 200.
  // We'll assume the cart.subtotal is the correct amount to display.
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;
  const shipping = cart?.shipping_total || 0;

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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Calculated at checkout" : `৳ ${shipping}`}</span>
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
