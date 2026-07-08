/**
 * Skeleton.jsx — Kiddle Design System
 * Loading skeleton components
 */
export function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`bg-gradient-to-r from-[#f0e8dc] via-[#e8ddd0] to-[#f0e8dc] bg-[length:200%_100%] animate-[shimmer_1.4s_infinite] rounded-lg ${className}`}
    />
  );
}

export function ProductCardSkeleton({ type = "book" }) {
  const aspect = type === "book" ? "aspect-[3/4]" : "aspect-square";
  return (
    <div className="rounded-xl overflow-hidden bg-white border border-[rgba(200,170,130,0.18)]">
      <div
        className={`${aspect} bg-gradient-to-r from-[#f0e8dc] via-[#e8ddd0] to-[#f0e8dc] bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]`}
      />
      <div className="p-2.5 space-y-1.5">
        <SkeletonBlock className="h-[10px] w-[45%]" />
        <SkeletonBlock className="h-[12px] w-[85%]" />
        <SkeletonBlock className="h-[10px] w-[60%]" />
        <div className="flex justify-between items-center pt-1">
          <SkeletonBlock className="h-[14px] w-[40%]" />
          <SkeletonBlock className="h-[28px] w-[50px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CollectionSkeleton({ count = 8, type = "book" }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} type={type} />
      ))}
    </div>
  );
}
