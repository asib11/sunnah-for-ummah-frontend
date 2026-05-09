"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useCustomer } from "@/hooks/useCustomer";
import { storeApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Check, ArrowLeft, ArrowRight, CreditCard, Truck, MapPin, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CheckoutStep = "address" | "shipping" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cart, isLoading: isCartLoading, refetch: refetchCart } = useCart();
  const { customer, isAuthenticated, isLoading: isAuthLoading } = useCustomer();
  
  const [step, setStep] = useState<CheckoutStep>("address");
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("");

  // Form states
  const [address, setAddress] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    postal_code: "",
    country_code: "bd", // Default to Bangladesh
    phone: "",
  });

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    if (customer) {
      setAddress(prev => ({
        ...prev,
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone: customer.phone || "",
      }));
    }
  }, [customer]);

  useEffect(() => {
    if (step === "shipping" && cart?.id) {
      loadShippingMethods();
    }
  }, [step, cart?.id]);

  const loadShippingMethods = async () => {
    try {
      const data = await storeApi.getShippingMethods(cart!.id);
      setShippingMethods(data.shipping_options || []);
      if (data.shipping_options?.length > 0) {
        setSelectedShippingMethod(data.shipping_options[0].id);
      }
    } catch (error) {
      toast.error("Failed to load shipping methods");
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // 1. Add customer to cart (optional, might fail if session is wonky but email update still works)
      try {
        await storeApi.addCustomerToCart(cart!.id);
      } catch (err) {
        console.warn("Could not link customer to cart:", err);
      }
      
      // 2. Update cart with shipping address
      await storeApi.updateCart(cart!.id, {
        shipping_address: address,
        email: customer?.email
      });
      
      await refetchCart();
      setStep("payment");
      window.scrollTo(0, 0);
    } catch (error: any) {
      toast.error(error.message || "Failed to update address");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!selectedShippingMethod) {
      toast.error("Please select a shipping method");
      return;
    }
    setIsProcessing(true);
    try {
      await storeApi.addShippingMethod(cart!.id, selectedShippingMethod);
      await refetchCart();
      // No next step, we are at the end
      window.scrollTo(0, 0);
    } catch (error: any) {
      toast.error(error.message || "Failed to set shipping method");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedShippingMethod) {
      toast.error("Please select a shipping method");
      return;
    }
    setIsProcessing(true);
    try {
      // Add the selected shipping method before completing
      await storeApi.addShippingMethod(cart!.id, selectedShippingMethod);

      // 1. Create payment collection
      await storeApi.createPaymentCollection(cart!.id);
      
      // 2. Complete cart
      const { type, order } = await storeApi.completeCart(cart!.id);
      
      if (type === "order" && order) {
        toast.success("Order placed successfully!");
        // Clear the cart: use the correct localStorage key and invalidate React Query cache
        localStorage.removeItem("medusa_cart_id");
        queryClient.removeQueries({ queryKey: ["cart"] });
        router.push(`/order-success?id=${order.id}`);
      } else {
        throw new Error("Order completion failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to complete order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isAuthLoading || isCartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart || (cart.items?.length === 0 && step !== "payment")) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <button onClick={() => router.push("/")} className="text-primary hover:underline">Return to Shop</button>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { id: "address", label: "Address", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "shipping", label: "Delivery", icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcf9] flex flex-col font-body">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-16 mt-20">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0"></div>
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isPast = steps.findIndex(x => x.id === step) > i;
              
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? "bg-primary text-primary-foreground scale-110 shadow-lg" : 
                    isPast ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {isPast ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-bold mt-2 uppercase tracking-widest ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              {step === "address" && (
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-600">First Name</label>
                      <input 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={address.first_name}
                        onChange={e => setAddress({...address, first_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-600">Last Name</label>
                      <input 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={address.last_name}
                        onChange={e => setAddress({...address, last_name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-600">Street Address</label>
                    <input 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      value={address.address_1}
                      onChange={e => setAddress({...address, address_1: e.target.value})}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-600">City</label>
                      <input 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={address.city}
                        onChange={e => setAddress({...address, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-600">Postal Code</label>
                      <input 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={address.postal_code}
                        onChange={e => setAddress({...address, postal_code: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-600">Phone</label>
                    <input 
                      required
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      value={address.phone}
                      onChange={e => setAddress({...address, phone: e.target.value})}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 mt-8"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue to Payment <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              )}

              {step === "shipping" && (
                <div className="space-y-6">
                   <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Delivery Method</h2>
                    <button onClick={() => setStep("payment")} className="text-sm text-primary hover:underline flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Back to Payment
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {shippingMethods.map((method) => (
                      <label 
                        key={method.id}
                        className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedShippingMethod === method.id ? "border-primary bg-primary/5" : "border-neutral-100 hover:border-neutral-200"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="shipping" 
                            className="w-5 h-5 text-primary border-neutral-300 focus:ring-primary"
                            checked={selectedShippingMethod === method.id}
                            onChange={() => setSelectedShippingMethod(method.id)}
                          />
                          <div>
                            <p className="font-bold">{method.name}</p>
                            <p className="text-sm text-muted-foreground">Standard Delivery</p>
                          </div>
                        </div>
                        <p className="font-bold">৳ {method.amount || 0}</p>
                      </label>
                    ))}
                    {shippingMethods.length === 0 && <p className="text-muted-foreground py-8 text-center">No shipping methods available for this address.</p>}
                  </div>

                   <button 
                    onClick={handleCompleteOrder}
                    disabled={isProcessing || !selectedShippingMethod}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 mt-8"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Order <Check className="w-4 h-4" /></>}
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div className="space-y-6">
                   <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Payment Method</h2>
                    <button onClick={() => setStep("address")} className="text-sm text-primary hover:underline flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Back to Address
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Cash on Delivery / Manual Payment</p>
                      <p className="text-sm text-muted-foreground mt-1">Pay with cash upon delivery or through manual mobile banking (bKash/Nagad).</p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-500">Order Confirmation</h3>
                    <p className="text-sm leading-relaxed text-neutral-600">
                      By clicking "Complete Order", you agree to our terms of service and confirm that the shipping details are correct.
                    </p>
                  </div>

                   <button 
                    onClick={() => {
                      setStep("shipping");
                      window.scrollTo(0, 0);
                    }}
                    disabled={isProcessing}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 mt-8"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue to Delivery <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold mt-1">৳ {item.unit_price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-neutral-100 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">৳ {cart.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-bold">{cart.shipping_total === 0 ? "—" : `৳ ${cart.shipping_total}`}</span>
                </div>
                <div className="flex justify-between items-center border-t border-neutral-100 pt-4 mt-2">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-primary">৳ {cart.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
