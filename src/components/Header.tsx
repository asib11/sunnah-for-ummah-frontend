"use client";

import { Search, ShoppingCart, Heart, User, Menu, X, Star, ChevronDown, Moon } from "lucide-react";
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

const CrescentStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M12 1l2.5 6.5L21 8.5l-5.5 4.5 1.5 7-6-4-6 4 1.5-7L3 8.5l6.5-1L12 1z" fill="currentColor" />
    <path d="M4 14c-1.5-1-2.5-2.8-2.5-4.8C1.5 6.3 4 3.5 7.2 3c-1 .8-1.7 2-1.7 3.5 0 2.5 2 4.5 4.5 4.5.6 0 1.2-.1 1.7-.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NavIcon = ({ type, isActive }: { type?: string; isActive?: boolean }) => {
  if (!type) return null;
  const cls = isActive
    ? "w-3.5 h-3.5 text-gold shrink-0 nav-icon-glow-active animate-shimmer-glow"
    : "w-3.5 h-3.5 text-primary/90 shrink-0 drop-shadow-[0_0_5px_hsl(var(--gold)/0.65)] group-hover:animate-shimmer-glow";
  if (type === "crescent") return <CrescentStar className={cls} />;
  if (type === "star") return <Star className={cls} fill="currentColor" />;
  if (type === "moon") return <Moon className={cls} />;
  return null;
};

const searchProducts = [
  "Hajj Essentials",
  "Premium Black Embroidered Panjabi",
  "Classic White Thobe",
  "Dawah T-Shirt",
  "Navy Blue Embroidered Panjabi",
  "Premium Attar Perfume Oil Set",
  "Beige Cotton Panjabi",
  "Solid Premium T-Shirt",
];

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[]; icon?: "crescent" | "star" | "moon" };

const navItems: NavItem[] = [
  { label: "Eid Collection", href: "/eid-collection", icon: "crescent" },
  {
    label: "Men's",
    href: "#",
    children: [
      { label: "Calligraphy T-shirt", href: "/calligraphy-tshirt" },
      { label: "Calligraphy Dropshoulder", href: "/calligraphy-dropshoulder" },
      { label: "Baggy Sweatpants", href: "/baggy-sweatpants" },
    ],
  },
  { label: "Calligraphy T-shirt", href: "#calligraphy-showcase", icon: "star" },
  { label: "Calligraphy Dropshoulder", href: "/calligraphy-dropshoulder", icon: "star" },
];

const NavLinkItem = ({
  href, children, onClick, className,
}: {
  href: string;
  children: (props: { isActive: boolean }) => React.ReactNode;
  onClick?: () => void;
  className?: (props: { isActive: boolean }) => string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} onClick={onClick} className={className ? className({ isActive }) : undefined}>
      {children({ isActive })}
    </Link>
  );
};

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

        <div className="container relative mx-auto flex items-center justify-center gap-6 px-4 py-3">
          {navItems.map((item, idx) => (
            <div key={item.label} className="flex items-center gap-6">
              {item.children ? (
                <div className="relative group">
                  {(() => {
                    const childActive = item.children!.some((c) => pathname === c.href);
                    return (
                      <button type="button" className={`group/btn relative inline-flex items-center gap-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${childActive ? "text-primary" : "text-foreground hover:text-primary"}`}>
                        <NavIcon type={item.icon} isActive={childActive} />
                        {item.label}
                        <ChevronDown className={`w-3 h-3 opacity-70 transition-transform duration-300 group-hover:rotate-180 ${childActive ? "rotate-180" : ""}`} />
                        <span className={`pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-px bg-primary transition-all duration-500 ease-out ${childActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                      </button>
                    );
                  })()}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50 transition-all duration-300 ease-out ${item.children!.some((c) => pathname === c.href) ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"}`}>
                    <div className="min-w-[16rem] rounded-xl border border-gold/40 bg-gradient-to-b from-background via-background to-emerald-tint/30 backdrop-blur-md shadow-[0_20px_50px_-15px_hsl(var(--primary)/0.45)] overflow-hidden">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
                      {item.children.map((c, ci) => (
                        <NavLinkItem key={c.label} href={c.href}
                          className={({ isActive }) => `group/item relative flex items-center gap-2.5 px-4 py-3 text-sm font-body font-semibold tracking-wide transition-all duration-300 ${ci > 0 ? "border-t border-gold/15" : ""} ${isActive ? "bg-gradient-to-r from-primary/15 via-gold/10 to-transparent text-primary" : "text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:via-gold/10 hover:to-transparent hover:text-primary hover:pl-6"}`}
                        >
                          {({ isActive }) => (
                            <>
                              <span className={`inline-block h-1.5 w-1.5 rounded-full transition-all duration-300 ${isActive ? "bg-gold shadow-[0_0_8px_hsl(var(--gold)/0.9)]" : "bg-primary/40 group-hover/item:bg-gold group-hover/item:shadow-[0_0_8px_hsl(var(--gold)/0.9)]"}`} />
                              <span className="flex-1">{c.label}</span>
                              <span className={`text-gold transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0"}`} aria-hidden>✦</span>
                            </>
                          )}
                        </NavLinkItem>
                      ))}
                    </div>
                  </div>
                </div>
              ) : item.href.startsWith("/") ? (
                <NavLinkItem key={item.label} href={item.href}
                  className={({ isActive }) => `group relative inline-flex items-center gap-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
                >
                  {({ isActive }) => (
                    <>
                      <NavIcon type={item.icon} isActive={isActive} />
                      {item.label}
                      <span className={`pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-px bg-primary transition-all duration-500 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                    </>
                  )}
                </NavLinkItem>
              ) : (
                <a key={item.label} href={pathname !== "/" && item.href.startsWith("#") ? `/${item.href}` : item.href}
                  className="group relative inline-flex items-center gap-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground hover:text-primary transition-colors duration-300"
                >
                  <NavIcon type={item.icon} isActive={false} />
                  {item.label}
                  <span className="pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-px w-0 bg-primary group-hover:w-full transition-all duration-500 ease-out" />
                </a>
              )}
              {idx < navItems.length - 1 && (
                <span aria-hidden className="text-primary/30 text-[10px] select-none">◆</span>
              )}
            </div>
          ))}
          <span aria-hidden className="mx-1 h-4 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
          <Link href="/hajj-mabroor" data-sparkle className="group relative inline-flex items-center gap-2 rounded-full pl-3 pr-2 py-1 bg-background border border-primary/25 hover:border-primary/60 text-primary font-body text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_-4px_hsl(var(--primary)/0.35)]">
            <Star className="w-3.5 h-3.5 fill-primary/70 text-primary" />
            <span>Hajj Mabroor</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-[8px] tracking-[0.15em] text-primary-foreground font-bold">NEW</span>
          </Link>
          <Link href="/panjabi-collection"
            className="group relative inline-flex items-center gap-2 rounded-full pl-3 pr-2 py-1 bg-gradient-to-r from-primary via-emerald-light to-primary text-primary-foreground font-body text-[11px] font-semibold uppercase tracking-[0.18em] border border-gold/50 shadow-[0_2px_10px_-2px_hsl(var(--gold)/0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_-4px_hsl(var(--gold)/0.7)] overflow-hidden"
          >
            <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/40 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <Moon className="relative w-3.5 h-3.5 text-gold nav-icon-glow-active animate-shimmer-glow" />
            <span className="relative">Panjabi &amp; Kurta</span>
            <span className="relative ml-1 px-1.5 py-0.5 rounded-full bg-gold text-[8px] tracking-[0.15em] text-accent-foreground font-bold">−10%</span>
          </Link>
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
