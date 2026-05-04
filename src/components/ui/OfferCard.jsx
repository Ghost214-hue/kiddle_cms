
import { useState } from 'react'
import StarRating from '../ui/StarRating'
import CountdownTimer from '../ui/CountdownTimer'

const COVER_FALLBACKS = [
  ['#f5d5a8', '#e0a870'],
  ['#c8d8e8', '#8aaccb'],
  ['#d8e8c0', '#9aba6a'],
  ['#e8c8d8', '#c890b0'],
  ['#d8d0e8', '#a898cc'],
  ['#e8dac8', '#c0a878'],
  ['#f0d8c0', '#d4956a'],
  ['#cce8d8', '#78b898'],
]

function getCoverColors(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return COVER_FALLBACKS[Math.abs(h) % COVER_FALLBACKS.length]
}

export default function OfferCard({
  offer = {},
  onAddToCart,
  onWishlist,
  wishlisted = false,
  active = false,
}) {
  const [hovered,  setHovered]  = useState(false)
  const [added,    setAdded]    = useState(false)
  const [imgError, setImgError] = useState(false)

  const {
    book          = {},
    discountPercent,
    originalPrice = 0,
    salePrice     = 0,
    badgeLabel,
    expiresAt,
  } = offer

  const {
    title      = 'Untitled',
    author     = '',
    coverImage,
    rating     = 0,
    reviewCount,
    slug       = '#',
    ageRange,
  } = book

  const [c1, c2] = getCoverColors(title)
  const savePct  = discountPercent ?? Math.round((1 - salePrice / originalPrice) * 100)
  const isLifted = hovered || active

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.({ ...book, price: salePrice })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function handleWish(e) {
    e.preventDefault()
    e.stopPropagation()
    onWishlist?.(book)
  }

  return (
    <a
      href={`/book/${slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: 'rgba(255,255,255,0.56)',
        border: `1px solid ${active ? 'rgba(160,105,58,0.45)' : 'rgba(200,170,130,0.30)'}`,
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: isLifted ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isLifted
          ? '0 16px 48px rgba(100,60,20,0.18)'
          : active
          ? '0 8px 28px rgba(100,60,20,0.12)'
          : '0 3px 14px rgba(100,60,20,0.07)',
        backdropFilter: 'blur(14px)',
        position: 'relative',
        width: '100%',
      }}>

        {/* ── Cover image area ── */}
        <div style={{
          position: 'relative',
          height: '160px',
          background: `linear-gradient(145deg, ${c1}, ${c2})`,
          overflow: 'hidden',
        }}>
          {coverImage && !imgError ? (
            <img
              src={typeof coverImage === 'string' ? coverImage : coverImage?.asset?.url}
              alt={title}
              onError={() => setImgError(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.4s ease',
                transform: isLifted ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          ) : (
            /* Illustrated book fallback */
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '70px', height: '100px',
                background: 'rgba(255,255,255,0.28)',
                borderRadius: '2px 8px 8px 2px',
                border: '1px solid rgba(255,255,255,0.45)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '8px', position: 'relative',
                transition: 'transform 0.3s ease',
                transform: isLifted ? 'scale(1.08) rotate(-1deg)' : 'scale(1)',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '9px',
                  background: 'rgba(0,0,0,0.14)', borderRadius: '2px 0 0 2px',
                }}/>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.75 }}>
                  <path d="M4 19V5a2 2 0 012-2h13a1 1 0 011 1v13" stroke="rgba(255,255,255,0.95)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 19a2 2 0 002 2h14" stroke="rgba(255,255,255,0.95)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M9 7h6M9 11h4" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <div style={{
                  fontSize: '7px', color: 'rgba(255,255,255,0.9)',
                  fontFamily: "'Playfair Display', serif",
                  textAlign: 'center', marginTop: '5px', fontWeight: '600', lineHeight: 1.3,
                }}>
                  {title.split(' ').slice(0, 3).join(' ')}
                </div>
              </div>
            </div>
          )}

          {/* Gradient overlay at bottom for text legibility */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.18), transparent)',
          }}/>

          {/* Discount badge */}
          {savePct > 0 && (
            <div style={{
              position: 'absolute', top: '10px', right: '10px',
              background: '#a0693a',
              color: '#fff',
              fontSize: '10px', fontWeight: '700',
              padding: '4px 9px', borderRadius: '12px',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.02em',
              boxShadow: '0 2px 8px rgba(100,60,20,0.25)',
            }}>
              -{savePct}%
            </div>
          )}

          {/* Flash sale / custom badge */}
          {badgeLabel && (
            <div style={{
              position: 'absolute', top: '10px', left: '10px',
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(8px)',
              color: '#7a4e22',
              fontSize: '9.5px', fontWeight: '700',
              padding: '3px 9px', borderRadius: '12px',
              fontFamily: "'DM Sans', sans-serif",
              border: '1px solid rgba(180,140,90,0.3)',
              letterSpacing: '0.03em',
            }}>
              {badgeLabel}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWish}
            style={{
              position: 'absolute', bottom: '8px', right: '8px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(180,140,90,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              opacity: hovered || wishlisted ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 12C7 12 1.5 8.5 1.5 4.8C1.5 3 3 1.5 4.8 1.5C5.9 1.5 6.8 2.2 7 2.8C7.2 2.2 8.1 1.5 9.2 1.5C11 1.5 12.5 3 12.5 4.8C12.5 8.5 7 12 7 12Z"
                fill={wishlisted ? '#a0693a' : 'none'}
                stroke="#a0693a" strokeWidth="1.3"
              />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '14px 16px 16px' }}>

          {/* Age range */}
          {ageRange && (
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(160,105,58,0.09)', borderRadius: '10px',
              padding: '2px 8px', marginBottom: '6px',
            }}>
              <span style={{
                fontSize: '9.5px', color: '#9a6030',
                fontFamily: "'DM Sans', sans-serif", fontWeight: '500',
              }}>
                {ageRange}
              </span>
            </div>
          )}

          {/* Title */}
          <div style={{
            fontSize: '14px',
            fontFamily: "'Playfair Display', serif",
            fontWeight: '600', color: '#3d2010',
            lineHeight: 1.35, marginBottom: '3px',
            display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {title}
          </div>

          {/* Author */}
          <div style={{
            fontSize: '11.5px', color: '#9a7a5a',
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: '8px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            by {author}
          </div>

          {/* Stars */}
          <div style={{ marginBottom: '10px' }}>
            <StarRating rating={rating} count={reviewCount} size="sm" showCount={!!reviewCount} />
          </div>

          {/* Countdown timer */}
          {expiresAt && (
            <div style={{ marginBottom: '12px' }}>
              <CountdownTimer expiresAt={expiresAt} variant="badge" />
            </div>
          )}

          {/* Price row + Add to cart */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                fontSize: '16px', fontWeight: '700', color: '#7a4e22',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                ${salePrice.toFixed(2)}
              </span>
              {originalPrice > salePrice && (
                <span style={{
                  fontSize: '12px', color: '#b8998a',
                  fontFamily: "'DM Sans', sans-serif",
                  textDecoration: 'line-through',
                }}>
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <button
              onClick={handleAdd}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: added
                  ? 'rgba(60,140,80,0.14)'
                  : 'linear-gradient(135deg, #c48b52, #a0693a)',
                border: added ? '1px solid rgba(60,140,80,0.3)' : 'none',
                borderRadius: '20px',
                padding: '7px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '11px', fontWeight: '600',
                color: added ? '#2d7a45' : '#fff',
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: added ? 'none' : '0 3px 10px rgba(100,60,20,0.22)',
                whiteSpace: 'nowrap',
              }}
            >
              {added ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#2d7a45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M1.5 2H3l1.8 6H9l1.5-4H4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="5.5" cy="10" r="0.9" fill="white"/>
                    <circle cx="9" cy="10" r="0.9" fill="white"/>
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Shop Deal link */}
          <div style={{
            marginTop: '10px',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <span style={{
              fontSize: '11px', color: '#a0693a', fontWeight: '600',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Shop Deal
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6M5 2l3 3-3 3" stroke="#a0693a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </a>
  )
}