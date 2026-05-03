"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, PackageX } from "lucide-react";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: customer } = useQuery({
    queryKey: ["customer"],
    queryFn: () => authApi.getCustomer().then((res) => res.customer || res),
    staleTime: Infinity, // Avoid re-fetching during edit
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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
      // Invalidate query to refresh header and other components
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Tabs defaultValue="personal-info" className="space-y-6">
      <TabsList className="bg-secondary/50">
        <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="personal-info">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-xl text-primary">Personal Information</CardTitle>
            <CardDescription className="font-body">
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    {...register("first_name")}
                    className={errors.first_name ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-destructive mt-1">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    {...register("last_name")}
                    className={errors.last_name ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-destructive mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled // usually email changing requires a special flow, so disabled
                  className="bg-muted text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+880 1..."
                  {...register("phone")}
                  className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isUpdating} className="mt-4">
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="orders">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-xl text-primary">Order History</CardTitle>
            <CardDescription className="font-body">
              View your recent orders and track their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg bg-secondary/20">
              <PackageX className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-display font-semibold text-lg text-foreground">No orders yet</h3>
              <p className="text-sm text-muted-foreground font-body mt-1 max-w-sm">
                When you place an order, its details and status will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
