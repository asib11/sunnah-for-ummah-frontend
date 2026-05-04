"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { storeApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Loader2, 
  ChevronLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  Receipt,
  ShoppingBag
} from "lucide-react";

const statusMap: Record<string, { label: string, color: string, icon: any }> = {
  pending: { label: "Pending", color: "text-amber-500 bg-amber-50", icon: Clock },
  completed: { label: "Completed", color: "text-emerald-500 bg-emerald-50", icon: CheckCircle },
  shipped: { label: "Shipped", color: "text-blue-500 bg-blue-50", icon: Truck },
  canceled: { label: "Canceled", color: "text-rose-500 bg-rose-50", icon: XCircle },
  archived: { label: "Archived", color: "text-slate-500 bg-slate-50", icon: Package },
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: orderData, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => storeApi.getOrder(id as string),
    enabled: !!id,
  });

  const order = orderData?.order;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Package className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Order not found</h1>
          <p className="text-muted-foreground mt-2">We couldn&apos;t find the order you&apos;re looking for.</p>
          <Button onClick={() => router.push("/profile")} className="mt-6 rounded-full px-8">
            Back to Profile
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const status = statusMap[order.status] || statusMap.pending;
  const StatusIcon = status.icon;
  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Back Link */}
        <Button 
          variant="ghost" 
          onClick={() => router.push("/profile")}
          className="mb-8 pl-0 hover:bg-transparent hover:text-primary transition-colors font-bold group"
        >
          <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to My Account
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${status.color} border border-current/10 flex items-center gap-1.5`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {status.label}
              </span>
              <span className="text-xs font-body text-muted-foreground">Order ID: {order.id}</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Order <span className="text-primary">#{order.display_id || order.id.slice(-6).toUpperCase()}</span>
            </h1>
            <p className="text-muted-foreground font-body mt-2">Placed on {date}</p>
          </div>
          <Button variant="outline" className="rounded-xl font-bold border-2 h-auto py-3 px-6">
            <Receipt className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Items */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2rem] shadow-xl border-none ring-1 ring-border/50 overflow-hidden">
              <CardHeader className="bg-secondary/20 border-b border-border/50 px-8 py-6">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="p-6 flex gap-6 group hover:bg-secondary/5 transition-colors">
                      <div className="w-20 h-24 rounded-2xl overflow-hidden bg-muted border border-border/50 shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-display font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground font-body mt-1">
                          {item.variant?.title !== "Default Variant" ? item.variant?.title : "One size"}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-sm font-bold text-foreground font-body">
                            Qty: <span className="text-muted-foreground">{item.quantity}</span>
                          </p>
                          <p className="font-display font-bold text-primary">
                            ৳{item.unit_price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="rounded-[2rem] shadow-xl border-none ring-1 ring-border/50 overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10 px-6 py-5">
                <CardTitle className="font-display text-lg text-primary">Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {(() => {
                  const itemsTotal = order.items?.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0) || 0;
                  const shippingTotal = order.summary?.shipping_total ?? 
                                      order.shipping_total ?? 
                                      order.shipping_methods?.reduce((acc: number, sm: any) => acc + (sm.amount || 0), 0) ?? 
                                      0;
                  const finalTotal = order.summary?.total ?? order.total ?? (itemsTotal + shippingTotal);

                  return (
                    <>
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-bold">৳{itemsTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className={shippingTotal ? "font-bold text-foreground" : "font-bold text-emerald-600"}>
                          {shippingTotal ? `৳${shippingTotal.toLocaleString()}` : "FREE"}
                        </span>
                      </div>
                      <div className="border-t border-border/50 pt-4 flex justify-between items-center">
                        <span className="font-display font-bold text-foreground">Total</span>
                        <span className="font-display font-bold text-2xl text-primary">
                          ৳{finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card className="rounded-[2rem] shadow-xl border-none ring-1 ring-border/50 overflow-hidden">
              <CardHeader className="bg-secondary/20 border-b border-border/50 px-6 py-5">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-sm font-body space-y-1.5">
                  <p className="font-bold text-foreground">
                    {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {order.shipping_address?.address_1}
                    {order.shipping_address?.address_2 && `, ${order.shipping_address.address_2}`}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shipping_address?.city}, {order.shipping_address?.postal_code}
                  </p>
                  <p className="text-muted-foreground">{order.shipping_address?.country_code?.toUpperCase()}</p>
                  {order.shipping_address?.phone && (
                    <p className="mt-3 pt-3 border-t border-border/50 text-foreground font-medium">
                      📞 {order.shipping_address.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Collection */}
            <Card className="rounded-[2rem] shadow-xl border-none ring-1 ring-border/50 overflow-hidden">
              <CardHeader className="bg-secondary/20 border-b border-border/50 px-6 py-5">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {order.payment_collections?.map((pc: any) => (
                  <div key={pc.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                      <span className="text-sm font-bold text-primary uppercase">{pc.status}</span>
                    </div>
                    {pc.payments?.map((p: any) => (
                      <div key={p.id} className="bg-secondary/30 p-3 rounded-xl border border-border/30">
                        <p className="text-xs font-bold text-foreground">Payment Method: {p.provider_id}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Transaction ID: {p.id.slice(-8).toUpperCase()}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
