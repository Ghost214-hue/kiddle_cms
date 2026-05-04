
import { useState, useEffect, useRef } from 'react'
import { useCart,useWishlist } from '../../context/CartContext'

// ── Mock data with REAL book images ─────────────────────────────────────────
export const MOCK_FEATURED = [
  {
    _id: 'f1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 24.99,
    rating: 4.4,
    reviewCount: 1240,
    ageRange: 'Young Adult',
    badge: '#1 Bestseller',
    badgeColor: '#D97706',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80',
    slug: 'the-midnight-library',
  },
  {
    _id: 'f2',
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    price: 18.99,
    rating: 4.8,
    reviewCount: 876,
    ageRange: 'Adult',
    badge: 'New',
    badgeColor: '#43A047',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&q=80',
    slug: 'before-the-coffee-gets-cold',
  },
  {
    _id: 'f3',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    price: 23.00,
    rating: 4.7,
    reviewCount: 2100,
    ageRange: 'Adult',
    badge: '',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80',
    slug: 'where-the-crawdads-sing',
  },
  {
    _id: 'f4',
    title: "The Lion's Secret Garden",
    author: 'Clara Moss',
    price: 12.99,
    rating: 4.6,
    reviewCount: 580,
    ageRange: '4-8 Years',
    badge: 'New',
    badgeColor: '#43A047',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80',
    slug: 'lions-secret-garden',
  },
  {
    _id: 'f5',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    price: 20.00,
    rating: 4.6,
    reviewCount: 940,
    ageRange: 'Adult',
    badge: '',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80',
    slug: 'klara-and-the-sun',
  },
  {
    _id: 'f6',
    title: 'Stars & Beyond',
    author: 'J. Hartley',
    price: 9.50,
    rating: 4.2,
    reviewCount: 310,
    ageRange: '9-12 Years',
    badge: 'Sale',
    badgeColor: '#E53935',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80',
    slug: 'stars-and-beyond',
  },
]

// ── Individual Featured Book Card ──────────────────────────────────────────
function FeaturedBookCard({ book, onAddToCart, onWishlist, wishlisted = false }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      {/* Badge */}
      {book.badge && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 2,
          background: book.badgeColor || '#D97706',
          color: 'white',
          padding: '3px 10px',
          borderRadius: '16px',
          fontSize: '10px',
          fontWeight: '700',
        }}>
          {book.badge}
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={() => onWishlist?.(book)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 2,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#E53935' : 'none'} stroke="#E53935" strokeWidth="1.5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>

      {/* Cover Image */}
      <div style={{
        background: '#F5F0E8',
        height: '200px',
        overflow: 'hidden',
      }}>
        <img
          src={book.coverImage}
          alt={book.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={e => {
            e.target.src = 'https://placehold.co/300x200/FEF3C7/78350F?text=📚'
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '14px', flex: 1 }}>
        <div style={{
          fontSize: '11px',
          color: '#D97706',
          fontWeight: '600',
          marginBottom: '4px',
        }}>
          {book.ageRange}
        </div>
        
        <h3 style={{
          fontSize: '15px',
          fontWeight: '700',
          color: '#78350F',
          margin: '4px 0',
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1.3,
        }}>
          {book.title.length > 30 ? book.title.substring(0, 27) + '...' : book.title}
        </h3>
        
        <p style={{
          fontSize: '11px',
          color: '#92400E',
          margin: '0 0 8px 0',
        }}>
          {book.author}
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{
                fontSize: '11px',
                color: i < Math.floor(book.rating) ? '#FFB800' : '#E2E8F0',
              }}>★</span>
            ))}
          </div>
          <span style={{ fontSize: '11px', color: '#B45309' }}>({book.reviewCount})</span>
        </div>

        {/* Price & Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            color: '#D97706',
          }}>
            ${book.price}
          </span>
          <button
            onClick={() => onAddToCart?.(book)}
            style={{
              background: 'linear-gradient(135deg, #D97706, #B45309)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main FeaturedCarousel Component ────────────────────────────────────────
export default function FeaturedCarousel({
  books: propBooks,
  loading = false,
  title = '⭐ Bestsellers This Month',
  viewAllHref = '/books',
}) {
  const books = propBooks ?? MOCK_FEATURED
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const { addToCart } = useCart()
  const { toggleWishlist, wishlist } = useWishlist?.() || {}

  // Responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth
      if (width < 480) setItemsPerPage(1)
      else if (width < 768) setItemsPerPage(2)
      else if (width < 1024) setItemsPerPage(3)
      else setItemsPerPage(4)
    }
    
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  const displayedBooks = books.slice(0, itemsPerPage * 2) // Show up to 8 books

  return (
    <section style={{ width: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px, 4vw, 28px)',
            fontWeight: '700',
            color: '#78350F',
            margin: 0,
          }}>
            {title}
          </h2>
        </div>

        <a
          href={viewAllHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#D97706',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '30px',
            background: '#FEF3C7',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#FDE68A'
            e.currentTarget.style.transform = 'translateX(2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#FEF3C7'
            e.currentTarget.style.transform = 'translateX(0)'
          }}
        >
          View All →
        </a>
      </div>

      {/* Books Grid - Responsive */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
        gap: '20px',
      }}>
        {loading ? (
          [...Array(itemsPerPage)].map((_, i) => (
            <div key={i} style={{
              background: '#F5F0E8',
              borderRadius: '16px',
              height: '380px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))
        ) : (
          displayedBooks.map((book) => (
            <FeaturedBookCard
              key={book._id}
              book={book}
              onAddToCart={() => addToCart?.(book)}
              onWishlist={() => toggleWishlist?.(book)}
              wishlisted={wishlist?.some(w => w.slug === book.slug)}
            />
          ))
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}