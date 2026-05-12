"use client";

import { Search, ShoppingCart, Heart, User, Menu, X, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import logoSfu from "@/assets/logo-sfu.png";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "./CartDrawer";

const searchProducts = [
  "Premium Black Embroidered Panjabi",
  "Classic White Thobe",
  "Dawah T-Shirt",
  "Navy Blue Embroidered Panjabi",
  "Premium Attar Perfume Oil Set",
  "Beige Cotton Panjabi",
  "Olive Green Chino Pants",
  "Solid Premium T-Shirt",
];

const navItems = [
  { label: "Eid Collection", href: "/eid-collection" },
  { label: "Men's", href: "#" },
  { label: "Women's", href: "#" },
  { label: "Calligraphy T-shirt", href: "/#calligraphy-showcase" },
  // { label: "Accessories", href: "#" },
  // { label: "Perfume Oil (Attar)", href: "#" },
  { label: "Calligraphy Dropshoulder", href: "/#calligraphy-drop-shoulder" },
];

const useTypingPlaceholder = (words: string[], typingSpeed = 80, deleteSpeed = 40, pauseMs = 1500) => {
  const [text, setText] = useState("");
  const idx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    const tick = () => {
      const current = words[idx.current];
      if (!deleting.current) {
        charIdx.current++;
        setText(current.slice(0, charIdx.current));
        if (charIdx.current === current.length) {
          deleting.current = true;
          return pauseMs;
        }
        return typingSpeed;
      } else {
        charIdx.current--;
        setText(current.slice(0, charIdx.current));
        if (charIdx.current === 0) {
          deleting.current = false;
          idx.current = (idx.current + 1) % words.length;
          return typingSpeed;
        }
        return deleteSpeed;
      }
    };

    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      const delay = tick();
      timer = setTimeout(loop, delay);
    };
    timer = setTimeout(loop, typingSpeed);
    return () => clearTimeout(timer);
  }, [words, typingSpeed, deleteSpeed, pauseMs]);

  return text;
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const typingText = useTypingPlaceholder(searchProducts);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { totalItems, totalPrice } = useCart();

  const { data: customerData } = useQuery({
    queryKey: ["customer"],
    queryFn: () => authApi.getCustomer().then((res) => res.customer || res),
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
      // removeQueries wipes the cache immediately so the name disappears instantly
      queryClient.removeQueries({ queryKey: ["customer"] });
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        {/* Search - desktop */}
        <div className="hidden md:flex items-center gap-2 bg-secondary rounded-full px-4 py-2 w-72">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={typingText || "Search"}
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full font-body"
          />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 min-w-0 hover:opacity-90 transition-opacity">
          <img
            src={logoSfu.src}
            alt="Sunnah For Ummah logo"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-md ring-1 ring-primary/20"
          />
          <div className="flex flex-col items-start text-left">
            <h1 className="font-display text-xl md:text-2xl font-bold text-primary tracking-wide leading-none">
              Sunnah For Ummah
            </h1>
            <span className="uppercase tracking-[0.2em] md:tracking-[0.3em] font-body text-[8px] md:text-xs font-bold text-emerald-light mt-1">
              SUNNAH: THE LEGACY OF THE BEST.
            </span>
          </div>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Animated cart pill with live total */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-cart"))}
            className="hidden md:flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-card border border-border hover:border-primary/30 transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-body font-bold">Your Bag</span>
              <span className="text-sm font-display font-bold text-primary tabular-nums">৳ {totalPrice.toFixed(2)}</span>
            </div>
            <div className="relative p-2.5 rounded-full bg-primary text-primary-foreground group-hover:bg-emerald-light transition-all duration-300">
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold ring-2 ring-card animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </div>
          </button>

          {/* Mobile cart */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-cart"))}
            className="md:hidden relative p-2 hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                {totalItems}
              </span>
            )}
          </button>

          <button className="relative p-2 rounded-full hover:bg-accent/10 hover:text-accent transition-all hover:scale-110 hidden md:block group" aria-label="Wishlist">
            <Heart className="w-5 h-5 group-hover:fill-accent transition-all" />
            <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body ring-2 ring-background">
              0
            </span>
          </button>

          {customerData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all hover:scale-110 hidden md:flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium font-body truncate max-w-[100px]">
                    {customerData.first_name || customerData.email?.split("@")[0] || "Profile"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 font-body">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all hover:scale-110 hidden md:block" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search - always visible */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder={typingText || "Search"}
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full font-body"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block relative border-t border-primary/20 overflow-hidden bg-gradient-to-r from-primary/10 via-emerald-light/15 to-primary/10">
        {/* Decorative glow shimmer */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.18),_transparent_70%)]" />
        <div className="pointer-events-none absolute -top-1/2 left-0 right-0 h-[200%] bg-[linear-gradient(110deg,transparent_30%,hsl(var(--accent)/0.15)_50%,transparent_70%)] animate-[shimmer_6s_linear_infinite] bg-[length:200%_100%]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container relative mx-auto flex items-center justify-center gap-8 px-4 py-2.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && !item.href.includes("#"));
            return item.href.startsWith("/") && !item.href.includes("#") ? (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative text-sm font-body font-medium transition-colors ${
                  isActive ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="group relative text-sm font-body font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-px w-0 bg-gradient-to-r from-primary via-accent to-primary group-hover:w-full transition-all duration-300" />
              </a>
            );
          })}
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("whats-inside-kit")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 bg-gradient-to-r from-primary/90 via-emerald-light/90 to-primary/90 text-primary-foreground font-body text-xs font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ring-1 ring-accent/40"
          >
            <Star className="w-3 h-3 fill-accent text-accent animate-pulse" />
            <span>সম্পূর্ণ হজ্জ ও উমরাহ সামগ্রী</span>
            <span className="ml-1 px-1.5 py-px rounded-full bg-accent/90 text-[9px] uppercase tracking-wider text-accent-foreground font-bold">New</span>
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col px-4 py-3 gap-3">
            <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={typingText || "Search"}
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full font-body"
              />
            </div>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-body font-medium text-foreground hover:text-primary transition-colors py-1"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                document
                  .getElementById("whats-inside-kit")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-accent/15 border border-accent/50 text-accent font-body text-xs font-semibold hover:bg-accent/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background w-fit"
            >
              <Star className="w-3 h-3 fill-accent" />
              <span>সম্পূর্ণ হজ্জ ও উমরাহ সামগ্রী</span>
            </button>
          </div>
        </nav>
      )}

      <CartDrawer />
    </header>
  );
};

export default Header;
