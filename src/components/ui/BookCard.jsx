import { useState } from 'react'
import StarRating from './StarRating'
import { formatPrice } from '../../utils/formatPrice'

const SIZES = {
  sm: { width: '148px', coverH: '110px', titleSize: '12px', padding: '12px' },
  md: { width: '170px', coverH: '130px', titleSize: '13px', padding: '14px' },
  lg: { width: '200px', coverH: '160px', titleSize: '14px', padding: '16px' },
}

const BADGE_COLORS = {
  tan:   { bg: 'rgba(160,105,58,0.15)',  border: 'rgba(160,105,58,0.3)',  text: '#7a4e22' },
  green: { bg: 'rgba(60,140,80,0.12)',   border: 'rgba(60,140,80,0.3)',   text: '#2d7a45' },
  red:   { bg: 'rgba(180,50,40,0.12)',   border: 'rgba(180,50,40,0.28)',  text: '#b43228' },
}

const COVER_FALLBACKS = [
  'linear-gradient(145deg, #f5d5a8, #e0a870)',
  'linear-gradient(145deg, #c8d8e8, #8aaccb)',
  'linear-gradient(145deg, #d8e8c0, #9aba6a)',
  'linear-gradient(145deg, #e8c8d8, #c890b0)',
  'linear-gradient(145deg, #d8d0e8, #a898cc)',
  'linear-gradient(145deg, #e8dac8, #c0a878)',
]

function getHashColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return COVER_FALLBACKS[Math.abs(hash) % COVER_FALLBACKS.length]
}

const sizeClasses = {
  sm: {
    wrapper: 'w-[148px] p-3',
    coverH: 'h-[110px]',
    titleSize: 'text-[12px]',
  },
  md: {
    wrapper: 'w-[170px] p-3.5',
    coverH: 'h-[130px]',
    titleSize: 'text-[13px]',
  },
  lg: {
    wrapper: 'w-[200px] p-4',
    coverH: 'h-[160px]',
    titleSize: 'text-[14px]',
  },
}

export default function BookCard({
  book = {},
  onAddToCart,
  onWishlist,
  wishlisted = false,
  size = 'md',
}) {
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const s = SIZES[size] || SIZES.md
  const currentSize = sizeClasses[size] || sizeClasses.md

  const {
    title = 'Untitled',
    author = '',
    price = 0,
    rating = 0,
    reviewCount,
    coverImage,
    ageRange,
    badge,
    badgeColor = 'tan',
    slug = '#',
  } = book

  const fallbackBg = getHashColor(title)
  const bc = BADGE_COLORS[badgeColor] || BADGE_COLORS.tan

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(book)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()
    onWishlist?.(book)
  }

  return (
    <a
      href={`/book/${slug}`}
      className="group flex-shrink-0 no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`
          ${currentSize.wrapper}
          bg-white/50
          border border-[rgba(200,170,130,0.32)]
          rounded-[18px]
          cursor-pointer
          transition-all duration-200 ease-out
          group-hover:translate-y-[-5px]
          shadow-[0_3px_16px_rgba(100,60,20,0.08)]
          group-hover:shadow-[0_12px_36px_rgba(100,60,20,0.16)]
          backdrop-blur-md
          relative
        `}
      >
        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`
            absolute top-2.5 right-2.5
            w-7 h-7 rounded-full
            bg-white/75 border border-amber-800/20
            flex items-center justify-center
            cursor-pointer z-10
            transition-opacity duration-200
            ${wishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 12C7 12 1.5 8.5 1.5 4.8C1.5 3 3 1.5 4.8 1.5C5.9 1.5 6.8 2.2 7 2.8C7.2 2.2 8.1 1.5 9.2 1.5C11 1.5 12.5 3 12.5 4.8C12.5 8.5 7 12 7 12Z"
              fill={wishlisted ? '#a0693a' : 'none'}
              stroke="#a0693a"
              strokeWidth="1.3"
            />
          </svg>
        </button>

        {/* Cover image area */}
        <div
          className={`
            relative w-full ${currentSize.coverH}
            rounded-[10px] mb-2.5 overflow-hidden
            transition-transform duration-200
            group-hover:scale-105
          `}
          style={{ background: fallbackBg }}
        >
          {coverImage && !imgError ? (
            <img
              src={typeof coverImage === 'string' ? coverImage : coverImage?.asset?.url}
              alt={title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Fallback book spine illustration */
            <div className="w-full h-full flex items-center justify-center p-3">
              <div className="relative w-[55%] h-[85%] bg-white/25 rounded-[2px_6px_6px_2px] border border-white/40 flex flex-col items-center justify-center p-2">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/10 rounded-l-[2px]" />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-70">
                  <path d="M4 19V5a2 2 0 012-2h13a1 1 0 011 1v13" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 19a2 2 0 002 2h14" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M9 7h7M9 11h5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <div className="text-[7.5px] text-white/85 font-['Playfair_Display',serif] text-center mt-1 font-semibold leading-tight">
                  {title.split(' ').slice(0, 3).join(' ')}
                </div>
              </div>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div
              className="absolute top-2 left-2 rounded-2xl px-2 py-0.5 text-[9.5px] font-bold font-['DM_Sans',sans-serif] tracking-wide backdrop-blur-sm"
              style={{
                background: bc.bg,
                border: `1px solid ${bc.border}`,
                color: bc.text,
              }}
            >
              {badge}
            </div>
          )}
        </div>

        {/* Age range */}
        {ageRange && (
          <div className="inline-flex items-center bg-amber-800/10 rounded-[10px] px-2 py-0.5 mb-1.5">
            <span className="text-[9.5px] text-amber-800/80 font-['DM_Sans',sans-serif] font-medium">
              {ageRange}
            </span>
          </div>
        )}

        {/* Title */}
        <div
          className={`
            ${currentSize.titleSize}
            font-['Playfair_Display',serif] font-semibold text-amber-950
            leading-tight mb-0.5 line-clamp-2
          `}
        >
          {title}
        </div>

        {/* Author */}
        <div className="text-[11px] text-amber-700/60 font-['DM_Sans',sans-serif] mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {author}
        </div>

        {/* Stars */}
        <div className="mb-2.5">
          <StarRating rating={rating} count={reviewCount} size="sm" showCount={!!reviewCount} />
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-sm font-bold text-amber-800 font-['DM_Sans',sans-serif]">
            {formatPrice(price)}
          </span>

          <button
            onClick={handleAddToCart}
            className={`
              flex items-center gap-1
              rounded-2xl px-2.5 py-1.25
              cursor-pointer transition-all duration-200
              text-[10.5px] font-semibold font-['DM_Sans',sans-serif]
              whitespace-nowrap
              ${added
                ? 'bg-green-800/15 border border-green-700/30 text-green-800'
                : 'bg-amber-700/15 border border-amber-700/30 text-amber-800'
              }
            `}
          >
            {added ? (
              <>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#2d7a45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2v8M2 6h8" stroke="#7a4e22" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </a>
  )
}
