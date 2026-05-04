/**
 * OffersCarousel.jsx — Responsive carousel with book images
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useCart ,useWishlist } from '../../context/CartContext'


// ── Mock data with REAL book images from Unsplash/online ──────────────────
export const MOCK_OFFERS = [
  {
    _id: 'o1',
    discountPercent: 30,
    originalPrice: 24.99,
    salePrice: 17.49,
    badgeLabel: 'Summer Deal',
    badgeColor: '#FF6B35',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 47).toISOString(),
    book: {
      title: 'The Midnight Library',
      author: 'Matt Haig',
      slug: 'the-midnight-library',
      rating: 4.4,
      reviewCount: 1240,
      ageRange: 'Young Adult',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80',
    },
  },
  {
    _id: 'o2',
    discountPercent: 25,
    originalPrice: 19.99,
    salePrice: 14.99,
    badgeLabel: 'Author Spotlight',
    badgeColor: '#9C27B0',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    book: {
      title: 'The Lions Secret Garden',
      author: 'Clara Moss',
      slug: 'lions-secret-garden',
      rating: 4.8,
      reviewCount: 580,
      ageRange: '4-8 Years',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80',
    },
  },
  {
    _id: 'o3',
    discountPercent: 40,
    originalPrice: 29.99,
    salePrice: 17.99,
    badgeLabel: 'Flash Sale',
    badgeColor: '#E53935',
    expiresAt: new Date(Date.now() + 1000 * 60 * 55).toISOString(),
    book: {
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      slug: 'where-the-crawdads-sing',
      rating: 4.7,
      reviewCount: 2100,
      ageRange: 'Adult',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80',
    },
  },
  {
    _id: 'o4',
    discountPercent: 20,
    originalPrice: 14.99,
    salePrice: 11.99,
    badgeLabel: 'Weekly Deal',
    badgeColor: '#43A047',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    book: {
      title: 'Stars & Beyond',
      author: 'J. Hartley',
      slug: 'stars-and-beyond',
      rating: 4.2,
      reviewCount: 310,
      ageRange: '9-12 Years',
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80',
    },
  },
  {
    _id: 'o5',
    discountPercent: 35,
    originalPrice: 22.99,
    salePrice: 14.94,
    badgeLabel: 'Book Club Pick',
    badgeColor: '#E91E63',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    book: {
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      slug: 'klara-and-the-sun',
      rating: 4.6,
      reviewCount: 940,
      ageRange: 'Adult',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&q=80',
    },
  },
]

// ── Time remaining formatter ──────────────────────────────────────────────
function getTimeRemaining(expiresAt) {
  const diff = new Date(expiresAt) - new Date()
  if (diff <= 0) return 'Expired'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (86400000)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (3600000)) / (1000 * 60))
  const seconds = Math.floor((diff % 60000) / 1000)
  
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${minutes}m left`
  if (minutes > 0) return `${minutes}m ${seconds}s left`
  return `${seconds}s left`
}

// ── Individual Offer Card ──────────────────────────────────────────────────
function OfferCard({ offer, onAddToCart, onWishlist, wishlisted = false }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(offer.expiresAt))
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(offer.expiresAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [offer.expiresAt])
  
  const isUrgent = timeLeft.includes('m') && !timeLeft.includes('d') && !timeLeft.includes('h')
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
    }}>
      {/* Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 2,
        background: offer.badgeColor,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        -{offer.discountPercent}% {offer.badgeLabel}
      </div>

      {/* Wishlist button */}
      <button
        onClick={() => onWishlist?.(offer.book)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 2,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? '#E53935' : 'none'} stroke="#E53935" strokeWidth="1.5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>

      {/* Book Cover Image */}
      <div style={{
        background: '#F5F0E8',
        height: '200px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <img
          src={offer.book.coverImage}
          alt={offer.book.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={e => {
            e.target.src = 'https://placehold.co/300x200/FEF3C7/78350F?text=📚+Book+Cover'
          }}
        />
        
        {/* Discount badge overlay */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.75)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: '800',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          -{offer.discountPercent}%
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{
            fontSize: '11px',
            color: '#D97706',
            fontWeight: '600',
            background: '#FEF3C7',
            padding: '2px 8px',
            borderRadius: '12px',
          }}>
            {offer.book.ageRange}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#FFB800' }}>★</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#78350F' }}>{offer.book.rating}</span>
            <span style={{ fontSize: '10px', color: '#B45309' }}>({offer.book.reviewCount})</span>
          </div>
        </div>

        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#78350F',
          margin: '4px 0',
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1.3,
        }}>
          {offer.book.title}
        </h3>
        
        <p style={{
          fontSize: '12px',
          color: '#92400E',
          margin: '0 0 8px 0',
        }}>
          by {offer.book.author}
        </p>

        {/* Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px',
          background: isUrgent ? '#FFEBEE' : '#F5F0E8',
          padding: '6px 10px',
          borderRadius: '12px',
        }}>
          <span style={{ fontSize: '12px' }}>⏰</span>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: isUrgent ? '#E53935' : '#78350F',
          }}>
            {timeLeft}
          </span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#D97706',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            ${offer.salePrice}
          </span>
          <span style={{
            fontSize: '14px',
            color: '#B45309',
            textDecoration: 'line-through',
          }}>
            ${offer.originalPrice}
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            onClick={() => onAddToCart?.(offer)}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #D97706, #B45309)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Add to Cart
          </button>
          <a
            href={`/book/${offer.book.slug}`}
            style={{
              padding: '10px 16px',
              background: 'white',
              border: '1px solid #FCD34D',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#D97706',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#FEF3C7'
              e.currentTarget.style.borderColor = '#D97706'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.borderColor = '#FCD34D'
            }}
          >
            View Deal
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Main OffersCarousel Component ──────────────────────────────────────────
export default function OffersCarousel({
  offers: propOffers,
  loading = false,
  title = '🔥 Special Offers',
  subtitle = 'Limited time deals on books & stationery',
}) {
  const offers = propOffers ?? MOCK_OFFERS
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const { addToCart } = useCart()
  const { toggleWishlist, wishlist } = useWishlist?.() || { toggleWishlist: () => {}, wishlist: {} }

  // Responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth
      if (width < 640) setItemsPerPage(1)
      else if (width < 1024) setItemsPerPage(2)
      else setItemsPerPage(3)
    }
    
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  const totalPages = Math.ceil(offers.length / itemsPerPage)
  const currentOffers = offers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const goToPage = (page) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)))
  }

  // Auto-advance carousel
  useEffect(() => {
    if (totalPages <= 1) return
    const interval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages)
    }, 5000)
    return () => clearInterval(interval)
  }, [totalPages])

  return (
    <section style={{ width: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#D97706',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: '4px',
          }}>
            ✦ Limited Time
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: '700',
            color: '#78350F',
            margin: 0,
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{
              fontSize: '13px',
              color: '#92400E',
              marginTop: '4px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Navigation Arrows - Hide on mobile */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentPage === 0 ? '#F5F0E8' : 'white',
              border: '1px solid #FCD34D',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 0 ? 0.5 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#78350F" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentPage === totalPages - 1 ? '#F5F0E8' : 'white',
              border: '1px solid #FCD34D',
              cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages - 1 ? 0.5 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#78350F" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
        gap: '20px',
        transition: 'all 0.3s ease',
      }}>
        {loading ? (
          [...Array(itemsPerPage)].map((_, i) => (
            <div key={i} style={{
              background: '#F5F0E8',
              borderRadius: '20px',
              height: '480px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))
        ) : (
          currentOffers.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              onAddToCart={() => addToCart?.(offer)}
              onWishlist={() => toggleWishlist?.(offer.book)}
              wishlisted={wishlist?.[offer.book.slug]}
            />
          ))
        )}
      </div>

      {/* Dots Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '28px',
        }}>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              style={{
                width: currentPage === idx ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentPage === idx ? '#D97706' : '#FCD34D',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 640px) {
          .offers-grid {
            gap: 16px;
          }
        }
      `}</style>
    </section>
  )
}