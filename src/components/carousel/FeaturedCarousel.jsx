/**
 * FeaturedCarousel — Featured picks horizontal slider
 *
 * Props:
 *   books        {array}   — array of book objects from Sanity
 *   loading      {boolean}
 *   title        {string}  — section title
 *   viewAllHref  {string}  — "View All" link
 *   showBadges   {boolean} — show New/Sale/Bestseller badges (default true)
 *
 * Usage:
 *   import FeaturedCarousel from './carousel/FeaturedCarousel'
 *   <FeaturedCarousel books={featured} loading={loading} />
 */

import { useState, useRef, useEffect } from 'react'
import BookCard from '../ui/BookCard'
import SkeletonCard from '../ui/SkeletonCard'

// ── mock data (replace with Sanity fetch) ──────────────────────────────────
export const MOCK_FEATURED = [
  {
    _id: 'b1', title: 'The Midnight Library', author: 'Matt Haig',
    price: 24.99, rating: 4.4, reviewCount: 1240,
    ageRange: 'Young Adult', badge: '#1 Bestseller', badgeColor: 'tan',
    slug: 'the-midnight-library',
  },
  {
    _id: 'b2', title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi',
    price: 18.99, rating: 4.8, reviewCount: 876,
    ageRange: 'Adult', badge: 'New', badgeColor: 'green',
    slug: 'before-the-coffee-gets-cold',
  },
  {
    _id: 'b3', title: 'Where the Crawdads Sing', author: 'Delia Owens',
    price: 23.00, rating: 4.7, reviewCount: 2100,
    ageRange: 'Adult', slug: 'where-the-crawdads-sing',
  },
  {
    _id: 'b4', title: "The Lion's Secret Garden", author: 'Clara Moss',
    price: 12.99, rating: 4.6, reviewCount: 580,
    ageRange: '4-8 Years', badge: 'New', badgeColor: 'green',
    slug: 'lions-secret-garden',
  },
  {
    _id: 'b5', title: 'Klara and the Sun', author: 'Kazuo Ishiguro',
    price: 20.00, rating: 4.6, reviewCount: 940,
    ageRange: 'Adult', slug: 'klara-and-the-sun',
  },
  {
    _id: 'b6', title: 'Stars & Beyond', author: 'J. Hartley',
    price: 9.50, rating: 4.2, reviewCount: 310,
    ageRange: '9-12 Years', badge: 'Sale', badgeColor: 'red',
    slug: 'stars-and-beyond',
  },
  {
    _id: 'b7', title: 'The Forest Alphabet', author: 'Nora Fynn',
    price: 8.99, rating: 4.9, reviewCount: 430,
    ageRange: '0-3 Years', slug: 'forest-alphabet',
  },
  {
    _id: 'b8', title: 'Wings of Tomorrow', author: 'Sol Rivera',
    price: 11.00, rating: 4.3, reviewCount: 195,
    ageRange: '9-12 Years', slug: 'wings-of-tomorrow',
  },
]

export default function FeaturedCarousel({
  books: propBooks,
  loading      = false,
  title        = 'Featured Picks',
  viewAllHref  = '/books',
  showBadges   = true,
}) {
  const books       = propBooks ?? MOCK_FEATURED
  const [wish, setWish] = useState({})
  const [atStart, setAtStart] = useState(true)
  const [atEnd,   setAtEnd]   = useState(false)
  const trackRef  = useRef(null)

  // track scroll position for fade edges
  function onScroll() {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft < 16)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 16)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  function scrollBy(dir) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * 360, behavior: 'smooth' })
  }

  return (
    <section style={{ position: 'relative' }}>

      {/* ── Section header ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '20px', gap: '12px',
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: '600', color: '#3d2010',
            lineHeight: 1.2, margin: 0,
          }}>
            {title}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* View All link */}
          <a
            href={viewAllHref}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '12px', fontWeight: '600', color: '#a0693a',
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: 'none',
              border: '1px solid rgba(160,105,58,0.3)',
              borderRadius: '20px',
              padding: '5px 14px',
              background: 'rgba(160,105,58,0.07)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(160,105,58,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(160,105,58,0.07)'}
          >
            View All
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 2.5l3.5 3.5-3.5 3.5" stroke="#a0693a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Scroll arrows (desktop) */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { dir: -1, label: '←', disabled: atStart },
              { dir:  1, label: '→', disabled: atEnd   },
            ].map(({ dir, label, disabled }) => (
              <button
                key={dir}
                onClick={() => scrollBy(dir)}
                disabled={disabled}
                style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(180,140,90,0.28)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.35 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: disabled ? 'none' : '0 2px 8px rgba(100,60,20,0.09)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  {dir === -1
                    ? <path d="M9 2L4 7l5 5" stroke="#7a4e22" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    : <path d="M5 2l5 5-5 5" stroke="#7a4e22" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  }
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Left fade edge ── */}
      <div style={{
        position: 'absolute', left: 0, top: '62px', bottom: 0,
        width: '40px', zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to right, #f5f0e8, transparent)',
        opacity: atStart ? 0 : 1, transition: 'opacity 0.3s ease',
      }}/>

      {/* ── Right fade edge ── */}
      <div style={{
        position: 'absolute', right: 0, top: '62px', bottom: 0,
        width: '60px', zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to left, #f5f0e8, transparent)',
        opacity: atEnd ? 0 : 1, transition: 'opacity 0.3s ease',
      }}/>

      {/* ── Scrollable track ── */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          paddingBottom: '10px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
        }}
      >
        <style>{`
          .ks-feat-track::-webkit-scrollbar { display: none }
        `}</style>

        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} style={{ flexShrink: 0, scrollSnapAlign: 'start' }}>
              <SkeletonCard variant="book" />
            </div>
          ))
        ) : (
          books.map((book, i) => (
            <div
              key={book._id || i}
              style={{
                flexShrink: 0,
                scrollSnapAlign: 'start',
                animation: `ks-fadein 0.4s ease both`,
                animationDelay: `${i * 60}ms`,
              }}
            >
              <BookCard
                book={showBadges ? book : { ...book, badge: undefined }}
                wishlisted={!!wish[book.slug]}
                onWishlist={(b) => setWish(w => ({ ...w, [b.slug]: !w[b.slug] }))}
                onAddToCart={(item) => console.log('Add to cart:', item)}
                size="md"
              />
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes ks-fadein {
          from { opacity: 0; transform: translateY(10px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </section>
  )
}