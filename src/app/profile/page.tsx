"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi, storeApi } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, PackageX, ShoppingBag, Clock, CheckCircle, Truck, XCircle, User, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const statusMap: Record<string, { label: string, color: string, icon: any }> = {
  pending: { label: "Pending", color: "text-amber-500 bg-amber-50", icon: Clock },
  completed: { label: "Completed", color: "text-emerald-500 bg-emerald-50", icon: CheckCircle },
  shipped: { label: "Shipped", color: "text-blue-500 bg-blue-50", icon: Truck },
  canceled: { label: "Canceled", color: "text-rose-500 bg-rose-50", icon: XCircle },
  archived: { label: "Archived", color: "text-slate-500 bg-slate-50", icon: PackageX },
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ["customer"],
    queryFn: () => authApi.getCustomer().then((res) => res.customer || res),
    staleTime: Infinity,
  });

  const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["customer_orders"],
    queryFn: () => storeApi.getCustomerOrders(),
    enabled: !!customer,
  });

  const orders = ordersData?.orders || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      first_name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      await authApi.updateCustomer({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      });
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isCustomerLoading) {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Welcome Section */}
        <div className="mb-10 p-8 rounded-[2rem] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <User className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary mb-2">My Account</h2>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Welcome back, <span className="text-primary">{customer?.first_name || "Friend"}!</span>
            </h1>
            <p className="font-body text-muted-foreground mt-3 max-w-md">
              From your dashboard you can easily manage your recent orders, shipping addresses and edit your account details.
            </p>
          </div>
        </div>

        <Tabs defaultValue="personal-info" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1.5 rounded-2xl w-full sm:w-auto justify-start border border-border/50 backdrop-blur-sm">
            <TabsTrigger value="personal-info" className="rounded-xl px-8 py-2.5 font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary">
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl px-8 py-2.5 font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary">
              Order History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal-info" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-border shadow-xl rounded-[2rem] overflow-hidden border-none ring-1 ring-border/50">
              <CardHeader className="bg-secondary/20 border-b border-border/50 px-8 py-6">
                <CardTitle className="font-display text-2xl text-primary">Account Details</CardTitle>
                <CardDescription className="font-body text-base">
                  Keep your information up to date to ensure smooth deliveries.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="first_name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                      <Input
                        id="first_name"
                        {...register("first_name")}
                        className={`rounded-xl py-6 border-2 focus-visible:ring-primary/20 ${errors.first_name ? "border-destructive" : "border-border/50"}`}
                      />
                      {errors.first_name && (
                        <p className="text-xs text-destructive mt-1 font-bold">{errors.first_name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="last_name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                      <Input
                        id="last_name"
                        {...register("last_name")}
                        className={`rounded-xl py-6 border-2 focus-visible:ring-primary/20 ${errors.last_name ? "border-destructive" : "border-border/50"}`}
                      />
                      {errors.last_name && (
                        <p className="text-xs text-destructive mt-1 font-bold">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled
                      className="bg-muted/50 text-muted-foreground rounded-xl py-6 border-2 border-dashed border-border/50 cursor-not-allowed opacity-80"
                    />
                    <p className="text-[11px] text-muted-foreground italic font-medium px-1">For security, email updates must be handled via support.</p>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+880 1..."
                      {...register("phone")}
                      className={`rounded-xl py-6 border-2 focus-visible:ring-primary/20 ${errors.phone ? "border-destructive" : "border-border/50"}`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1 font-bold">{errors.phone.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto mt-4 rounded-xl px-12 py-7 h-auto text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl hover:shadow-primary/20 transition-all active:scale-95">
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-border shadow-xl rounded-[2rem] overflow-hidden border-none ring-1 ring-border/50">
              <CardHeader className="bg-secondary/20 border-b border-border/50 px-8 py-6">
                <CardTitle className="font-display text-2xl text-primary">Your Orders</CardTitle>
                <CardDescription className="font-body text-base">
                  Track, view, and manage your recent purchases.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isOrdersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-sm font-body text-muted-foreground animate-pulse">Retrieving your order history...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center border-4 border-dashed border-secondary rounded-[2.5rem] bg-secondary/5">
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
                      <PackageX className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-foreground">No orders yet</h3>
                    <p className="text-base text-muted-foreground font-body mt-3 max-w-sm">
                      It looks like you haven&apos;t placed any orders with us yet. Explore our collections and find something you love!
                    </p>
                    <Button asChild className="mt-8 rounded-full px-10 py-6 h-auto text-lg font-bold">
                      <Link href="/">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order: any) => {
                      const status = statusMap[order.status] || statusMap.pending;
                      const Icon = status.icon;
                      const date = new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                      const total = order.summary?.total ?? order.total ?? 0;
                      const displayId = order.display_id ?? order.id.slice(-6).toUpperCase();
                      const itemCount = order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

                      return (
                        <div 
                          key={order.id} 
                          className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[2rem] border border-border/50 bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all group relative"
                        >
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                              <ShoppingBag className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-display font-bold text-xl text-foreground">Order #{displayId}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${status.color} border border-current/10 flex items-center gap-1.5`}>
                                  <Icon className="w-3.5 h-3.5" />
                                  {status.label}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                                <p className="text-sm text-muted-foreground font-body flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" /> Placed on {date}
                                </p>
                                <p className="text-sm font-bold text-foreground font-body">
                                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                </p>
                              </div>
                              {/* Order Item Preview */}
                              <p className="text-xs text-muted-foreground font-body line-clamp-1 mt-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/30">
                                {order.items?.map((i: any) => i.title).join(", ")}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 md:mt-0 flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:border-l border-border/50 md:pl-8">
                            <div className="text-right">
                              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Amount</p>
                              <p className="font-display font-bold text-2xl text-primary">৳{total.toLocaleString()}</p>
                            </div>
                            <Button asChild variant="ghost" className="rounded-full px-6 font-bold hover:bg-primary hover:text-white transition-all">
                              <Link href={`/profile/orders/${order.id}`}>
                                View Details <ArrowRight className="ml-2 w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
