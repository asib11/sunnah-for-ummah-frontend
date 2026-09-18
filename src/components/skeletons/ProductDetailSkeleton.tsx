import React from "react";

const ProductDetailSkeleton = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full bg-transparent">
      {/* Details — left */}
      <div className="md:col-span-4 order-2 md:order-1 flex flex-col justify-center space-y-4 animate-pulse">
        {/* Eyebrow label (~80px wide, ~12px tall) */}
        <div className="h-3 w-[80px] bg-[hsl(157_20%_85%)] rounded" />
        
        {/* Title (~250px wide, ~36px tall) */}
        <div className="h-9 w-[250px] bg-[hsl(157_20%_80%)] rounded mt-2" />
        
        {/* Description (2-3 thin bars ~16px tall) */}
        <div className="space-y-2.5 mt-3">
          <div className="h-4 w-full bg-[hsl(157_20%_85%)] rounded" />
          <div className="h-4 w-[90%] bg-[hsl(157_20%_85%)] rounded" />
          <div className="h-4 w-[75%] bg-[hsl(157_20%_85%)] rounded" />
        </div>
        
        {/* Color swatches (3 circles, ~24px diameter) */}
        <div className="flex items-center gap-2 mt-4">
          <div className="w-6 h-6 rounded-full bg-[hsl(157_20%_85%)]" />
          <div className="w-6 h-6 rounded-full bg-[hsl(157_20%_85%)]" />
          <div className="w-6 h-6 rounded-full bg-[hsl(157_20%_85%)]" />
        </div>
        
        {/* Price (~100px wide, ~28px tall) */}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <div className="h-7 w-[100px] bg-[hsl(157_20%_80%)] rounded" />
          {/* Add to cart button */}
          <div className="h-[36px] w-[140px] bg-[hsl(41_50%_70%/0.4)] rounded-full" />
        </div>
      </div>

      {/* LookCard — center */}
      <div className="md:col-span-5 order-1 md:order-2 animate-pulse">
        <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border border-[hsl(41_64%_56%/0.2)] bg-[hsl(157_20%_85%)]">
           <div className="absolute inset-0 bg-gradient-to-t from-[hsl(157_60%_15%/0.2)] to-transparent pointer-events-none" />
           
           {/* Color dots above image */}
           <div className="absolute top-4 left-4 flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-[hsl(157_20%_80%)]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[hsl(157_20%_80%)]" />
           </div>
           
           {/* Overlay text at bottom */}
           <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
             <div className="space-y-2">
               <div className="h-2 w-16 bg-[hsl(157_20%_80%)] rounded" />
               <div className="h-6 w-32 bg-[hsl(157_20%_80%)] rounded" />
               <div className="h-5 w-24 bg-[hsl(157_20%_80%)] rounded" />
             </div>
             <div className="h-6 w-28 rounded-full bg-[hsl(157_20%_80%)]" />
           </div>
        </div>
      </div>

      {/* Selector — right */}
      <div className="md:col-span-3 order-3 space-y-1.5 md:max-h-[480px] md:overflow-hidden pr-1 animate-pulse">
        {/* Sidebar heading */}
        <div className="h-2.5 w-28 bg-[hsl(41_50%_70%/0.4)] rounded mb-3" />
        
        {/* 8 List items */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`w-full flex items-center gap-2.5 p-1.5 rounded-lg border transition-all ${i === 0 ? "border-[hsl(41_60%_55%)] bg-[hsl(40_50%_98%)]" : "border-[hsl(41_40%_70%/0.3)] bg-[hsl(40_40%_96%)]"}`}>
            {/* Small square thumbnail (~48x48px) - actually the component uses w-10 h-10 which is 40px, but 48 is close */}
            <div className="w-10 h-10 rounded-md bg-[hsl(157_20%_85%)] shrink-0" />
            
            {/* Text bars */}
            <div className="flex-1 space-y-1.5 min-w-0">
              {/* English name wider */}
              <div className="h-2.5 w-20 bg-[hsl(157_20%_80%)] rounded" />
              {/* Bengali name shorter */}
              <div className="h-2 w-16 bg-[hsl(157_20%_85%)] rounded" />
            </div>
            
            {/* Small circle on the right */}
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? "bg-[hsl(41_64%_56%)]" : "bg-[hsl(41_64%_56%/0.25)]"}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
