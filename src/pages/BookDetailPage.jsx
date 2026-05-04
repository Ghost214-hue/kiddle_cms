

import { useState } from 'react'
import StarRating       from '../components/ui/StarRating'
import FeaturedCarousel from '../components/carousel/FeaturedCarousel'
import CountdownTimer   from '../components/ui/CountdownTimer'
import { useCart }      from '../context/CartContext'
import { useWishlist }  from '../context/CartContext'
import { formatPrice, formatReviewCount } from '../utils/formatPrice'

// ── mock book ─────────────────────────────────────────────────────────────────
const BOOK = {
  _id: 'b1',
  title: 'The Midnight Library',
  author: 'Matt Haig',
  authorBio: 'Matt Haig is a British author for children and adults. His novels include The Humans, Reasons to Stay Alive and How to Stop Time.',
  price: 32.00,
  salePrice: 24.99,
  originalPrice: 32.00,
  rating: 4.4,
  reviewCount: 1240,
  ageRange: 'Young Adult',
  categories: ['Contemporary Fiction'],
  formats: ['Hardcover', 'Paperback', 'E-book', 'Audiobook'],
  isbn: '978-0-525-55947-4',
  pageCount: 304,
  publishedDate: 'August 13, 2020',
  publisher: 'Viking',
  language: 'English',
  slug: 'the-midnight-library',
  badge: '#1 Bestseller',
  description: `Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices...

Would you have done anything different, if you had the chance to undo your regrets?

Nora Seed finds herself in the Midnight Library. Until she decides to live the life of her dreams, she will keep visiting this magical realm of possibilities. She must ask herself what is truly fulfilling in life, and what makes it worth living in the first place.`,
  hasLimitedEdition: true,
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2 + 1000 * 60 * 44 + 12000).toISOString(),
  coverColors: ['#8aaccb', '#6a8cb0'],
}

const REVIEWS = [
  { id:1, name:'Sarah M.',      rating:5, date:'Dec 2024', text: 'Absolutely breathtaking. This book changed my perspective on life choices and regret. Beautifully written.' },
  { id:2, name:'James T.',      rating:4, date:'Nov 2024', text: 'A wonderful meditation on the roads not taken. Haig writes with such warmth and wisdom.' },
  { id:3, name:'Priya K.',      rating:5, date:'Nov 2024', text: 'One of those rare books that stays with you long after you finish. Truly unforgettable.' },
  { id:4, name:'Michael R.',    rating:4, date:'Oct 2024', text: 'Thought-provoking and touching. The concept is brilliant and execution is near-perfect.' },
]

const RATING_BREAKDOWN = [
  { stars: 5, pct: 62 },
  { stars: 4, pct: 23 },
  { stars: 3, pct: 10 },
  { stars: 2, pct: 3  },
  { stars: 1, pct: 2  },
]

function ReviewCard({ review }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.52)',
      border: '1px solid rgba(200,170,130,0.28)',
      borderRadius: '16px', padding: '18px 20px',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: `hsl(${review.id * 47}, 45%, 75%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: '#fff',
            fontFamily: "'DM Sans',sans-serif",
          }}>
            {review.name[0]}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#3d2010', fontFamily: "'DM Sans',sans-serif" }}>
              {review.name}
            </div>
            <div style={{ fontSize: '11px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif" }}>
              {review.date}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" showCount={false} />
      </div>
      <p style={{ fontSize: '13px', color: '#5c3d1e', fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7 }}>
        {review.text}
      </p>
    </div>
  )
}

export default function BookDetailPage() {
  const [selectedFormat, setSelectedFormat] = useState('Hardcover')
  const [qty,   setQty]   = useState(1)
  const [tab,   setTab]   = useState('description')
  const [added, setAdded] = useState(false)

  const { addToCart }                      = useCart()
  const { toggleWishlist, isWishlisted }   = useWishlist()

  const wishlisted = isWishlisted(BOOK._id)

  function handleAddToCart() {
    addToCart({ ...BOOK, price: BOOK.salePrice, format: selectedFormat }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', paddingTop: '68px' }}>

      {/* Limited edition countdown banner */}
      {BOOK.hasLimitedEdition && (
        <div style={{
          background: 'rgba(160,105,58,0.10)',
          borderBottom: '1px solid rgba(180,140,90,0.20)',
          padding: '10px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#a0693a" strokeWidth="1.2"/>
            <path d="M7 4v3l2 2" stroke="#a0693a" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: '12.5px', color: '#5c3d1e', fontFamily: "'DM Sans',sans-serif", fontWeight: '500' }}>
            LIMITED EDITION SIGNED COPIES:
          </span>
          <CountdownTimer expiresAt={BOOK.expiresAt} variant="inline" />
          <span style={{ fontSize: '12px', color: '#7a5c3a', fontFamily: "'DM Sans',sans-serif" }}>REMAINING</span>
        </div>
      )}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', color: '#9a7a5a',
          fontFamily: "'DM Sans',sans-serif", marginBottom: '32px',
        }}>
          {['Home','Shop','Contemporary Fiction'].map((crumb, i, arr) => (
            <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a href="#" style={{ color: '#9a7a5a', textDecoration: 'none' }}>{crumb}</a>
              {i < arr.length - 1 && <span style={{ color: '#c4a882' }}>›</span>}
            </span>
          ))}
          <span style={{ color: '#c4a882' }}>›</span>
          <span style={{ color: '#5c3d1e', fontWeight: '500' }}>Hardcover Edition</span>
        </div>

        {/* Main grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '56px', marginBottom: '64px', alignItems: 'start',
        }}
          className="detail-grid"
        >
          {/* Left — cover */}
          <div>
            <div style={{
              background: `linear-gradient(145deg, ${BOOK.coverColors[0]}, ${BOOK.coverColors[1]})`,
              borderRadius: '20px', overflow: 'hidden',
              aspectRatio: '3/4', maxHeight: '520px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 24px 64px rgba(100,60,20,0.20)',
            }}>
              {/* Bestseller badge */}
              <div style={{
                position: 'absolute', top: '16px', left: '16px',
                background: 'rgba(160,105,58,0.15)',
                border: '1px solid rgba(160,105,58,0.35)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px', padding: '5px 12px',
                fontSize: '10.5px', fontWeight: '700', color: '#7a4e22',
                fontFamily: "'DM Sans',sans-serif",
              }}>
                {BOOK.badge}
              </div>

              {/* Book mockup */}
              <div style={{
                width: '55%', height: '75%',
                background: 'linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))',
                borderRadius: '4px 12px 12px 4px',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '8px 12px 40px rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '20px', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '12px',
                  background: 'rgba(0,0,0,0.20)', borderRadius: '4px 0 0 4px',
                }}/>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" opacity="0.8">
                    <path d="M12 2L9 8H3l5 4-2 6 6-4 6 4-2-6 5-4h-6L12 2Z" fill="rgba(255,255,255,0.9)"/>
                  </svg>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', fontFamily: "'Playfair Display',serif", fontWeight: '600', textAlign: 'center', lineHeight: 1.4, marginBottom: '6px' }}>
                  {BOOK.title}
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans',sans-serif" }}>
                  {BOOK.author}
                </div>
              </div>

              {/* Share button */}
              <button style={{
                position: 'absolute', bottom: '16px', right: '16px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(180,140,90,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="13" cy="3" r="1.5" stroke="#7a4e22" strokeWidth="1.3"/>
                  <circle cx="13" cy="13" r="1.5" stroke="#7a4e22" strokeWidth="1.3"/>
                  <circle cx="3" cy="8" r="1.5" stroke="#7a4e22" strokeWidth="1.3"/>
                  <path d="M4.5 8.7L11.5 12M11.5 4L4.5 7.3" stroke="#7a4e22" strokeWidth="1.2"/>
                </svg>
              </button>
            </div>

            {/* Thumbnail strip */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              {['#8aaccb','#a89060','#7ab080'].map((c, i) => (
                <div key={i} style={{
                  width: '60px', height: '80px', borderRadius: '8px',
                  background: c, border: i === 0 ? '2px solid #a0693a' : '2px solid transparent',
                  cursor: 'pointer', opacity: i === 0 ? 1 : 0.6,
                  transition: 'opacity 0.2s',
                }}/>
              ))}
            </div>
          </div>

          {/* Right — details */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '11.5px', color: '#a0693a',
              fontFamily: "'DM Sans',sans-serif", fontWeight: '600',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              {BOOK.categories.join(' · ')}
              <span style={{ color: '#c4a882' }}>›</span>
              <span style={{ color: '#9a7a5a', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>
                Hardcover Edition
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(26px,3.5vw,38px)',
              fontWeight: '700', color: '#3d2010',
              lineHeight: 1.2, marginBottom: '6px',
            }}>
              {BOOK.title}
            </h1>

            <p style={{
              fontSize: '15px', color: '#9a7a5a',
              fontFamily: "'DM Sans',sans-serif",
              fontStyle: 'italic', marginBottom: '14px',
            }}>
              by <a href="#" style={{ color: '#a0693a', textDecoration: 'none' }}>{BOOK.author}</a>
            </p>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <StarRating rating={BOOK.rating} size="md" showCount={false} />
              <span style={{ fontSize: '13px', color: '#a0693a', fontFamily: "'DM Sans',sans-serif", fontWeight: '600' }}>
                {BOOK.rating}
              </span>
              <a href="#reviews" style={{
                fontSize: '12.5px', color: '#9a7a5a',
                fontFamily: "'DM Sans',sans-serif", textDecoration: 'none',
              }}>
                ({formatReviewCount(BOOK.reviewCount)})
              </a>
            </div>

            {/* Price */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: '12px',
              marginBottom: '24px',
            }}>
              <span style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: '32px', fontWeight: '700', color: '#3d2010',
              }}>
                {formatPrice(BOOK.salePrice)}
              </span>
              <span style={{
                fontSize: '16px', color: '#b8998a',
                fontFamily: "'DM Sans',sans-serif",
                textDecoration: 'line-through',
              }}>
                {formatPrice(BOOK.originalPrice)}
              </span>
              <span style={{
                fontSize: '12px', fontWeight: '700', color: '#2d7a45',
                fontFamily: "'DM Sans',sans-serif",
                background: 'rgba(60,140,80,0.10)',
                padding: '3px 9px', borderRadius: '10px',
              }}>
                Save 22%
              </span>
            </div>

            {/* Format selector */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '11px', fontWeight: '600', color: '#5c3d1e',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                fontFamily: "'DM Sans',sans-serif", marginBottom: '10px',
              }}>
                Select Format
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {BOOK.formats.map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    style={{
                      padding: '8px 16px', borderRadius: '20px',
                      border: `1.5px solid ${selectedFormat === fmt ? '#a0693a' : 'rgba(180,140,90,0.3)'}`,
                      background: selectedFormat === fmt
                        ? 'rgba(160,105,58,0.14)'
                        : 'rgba(255,255,255,0.6)',
                      color: selectedFormat === fmt ? '#5c3520' : '#7a5c3a',
                      fontSize: '12.5px', fontWeight: selectedFormat === fmt ? '600' : '400',
                      fontFamily: "'DM Sans',sans-serif",
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '11px', fontWeight: '600', color: '#5c3d1e',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                fontFamily: "'DM Sans',sans-serif", marginBottom: '10px',
              }}>
                Quantity
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: '38px', height: '38px',
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(180,140,90,0.3)', borderRight: 'none',
                    borderRadius: '10px 0 0 10px',
                    cursor: 'pointer', fontSize: '16px', color: '#7a4e22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <div style={{
                  width: '48px', height: '38px',
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(180,140,90,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: '600', color: '#3d2010',
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  {qty}
                </div>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: '38px', height: '38px',
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(180,140,90,0.3)', borderLeft: 'none',
                    borderRadius: '0 10px 10px 0',
                    cursor: 'pointer', fontSize: '16px', color: '#7a4e22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1, minWidth: '180px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: added
                    ? 'rgba(60,140,80,0.15)'
                    : 'linear-gradient(135deg, #c48b52, #a0693a)',
                  border: added ? '1.5px solid rgba(60,140,80,0.35)' : 'none',
                  color: added ? '#2d7a45' : '#fff',
                  padding: '14px 28px', borderRadius: '28px',
                  fontSize: '14px', fontWeight: '600',
                  fontFamily: "'DM Sans',sans-serif",
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  boxShadow: added ? 'none' : '0 6px 24px rgba(160,105,58,0.35)',
                }}
              >
                {added ? (
                  <><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#2d7a45" strokeWidth="1.4"/><path d="M5 8l2.5 2.5 4-4" stroke="#2d7a45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Added to Basket!</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6.5" cy="12.5" r="1" fill="white"/><circle cx="11.5" cy="12.5" r="1" fill="white"/></svg> Add to Basket</>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(BOOK)}
                style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: wishlisted ? 'rgba(160,105,58,0.15)' : 'rgba(255,255,255,0.7)',
                  border: `1.5px solid ${wishlisted ? '#a0693a' : 'rgba(180,140,90,0.35)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 15.5C9 15.5 2 11 2 6.5C2 4.3 3.8 2.5 6 2.5C7.4 2.5 8.6 3.3 9 4.2C9.4 3.3 10.6 2.5 12 2.5C14.2 2.5 16 4.3 16 6.5C16 11 9 15.5 9 15.5Z"
                    fill={wishlisted ? '#a0693a' : 'none'}
                    stroke="#a0693a" strokeWidth="1.4"
                  />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div style={{
              display: 'flex', gap: '20px', flexWrap: 'wrap',
              padding: '14px 0',
              borderTop: '1px solid rgba(180,140,90,0.18)',
            }}>
              {[
                { icon: '🚚', text: 'Ships in 24 hours' },
                { icon: '📖', text: 'Free chapter preview' },
              ].map(({ icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontSize: '12px', color: '#7a5c3a',
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  <span style={{ fontSize: '14px' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginBottom: '64px' }} id="reviews">
          <div style={{
            display: 'flex', borderBottom: '1px solid rgba(180,140,90,0.2)',
            marginBottom: '28px', gap: '0',
          }}>
            {['description','details','reviews'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '12px 24px', background: 'none', border: 'none',
                  borderBottom: `2px solid ${tab === t ? '#a0693a' : 'transparent'}`,
                  color: tab === t ? '#a0693a' : '#9a7a5a',
                  fontSize: '13.5px', fontWeight: tab === t ? '600' : '400',
                  fontFamily: "'DM Sans',sans-serif",
                  cursor: 'pointer', transition: 'all 0.2s',
                  textTransform: 'capitalize', marginBottom: '-1px',
                }}
              >
                {t} {t === 'reviews' ? `(${BOOK.reviewCount.toLocaleString()})` : ''}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div style={{ maxWidth: '720px' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '20px', color: '#3d2010', marginBottom: '16px' }}>
                Between Life and Death…
              </h3>
              {BOOK.description.split('\n\n').map((para, i) => (
                <p key={i} style={{
                  fontSize: '14px', color: '#5c3d1e', lineHeight: 1.8,
                  fontFamily: "'DM Sans',sans-serif", marginBottom: '16px',
                }}>
                  {para}
                </p>
              ))}
            </div>
          )}

          {tab === 'details' && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
              maxWidth: '560px',
            }}>
              {[
                ['ISBN',       BOOK.isbn],
                ['Pages',      BOOK.pageCount],
                ['Published',  BOOK.publishedDate],
                ['Publisher',  BOOK.publisher],
                ['Language',   BOOK.language],
                ['Age Range',  BOOK.ageRange],
              ].map(([label, value]) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.52)',
                  border: '1px solid rgba(200,170,130,0.25)',
                  borderRadius: '12px', padding: '12px 16px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ fontSize: '10px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#3d2010', fontFamily: "'DM Sans',sans-serif", fontWeight: '500' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}
              className="reviews-grid"
            >
              {/* Rating breakdown */}
              <div style={{
                background: 'rgba(255,255,255,0.52)',
                border: '1px solid rgba(200,170,130,0.28)',
                borderRadius: '20px', padding: '24px',
                backdropFilter: 'blur(12px)',
                position: 'sticky', top: '84px',
              }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '52px', fontWeight: '700', color: '#3d2010', lineHeight: 1 }}>
                    {BOOK.rating}
                  </div>
                  <StarRating rating={BOOK.rating} size="lg" showCount={false} />
                  <div style={{ fontSize: '12px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginTop: '6px' }}>
                    {formatReviewCount(BOOK.reviewCount)}
                  </div>
                </div>
                {RATING_BREAKDOWN.map(({ stars, pct }) => (
                  <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#7a5c3a', fontFamily: "'DM Sans',sans-serif", width: '10px' }}>{stars}</span>
                    <span style={{ fontSize: '11px', color: '#a0693a' }}>★</span>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(160,105,58,0.12)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#a0693a', borderRadius: '3px', transition: 'width 0.6s ease' }}/>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", width: '28px', textAlign: 'right' }}>{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Review cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
              </div>
            </div>
          )}
        </div>

        {/* Related books */}
        <div style={{ borderTop: '1px solid rgba(180,140,90,0.18)', paddingTop: '48px' }}>
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '11px', color: '#a0693a', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif", marginBottom: '4px' }}>
              CURATED FOR YOU
            </div>
          </div>
          <FeaturedCarousel title="Readers Also Loved" viewAllHref="/books" />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid   { grid-template-columns: 1fr !important; gap: 32px !important }
          .reviews-grid  { grid-template-columns: 1fr !important }
        }
      `}</style>
    </div>
  )
}