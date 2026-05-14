const shimmerClasses = `
  animate-[kiddle-shimmer_1.6s_ease-in-out_infinite]
  bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-amber-50/80
  bg-[length:200%_100%]
  rounded-md
`

function SkeletonBox({ width = '100%', height, className = '', style = {} }) {
  return (
    <div
      className={`${shimmerClasses} ${className}`}
      style={{ width, height, ...style }}
    />
  )
}

function BookSkeleton() {
  return (
    <div className="w-[170px] flex-shrink-0 bg-white/45 border border-amber-800/25 rounded-[18px] p-3.5">
      {/* Cover */}
      <SkeletonBox height="130px" className="rounded-[10px] mb-3" />
      {/* Badge row */}
      <div className="flex gap-1.5 mb-2">
        <SkeletonBox width="48px" height="16px" className="rounded-[10px]" />
      </div>
      {/* Title */}
      <SkeletonBox height="13px" className="mb-1" />
      <SkeletonBox width="70%" height="13px" className="mb-2" />
      {/* Author */}
      <SkeletonBox width="55%" height="11px" className="mb-3" />
      {/* Price row + stars */}
      <div className="flex justify-between items-center">
        <SkeletonBox width="44px" height="14px" />
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <SkeletonBox key={i} width="10px" height="10px" className="rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

function OfferSkeleton() {
  return (
    <div className="w-[220px] flex-shrink-0 bg-white/45 border border-amber-800/25 rounded-[18px] overflow-hidden">
      {/* Image area */}
      <SkeletonBox height="120px" className="rounded-none mb-0" />
      <div className="p-3 pb-3.5 px-3.5">
        {/* Title */}
        <SkeletonBox height="14px" className="mb-1.5" />
        <SkeletonBox width="60%" height="14px" className="mb-1" />
        {/* Author */}
        <SkeletonBox width="45%" height="11px" className="mb-3" />
        {/* Price + stars */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5 items-baseline">
            <SkeletonBox width="40px" height="15px" />
            <SkeletonBox width="32px" height="11px" />
          </div>
          <SkeletonBox width="50px" height="10px" />
        </div>
      </div>
    </div>
  )
}

function EditorialSkeleton() {
  return (
    <div className="bg-white/45 border border-amber-800/25 rounded-2xl p-7 grid grid-cols-[200px_1fr] gap-7 items-center">
      <SkeletonBox height="260px" className="rounded-xl" />
      <div>
        <SkeletonBox width="80px" height="12px" className="rounded-[10px] mb-3.5" />
        <SkeletonBox height="22px" className="mb-2" />
        <SkeletonBox width="80%" height="22px" className="mb-4" />
        <SkeletonBox height="14px" className="mb-1.5" />
        <SkeletonBox height="14px" className="mb-1.5" />
        <SkeletonBox width="75%" height="14px" className="mb-6" />
        <div className="flex gap-3">
          <SkeletonBox width="120px" height="38px" className="rounded-3xl" />
          <SkeletonBox width="100px" height="38px" className="rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

const VARIANT_MAP = {
  book: BookSkeleton,
  offer: OfferSkeleton,
  editorial: EditorialSkeleton,
}

export default function SkeletonCard({ variant = 'book', count = 1 }) {
  const Component = VARIANT_MAP[variant] || BookSkeleton

  return (
    <>
      <style>{`
        @keyframes kiddle-shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
      {count === 1 ? (
        <Component />
      ) : (
        <div className="flex gap-3.5 flex-wrap">
          {[...Array(count)].map((_, i) => (
            <Component key={i} />
          ))}
        </div>
      )}
    </>
  )
}