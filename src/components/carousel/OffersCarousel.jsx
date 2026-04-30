import { useState, useEffect, useRef, useCallback } from 'react'
import OfferCard from '../ui/OfferCard'
import SkeletonCard from '../ui/SkeletonCard'

// ── mock data (replace with Sanity fetch) ──────────────────────────────────
export const MOCK_OFFERS = [
  {
    _id: 'o1',
    discountPercent: 30,
    originalPrice: 24.99,
    salePrice: 17.49,
    badgeLabel: 'Summer Deal',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 47).toISOString(),
    book: {
      title: 'The Midnight Library',
      author: 'Matt Haig',
      slug: 'the-midnight-library',
      rating: 4.4,
      reviewCount: 1240,
      ageRange: 'Young Adult',
      coverColor: '#8aaccb',
    },
  },
  {
    _id: 'o2',
    discountPercent: 25,
    originalPrice: 19.99,
    salePrice: 14.99,
    badgeLabel: 'Author Spotlight',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    book: {
      title: 'The Lions Secret Garden',
      author: 'Clara Moss',
      slug: 'lions-secret-garden',
      rating: 4.8,
      reviewCount: 580,
      ageRange: '4-8 Years',
    },
  },
  {
    _id: 'o3',
    discountPercent: 40,
    originalPrice: 29.99,
    salePrice: 17.99,
    badgeLabel: 'Flash Sale',
    expiresAt: new Date(Date.now() + 1000 * 60 * 55).toISOString(), // urgent — < 1hr
    book: {
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      slug: 'where-the-crawdads-sing',
      rating: 4.7,
      reviewCount: 2100,
      ageRange: 'Adult',
    },
  },
  {
    _id: 'o4',
    discountPercent: 20,
    originalPrice: 14.99,
    salePrice: 11.99,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    book: {
      title: 'Stars & Beyond',
      author: 'J. Hartley',
      slug: 'stars-and-beyond',
      rating: 4.2,
      reviewCount: 310,
      ageRange: '9-12 Years',
    },
  },
  {
    _id: 'o5',
    discountPercent: 35,
    originalPrice: 22.99,
    salePrice: 14.94,
    badgeLabel: 'Book Club Pick',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    book: {
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      slug: 'klara-and-the-sun',
      rating: 4.6,
      reviewCount: 940,
      ageRange: 'Adult',
    },
  },
]

// ── Arrow button ────────────────────────────────────────────────────────────
function ArrowBtn({ dir, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.65)',
        border: '1px solid rgba(180,140,90,0.28)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s ease',
        flexShrink: 0,
        boxShadow: disabled ? 'none' : '0 2px 10px rgba(100,60,20,0.10)',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.65)' }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        {dir === 'prev'
          ? <path d="M9 2L4 7l5 5" stroke="#7a4e22" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M5 2l5 5-5 5" stroke="#7a4e22" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
    </button>
  )
}

export default function OffersCarousel({
  offers: propOffers,
  loading   = false,
  title     = 'Special Offers',
  subtitle  = 'Managed via Sanity CMS · updates live',
  autoPlay  = true,
  autoPlayMs = 5000,
}) {
  const offers      = propOffers ?? MOCK_OFFERS
  const [cur,  setCur]  = useState(0)
  const [wish, setWish] = useState({})
  const trackRef    = useRef(null)
  const autoRef     = useRef(null)
  const pauseRef    = useRef(false)

  // responsive visible count
  const [visible, setVisible] = useState(3)
  useEffect(() => {
    function calc() {
      const w = window.innerWidth
      setVisible(w < 640 ? 1 : w < 1024 ? 2 : 3)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const maxIndex  = Math.max(0, offers.length - visible)
  const canPrev   = cur > 0
  const canNext   = cur < maxIndex

  const go = useCallback((n) => {
    setCur(Math.max(0, Math.min(n, maxIndex)))
  }, [maxIndex])

  // autoplay
  useEffect(() => {
    if (!autoPlay || offers.length <= visible) return
    autoRef.current = setInterval(() => {
      if (!pauseRef.current) {
        setCur(c => c >= maxIndex ? 0 : c + 1)
      }
    }, autoPlayMs)
    return () => clearInterval(autoRef.current)
  }, [autoPlay, autoPlayMs, maxIndex, visible, offers.length])

  // touch swipe
  const touchX = useRef(null)
  function onTouchStart(e) { touchX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchX.current === null) return
    const diff = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) go(diff > 0 ? cur + 1 : cur - 1)
    touchX.current = null
  }

  // card gap + width
  const GAP      = 16
  const cardPct  = `calc(${100 / visible}% - ${GAP * (visible - 1) / visible}px)`
  const shift    = `calc(${cur} * (${100 / visible}% + ${GAP / visible}px - ${GAP * (visible - 1) / (visible * visible)}px))`

  return (
    <section style={{ padding: '0 0 8px' }}>

      {/* ── Section header ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '20px', gap: '12px',
      }}>
        <div>
          <div style={{
            fontSize: '11px', fontWeight: '600',
            color: '#a0693a', letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: '4px',
          }}>
            ✦ Limited Time
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: '600', color: '#3d2010',
            lineHeight: 1.2, margin: 0,
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{
              fontSize: '11.5px', color: '#9a7a5a',
              fontFamily: "'DM Sans', sans-serif",
              marginTop: '3px',
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Arrow controls */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <ArrowBtn dir="prev" onClick={() => go(cur - 1)} disabled={!canPrev} />
          <ArrowBtn dir="next" onClick={() => go(cur + 1)} disabled={!canNext} />
        </div>
      </div>

      {/* ── Track ── */}
      <div
        style={{ overflow: 'hidden', borderRadius: '4px' }}
        onMouseEnter={() => { pauseRef.current = true }}
        onMouseLeave={() => { pauseRef.current = false }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {loading ? (
          <div style={{ display: 'flex', gap: `${GAP}px` }}>
            {[...Array(visible)].map((_, i) => (
              <div key={i} style={{ flex: `0 0 ${cardPct}` }}>
                <SkeletonCard variant="offer" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: `${GAP}px`,
              transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(-${shift})`,
              willChange: 'transform',
            }}
          >
            {offers.map((offer, i) => (
              <div
                key={offer._id || i}
                style={{
                  flex: `0 0 ${cardPct}`,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <OfferCard
                  offer={offer}
                  active={i === cur + Math.floor(visible / 2)}
                  wishlisted={!!wish[offer.book?.slug]}
                  onWishlist={(b) => setWish(w => ({ ...w, [b.slug]: !w[b.slug] }))}
                  onAddToCart={(item) => console.log('Add to cart:', item)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Dots ── */}
      {offers.length > visible && (
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: '6px', marginTop: '20px',
        }}>
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                height: '6px',
                width: cur === i ? '22px' : '6px',
                borderRadius: '3px',
                background: cur === i ? '#a0693a' : 'rgba(160,105,58,0.25)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Progress bar (autoplay indicator) ── */}
      {autoPlay && offers.length > visible && (
        <div style={{
          height: '2px',
          background: 'rgba(160,105,58,0.12)',
          borderRadius: '2px',
          marginTop: '14px',
          overflow: 'hidden',
        }}>
          <div
            key={cur}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #c48b52, #a0693a)',
              borderRadius: '2px',
              animation: `ks-progress ${autoPlayMs}ms linear forwards`,
            }}
          />
        </div>
      )}
      <style>{`
        @keyframes ks-progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  )
}