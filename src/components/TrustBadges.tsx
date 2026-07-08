"use client";

import { Award, RefreshCw, Truck, Shield, Globe } from "lucide-react";
import { useEffect, useRef } from "react";

const badges = [
  { icon: Award, label: "Premium Quality", desc: "Hand-picked fabrics" },
  { icon: RefreshCw, label: "Easy Return", desc: "7-day hassle free" },
  { icon: Globe, label: "Global Shipping", desc: "Worldwide delivery" },
  { icon: Truck, label: "Fast Delivery", desc: "1-3 days national" },
  { icon: Shield, label: "Secure Payment", desc: "SSL encrypted" },
];

const TrustBadges = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const step = () => {
      pos += 0.4;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Light emerald-washed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-white/80 to-emerald-50/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(152_60%_70%/0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(43_70%_60%/0.10),_transparent_60%)]" />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230645e3' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Top & bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />

      <div className="relative container mx-auto px-4 py-10 md:py-14">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="font-body text-[10px] uppercase tracking-[0.4em] text-emerald-700/70 mb-2">
            Why Choose Us
          </p>
          <h2 className="font-display text-xl md:text-2xl text-emerald-950/90">
            Trusted by <span className="text-emerald-700 italic">Thousands</span> of Muslims
          </h2>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-5 gap-4">
          {badges.map((badge, i) => (
            <div
              key={badge.label}
              className="group relative flex flex-col items-center text-center gap-3 rounded-xl px-5 py-6 bg-white/60 border border-emerald-200/40 hover:border-emerald-400/40 hover:bg-white/90 transition-all duration-500 backdrop-blur-sm shadow-[0_4px_20px_-4px_hsl(152_45%_25%/0.06)] hover:shadow-[0_8px_30px_-6px_hsl(152_45%_25%/0.12)]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Glow orb behind icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/10 blur-xl rounded-full scale-150 group-hover:bg-emerald-400/20 transition-all duration-500" />
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200/60 border border-emerald-200/40 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-400/50 transition-all duration-500">
                  <badge.icon className="w-5 h-5 text-emerald-700 group-hover:text-emerald-800 transition-colors" />
                </div>
              </div>
              <div>
                <p className="text-sm font-body font-semibold text-emerald-950/90 group-hover:text-emerald-950 transition-colors">
                  {badge.label}
                </p>
                <p className="text-[11px] font-body text-emerald-600/60 mt-0.5 group-hover:text-emerald-700/80 transition-colors">
                  {badge.desc}
                </p>
              </div>
              {/* Corner accent */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400/40 group-hover:bg-emerald-500/70 transition-colors" />
            </div>
          ))}
        </div>

        {/* Mobile: auto-scrolling marquee */}
        <div className="md:hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-hidden"
            style={{ scrollBehavior: "auto" }}
          >
            {[...badges, ...badges].map((badge, i) => (
              <div
                key={`${badge.label}-${i}`}
                className="flex-shrink-0 flex flex-col items-center text-center gap-2 rounded-xl px-5 py-4 bg-white/60 border border-emerald-200/40 w-36 shadow-[0_4px_20px_-4px_hsl(152_45%_25%/0.06)]"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200/60 border border-emerald-200/40 flex items-center justify-center">
                  <badge.icon className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-xs font-body font-medium text-emerald-950/90">
                  {badge.label}
                </p>
                <p className="text-[10px] font-body text-emerald-600/60">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustBadges;


