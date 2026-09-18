export default function HajjKitItemSkeleton() {
  return (
    <div className="bg-card/40 border border-emerald-tint/40 rounded-2xl p-2.5 md:p-3 flex items-center gap-3 md:gap-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 bg-emerald-tint/20 rounded-xl overflow-hidden shrink-0" />
      
      {/* Text Skeleton */}
      <div className="flex-1 min-w-0 py-1 space-y-2">
        <div className="h-4 w-3/4 bg-emerald-tint/20 rounded" />
        <div className="h-3 w-1/2 bg-emerald-tint/10 rounded" />
      </div>
      
      {/* Price/Cart Skeleton */}
      <div className="shrink-0 text-right pl-2 space-y-2 flex flex-col items-end">
        <div className="h-5 w-16 bg-emerald-tint/20 rounded" />
        <div className="h-8 w-8 bg-emerald-tint/10 rounded-full" />
      </div>
    </div>
  );
}
