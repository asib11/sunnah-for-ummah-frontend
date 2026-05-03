"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ["customer"],
    queryFn: () => authApi.getCustomer().then(res => res.customer || res),
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (isError || !customer)) {
      router.push("/login");
    }
  }, [customer, isLoading, isError, router]);

  if (isLoading || !customer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary">My Account</h1>
        <p className="text-muted-foreground font-body mt-2">
          Welcome back, {customer.first_name || "Guest"}!
        </p>
      </div>
      {children}
    </div>
  );
}
