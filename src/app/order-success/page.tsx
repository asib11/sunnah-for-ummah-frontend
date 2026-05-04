"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="max-w-md w-full text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Thank you for your purchase. Your order has been placed successfully and is being processed.
      </p>
      
      <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left">
        <h2 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Order Details</h2>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm font-medium">Order ID</span>
          <span className="text-sm font-mono font-bold text-primary">{orderId}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium">Status</span>
          <span className="text-sm font-bold text-accent">Processing</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/" 
          className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
        >
          Continue Shopping <ShoppingBag className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <Suspense fallback={<div>Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
