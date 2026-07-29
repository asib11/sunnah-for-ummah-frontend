export default function ProductCardSkeleton() {
  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-emerald-tint/50 animate-pulse">
      {/* Image Placeholder */}
      <div className="aspect-[4/5] bg-emerald-tint/20 relative" />

      {/* Info Placeholder */}
      <div className="p-3 sm:p-4">
        {/* Title */}
        <div className="space-y-1.5 mb-2 min-h-[2.4rem] sm:min-h-[2.5rem]">
          <div className="h-3 sm:h-3.5 bg-emerald-tint/30 rounded w-full" />
          <div className="h-3 sm:h-3.5 bg-emerald-tint/30 rounded w-2/3" />
        </div>

        {/* Subtitle */}
        <div className="h-2.5 sm:h-3 bg-emerald-tint/20 rounded w-1/2 mb-2.5" />

        <div className="flex items-center justify-between gap-2 mt-1">
          {/* Price */}
          <div className="h-5 sm:h-6 w-16 bg-emerald-tint/30 rounded" />
          
          {/* Desktop Add Icon */}
          <div className="hidden sm:block w-8 h-8 rounded-full bg-emerald-tint/20 shrink-0" />
        </div>

        {/* Mobile / Full Width Add Button */}
        <div className="mt-3 w-full h-[2.375rem] sm:h-9 bg-accent/20 rounded-full" />
      </div>
    </div>
  );
}
