/**
 * CollectionPage.jsx — Kiddle Bookshop
 * • Real book cover images
 * • Fully responsive (mobile drawer sidebar)
 * • Filters synced with HomePage redirects:
 *     /books?grade=upper-primary&subject=mathematics
 *     /category/cbc-education
 *     /category/storybooks  etc.
 */

import { useState, useEffect } from 'react'
import BookCard     from '../components/ui/BookCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import { useCart }     from '../context/CartContext'
import { useWishlist } from '../context/CartContext'

// ─────────────────────────────────────────────
// MOCK BOOKS — with Unsplash cover images
// ─────────────────────────────────────────────
const ALL_BOOKS = [
  {
    _id: 'b1', title: 'The Midnight Library',       author: 'Matt Haig',
    price: 24.99, salePrice: null,
    rating: 4.4,  reviewCount: 1240,
    ageRange: 'Young Adult', badge: '#1 Bestseller', badgeColor: 'tan',
    slug: 'the-midnight-library',
    categories: ['fiction', 'young-adults', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=75',
  },
  {
    _id: 'b2', title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi',
    price: 18.99, salePrice: null,
    rating: 4.8,  reviewCount: 876,
    ageRange: 'Adult', badge: 'New', badgeColor: 'green',
    slug: 'before-the-coffee-gets-cold',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=75',
  },
  {
    _id: 'b3', title: "Where the Crawdads Sing",     author: 'Delia Owens',
    price: 23.00, salePrice: null,
    rating: 4.7,  reviewCount: 2100,
    ageRange: 'Adult',
    slug: 'where-the-crawdads-sing',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=75',
  },
  {
    _id: 'b4', title: "The Lion's Secret Garden",    author: 'Clara Moss',
    price: 12.99, salePrice: null,
    rating: 4.6,  reviewCount: 580,
    ageRange: '4-8 Years', badge: 'New', badgeColor: 'green',
    slug: 'lions-secret-garden',
    categories: ['storybooks', 'lower-primary'],
    img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=75',
  },
  {
    _id: 'b5', title: 'Klara and the Sun',           author: 'Kazuo Ishiguro',
    price: 20.00, salePrice: null,
    rating: 4.6,  reviewCount: 940,
    ageRange: 'Adult',
    slug: 'klara-and-the-sun',
    categories: ['fiction'],
    img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&q=75',
  },
  {
    _id: 'b6', title: 'Stars & Beyond',              author: 'J. Hartley',
    price: 9.50,  salePrice: 7.50,
    rating: 4.2,  reviewCount: 310,
    ageRange: '9-12 Years', badge: 'Sale', badgeColor: 'red',
    slug: 'stars-and-beyond',
    categories: ['storybooks', 'upper-primary', 'science-nature'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=400&q=75',
  },
  {
    _id: 'b7', title: 'The Forest Alphabet',         author: 'Nora Fynn',
    price: 8.99,  salePrice: null,
    rating: 4.9,  reviewCount: 430,
    ageRange: '0-3 Years',
    slug: 'forest-alphabet',
    categories: ['storybooks', 'pp1-pp2'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75',
  },
  {
    _id: 'b8', title: 'Wings of Tomorrow',           author: 'Sol Rivera',
    price: 11.00, salePrice: null,
    rating: 4.3,  reviewCount: 195,
    ageRange: '9-12 Years',
    slug: 'wings-of-tomorrow',
    categories: ['storybooks', 'upper-primary'],
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&q=75',
  },
  {
    _id: 'b9', title: 'The Starless Sea',            author: 'Erin Morgenstern',
    price: 22.50, salePrice: null,
    rating: 4.9,  reviewCount: 1540,
    ageRange: 'Adult', badge: 'Bestseller', badgeColor: 'tan',
    slug: 'the-starless-sea',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=75',
  },
  {
    _id: 'b10', title: 'Wildwood Whispers',          author: 'Elena Rosewood',
    price: 16.99, salePrice: null,
    rating: 4.5,  reviewCount: 268,
    ageRange: 'Young Adult',
    slug: 'wildwood-whispers',
    categories: ['fiction', 'young-adults', 'african-writers'],
    img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&q=75',
  },
  {
    _id: 'b11', title: 'Mathematics Grade 7',        author: 'KIE Press',
    price: 14.00, salePrice: null,
    rating: 4.7,  reviewCount: 88,
    ageRange: '12-15 Years',
    slug: 'mathematics-grade-7',
    categories: ['cbc-education', 'junior-secondary', 'mathematics'],
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=75',
  },
  {
    _id: 'b12', title: 'Colours of the Sky',         author: 'A. Linden',
    price: 11.00, salePrice: 8.50,
    rating: 4.8,  reviewCount: 340,
    ageRange: '4-8 Years', badge: 'Sale', badgeColor: 'red',
    slug: 'colours-of-the-sky',
    categories: ['storybooks', 'lower-primary'],
    img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=75',
  },
  {
    _id: 'b13', title: "Things Fall Apart",          author: 'Chinua Achebe',
    price: 19.99, salePrice: null,
    rating: 4.9,  reviewCount: 3200,
    ageRange: 'Adult', badge: '#1 Bestseller', badgeColor: 'tan',
    slug: 'things-fall-apart',
    categories: ['fiction', 'african-writers', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=75',
  },
  {
    _id: 'b14', title: 'English Workbook Grade 4',   author: 'KICD',
    price: 10.00, salePrice: null,
    rating: 4.4,  reviewCount: 210,
    ageRange: '9-12 Years',
    slug: 'english-workbook-grade-4',
    categories: ['cbc-education', 'upper-primary', 'english'],
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=75',
  },
  {
    _id: 'b15', title: 'Science & Tech Grade 6',     author: 'Focus Publishers',
    price: 13.50, salePrice: null,
    rating: 4.5,  reviewCount: 142,
    ageRange: '9-12 Years',
    slug: 'science-tech-grade-6',
    categories: ['cbc-education', 'upper-primary', 'science-nature', 'science'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=400&q=75',
  },
  {
    _id: 'b16', title: 'Social Studies Grade 3',     author: 'Longhorn',
    price: 9.00,  salePrice: null,
    rating: 4.2,  reviewCount: 95,
    ageRange: '6-9 Years',
    slug: 'social-studies-grade-3',
    categories: ['cbc-education', 'lower-primary', 'social-studies'],
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=75',
  },
]

// ─────────────────────────────────────────────
// CATEGORY META — matches HomePage slugs
// ─────────────────────────────────────────────
const CATEGORY_META = {
  all:              { label: 'All Books',             emoji: '📚', desc: 'Browse our full collection of over 10,000 titles.' },
  fiction:          { label: 'Fiction',               emoji: '📖', desc: 'Stories that reshape how you see the world.' },
  'cbc-education':  { label: 'CBC Textbooks',         emoji: '🏫', desc: 'KICD-approved books for every CBC grade level.' },
  storybooks:       { label: 'Storybooks',            emoji: '🌟', desc: 'African & world tales for every young reader.' },
  stationery:       { label: 'Stationery',            emoji: '✏️',  desc: 'Pens, notebooks, art supplies & more.' },
  philosophy:       { label: 'Philosophy & Life',     emoji: '🤔', desc: 'Mindset, growth & personal development.' },
  'young-adults':   { label: 'Young Adults',          emoji: '🌙', desc: 'Teen fiction & coming-of-age stories.' },
  'african-writers':{ label: 'African Writers',       emoji: '🌍', desc: 'Local & continental voices, proudly African.' },
  'science-nature': { label: 'Science & Nature',      emoji: '🔬', desc: 'Explore the natural world and beyond.' },
  bestsellers:      { label: 'Bestsellers',           emoji: '⭐', desc: 'Most loved books this month.' },
}

// Grade & subject — mirroring HomePage arrays exactly
const GRADE_LEVELS = [
  { slug: 'pp1-pp2',          label: 'PP1–PP2',      icon: '🎨' },
  { slug: 'lower-primary',    label: 'Grade 1–3',    icon: '📖' },
  { slug: 'upper-primary',    label: 'Grade 4–6',    icon: '🔬' },
  { slug: 'junior-secondary', label: 'Grade 7–9',    icon: '⚗️' },
  { slug: 'senior-school',    label: 'Grade 10–12',  icon: '🎓' },
]

const SUBJECTS = [
  { slug: 'mathematics',    label: 'Mathematics',    icon: '📐' },
  { slug: 'english',        label: 'English',        icon: '📝' },
  { slug: 'kiswahili',      label: 'Kiswahili',      icon: '🗣️' },
  { slug: 'science',        label: 'Science & Tech', icon: '🔬' },
  { slug: 'social-studies', label: 'Social Studies', icon: '🌍' },
  { slug: 'cre',            label: 'CRE / IRE',      icon: '⛪' },
  { slug: 'creative-arts',  label: 'Creative Arts',  icon: '🎨' },
  { slug: 'phe',            label: 'PE & Health',    icon: '🏃' },
]

const AGE_RANGES   = ['0-3 Years', '4-8 Years', '6-9 Years', '9-12 Years', '12-15 Years', '15-18 Years', 'Young Adult', 'Adult']
const FORMATS      = ['Hardcover', 'Paperback', 'E-book', 'Audiobook']
const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'        },
  { value: 'newest',     label: 'Newest'          },
  { value: 'price-asc',  label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
  { value: 'rating',     label: 'Top Rated'       },
]

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getParams() {
  if (typeof window === 'undefined') return {}
  const sp = new URLSearchParams(window.location.search)
  return {
    grade:   sp.get('grade')   || '',
    subject: sp.get('subject') || '',
  }
}

function getCategorySlug() {
  if (typeof window === 'undefined') return 'all'
  const parts = window.location.pathname.split('/')
  const idx   = parts.indexOf('category')
  return idx !== -1 && parts[idx + 1] ? parts[idx + 1] : 'all'
}

// ─────────────────────────────────────────────
// PILL
// ─────────────────────────────────────────────
function Pill({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '6px 14px', borderRadius: '20px',
        background: active ? 'rgba(160,105,58,0.15)' : 'rgba(255,255,255,0.6)',
        border: `1px solid ${active ? 'rgba(160,105,58,0.45)' : 'rgba(180,140,90,0.25)'}`,
        color: active ? '#7a4e22' : '#7a5c3a',
        fontSize: '12px', fontWeight: active ? '700' : '400',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.18s',
      }}
    >
      {icon && <span style={{ fontSize: '13px', lineHeight: 1 }}>{icon}</span>}
      {label}
    </button>
  )
}

// ─────────────────────────────────────────────
// CHECKBOX
// ─────────────────────────────────────────────
function CheckBox({ label, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
      padding: '4px 0', fontSize: '12.5px', color: checked ? '#5c3d1e' : '#9a7a5a',
      fontFamily: "'DM Sans', sans-serif", fontWeight: checked ? '500' : '400',
    }}>
      <div
        onClick={onChange}
        style={{
          width: '16px', height: '16px', borderRadius: '4px',
          border: `1.5px solid ${checked ? '#a0693a' : 'rgba(180,140,90,0.4)'}`,
          background: checked ? '#a0693a' : 'rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', flexShrink: 0,
        }}
      >
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
    <div style={{ borderBottom: '1px solid rgba(180,140,90,0.15)', paddingBottom: '16px', marginBottom: '16px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 0 10px',
        }}
      >
        <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#5c3d1e', fontFamily: "'DM Sans',sans-serif" }}>
          {title}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M2 4l4 4 4-4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div style={{ paddingTop: '4px' }}>{children}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────
// BOOK LIST ROW (list view)
// ─────────────────────────────────────────────
function BookListRow({ book, onAddToCart, onWishlist, wishlisted }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov, setHov]       = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        background: hov ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
        border: '1px solid rgba(200,170,130,0.28)',
        borderRadius: '16px', padding: '14px 18px',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
        transform: hov ? 'translateX(4px)' : 'none',
        boxShadow: hov ? '0 4px 20px rgba(100,60,20,0.10)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Cover */}
      <div style={{
        width: '56px', height: '80px', borderRadius: '8px',
        overflow: 'hidden', flexShrink: 0,
        background: 'rgba(200,170,130,0.2)',
      }}>
        {!imgErr && book.img ? (
          <img src={book.img} alt={book.title}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
          }}>📖</div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <a href={`/book/${book.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: '14px', fontWeight: '600', color: '#3d2010',
            marginBottom: '2px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {book.title}
          </div>
        </a>
        <div style={{ fontSize: '12px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginBottom: '6px' }}>
          {book.author}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: '#a0693a' }}>{'★'.repeat(Math.round(book.rating))}</span>
          <span style={{ fontSize: '10px', color: '#b09070', fontFamily: "'DM Sans',sans-serif" }}>
            ({book.reviewCount})
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
        </div>
      </div>

      {/* Price + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#7a4e22', fontFamily: "'DM Sans',sans-serif" }}>
            ${(book.salePrice ?? book.price).toFixed(2)}
          </div>
          {book.salePrice && (
            <div style={{ fontSize: '11px', color: '#b09070', textDecoration: 'line-through', fontFamily: "'DM Sans',sans-serif" }}>
              ${book.price.toFixed(2)}
            </div>
          )}
        </div>
        <button
          onClick={() => onWishlist(book)}
          style={{
            width: '34px', height: '34px', borderRadius: '50%',
            border: '1px solid rgba(180,140,90,0.3)',
            background: wishlisted ? 'rgba(160,105,58,0.12)' : 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
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
            padding: '8px 16px', borderRadius: '16px',
            fontSize: '11.5px', fontWeight: '600',
            fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          + Add
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function CollectionPage() {
  const params      = getParams()
  const categorySlug = getCategorySlug()
  const meta         = CATEGORY_META[categorySlug] || CATEGORY_META['all']

  // Filter state — pre-populated from URL params
  const [sort,            setSort]            = useState('featured')
  const [viewMode,        setViewMode]        = useState('grid')
  const [loading,         setLoading]         = useState(true)
  const [page,            setPage]            = useState(1)
  const [priceRange,      setPriceRange]      = useState([0, 100])
  const [selectedGrades,  setSelectedGrades]  = useState(params.grade ? [params.grade] : [])
  const [selectedSubjects,setSelectedSubjects]= useState(params.subject ? [params.subject] : [])
  const [selectedAges,    setSelectedAges]    = useState([])
  const [selectedFormats, setSelectedFormats] = useState([])
  const [mobileFilters,   setMobileFilters]   = useState(false)

  const { addToCart }                    = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [categorySlug, sort, selectedGrades, selectedSubjects, selectedAges, selectedFormats])

  // ── Apply filters ──
  let books = [...ALL_BOOKS]

  if (categorySlug !== 'all') {
    books = books.filter(b => b.categories?.includes(categorySlug))
  }
  if (selectedGrades.length) {
    books = books.filter(b => selectedGrades.some(g => b.categories?.includes(g)))
  }
  if (selectedSubjects.length) {
    books = books.filter(b => selectedSubjects.some(s => b.categories?.includes(s)))
  }
  if (selectedAges.length) {
    books = books.filter(b => selectedAges.includes(b.ageRange))
  }
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

  // ── Sidebar content (shared between desktop & mobile drawer) ──
  const SidebarContent = () => (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <span style={{
          fontSize: '13px', fontWeight: '700', color: '#3d2010',
          fontFamily: "'DM Sans',sans-serif",
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2 4h10M4 7h6M6 10h2" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Filters
        </span>
        {hasFilters && (
          <button onClick={resetFilters} style={{
            fontSize: '11px', color: '#a0693a', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: '500',
          }}>
            Reset all
          </button>
        )}
      </div>

      {/* Grade Level — mirrors HomePage CBC picker */}
      <FilterSection title="Grade Level">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {GRADE_LEVELS.map(g => (
            <CheckBox key={g.slug}
              label={`${g.icon} ${g.label}`}
              checked={selectedGrades.includes(g.slug)}
              onChange={() => toggle(selectedGrades, setSelectedGrades, g.slug)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Subject */}
      <FilterSection title="Subject">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SUBJECTS.map(s => (
            <CheckBox key={s.slug}
              label={`${s.icon} ${s.label}`}
              checked={selectedSubjects.includes(s.slug)}
              onChange={() => toggle(selectedSubjects, setSelectedSubjects, s.slug)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Age Range */}
      <FilterSection title="Age Range" defaultOpen={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {AGE_RANGES.map(age => (
            <CheckBox key={age} label={age}
              checked={selectedAges.includes(age)}
              onChange={() => toggle(selectedAges, setSelectedAges, age)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div style={{ padding: '4px 0' }}>
          <input
            type="range" min="0" max="100" value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            style={{ width: '100%', accentColor: '#a0693a', marginBottom: '8px' }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '11.5px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif",
          }}>
            <span>$0</span><span>${priceRange[1]}+</span>
          </div>
        </div>
      </FilterSection>

      {/* Format */}
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
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px clamp(16px,4vw,40px)' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', color: '#9a7a5a',
          fontFamily: "'DM Sans',sans-serif", marginBottom: '24px',
        }}>
          {['Home', 'Shop', meta.label].map((crumb, i, arr) => (
            <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i < arr.length - 1
                ? <a href="#" style={{ color: '#9a7a5a', textDecoration: 'none' }}>{crumb}</a>
                : <span style={{ color: '#5c3d1e', fontWeight: '500' }}>{crumb}</span>
              }
              {i < arr.length - 1 && <span style={{ color: '#c4a882' }}>›</span>}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

          {/* ════ DESKTOP SIDEBAR ════ */}
          <aside className="col-sidebar" style={{
            width: '240px', flexShrink: 0,
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(200,170,130,0.28)',
            borderRadius: '20px', padding: '22px',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            position: 'sticky', top: '88px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}>
            <SidebarContent />
          </aside>

          {/* ════ MAIN CONTENT ════ */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Page header */}
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', marginBottom: '20px',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <div>
                <h1 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(20px,3vw,28px)', fontWeight: '700',
                  color: '#3d2010', marginBottom: '4px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  {meta.emoji && <span style={{ fontSize: '22px' }}>{meta.emoji}</span>}
                  {meta.label}
                </h1>
                <p style={{ fontSize: '12.5px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif" }}>
                  {meta.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Mobile filter toggle */}
                <button
                  className="mobile-filter-btn"
                  onClick={() => setMobileFilters(true)}
                  style={{
                    display: 'none',
                    alignItems: 'center', gap: '6px',
                    padding: '8px 14px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(180,140,90,0.28)',
                    fontSize: '12px', fontWeight: '600', color: '#5c3d1e',
                    fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4h10M4 7h6M6 10h2" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Filters {hasFilters ? `(${[selectedGrades, selectedSubjects, selectedAges, selectedFormats].flat().length})` : ''}
                </button>

                {/* Grid/List toggle */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(180,140,90,0.25)', borderRadius: '10px',
                  overflow: 'hidden',
                }}>
                  {[
                    {
                      mode: 'grid',
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                          <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                          <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                          <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                      ),
                    },
                    {
                      mode: 'list',
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M4 3h9M4 7h9M4 11h9M1.5 3h.01M1.5 7h.01M1.5 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ),
                    },
                  ].map(({ mode, icon }) => (
                    <button key={mode} onClick={() => setViewMode(mode)} style={{
                      padding: '7px 10px', border: 'none', cursor: 'pointer',
                      background: viewMode === mode ? 'rgba(160,105,58,0.15)' : 'transparent',
                      color: viewMode === mode ? '#a0693a' : '#9a7a5a',
                      transition: 'all 0.2s',
                    }}>
                      {icon}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    padding: '8px 12px', fontSize: '12px',
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(180,140,90,0.28)',
                    borderRadius: '10px', color: '#5c3d1e',
                    fontFamily: "'DM Sans',sans-serif",
                    cursor: 'pointer', outline: 'none',
                  }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {[
                  ...selectedGrades.map(g => ({ key: g, label: GRADE_LEVELS.find(x => x.slug === g)?.label || g, set: setSelectedGrades, arr: selectedGrades })),
                  ...selectedSubjects.map(s => ({ key: s, label: SUBJECTS.find(x => x.slug === s)?.label || s, set: setSelectedSubjects, arr: selectedSubjects })),
                  ...selectedAges.map(a => ({ key: a, label: a, set: setSelectedAges, arr: selectedAges })),
                ].map(chip => (
                  <div key={chip.key} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(160,105,58,0.12)',
                    border: '1px solid rgba(160,105,58,0.28)',
                    borderRadius: '16px', padding: '3px 10px',
                    fontSize: '11.5px', color: '#7a4e22',
                    fontFamily: "'DM Sans',sans-serif",
                  }}>
                    {chip.label}
                    <button
                      onClick={() => chip.set(prev => prev.filter(v => v !== chip.key))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0693a', fontSize: '12px', lineHeight: 1, padding: '0 2px' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Book Grid / List */}
            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
                gap: '16px',
              }}>
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} variant="book"/>)}
              </div>
            ) : books.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '80px 20px',
                background: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(200,170,130,0.25)',
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
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
                gap: '16px',
              }}>
                {displayed.map(book => (
                  <BookCard
                    key={book._id}
                    book={book}
                    wishlisted={isWishlisted(book._id)}
                    onWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    size="md"
                  />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {displayed.map(book => (
                  <BookListRow
                    key={book._id}
                    book={book}
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
                  fontSize: '11.5px', color: '#9a7a5a',
                  fontFamily: "'DM Sans',sans-serif", marginBottom: '14px',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Showing {Math.min(displayed.length, books.length)} of {books.length} products
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)} style={{
                      padding: '7px 13px', borderRadius: '10px',
                      background: n === page ? '#a0693a' : 'rgba(255,255,255,0.6)',
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
                  <button
                    onClick={() => setPage(p => p + 1)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(255,255,255,0.6)',
                      border: '1px solid rgba(180,140,90,0.28)',
                      padding: '10px 24px', borderRadius: '20px',
                      fontSize: '12.5px', fontWeight: '500',
                      fontFamily: "'DM Sans',sans-serif",
                      color: '#7a4e22', cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
                  >
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
        <div
          onClick={() => setMobileFilters(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 8990,
            background: 'rgba(20,10,2,0.35)',
            backdropFilter: 'blur(3px)',
          }}
        />
      )}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 9000,
        width: '300px',
        background: 'rgba(248,244,236,0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(20,10,2,0.12)',
        boxShadow: '12px 0 48px rgba(20,10,2,0.15)',
        display: 'flex', flexDirection: 'column',
        transform: mobileFilters ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.34s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 22px 16px',
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
          }}>
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          <SidebarContent />
        </div>
        <div style={{ padding: '16px 22px', borderTop: '1px solid rgba(180,140,90,0.15)' }}>
          <button
            onClick={() => setMobileFilters(false)}
            style={{
              width: '100%', padding: '12px',
              background: '#a0693a', color: '#fff',
              border: 'none', borderRadius: '14px',
              fontSize: '13px', fontWeight: '700',
              fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
            }}
          >
            Show {books.length} Results
          </button>
        </div>
      </div>

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          .col-sidebar        { display: none !important }
          .mobile-filter-btn  { display: flex !important }
        }
        @media (max-width: 480px) {
          .col-sidebar        { display: none !important }
          .mobile-filter-btn  { display: flex !important }
        }
      `}</style>
    </div>
  )
}