import { useState } from 'react'
import StarRating from './StarRating'

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

export default function BookCard({
  book = {},
  onAddToCart,
  onWishlist,
  wishlisted = false,
  size = 'md',
}) {
  const [hovered, setHovered]   = useState(false)
  const [added,   setAdded]     = useState(false)
  const [imgError, setImgError] = useState(false)

  const s = SIZES[size] || SIZES.md
  const {
    title       = 'Untitled',
    author      = '',
    price       = 0,
    rating      = 0,
    reviewCount,
    coverImage,
    ageRange,
    badge,
    badgeColor  = 'tan',
    slug        = '#',
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
      style={{ textDecoration: 'none', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: s.width,
        background: 'rgba(255,255,255,0.52)',
        border: '1px solid rgba(200,170,130,0.32)',
        borderRadius: '18px',
        padding: s.padding,
        cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 36px rgba(100,60,20,0.16)'
          : '0 3px 16px rgba(100,60,20,0.08)',
        backdropFilter: 'blur(14px)',
        position: 'relative',
      }}>

        {/* ── Wishlist btn ── */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(180,140,90,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
            opacity: hovered || wishlisted ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
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

        {/* ── Cover image ── */}
        <div style={{
          width: '100%',
          height: s.coverH,
          borderRadius: '10px',
          marginBottom: '10px',
          overflow: 'hidden',
          background: fallbackBg,
          position: 'relative',
          transition: 'transform 0.25s ease',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
        }}>
          {coverImage && !imgError ? (
            <img
              src={typeof coverImage === 'string' ? coverImage : coverImage?.asset?.url}
              alt={title}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            /* Fallback: decorative book spine illustration */
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
            }}>
              <div style={{
                width: '55%',
                height: '85%',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '2px 6px 6px 2px',
                border: '1px solid rgba(255,255,255,0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '8px',
                  background: 'rgba(0,0,0,0.12)', borderRadius: '2px 0 0 2px',
                }} />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
                  <path d="M4 19V5a2 2 0 012-2h13a1 1 0 011 1v13" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 19a2 2 0 002 2h14" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M9 7h7M9 11h5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <div style={{
                  fontSize: '7.5px',
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: "'Playfair Display', serif",
                  textAlign: 'center',
                  marginTop: '5px',
                  fontWeight: '600',
                  lineHeight: 1.3,
                }}>
                  {title.split(' ').slice(0, 3).join(' ')}
                </div>
              </div>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: bc.bg,
              border: `1px solid ${bc.border}`,
              borderRadius: '12px',
              padding: '3px 8px',
              fontSize: '9.5px',
              fontWeight: '700',
              color: bc.text,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.02em',
              backdropFilter: 'blur(8px)',
            }}>
              {badge}
            </div>
          )}
        </div>

        {/* ── Age range tag ── */}
        {ageRange && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(160,105,58,0.09)',
            borderRadius: '10px',
            padding: '2px 8px',
            marginBottom: '6px',
          }}>
            <span style={{
              fontSize: '9.5px',
              color: '#9a6030',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: '500',
            }}>
              {ageRange}
            </span>
          </div>
        )}

        {/* ── Title ── */}
        <div style={{
          fontSize: s.titleSize,
          fontFamily: "'Playfair Display', serif",
          fontWeight: '600',
          color: '#3d2010',
          lineHeight: 1.35,
          marginBottom: '3px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {title}
        </div>

        {/* ── Author ── */}
        <div style={{
          fontSize: '11px',
          color: '#9a7a5a',
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: '8px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {author}
        </div>

        {/* ── Stars ── */}
        <div style={{ marginBottom: '10px' }}>
          <StarRating rating={rating} count={reviewCount} size="sm" showCount={!!reviewCount} />
        </div>

        {/* ── Price + Add to cart ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#7a4e22',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            ${price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: added ? 'rgba(60,140,80,0.15)' : 'rgba(160,105,58,0.14)',
              border: `1px solid ${added ? 'rgba(60,140,80,0.3)' : 'rgba(160,105,58,0.3)'}`,
              borderRadius: '16px',
              padding: '5px 10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '10.5px',
              fontWeight: '600',
              color: added ? '#2d7a45' : '#7a4e22',
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: 'nowrap',
            }}
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