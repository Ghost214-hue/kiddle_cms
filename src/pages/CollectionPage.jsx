import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart,useWishlist  }     from '../context/CartContext'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const ALL_BOOKS = [
  {
    _id: 'b1',  title: 'The Midnight Library',       author: 'Matt Haig',
    price: 24.99, salePrice: null,  rating: 4.4, reviewCount: 1240,
    ageRange: 'Young Adult', badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'the-midnight-library',
    categories: ['fiction', 'young-adults', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
  },
  {
    _id: 'b2',  title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi',
    price: 18.99, salePrice: null,  rating: 4.8, reviewCount: 876,
    ageRange: 'Adult', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'before-the-coffee-gets-cold',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
  },
  {
    _id: 'b3',  title: 'Where the Crawdads Sing',    author: 'Delia Owens',
    price: 23.00, salePrice: null,  rating: 4.7, reviewCount: 2100,
    ageRange: 'Adult', badge: null, badgeColor: null,
    slug: 'where-the-crawdads-sing',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
  },
  {
    _id: 'b4',  title: "The Lion's Secret Garden",   author: 'Clara Moss',
    price: 12.99, salePrice: null,  rating: 4.6, reviewCount: 580,
    ageRange: '4-8 Years', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'lions-secret-garden',
    categories: ['storybooks', 'lower-primary'],
    img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&q=80',
  },
  {
    _id: 'b5',  title: 'Klara and the Sun',          author: 'Kazuo Ishiguro',
    price: 20.00, salePrice: null,  rating: 4.6, reviewCount: 940,
    ageRange: 'Adult', badge: null, badgeColor: null,
    slug: 'klara-and-the-sun',
    categories: ['fiction'],
    img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80',
  },
  {
    _id: 'b6',  title: 'Stars & Beyond',             author: 'J. Hartley',
    price: 9.50, salePrice: 7.50,   rating: 4.2, reviewCount: 310,
    ageRange: '9-12 Years', badge: 'Sale', badgeColor: '#b03030',
    slug: 'stars-and-beyond',
    categories: ['storybooks', 'upper-primary', 'science-nature'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=500&q=80',
  },
  {
    _id: 'b7',  title: 'The Forest Alphabet',        author: 'Nora Fynn',
    price: 8.99, salePrice: null,   rating: 4.9, reviewCount: 430,
    ageRange: '0-3 Years', badge: null, badgeColor: null,
    slug: 'forest-alphabet',
    categories: ['storybooks', 'pp1-pp2'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
  {
    _id: 'b8',  title: 'Wings of Tomorrow',          author: 'Sol Rivera',
    price: 11.00, salePrice: null,  rating: 4.3, reviewCount: 195,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'wings-of-tomorrow',
    categories: ['storybooks', 'upper-primary'],
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80',
  },
  {
    _id: 'b9',  title: 'The Starless Sea',           author: 'Erin Morgenstern',
    price: 22.50, salePrice: null,  rating: 4.9, reviewCount: 1540,
    ageRange: 'Adult', badge: 'Bestseller', badgeColor: '#8a6030',
    slug: 'the-starless-sea',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&q=80',
  },
  {
    _id: 'b10', title: 'Wildwood Whispers',          author: 'Elena Rosewood',
    price: 16.99, salePrice: null,  rating: 4.5, reviewCount: 268,
    ageRange: 'Young Adult', badge: null, badgeColor: null,
    slug: 'wildwood-whispers',
    categories: ['fiction', 'young-adults', 'african-writers'],
    img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=500&q=80',
  },
  {
    _id: 'b11', title: 'Mathematics Grade 7',        author: 'KIE Press',
    price: 14.00, salePrice: null,  rating: 4.7, reviewCount: 88,
    ageRange: '12-15 Years', badge: null, badgeColor: null,
    slug: 'mathematics-grade-7',
    categories: ['cbc-education', 'junior-secondary', 'mathematics'],
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
  },
  {
    _id: 'b12', title: 'Colours of the Sky',         author: 'A. Linden',
    price: 11.00, salePrice: 8.50,  rating: 4.8, reviewCount: 340,
    ageRange: '4-8 Years', badge: 'Sale', badgeColor: '#b03030',
    slug: 'colours-of-the-sky',
    categories: ['storybooks', 'lower-primary'],
    img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&q=80',
  },
  {
    _id: 'b13', title: 'Things Fall Apart',          author: 'Chinua Achebe',
    price: 19.99, salePrice: null,  rating: 4.9, reviewCount: 3200,
    ageRange: 'Adult', badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'things-fall-apart',
    categories: ['fiction', 'african-writers', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80',
  },
  {
    _id: 'b14', title: 'English Workbook Grade 4',   author: 'KICD',
    price: 10.00, salePrice: null,  rating: 4.4, reviewCount: 210,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'english-workbook-grade-4',
    categories: ['cbc-education', 'upper-primary', 'english'],
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
  },
  {
    _id: 'b15', title: 'Science & Tech Grade 6',     author: 'Focus Publishers',
    price: 13.50, salePrice: null,  rating: 4.5, reviewCount: 142,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'science-tech-grade-6',
    categories: ['cbc-education', 'upper-primary', 'science-nature', 'science'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=500&q=80',
  },
  {
    _id: 'b16', title: 'Social Studies Grade 3',     author: 'Longhorn',
    price: 9.00, salePrice: null,   rating: 4.2, reviewCount: 95,
    ageRange: '6-9 Years', badge: null, badgeColor: null,
    slug: 'social-studies-grade-3',
    categories: ['cbc-education', 'lower-primary', 'social-studies'],
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80',
  },
]

const CATEGORY_META = {
  all:               { label: 'All Books',          emoji: '📚' , desc: 'Browse our full collection of over 10,000 titles.' },
  fiction:           { label: 'Fiction',            emoji: '📖',  desc: 'Stories that reshape how you see the world.' },
  'cbc-education':   { label: 'CBC Textbooks',      emoji: '🏫',  desc: 'KICD-approved books for every CBC grade level.' },
  storybooks:        { label: 'Storybooks',         emoji: '🌟',  desc: 'African & world tales for every young reader.' },
  stationery:        { label: 'Stationery',         emoji: '✏️',   desc: 'Pens, notebooks, art supplies & more.' },
  philosophy:        { label: 'Philosophy & Life',  emoji: '🤔',  desc: 'Mindset, growth & personal development.' },
  'young-adults':    { label: 'Young Adults',       emoji: '🌙',  desc: 'Teen fiction & coming-of-age stories.' },
  'african-writers': { label: 'African Writers',    emoji: '🌍',  desc: 'Local & continental voices, proudly African.' },
  'science-nature':  { label: 'Science & Nature',   emoji: '🔬',  desc: 'Explore the natural world and beyond.' },
  bestsellers:       { label: 'Bestsellers',        emoji: '⭐',  desc: 'Most loved books this month.' },
}

const GRADE_LEVELS = [
  { slug: 'pp1-pp2',          label: 'PP1–PP2',     icon: '🎨' },
  { slug: 'lower-primary',    label: 'Grade 1–3',   icon: '📖' },
  { slug: 'upper-primary',    label: 'Grade 4–6',   icon: '🔬' },
  { slug: 'junior-secondary', label: 'Grade 7–9',   icon: '⚗️'  },
  { slug: 'senior-school',    label: 'Grade 10–12', icon: '🎓' },
]

const SUBJECTS = [
  { slug: 'mathematics',    label: 'Mathematics',    icon: '📐' },
  { slug: 'english',        label: 'English',        icon: '📝' },
  { slug: 'kiswahili',      label: 'Kiswahili',      icon: '🗣️'  },
  { slug: 'science',        label: 'Science & Tech', icon: '🔬' },
  { slug: 'social-studies', label: 'Social Studies', icon: '🌍' },
  { slug: 'cre',            label: 'CRE / IRE',      icon: '⛪' },
  { slug: 'creative-arts',  label: 'Creative Arts',  icon: '🎨' },
  { slug: 'phe',            label: 'PE & Health',    icon: '🏃' },
]

const AGE_RANGES   = ['0-3 Years','4-8 Years','6-9 Years','9-12 Years','12-15 Years','15-18 Years','Young Adult','Adult']
const FORMATS      = ['Hardcover','Paperback','E-book','Audiobook']
const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'        },
  { value: 'price-asc',  label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
  { value: 'rating',     label: 'Top Rated'       },
]

// ─────────────────────────────────────────────
// URL HELPERS
// ─────────────────────────────────────────────
function getParams() {
  if (typeof window === 'undefined') return {}
  const sp = new URLSearchParams(window.location.search)
  return { grade: sp.get('grade') || '', subject: sp.get('subject') || '' }
}

function getCategorySlug() {
  if (typeof window === 'undefined') return 'all'
  const parts = window.location.pathname.split('/')
  const idx   = parts.indexOf('category')
  return idx !== -1 && parts[idx + 1] ? parts[idx + 1] : 'all'
}

// ─────────────────────────────────────────────
// STARS
// ─────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: '11px', color: i <= Math.round(rating) ? '#a0693a' : '#ddd' }}>★</span>
      ))}
    </span>
  )
}

// ─────────────────────────────────────────────
// GRID CARD — with View Details link
// ─────────────────────────────────────────────
function BookGridCard({ book, wishlisted, onWishlist, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov,    setHov]    = useState(false)
  const price = book.salePrice ?? book.price

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: '18px', overflow: 'hidden',
        background: '#fff',
        border: `1px solid ${hov ? 'rgba(160,105,58,0.35)' : 'rgba(200,170,130,0.22)'}`,
        boxShadow: hov ? '0 14px 40px rgba(100,60,20,0.13)' : '0 2px 10px rgba(100,60,20,0.06)',
        transform: hov ? 'translateY(-4px)' : 'none',
        transition: 'all 0.25s ease',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── Cover image ── */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', flexShrink: 0 }}>
        <Link to={`/book/${book.slug}`} style={{ display: 'block', height: '100%' }}>
          {!imgErr && book.img ? (
            <img
              src={book.img}
              alt={book.title}
              loading="lazy"
              onError={() => setImgErr(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: hov ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.4s ease',
                display: 'block',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(160deg,#f5e8d5,#e8d5b8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '48px',
            }}>
              📖
            </div>
          )}
        </Link>

        {/* Badge */}
        {book.badge && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            background: book.badgeColor || '#8a6030',
            color: '#fff', fontSize: '9.5px', fontWeight: '700',
            padding: '3px 10px', borderRadius: '12px',
            fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.04em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}>
            {book.badge}
          </div>
        )}

        {/* Wishlist btn */}
        <button
          onClick={e => { e.preventDefault(); onWishlist(book) }}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: wishlisted ? 'rgba(160,105,58,0.95)' : 'rgba(255,255,255,0.88)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'background 0.2s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#fff' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
              stroke={wishlisted ? '#fff' : '#a0693a'} strokeWidth="1.4"/>
          </svg>
        </button>

        {/* Quick View overlay on hover */}
        {hov && (
          <Link to={`/book/${book.slug}`} style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            zIndex: 10,
          }}>
            <span style={{
              background: '#fff',
              color: '#a0693a',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: "'DM Sans',sans-serif",
            }}>
              Quick View
            </span>
          </Link>
        )}
      </div>

      {/* ── Info ── */}
      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {book.ageRange && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start',
            fontSize: '9.5px', fontWeight: '700',
            background: 'rgba(160,105,58,0.09)',
            color: '#9a6030', padding: '2px 9px', borderRadius: '8px',
            fontFamily: "'DM Sans',sans-serif", marginBottom: '7px',
          }}>
            {book.ageRange}
          </div>
        )}

        <Link to={`/book/${book.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
          <div style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: '14px', fontWeight: '700', color: '#3d2010',
            lineHeight: 1.3, marginBottom: '3px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {book.title}
          </div>
        </Link>

        <div style={{
          fontSize: '12px', color: '#9a7a5a',
          fontFamily: "'DM Sans',sans-serif", marginBottom: '8px',
        }}>
          {book.author}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
          <Stars rating={book.rating}/>
          <span style={{ fontSize: '10.5px', color: '#b09070', fontFamily: "'DM Sans',sans-serif" }}>
            ({book.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* View Details Link */}
        <Link to={`/book/${book.slug}`} style={{ textDecoration: 'none', marginBottom: '12px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', fontWeight: '600', color: '#a0693a',
            fontFamily: "'DM Sans',sans-serif",
            transition: 'gap 0.2s ease',
          }}>
            <span>View Details</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="#a0693a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#7a4e22', fontFamily: "'DM Sans',sans-serif" }}>
              ${price.toFixed(2)}
            </span>
            {book.salePrice && (
              <span style={{
                fontSize: '11px', color: '#b09070', textDecoration: 'line-through',
                fontFamily: "'DM Sans',sans-serif", marginLeft: '6px',
              }}>
                ${book.price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(book)}
            style={{
              background: hov ? '#8a5830' : '#a0693a',
              color: '#fff', border: 'none',
              padding: '7px 16px', borderRadius: '14px',
              fontSize: '12px', fontWeight: '700',
              fontFamily: "'DM Sans',sans-serif",
              cursor: 'pointer', transition: 'background 0.2s',
            }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// LIST ROW — with View Details link
// ─────────────────────────────────────────────
function BookListRow({ book, wishlisted, onWishlist, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov,    setHov]    = useState(false)
  const price = book.salePrice ?? book.price

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        background: hov ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)',
        border: `1px solid ${hov ? 'rgba(160,105,58,0.30)' : 'rgba(200,170,130,0.22)'}`,
        borderRadius: '16px', padding: '14px 18px',
        boxShadow: hov ? '0 6px 24px rgba(100,60,20,0.10)' : 'none',
        transform: hov ? 'translateX(4px)' : 'none',
        transition: 'all 0.22s ease',
      }}
    >
      {/* Cover */}
      <Link to={`/book/${book.slug}`} style={{ flexShrink: 0 }}>
        <div style={{
          width: '60px', height: '84px', borderRadius: '10px',
          overflow: 'hidden',
          background: 'linear-gradient(160deg,#f5e8d5,#e8d5b8)',
        }}>
          {!imgErr && book.img ? (
            <img
              src={book.img} alt={book.title} loading="lazy"
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
            }}>📖</div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link to={`/book/${book.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: "'Playfair Display',serif", fontSize: '14px',
            fontWeight: '700', color: '#3d2010', marginBottom: '2px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {book.title}
          </div>
        </Link>
        <div style={{ fontSize: '12px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginBottom: '5px' }}>
          {book.author}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '5px' }}>
          <Stars rating={book.rating}/>
          <span style={{ fontSize: '10.5px', color: '#b09070', fontFamily: "'DM Sans',sans-serif" }}>
            ({book.reviewCount.toLocaleString()})
          </span>
          {book.ageRange && (
            <span style={{
              fontSize: '10px', background: 'rgba(160,105,58,0.09)',
              padding: '2px 8px', borderRadius: '8px', color: '#9a6030',
              fontFamily: "'DM Sans',sans-serif",
            }}>
              {book.ageRange}
            </span>
          )}
          {book.badge && (
            <span style={{
              fontSize: '9.5px', fontWeight: '700',
              background: book.badgeColor || '#8a6030',
              color: '#fff', padding: '2px 8px', borderRadius: '8px',
              fontFamily: "'DM Sans',sans-serif",
            }}>
              {book.badge}
            </span>
          )}
        </div>
        
        {/* View Details link for list view */}
        <Link to={`/book/${book.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '10.5px', fontWeight: '500', color: '#a0693a',
            fontFamily: "'DM Sans',sans-serif",
          }}>
            <span>View Details</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="#a0693a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Link>
      </div>

      {/* Price + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#7a4e22', fontFamily: "'DM Sans',sans-serif" }}>
            ${price.toFixed(2)}
          </div>
          {book.salePrice && (
            <div style={{ fontSize: '10.5px', color: '#b09070', textDecoration: 'line-through', fontFamily: "'DM Sans',sans-serif" }}>
              ${book.price.toFixed(2)}
            </div>
          )}
        </div>
        <button
          onClick={() => onWishlist(book)}
          style={{
            width: '34px', height: '34px', borderRadius: '50%',
            border: '1px solid rgba(180,140,90,0.3)',
            background: wishlisted ? 'rgba(160,105,58,0.12)' : 'rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#a0693a' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
              stroke="#a0693a" strokeWidth="1.4"/>
          </svg>
        </button>
        <button
          onClick={() => onAddToCart(book)}
          style={{
            background: '#a0693a', color: '#fff', border: 'none',
            padding: '8px 16px', borderRadius: '14px',
            fontSize: '12px', fontWeight: '700',
            fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
          }}
        >
          + Add
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// CHECKBOX
// ─────────────────────────────────────────────
function CheckBox({ label, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
      padding: '4px 0', fontSize: '12.5px',
      color: checked ? '#5c3d1e' : '#9a7a5a',
      fontFamily: "'DM Sans',sans-serif", fontWeight: checked ? '600' : '400',
    }}>
      <div onClick={onChange} style={{
        width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
        border: `1.5px solid ${checked ? '#a0693a' : 'rgba(180,140,90,0.4)'}`,
        background: checked ? '#a0693a' : 'rgba(255,255,255,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.18s',
      }}>
        {checked && (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {label}
    </label>
  )
}

// ─────────────────────────────────────────────
// FILTER SECTION
// ─────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid rgba(180,140,90,0.15)', paddingBottom: '14px', marginBottom: '14px' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        padding: '2px 0 10px',
      }}>
        <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#5c3d1e', fontFamily: "'DM Sans',sans-serif" }}>
          {title}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          <path d="M2 4l4 4 4-4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && children}
    </div>
  )
}

// ─────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────
function SkeletonGridCard() {
  return (
    <div style={{ borderRadius: '18px', overflow: 'hidden', background: '#fff', border: '1px solid rgba(200,170,130,0.18)' }}>
      <div style={{ aspectRatio: '3/4', background: 'linear-gradient(90deg,#f0e8dc,#e8ddd0,#f0e8dc)', backgroundSize: '200% 100%', animation: 'ks-shimmer 1.4s infinite' }}/>
      <div style={{ padding: '14px' }}>
        <div style={{ height: '12px', width: '50%', borderRadius: '6px', background: '#ede5d8', marginBottom: '10px' }}/>
        <div style={{ height: '14px', width: '90%', borderRadius: '6px', background: '#ede5d8', marginBottom: '6px' }}/>
        <div style={{ height: '12px', width: '70%', borderRadius: '6px', background: '#ede5d8' }}/>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function CollectionPage() {
  const params       = getParams()
  const categorySlug = getCategorySlug()
  const meta         = CATEGORY_META[categorySlug] || CATEGORY_META['all']

  const [sort,             setSort]             = useState('featured')
  const [viewMode,         setViewMode]         = useState('grid')
  const [loading,          setLoading]          = useState(true)
  const [page,             setPage]             = useState(1)
  const [priceRange,       setPriceRange]       = useState([0, 100])
  const [selectedGrades,   setSelectedGrades]   = useState(params.grade   ? [params.grade]   : [])
  const [selectedSubjects, setSelectedSubjects] = useState(params.subject ? [params.subject] : [])
  const [selectedAges,     setSelectedAges]     = useState([])
  const [selectedFormats,  setSelectedFormats]  = useState([])
  const [mobileFilters,    setMobileFilters]    = useState(false)

  const { addToCart }                    = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [categorySlug, sort, selectedGrades, selectedSubjects, selectedAges, selectedFormats])

  // ── Filter ──
  let books = [...ALL_BOOKS]
  if (categorySlug !== 'all')    books = books.filter(b => b.categories?.includes(categorySlug))
  if (selectedGrades.length)     books = books.filter(b => selectedGrades.some(g => b.categories?.includes(g)))
  if (selectedSubjects.length)   books = books.filter(b => selectedSubjects.some(s => b.categories?.includes(s)))
  if (selectedAges.length)       books = books.filter(b => selectedAges.includes(b.ageRange))
  books = books.filter(b => (b.salePrice ?? b.price) >= priceRange[0] && (b.salePrice ?? b.price) <= priceRange[1])

  // ── Sort ──
  if (sort === 'price-asc')  books = [...books].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
  if (sort === 'price-desc') books = [...books].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
  if (sort === 'rating')     books = [...books].sort((a, b) => b.rating - a.rating)

  const ITEMS_PER_PAGE = 12
  const totalPages     = Math.ceil(books.length / ITEMS_PER_PAGE)
  const displayed      = books.slice(0, page * ITEMS_PER_PAGE)

  function toggle(arr, setArr, val) {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  }
  function resetFilters() {
    setSelectedGrades([]); setSelectedSubjects([])
    setSelectedAges([]); setSelectedFormats([]); setPriceRange([0, 100])
  }

  const hasFilters = selectedGrades.length || selectedSubjects.length ||
    selectedAges.length || selectedFormats.length || priceRange[0] > 0 || priceRange[1] < 100

  const activeChips = [
    ...selectedGrades.map(g   => ({ key: g, label: GRADE_LEVELS.find(x => x.slug === g)?.label || g,   set: setSelectedGrades,   arr: selectedGrades   })),
    ...selectedSubjects.map(s => ({ key: s, label: SUBJECTS.find(x => x.slug === s)?.label || s,       set: setSelectedSubjects, arr: selectedSubjects })),
    ...selectedAges.map(a     => ({ key: a, label: a,                                                   set: setSelectedAges,     arr: selectedAges     })),
  ]

  // ── Sidebar shared content ──
  const SidebarContent = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#3d2010', fontFamily: "'DM Sans',sans-serif" }}>
          Filters
        </span>
        {hasFilters && (
          <button onClick={resetFilters} style={{
            fontSize: '11px', color: '#a0693a', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: '600',
          }}>
            Reset all
          </button>
        )}
      </div>

      <FilterSection title="Grade Level">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {GRADE_LEVELS.map(g => (
            <CheckBox key={g.slug} label={`${g.icon} ${g.label}`}
              checked={selectedGrades.includes(g.slug)}
              onChange={() => toggle(selectedGrades, setSelectedGrades, g.slug)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Subject">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SUBJECTS.map(s => (
            <CheckBox key={s.slug} label={`${s.icon} ${s.label}`}
              checked={selectedSubjects.includes(s.slug)}
              onChange={() => toggle(selectedSubjects, setSelectedSubjects, s.slug)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Age Range" defaultOpen={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {AGE_RANGES.map(a => (
            <CheckBox key={a} label={a}
              checked={selectedAges.includes(a)}
              onChange={() => toggle(selectedAges, setSelectedAges, a)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <input type="range" min="0" max="100" value={priceRange[1]}
          onChange={e => setPriceRange([0, Number(e.target.value)])}
          style={{ width: '100%', accentColor: '#a0693a', marginBottom: '6px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif" }}>
          <span>$0</span><span>${priceRange[1]}+</span>
        </div>
      </FilterSection>

      <FilterSection title="Format" defaultOpen={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {FORMATS.map(f => (
            <CheckBox key={f} label={f}
              checked={selectedFormats.includes(f)}
              onChange={() => toggle(selectedFormats, setSelectedFormats, f)}
            />
          ))}
        </div>
      </FilterSection>
    </>
  )

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', paddingTop: '80px' }}>

      {/* shimmer keyframe */}
      <style>{`
        @keyframes ks-shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
        /* Desktop sidebar visible, mobile hidden */
        .col-sidebar       { display: block !important }
        .mob-filter-btn    { display: none  !important }

        /* Responsive grid columns */
        .books-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (min-width: 1200px) {
          .books-grid { grid-template-columns: repeat(4, 1fr) }
        }
        @media (max-width: 900px) {
          .books-grid { grid-template-columns: repeat(2, 1fr) }
        }
        @media (max-width: 600px) {
          .books-grid { grid-template-columns: 1fr }
        }
        @media (max-width: 768px) {
          .col-sidebar    { display: none  !important }
          .mob-filter-btn { display: flex  !important }
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px clamp(14px,4vw,40px)' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', color: '#9a7a5a',
          fontFamily: "'DM Sans',sans-serif", marginBottom: '22px',
        }}>
          <Link to="/" style={{ color: '#9a7a5a', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#c4a882' }}>›</span>
          <Link to="/shop" style={{ color: '#9a7a5a', textDecoration: 'none' }}>Shop</Link>
          <span style={{ color: '#c4a882' }}>›</span>
          <span style={{ color: '#5c3d1e', fontWeight: '500' }}>{meta.label}</span>
        </div>

        <div style={{ display: 'flex', gap: '26px', alignItems: 'flex-start' }}>

          {/* ════ DESKTOP SIDEBAR ════ */}
          <aside className="col-sidebar" style={{
            width: '232px', flexShrink: 0,
            background: 'rgba(255,255,255,0.60)',
            border: '1px solid rgba(200,170,130,0.28)',
            borderRadius: '20px', padding: '20px',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            position: 'sticky', top: '88px',
            maxHeight: 'calc(100vh - 108px)',
            overflowY: 'auto',
          }}>
            <SidebarContent/>
          </aside>

          {/* ════ MAIN ════ */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Header row */}
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '16px', flexWrap: 'wrap', gap: '10px',
            }}>
              <div>
                <h1 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(20px,3vw,28px)', fontWeight: '700',
                  color: '#3d2010', marginBottom: '3px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  {meta.emoji && <span style={{ fontSize: '22px' }}>{meta.emoji}</span>}
                  {meta.label}
                </h1>
                <p style={{ fontSize: '12px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif" }}>
                  {meta.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Mobile filter btn */}
                <button className="mob-filter-btn" onClick={() => setMobileFilters(true)} style={{
                  alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '10px',
                  background: hasFilters ? 'rgba(160,105,58,0.12)' : 'rgba(255,255,255,0.65)',
                  border: `1px solid ${hasFilters ? 'rgba(160,105,58,0.35)' : 'rgba(180,140,90,0.28)'}`,
                  fontSize: '12px', fontWeight: '600',
                  color: hasFilters ? '#7a4e22' : '#5c3d1e',
                  fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
                }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4h10M4 7h6M6 10h2" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Filters{hasFilters ? ` (${activeChips.length})` : ''}
                </button>

                {/* Grid/List toggle */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(180,140,90,0.25)',
                  borderRadius: '10px', overflow: 'hidden',
                }}>
                  {[
                    { mode: 'grid', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
                    { mode: 'list', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3h9M4 7h9M4 11h9M1.5 3h.01M1.5 7h.01M1.5 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  ].map(({ mode, svg }) => (
                    <button key={mode} onClick={() => setViewMode(mode)} style={{
                      padding: '7px 10px', border: 'none', cursor: 'pointer',
                      background: viewMode === mode ? 'rgba(160,105,58,0.15)' : 'transparent',
                      color: viewMode === mode ? '#a0693a' : '#9a7a5a',
                      transition: 'all 0.18s',
                    }}>
                      {svg}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select value={sort} onChange={e => setSort(e.target.value)} style={{
                  padding: '8px 12px', fontSize: '12px',
                  background: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(180,140,90,0.28)',
                  borderRadius: '10px', color: '#5c3d1e',
                  fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', outline: 'none',
                }}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {activeChips.map(chip => (
                  <div key={chip.key} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(160,105,58,0.10)',
                    border: '1px solid rgba(160,105,58,0.28)',
                    borderRadius: '14px', padding: '3px 10px',
                    fontSize: '11.5px', color: '#7a4e22',
                    fontFamily: "'DM Sans',sans-serif",
                  }}>
                    {chip.label}
                    <button onClick={() => chip.set(prev => prev.filter(v => v !== chip.key))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0693a', fontSize: '12px', lineHeight: 1 }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ── Books ── */}
            {loading ? (
              <div className="books-grid">
                {[...Array(8)].map((_, i) => <SkeletonGridCard key={i}/>)}
              </div>
            ) : books.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '72px 20px',
                background: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(200,170,130,0.22)',
                borderRadius: '20px',
              }}>
                <div style={{ fontSize: '40px', marginBottom: '14px' }}>📭</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '20px', color: '#3d2010', marginBottom: '8px' }}>
                  No books found
                </h3>
                <p style={{ fontSize: '13px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginBottom: '20px' }}>
                  Try adjusting your filters.
                </p>
                <button onClick={resetFilters} style={{
                  background: '#a0693a', color: '#fff', border: 'none',
                  padding: '10px 24px', borderRadius: '20px', cursor: 'pointer',
                  fontSize: '12.5px', fontFamily: "'DM Sans',sans-serif",
                }}>
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="books-grid">
                {displayed.map(book => (
                  <BookGridCard key={book._id} book={book}
                    wishlisted={isWishlisted(book._id)}
                    onWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {displayed.map(book => (
                  <BookListRow key={book._id} book={book}
                    wishlisted={isWishlisted(book._id)}
                    onWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && books.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <p style={{
                  fontSize: '11px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif",
                  marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Showing {Math.min(displayed.length, books.length)} of {books.length} books
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)} style={{
                      padding: '7px 13px', borderRadius: '10px',
                      background: n === page ? '#a0693a' : 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(180,140,90,0.28)',
                      color: n === page ? '#fff' : '#7a4e22',
                      fontSize: '12.5px', fontFamily: "'DM Sans',sans-serif",
                      cursor: 'pointer', fontWeight: n === page ? '700' : '400',
                    }}>
                      {n}
                    </button>
                  ))}
                </div>
                {page < totalPages && (
                  <button onClick={() => setPage(p => p + 1)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(180,140,90,0.28)',
                    padding: '10px 24px', borderRadius: '20px',
                    fontSize: '12.5px', fontFamily: "'DM Sans',sans-serif",
                    color: '#7a4e22', cursor: 'pointer',
                  }}>
                    Show more results
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4l4 4 4-4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════ MOBILE FILTER DRAWER ════ */}
      {mobileFilters && (
        <div onClick={() => setMobileFilters(false)} style={{
          position: 'fixed', inset: 0, zIndex: 8990,
          background: 'rgba(20,10,2,0.38)', backdropFilter: 'blur(3px)',
        }}/>
      )}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 9000,
        width: '290px',
        background: 'rgba(248,244,236,0.98)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(20,10,2,0.12)',
        boxShadow: '12px 0 48px rgba(20,10,2,0.14)',
        display: 'flex', flexDirection: 'column',
        transform: mobileFilters ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.34s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 14px',
          borderBottom: '1px solid rgba(180,140,90,0.18)',
        }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '16px', fontWeight: '600', color: '#3d2010' }}>
            Filters
          </span>
          <button onClick={() => setMobileFilters(false)} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            border: '1px solid rgba(20,10,2,0.14)',
            background: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '13px', color: '#1a1008',
          }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <SidebarContent/>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(180,140,90,0.15)' }}>
          <button onClick={() => setMobileFilters(false)} style={{
            width: '100%', padding: '12px',
            background: '#a0693a', color: '#fff',
            border: 'none', borderRadius: '14px',
            fontSize: '13px', fontWeight: '700',
            fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
          }}>
            Show {books.length} Results
          </button>
        </div>
      </div>

    </div>
  )
}