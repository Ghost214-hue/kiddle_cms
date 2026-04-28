import { useState } from 'react'

const SIZES = {
  sm: { star: 11, text: '10px', gap: '2px' },
  md: { star: 14, text: '12px', gap: '3px' },
  lg: { star: 18, text: '13px', gap: '4px' },
}

function Star({ fill = 'full', size = 14, color = '#a0693a' }) {
  const id = `grad-${Math.random().toString(36).slice(2, 7)}`
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
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

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
        {stars.map((fill, i) => (
          <span
            key={i}
            style={{ cursor: interactive ? 'pointer' : 'default', lineHeight: 0 }}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => interactive && onChange?.(i + 1)}
          >
            <Star fill={fill} size={s.star} />
          </span>
        ))}
      </div>

      {showCount && count !== undefined && (
        <span style={{
          fontSize: s.text,
          color: '#9a7a5a',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          ({count.toLocaleString()})
        </span>
      )}

      {showCount && count === undefined && rating > 0 && (
        <span style={{
          fontSize: s.text,
          color: '#9a7a5a',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
        }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}