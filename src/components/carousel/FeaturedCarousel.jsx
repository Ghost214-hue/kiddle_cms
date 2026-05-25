import { useState, useEffect } from 'react'
import { useCart, useWishlist } from '../../context/CartContext'
import { fetchFeaturedBooks, fetchFeaturedCarousel } from '../../lib/queries'
import { formatPrice } from '../../utils/formatPrice'

const MOCK_FEATURED = [
  {
    _id: 'f1', title: 'The Midnight Library', author: 'Matt Haig',
    price: 1200, rating: 4.4, reviewCount: 1240, ageRange: 'Young Adult',
    badge: '#1 Bestseller', badgeColor: '#D97706',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
    slug: 'the-midnight-library', type: 'book',
  },
  {
    _id: 'f2', title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi',
    price: 950, rating: 4.8, reviewCount: 876, ageRange: 'Adult',
    badge: 'New', badgeColor: '#2d7a4f',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80',
    slug: 'before-the-coffee-gets-cold', type: 'book',
  },
  {
    _id: 'f3', title: 'Where the Crawdads Sing', author: 'Delia Owens',
    price: 1100, rating: 4.7, reviewCount: 2100, ageRange: 'Adult',
    badge: 'Reader Pick', badgeColor: '#9C27B0',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    slug: 'where-the-crawdads-sing', type: 'book',
  },
  {
    _id: 'f4', title: "The Lion's Secret Garden", author: 'Clara Moss',
    price: 780, rating: 4.6, reviewCount: 580, ageRange: '4-8 Years',
    badge: 'Kids Love It', badgeColor: '#43A047',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
    slug: 'lions-secret-garden', type: 'book',
  },
]

function itemHref(item) {
  return `/${item.type === 'book' || item._type === 'book' ? 'book' : 'product'}/${item.slug}`
}

function coverSrc(item) {
  return item.img || item.coverImage
}

function itemLabel(item) {
  if (item.type === 'stationery') return 'Stationery'
  if (item.type === 'accessory') return 'Accessory'
  return item.ageRange || 'Featured'
}

function FeaturedBookCard({ item, index, onAddToCart, onWishlist, wishlisted = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const price = item.salePrice ?? item.price
  const isLead = index === 0

  return (
    <article className={`fc-card ${isLead ? 'fc-card-lead' : ''}`}>
      <a href={itemHref(item)} className="fc-cover" aria-label={item.title}>
        {!imageFailed && coverSrc(item) ? (
          <img src={coverSrc(item)} alt={item.title} loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <div className="fc-cover-fallback">
            <span>{item.type === 'stationery' ? '✏️' : item.type === 'accessory' ? '🎒' : '📖'}</span>
          </div>
        )}

        {item.badge && (
          <span className="fc-badge" style={{ background: item.badgeColor || '#D97706' }}>
            {item.badge}
          </span>
        )}

        <button
          type="button"
          onClick={event => { event.preventDefault(); onWishlist?.(item) }}
          className={`fc-wish ${wishlisted ? 'is-active' : ''}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill={wishlisted ? 'currentColor' : 'none'}>
            <path d="M8 13.5S1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2c1.2 0 2.2.7 3 1.5C8.8 2.7 9.8 2 11 2c2 0 3.5 1.5 3.5 3.5 0 4-6.5 8-6.5 8Z" stroke="currentColor" strokeWidth="1.35" />
          </svg>
        </button>
      </a>

      <div className="fc-body">
        <div className="fc-meta">
          <span>{itemLabel(item)}</span>
          <span>{(item.reviewCount || 0).toLocaleString()} reviews</span>
        </div>

        <a href={itemHref(item)} className="fc-title">
          {item.title}
        </a>

        <p className="fc-author">{item.author || item.brand || 'Kiddle'}</p>

        <div className="fc-foot">
          <div>
            <strong>{formatPrice(price)}</strong>
            {item.salePrice && <span>{formatPrice(item.price)}</span>}
          </div>
          <button type="button" onClick={() => onAddToCart?.(item)}>
            Add
          </button>
        </div>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return <div className="fc-skeleton" />
}

export default function FeaturedCarousel({
  books: propBooks,
  loading: propLoading,
  title = 'Bestsellers This Month',
  subtitle = '',
  eyebrow = 'Featured Shelf',
  viewAllHref = '/books',
  carouselSlug,
}) {
  const [items, setItems] = useState([])
  const [cmsConfig, setCmsConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const { addToCart } = useCart()
  const { toggleWishlist, wishlist } = useWishlist?.() || {}

  useEffect(() => {
    if (propBooks) {
      setItems(propBooks)
      setLoading(false)
      return
    }

    fetchFeaturedCarousel(carouselSlug)
      .then(doc => {
        if (doc?.items?.length) {
          setCmsConfig(doc)
          setItems(doc.items)
          setLoading(false)
          return null
        }
        return fetchFeaturedBooks().then(data => {
          setItems(data?.length ? data : MOCK_FEATURED)
          setLoading(false)
        })
      })
      .catch(() => {
        fetchFeaturedBooks()
          .then(data => setItems(data?.length ? data : MOCK_FEATURED))
          .catch(() => setItems(MOCK_FEATURED))
          .finally(() => setLoading(false))
      })
  }, [propBooks, carouselSlug])

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 560) setItemsPerPage(1)
      else if (w < 900) setItemsPerPage(2)
      else if (w < 1180) setItemsPerPage(3)
      else setItemsPerPage(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const displayItems = (propBooks ?? items).filter(Boolean).slice(0, Math.max(itemsPerPage * 2, 4))
  const isLoading = propLoading ?? loading
  const displayTitle = cmsConfig?.title || title
  const displaySubtitle = cmsConfig?.subtitle || subtitle || 'Handpicked favorites, new discoveries, and books readers keep coming back for.'
  const displayEyebrow = cmsConfig?.eyebrow || eyebrow
  const displayHref = cmsConfig?.viewAllHref || viewAllHref
  const themeColor = cmsConfig?.themeColor || '#D97706'

  return (
    <section className="featured-carousel" style={{ '--fc-accent': themeColor }}>
      <style>{`
        .featured-carousel{width:100%;position:relative}
        .fc-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:22px;flex-wrap:wrap}
        .fc-kicker{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--fc-accent);margin-bottom:7px}
        .fc-kicker:before{content:"";width:22px;height:2px;border-radius:999px;background:var(--fc-accent)}
        .fc-head h2{font-family:'Playfair Display',serif;font-size:clamp(25px,4vw,38px);line-height:1.02;color:#1a0e04;margin:0}
        .fc-head p{max-width:520px;margin:9px 0 0;color:#7a5c3a;font-size:13.5px;line-height:1.65}
        .fc-view{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(217,119,6,.25);background:#fff8ec;color:#9a4f08;text-decoration:none;border-radius:999px;padding:10px 16px;font-size:12.5px;font-weight:800;transition:.2s ease}
        .fc-view:hover{transform:translateX(3px);background:#fef3c7}
        .fc-grid{display:grid;grid-template-columns:repeat(var(--fc-cols),minmax(0,1fr));gap:18px;align-items:stretch}
        .fc-card{background:rgba(255,255,255,.78);border:1px solid rgba(180,140,90,.24);border-radius:16px;overflow:hidden;box-shadow:0 8px 26px rgba(100,60,20,.08);transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;min-width:0}
        .fc-card:hover{transform:translateY(-5px);box-shadow:0 18px 42px rgba(100,60,20,.16);border-color:rgba(217,119,6,.35)}
        .fc-card-lead{background:linear-gradient(180deg,#fffdf7,#fff7e8)}
        .fc-cover{display:block;position:relative;aspect-ratio:4/5;background:#f5f0e8;overflow:hidden;text-decoration:none}
        .fc-cover img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s ease}
        .fc-card:hover .fc-cover img{transform:scale(1.055)}
        .fc-cover-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#f7d9a9,#d79653)}
        .fc-cover-fallback span{font-size:44px}
        .fc-badge{position:absolute;top:10px;left:10px;color:white;font-size:10px;font-weight:800;border-radius:999px;padding:5px 10px;box-shadow:0 7px 18px rgba(0,0,0,.18)}
        .fc-wish{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;border:1px solid rgba(120,53,15,.16);background:rgba(255,255,255,.9);color:#a8550d;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(10px)}
        .fc-wish.is-active{background:#a8550d;color:white}
        .fc-body{padding:14px 14px 15px}
        .fc-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;color:#b06b12;font-size:10.5px;font-weight:700;margin-bottom:8px}
        .fc-title{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:#2b1609;text-decoration:none;font-family:'Playfair Display',serif;font-size:16px;font-weight:800;line-height:1.18;min-height:38px}
        .fc-title:hover{color:#9a4f08}
        .fc-author{margin:6px 0 12px;color:#8a6b4b;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .fc-foot{display:flex;align-items:center;justify-content:space-between;gap:10px}
        .fc-foot strong{display:block;color:#9a4f08;font-size:17px}
        .fc-foot span{display:block;color:#b99a78;font-size:11px;text-decoration:line-through;margin-top:1px}
        .fc-foot button{border:none;border-radius:999px;background:linear-gradient(135deg,var(--fc-accent),#9a4f08);color:white;font-size:12px;font-weight:800;padding:8px 13px;cursor:pointer;white-space:nowrap}
        .fc-empty,.fc-skeleton{border-radius:16px;background:#fff8ec;border:1px solid rgba(217,119,6,.18);min-height:320px}
        .fc-skeleton{animation:fc-pulse 1.45s ease-in-out infinite}
        .fc-empty{grid-column:1/-1;display:flex;align-items:center;justify-content:center;text-align:center;color:#8a5a24;padding:32px;font-size:13.5px}
        @keyframes fc-pulse{0%,100%{opacity:1}50%{opacity:.48}}
      `}</style>

      <div className="fc-head">
        <div>
          <div className="fc-kicker">{displayEyebrow}</div>
          <h2>{displayTitle}</h2>
          <p>{displaySubtitle}</p>
        </div>
        <a href={displayHref} className="fc-view">View All →</a>
      </div>

      <div className="fc-grid" style={{ '--fc-cols': itemsPerPage }}>
        {isLoading ? (
          [...Array(itemsPerPage)].map((_, index) => <SkeletonCard key={index} />)
        ) : displayItems.length ? (
          displayItems.map((item, index) => (
            <FeaturedBookCard
              key={item._id || item.slug || index}
              item={item}
              index={index}
              onAddToCart={addToCart}
              onWishlist={toggleWishlist}
              wishlisted={wishlist?.some(w => w._id === item._id || w.slug === item.slug)}
            />
          ))
        ) : (
          <div className="fc-empty">No featured items yet. Pick books in the Featured Carousel document or mark books as featured.</div>
        )}
      </div>
    </section>
  )
}
