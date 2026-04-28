
const shimmerStyle = {
  background: 'linear-gradient(90deg, #ede5d8 25%, #f5f0e8 50%, #ede5d8 75%)',
  backgroundSize: '200% 100%',
  animation: 'kiddle-shimmer 1.6s ease-in-out infinite',
  borderRadius: '6px',
}

function SkeletonBox({ width = '100%', height, style = {} }) {
  return (
    <div style={{ ...shimmerStyle, width, height, borderRadius: '6px', ...style }} />
  )
}

function BookSkeleton() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.45)',
      border: '1px solid rgba(200,170,130,0.25)',
      borderRadius: '18px',
      padding: '14px',
      width: '170px',
      flexShrink: 0,
    }}>
      {/* Cover */}
      <SkeletonBox height="130px" style={{ borderRadius: '10px', marginBottom: '12px' }} />
      {/* Badge row */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <SkeletonBox width="48px" height="16px" style={{ borderRadius: '10px' }} />
      </div>
      {/* Title */}
      <SkeletonBox height="13px" style={{ marginBottom: '5px' }} />
      <SkeletonBox width="70%" height="13px" style={{ marginBottom: '8px' }} />
      {/* Author */}
      <SkeletonBox width="55%" height="11px" style={{ marginBottom: '12px' }} />
      {/* Price row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonBox width="44px" height="14px" />
        <div style={{ display: 'flex', gap: '2px' }}>
          {[...Array(5)].map((_, i) => (
            <SkeletonBox key={i} width="10px" height="10px" style={{ borderRadius: '50%' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function OfferSkeleton() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.45)',
      border: '1px solid rgba(200,170,130,0.25)',
      borderRadius: '18px',
      overflow: 'hidden',
      width: '220px',
      flexShrink: 0,
    }}>
      {/* Image area */}
      <SkeletonBox height="120px" style={{ borderRadius: '0', marginBottom: '0' }} />
      <div style={{ padding: '12px 14px 14px' }}>
        {/* Title */}
        <SkeletonBox height="14px" style={{ marginBottom: '6px' }} />
        <SkeletonBox width="60%" height="14px" style={{ marginBottom: '5px' }} />
        {/* Author */}
        <SkeletonBox width="45%" height="11px" style={{ marginBottom: '12px' }} />
        {/* Price + stars */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
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
    <div style={{
      background: 'rgba(255,255,255,0.45)',
      border: '1px solid rgba(200,170,130,0.25)',
      borderRadius: '20px',
      padding: '28px',
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: '28px',
      alignItems: 'center',
    }}>
      <SkeletonBox height="260px" style={{ borderRadius: '12px' }} />
      <div>
        <SkeletonBox width="80px" height="12px" style={{ borderRadius: '10px', marginBottom: '14px' }} />
        <SkeletonBox height="22px" style={{ marginBottom: '8px' }} />
        <SkeletonBox width="80%" height="22px" style={{ marginBottom: '16px' }} />
        <SkeletonBox height="14px" style={{ marginBottom: '6px' }} />
        <SkeletonBox height="14px" style={{ marginBottom: '6px' }} />
        <SkeletonBox width="75%" height="14px" style={{ marginBottom: '24px' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <SkeletonBox width="120px" height="38px" style={{ borderRadius: '24px' }} />
          <SkeletonBox width="100px" height="38px" style={{ borderRadius: '24px' }} />
        </div>
      </div>
    </div>
  )
}

const VARIANT_MAP = {
  book:      BookSkeleton,
  offer:     OfferSkeleton,
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
      {count === 1
        ? <Component />
        : (
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {[...Array(count)].map((_, i) => <Component key={i} />)}
          </div>
        )
      }
    </>
  )
}