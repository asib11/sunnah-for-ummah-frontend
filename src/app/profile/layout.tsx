"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

/**
 * ProfileLayout handles the authentication check for all routes 
 * under /profile. It ensures only logged-in customers can access
 * their dashboard and order history.
 */
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ["customer"],
    queryFn: () => authApi.getCustomer().then(res => res.customer || res),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (!isLoading && (isError || !customer)) {
      router.push("/login");
    }
  }, [customer, isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-body text-muted-foreground animate-pulse">Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null; // Will redirect in useEffect
  }

  // We return children directly. Headers and Footers are handled 
  // by the individual pages to allow for unique layouts.
  return <>{children}</>;
}
