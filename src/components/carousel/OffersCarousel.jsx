import { useState, useEffect } from 'react'
import { useCart, useWishlist } from '../../context/CartContext'
import { fetchActiveOffers, fetchSaleProductOffers } from '../../lib/queries'
import { formatPrice } from '../../utils/formatPrice'


function getTimeRemaining(expiresAt) {
  if (!expiresAt) return 'Limited time'
  const diff = new Date(expiresAt) - new Date()
  if (!Number.isFinite(diff)) return 'Limited time'
  if (diff <= 0) return 'Expired'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${minutes}m left`
  if (minutes > 0) return `${minutes}m ${seconds}s left`
  return `${seconds}s left`
}

function offerItemHref(item) {
  if (item?.type === 'book' || item?._type === 'book') return `/book/${item?.slug || ''}`
  if (item?.type === 'stationery' || item?._type === 'stationery') return '/category/stationery'
  if (item?.type === 'accessory' || item?._type === 'accessory') return '/category/accessories'
  return '/books'
}

function offerItemLabel(item) {
  if (item?.type === 'stationery') return 'Stationery'
  if (item?.type === 'accessory') return 'Accessory'
  return item?.ageRange || 'Book'
}

function offerItemCreator(item) {
  if (item?.type === 'book') return item.author
  return item?.brand || item?.author || 'Kiddle'
}

// ── Offer Card ─────────────────────────────────────────────────────────────
function OfferCard({ offer, onAddToCart, onWishlist, wishlisted = false }) {
  const item = offer.book
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(offer.expiresAt))
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeRemaining(offer.expiresAt)), 1000)
    return () => clearInterval(id)
  }, [offer.expiresAt])
  const isUrgent = timeLeft.includes('m') && !timeLeft.includes('d') && !timeLeft.includes('h')

  return (
    <div
      style={{
        background: 'white', borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.3s ease',
        height: '100%', display: 'flex', flexDirection: 'column', position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)' }}
    >
      {/* Badge */}
      <div style={{
        position: 'absolute', top: '12px', left: '12px', zIndex: 2,
        background: offer.badgeColor, color: 'white', padding: '4px 12px',
        borderRadius: '20px', fontSize: '11px', fontWeight: '700',
      }}>
        -{offer.discountPercent}% {offer.badgeLabel}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => onWishlist?.(item)}
        style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 2,
          background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
          width: '32px', height: '32px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24"
          fill={wishlisted ? '#E53935' : 'none'} stroke="#E53935" strokeWidth="1.5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      {/* Cover */}
      <div style={{ background: '#F5F0E8', height: '200px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={item.img || item.coverImage}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={e => { e.target.src = 'https://placehold.co/300x200/FEF3C7/78350F?text=📚' }}
        />
        <div style={{
          position: 'absolute', bottom: '12px', right: '12px',
          background: 'rgba(0,0,0,0.75)', color: 'white', padding: '6px 10px',
          borderRadius: '12px', fontSize: '18px', fontWeight: '800',
        }}>
          -{offer.discountPercent}%
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: '#D97706', fontWeight: '600', background: '#FEF3C7', padding: '2px 8px', borderRadius: '12px' }}>
            {offerItemLabel(item)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#FFB800' }}>★</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#78350F' }}>{item.rating ?? 4.0}</span>
            <span style={{ fontSize: '10px', color: '#B45309' }}>({item.reviewCount || 0})</span>
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#78350F', margin: '4px 0', fontFamily: "'Playfair Display', serif", lineHeight: 1.3 }}>
          {item.title}
        </h3>
        <p style={{ fontSize: '12px', color: '#92400E', margin: '0 0 8px 0' }}>
          {item.type === 'book' ? 'by ' : ''}{offerItemCreator(item)}
        </p>

        {/* Timer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
          background: isUrgent ? '#FFEBEE' : '#F5F0E8', padding: '6px 10px', borderRadius: '12px',
        }}>
          <span style={{ fontSize: '12px' }}>⏰</span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: isUrgent ? '#E53935' : '#78350F' }}>
            {timeLeft}
          </span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#D97706' }}>
            {formatPrice(offer.salePrice)}
          </span>
          <span style={{ fontSize: '14px', color: '#B45309', textDecoration: 'line-through' }}>
            {formatPrice(offer.originalPrice)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            onClick={() => onAddToCart?.()}
            style={{
              flex: 1, background: 'linear-gradient(135deg, #D97706, #B45309)', color: 'white',
              border: 'none', borderRadius: '12px', padding: '10px',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            Add to Cart
          </button>
          <a
            href={offerItemHref(item)}
            style={{
              padding: '10px 16px', background: 'white', border: '1px solid #FCD34D',
              borderRadius: '12px', fontSize: '12px', fontWeight: '600',
              color: '#D97706', textDecoration: 'none',
            }}
          >
            View Deal
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Main OffersCarousel ────────────────────────────────────────────────────
export default function OffersCarousel({
  offers: propOffers,
  loading: propLoading,
  title = '🔥 Special Offers',
  subtitle = 'Limited time deals on books & stationery',
}) {
  const [sanityOffers, setSanityOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const { addToCart } = useCart()
  const { toggleWishlist, wishlist } = useWishlist?.() || {}

  // Fetch from Sanity when no props provided
  useEffect(() => {
    if (propOffers) { setLoading(false); return }
    fetchActiveOffers()
      .then(data => {
        if (data?.length) {
          setSanityOffers(data)
          setLoading(false)
          return null
        }
        return fetchSaleProductOffers().then(fallbackData => {
          setSanityOffers(fallbackData)
          setLoading(false)
        })
      })
      .catch(() => {
        fetchSaleProductOffers()
          .then(fallbackData => setSanityOffers(fallbackData))
          .finally(() => setLoading(false))
      })
  }, [propOffers])

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setItemsPerPage(1)
      else if (w < 1024) setItemsPerPage(2)
      else setItemsPerPage(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const offers = (propOffers ?? sanityOffers).filter(offer => offer?.book)
  const isLoading = propLoading ?? loading
  const totalPages = Math.ceil(offers.length / itemsPerPage)
  const currentOffers = offers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const getOfferKey = (offer, index) => {
    if (!offer) return `offer-fallback-${currentPage}-${index}`
    if (offer._id != null && offer._id !== '') return `offer-${offer._id}`
    if (offer.book?.slug) return `offer-${offer.book.slug}`
    return `offer-fallback-${currentPage}-${index}`
  }

  const goToPage = (p) => setCurrentPage(Math.max(0, Math.min(p, totalPages - 1)))

  useEffect(() => {
    if (totalPages <= 1) return
    const id = setInterval(() => setCurrentPage(p => (p + 1) % totalPages), 5000)
    return () => clearInterval(id)
  }, [totalPages])

  return (
    <section style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#D97706', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>✦ Limited Time</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '700', color: '#78350F', margin: 0 }}>{title}</h2>
          {subtitle && <p style={{ fontSize: '13px', color: '#92400E', marginTop: '4px' }}>{subtitle}</p>}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[['←', currentPage - 1], ['→', currentPage + 1]].map(([arrow, page]) => (
            <button key={arrow} onClick={() => goToPage(page)}
              disabled={page < 0 || page >= totalPages}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'white', border: '1px solid #FCD34D',
                cursor: 'pointer', opacity: (page < 0 || page >= totalPages) ? 0.4 : 1,
                fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {arrow}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`, gap: '20px', transition: 'all 0.3s ease' }}>
        {isLoading ? (
          [...Array(itemsPerPage)].map((_, i) => (
            <div key={i} style={{ background: '#F5F0E8', borderRadius: '20px', height: '480px', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))
        ) : currentOffers.length ? (
          currentOffers.map((offer, i) => (
            <OfferCard
              key={getOfferKey(offer, i)}
              offer={offer}
              onAddToCart={() => addToCart?.({
                ...offer.book,
                price: offer.originalPrice ?? offer.book.price,
                salePrice: offer.salePrice ?? offer.book.salePrice,
                originalPrice: offer.originalPrice ?? offer.book.price,
              })}
              onWishlist={() => toggleWishlist?.(offer.book)}
              wishlisted={wishlist?.some(w => w.slug === offer.book?.slug)}
            />
          ))
        ) : (
          <div style={{
            gridColumn: `1 / span ${itemsPerPage}`,
            background: '#FEF9EC',
            border: '1px solid #FCD34D',
            borderRadius: '20px',
            padding: '28px',
            textAlign: 'center',
            color: '#92400E',
            fontSize: '14px',
          }}>
            No live offers yet. Add an active Special Offer in Sanity, or add a Sale Price to any book, stationery item, or accessory.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => goToPage(i)} style={{
              width: currentPage === i ? '28px' : '8px', height: '8px',
              borderRadius: '4px', background: currentPage === i ? '#D97706' : '#FCD34D',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </section>
  )
}
