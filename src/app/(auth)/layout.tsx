import React from "react";
import Link from "next/link";
import { Search, ShoppingCart, Heart, User, Menu, X, ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to store
        </Link>
        <div className="bg-background rounded-2xl shadow-xl shadow-primary/5 border border-border p-8 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
