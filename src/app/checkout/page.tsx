"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useCustomer } from "@/hooks/useCustomer";
import { useBDAddress } from "@/hooks/useBDAddress";
import { storeApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Loader2, Check, MapPin, ShoppingBag, Truck, ChevronDown, Tag, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Reusable styled select
// ─────────────────────────────────────────────
function SelectField({
  label, value, onChange, disabled, children, required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          required={required}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed transition-all"
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shipping option card

// ─────────────────────────────────────────────
// Main checkout page
// ─────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cart, isLoading: isCartLoading, refetch: refetchCart, addPromotion, isAddingPromotion, removePromotion, isRemovingPromotion } = useCart();
  const { customer, isAuthenticated, isLoading: isAuthLoading } = useCustomer();

  const {
    divisions, districts, areas,
    state: addr, pickDivision, pickDistrict, pickArea,
    isDhakaCity,
  } = useBDAddress();

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>("");
  const [promoCodeInput, setPromoCodeInput] = useState("");

  // Contact details
  const [contact, setContact] = useState({
    first_name: "", last_name: "", phone: "", address_1: "",
  });

  // Auth guard
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Pre-fill customer name & phone
  useEffect(() => {
    if (customer) {
      setContact((prev) => ({
        ...prev,
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone: customer.phone || "",
      }));
    }
  }, [customer]);

  // Load shipping options once cart is ready
  useEffect(() => {
    if (cart?.id) loadShippingMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.id]);

  // Helper to calculate estimated Steadfast shipping cost
  function getEstimatedShippingCost() {
    if (!addr.districtId) return 0;
    const city = addr.districtName?.toLowerCase() || "";
    const area = addr.areaName?.toLowerCase() || "";

    if (city.includes("dhaka") && !area.includes("suburb") && !area.includes("keraniganj") && !area.includes("savar")) {
      return 70;
    }
    
    if (area.includes("savar") || area.includes("keraniganj") || city.includes("gazipur") || city.includes("narayanganj")) {
      return 100;
    }

    return 130;
  }

  // Auto-select shipping when available
  useEffect(() => {
    if (!shippingMethods.length || !addr.districtId) return;

    // Prefer Steadfast (calculated or named) over old flat rates
    const steadfastOption = shippingMethods.find(
      (m) => m.price_type === "calculated" || m.name?.toLowerCase().includes("steadfast")
    ) || shippingMethods[0];

    if (steadfastOption) {
      setSelectedShippingId(steadfastOption.id);
      // Immediately sync shipping address and method to backend so promotions can evaluate against the correct cost
      if (cart?.id && addr.districtName) {
        storeApi.updateCart(cart.id, {
          shipping_address: {
            city: addr.districtName,
            province: addr.divisionName,
            address_2: addr.areaName,
            country_code: "bd",
          }
        }).then(() => {
          return storeApi.addShippingMethod(cart.id, steadfastOption.id);
        }).then(() => {
          refetchCart();
        }).catch(() => {});
      }
    }
  }, [addr.districtId, addr.districtName, addr.divisionName, addr.areaName, shippingMethods, cart?.id, refetchCart]);

  async function loadShippingMethods() {
    try {
      const data = await storeApi.getShippingMethods(cart!.id);
      setShippingMethods(data.shipping_options || []);
    } catch {
      // silently ignore
    }
  }

  const selectedMethod = shippingMethods.find((m) => m.id === selectedShippingId);
  
  // Use item_subtotal to avoid double counting shipping if Medusa includes it in subtotal
  const subtotal = cart?.item_subtotal ?? cart?.subtotal ?? 0;
  // Use shipping_subtotal from backend if available, otherwise calculate it
  const shippingCost = cart?.shipping_subtotal ?? getEstimatedShippingCost();
  
  const discountTotal = cart?.discount_total ?? 0;
  
  // Medusa's cart.total already calculates everything accurately including shipping and discounts!
  const total = cart?.total !== undefined && cart.total !== null 
    ? cart.total 
    : subtotal + shippingCost - discountTotal;

  async function handleApplyPromo(e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) {
    if (e) e.preventDefault();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!addr.districtId)  { toast.error("Please select your district"); return; }
    if (!addr.areaName)     { toast.error("Please select your area / thana"); return; }
    if (!selectedShippingId) { toast.error("Delivery method not loaded yet — please wait"); return; }
    if (!contact.address_1) { toast.error("Please enter your street address"); return; }

    setIsProcessing(true);
    try {
      // 1. Link customer
      try { await storeApi.addCustomerToCart(cart!.id); } catch {}

      // 2. Update cart address — use BD hierarchy as city/province
      await storeApi.updateCart(cart!.id, {
        shipping_address: {
          first_name: contact.first_name,
          last_name: contact.last_name,
          phone: contact.phone,
          address_1: contact.address_1,
          address_2: addr.areaName,       // Thana / Upazila
          city: addr.districtName,         // District as city
          province: addr.divisionName,     // Division as province
          postal_code: addr.postCode || "1000",
          country_code: "bd",
        },
        email: customer?.email,
      });

      // 3. Set shipping method (already added when selected, but re-adding just in case)
      if (selectedShippingId) {
        await storeApi.addShippingMethod(cart!.id, selectedShippingId);
      }

      // 4. Payment collection
      await storeApi.createPaymentCollection(cart!.id);

      // 5. Complete cart
      const { type, order } = await storeApi.completeCart(cart!.id);

      if (type === "order" && order) {
        toast.success("Order placed successfully!");
        localStorage.removeItem("medusa_cart_id");
        queryClient.removeQueries({ queryKey: ["cart"] });
        router.push(`/order-success?id=${order.id}`);
      } else {
        throw new Error("Order completion failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  }

  // ── Loading state ──
  if (isAuthLoading || isCartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <button onClick={() => router.push("/")} className="text-primary hover:underline">
            Return to Shop
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcf9] flex flex-col font-body">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-16 mt-20">
        {/* Title */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Order</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Select your area — delivery charge updates automatically
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* ── Card 1: Delivery Area (address dropdowns) ── */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold leading-tight">Delivery Address</h2>
                    <p className="text-xs text-muted-foreground">Division → District → Area / Thana</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Division */}
                  <SelectField
                    label="Division"
                    value={addr.divisionId}
                    onChange={pickDivision}
                    required
                  >
                    <option value="">— Select Division —</option>
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </SelectField>

                  {/* District */}
                  <SelectField
                    label="District"
                    value={addr.districtId}
                    onChange={pickDistrict}
                    disabled={!addr.divisionId}
                    required
                  >
                    <option value="">— Select District —</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </SelectField>

                  {/* Area / Thana */}
                  <SelectField
                    label={isDhakaCity ? "Thana" : "Upazila / Thana"}
                    value={addr.areaName}
                    onChange={pickArea}
                    disabled={!addr.districtId}
                    required
                  >
                    <option value="">— Select Area —</option>
                    {areas.map((a) => (
                      <option key={a.name} value={a.name}>{a.name}</option>
                    ))}
                  </SelectField>

                  {/* Post Code — auto-filled */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Post Code
                    </label>
                    <input
                      readOnly
                      value={addr.postCode}
                      placeholder={addr.areaName ? "N/A" : "Auto-filled after area selection"}
                      className="px-4 py-3 rounded-xl border border-neutral-200 text-sm bg-neutral-50 text-neutral-500 cursor-default"
                    />
                  </div>

                  {/* Street / House No */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      House / Road / Area Detail <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      placeholder="House no, Road no, Block, Area"
                      value={contact.address_1}
                      onChange={(e) => setContact({ ...contact, address_1: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Address badge — shown once district is picked */}
                {addr.districtId && (
                  <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Truck className="w-4 h-4 shrink-0" />
                    ✓ Steadfast Courier Delivery — ৳{getEstimatedShippingCost()} charge
                  </div>
                )}
              </div>

              {/* ── Card 2: Contact Details ── */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                <h2 className="text-lg font-bold mb-5">Contact Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input required value={contact.first_name}
                      onChange={(e) => setContact({ ...contact, first_name: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input required value={contact.last_name}
                      onChange={(e) => setContact({ ...contact, last_name: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input required type="tel" placeholder="01XXXXXXXXX"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                </div>
              </div>



              {/* ── Card 4: Payment ── */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold">Payment</h2>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <p className="font-semibold text-sm">Cash on Delivery / Manual Payment</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pay with cash upon delivery or via bKash/Nagad after order confirmation.
                  </p>
                </div>
              </div>

            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm sticky top-24">
                <h2 className="font-bold text-lg mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-5">
                  {cart.items.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-14 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold mt-0.5">৳ {item.unit_price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Address preview */}
                {addr.districtId && (
                  <div className="mb-4 p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 space-y-0.5">
                    <p className="font-semibold text-neutral-700">Delivering to:</p>
                    {addr.areaName && <p>{addr.areaName},</p>}
                    <p>{addr.districtName}, {addr.divisionName}</p>
                  </div>
                )}

                {/* Discount Code */}
                <div className="mb-5 space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Discount code"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyPromo(e);
                          }
                        }}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleApplyPromo(e)}
                      disabled={!promoCodeInput.trim() || isAddingPromotion}
                      className="px-4 py-3 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[80px]"
                    >
                      {isAddingPromotion ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </button>
                  </div>
                  
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

                {/* Totals */}
                <div className="space-y-3 border-t border-neutral-100 pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">৳ {subtotal}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span>- ৳ {discountTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={`font-bold ${selectedMethod ? "text-primary" : "text-muted-foreground"}`}>
                      {selectedMethod ? `৳ ${shippingCost}` : "—"}
                    </span>
                  </div>
                  {selectedMethod && (
                    <p className="text-xs text-muted-foreground">Steadfast Courier Delivery</p>
                  )}
                  <div className="flex justify-between items-center border-t border-neutral-100 pt-4">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">৳ {total}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isProcessing || !selectedShippingId || !addr.districtId}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 mt-6 text-sm"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <><Check className="w-4 h-4" /> Complete Order</>
                  )}
                </button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  By placing this order you agree to our terms.
                </p>
              </div>
            </div>

          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
