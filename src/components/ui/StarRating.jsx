import { useState } from 'react'

const SIZES = {
  sm: { star: 11, text: '10px', gap: '2px' },
  md: { star: 14, text: '12px', gap: '3px' },
  lg: { star: 18, text: '13px', gap: '4px' },
}

function Star({ fill = 'full', size = 14, color = '#a0693a' }) {
  const id = `grad-${Math.random().toString(36).slice(2, 7)}`
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="shrink-0">
      {fill === 'partial' && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor="#e0cdb8" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M7 1l1.6 4H13l-3.5 2.6 1.4 4.4L7 9.5 3.1 12l1.4-4.4L1 5h4.4L7 1Z"
        fill={
          fill === 'full'    ? color      :
          fill === 'partial' ? `url(#${id})` :
          '#e0cdb8'
        }
      />
    </svg>
  )
}

export default function StarRating({
  rating = 0,
  count,
  size = 'md',
  showCount = true,
  interactive = false,
  onChange,
}) {
  const [hovered, setHovered] = useState(null)
  const s = SIZES[size] || SIZES.md
  const display = hovered ?? rating

  const stars = Array.from({ length: 5 }, (_, i) => {
    const val = i + 1
    if (display >= val)           return 'full'
    if (display >= val - 0.5)     return 'partial'
    return 'empty'
  })

  // Gap class mapping based on size
  const gapClass = {
    sm: 'gap-[2px]',
    md: 'gap-[3px]',
    lg: 'gap-[4px]',
  }[size] || 'gap-[3px]'

  // Text size class mapping
  const textSizeClass = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-[13px]',
  }[size] || 'text-xs'

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex items-center ${gapClass}`}>
        {stars.map((fill, i) => (
          <span
            key={i}
            className={`leading-[0] ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => interactive && onChange?.(i + 1)}
          >
            <Star fill={fill} size={s.star} />
          </span>
        ))}
      </div>

      {showCount && count !== undefined && (
        <span className={`${textSizeClass} text-amber-600/70 font-['DM_Sans',sans-serif]`}>
          ({count.toLocaleString()})
        </span>
      )}

      {showCount && count === undefined && rating > 0 && (
        <span className={`${textSizeClass} text-amber-600/70 font-['DM_Sans',sans-serif] font-medium`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}