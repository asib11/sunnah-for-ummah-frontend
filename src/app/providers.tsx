"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes — avoids duplicate requests while browsing
            staleTime: 1000 * 60 * 5,
            // IMPORTANT: gcTime: 0 means React Query immediately disposes a query
            // when no component is subscribed (i.e. the user navigated away).
            // This triggers AbortSignal cancellation of in-flight fetches,
            // freeing browser HTTP connection slots for the new page's RSC request.
            gcTime: 0,
            // Always attempt network requests; don't wait for "online" event.
            networkMode: "always",
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              if (error?.status === 401 || error?.response?.status === 401 || error?.message?.includes("401")) {
                return false;
              }
              // Aborted requests (navigation) should not retry
              if (error?.name === "AbortError") return false;
              return failureCount < 1;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
