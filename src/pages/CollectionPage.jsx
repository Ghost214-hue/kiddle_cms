import { useState, useEffect } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import { useCart, useWishlist } from '../context/CartContext'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const ALL_BOOKS = [
  {
    _id: 'b1', title: 'The Midnight Library', author: 'Matt Haig',
    price: 24.99, salePrice: null, rating: 4.4, reviewCount: 1240,
    ageRange: 'Young Adult', badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'the-midnight-library',
    categories: ['fiction', 'young-adults', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
  },
  {
    _id: 'b2', title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi',
    price: 18.99, salePrice: null, rating: 4.8, reviewCount: 876,
    ageRange: 'Adult', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'before-the-coffee-gets-cold',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
  },
  {
    _id: 'b3', title: 'Where the Crawdads Sing', author: 'Delia Owens',
    price: 23.00, salePrice: null, rating: 4.7, reviewCount: 2100,
    ageRange: 'Adult', badge: null, badgeColor: null,
    slug: 'where-the-crawdads-sing',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
  },
  {
    _id: 'b4', title: "The Lion's Secret Garden", author: 'Clara Moss',
    price: 12.99, salePrice: null, rating: 4.6, reviewCount: 580,
    ageRange: '4-8 Years', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'lions-secret-garden',
    categories: ['storybooks', 'lower-primary'],
    img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&q=80',
  },
  {
    _id: 'b5', title: 'Klara and the Sun', author: 'Kazuo Ishiguro',
    price: 20.00, salePrice: null, rating: 4.6, reviewCount: 940,
    ageRange: 'Adult', badge: null, badgeColor: null,
    slug: 'klara-and-the-sun',
    categories: ['fiction'],
    img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80',
  },
  {
    _id: 'b6', title: 'Stars & Beyond', author: 'J. Hartley',
    price: 9.50, salePrice: 7.50, rating: 4.2, reviewCount: 310,
    ageRange: '9-12 Years', badge: 'Sale', badgeColor: '#b03030',
    slug: 'stars-and-beyond',
    categories: ['storybooks', 'upper-primary', 'science-nature'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=500&q=80',
  },
  {
    _id: 'b7', title: 'The Forest Alphabet', author: 'Nora Fynn',
    price: 8.99, salePrice: null, rating: 4.9, reviewCount: 430,
    ageRange: '0-3 Years', badge: null, badgeColor: null,
    slug: 'forest-alphabet',
    categories: ['storybooks', 'pp1-pp2'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
  {
    _id: 'b8', title: 'Wings of Tomorrow', author: 'Sol Rivera',
    price: 11.00, salePrice: null, rating: 4.3, reviewCount: 195,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'wings-of-tomorrow',
    categories: ['storybooks', 'upper-primary'],
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80',
  },
  {
    _id: 'b9', title: 'The Starless Sea', author: 'Erin Morgenstern',
    price: 22.50, salePrice: null, rating: 4.9, reviewCount: 1540,
    ageRange: 'Adult', badge: 'Bestseller', badgeColor: '#8a6030',
    slug: 'the-starless-sea',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&q=80',
  },
  {
    _id: 'b10', title: 'Wildwood Whispers', author: 'Elena Rosewood',
    price: 16.99, salePrice: null, rating: 4.5, reviewCount: 268,
    ageRange: 'Young Adult', badge: null, badgeColor: null,
    slug: 'wildwood-whispers',
    categories: ['fiction', 'young-adults', 'african-writers'],
    img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=500&q=80',
  },
  {
    _id: 'b11', title: 'Mathematics Grade 7', author: 'KIE Press',
    price: 14.00, salePrice: null, rating: 4.7, reviewCount: 88,
    ageRange: '12-15 Years', badge: null, badgeColor: null,
    slug: 'mathematics-grade-7',
    categories: ['cbc-education', 'junior-secondary', 'mathematics'],
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
  },
  {
    _id: 'b12', title: 'Colours of the Sky', author: 'A. Linden',
    price: 11.00, salePrice: 8.50, rating: 4.8, reviewCount: 340,
    ageRange: '4-8 Years', badge: 'Sale', badgeColor: '#b03030',
    slug: 'colours-of-the-sky',
    categories: ['storybooks', 'lower-primary'],
    img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&q=80',
  },
  {
    _id: 'b13', title: 'Things Fall Apart', author: 'Chinua Achebe',
    price: 19.99, salePrice: null, rating: 4.9, reviewCount: 3200,
    ageRange: 'Adult', badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'things-fall-apart',
    categories: ['fiction', 'african-writers', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80',
  },
  {
    _id: 'b14', title: 'English Workbook Grade 4', author: 'KICD',
    price: 10.00, salePrice: null, rating: 4.4, reviewCount: 210,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'english-workbook-grade-4',
    categories: ['cbc-education', 'upper-primary', 'english'],
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
  },
  {
    _id: 'b15', title: 'Science & Tech Grade 6', author: 'Focus Publishers',
    price: 13.50, salePrice: null, rating: 4.5, reviewCount: 142,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'science-tech-grade-6',
    categories: ['cbc-education', 'upper-primary', 'science-nature', 'science'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=500&q=80',
  },
  {
    _id: 'b16', title: 'Social Studies Grade 3', author: 'Longhorn',
    price: 9.00, salePrice: null, rating: 4.2, reviewCount: 95,
    ageRange: '6-9 Years', badge: null, badgeColor: null,
    slug: 'social-studies-grade-3',
    categories: ['cbc-education', 'lower-primary', 'social-studies'],
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80',
  },
]

const CATEGORY_META = {
  all: { label: 'All Books', emoji: '📚', desc: 'Browse our full collection of over 10,000 titles.' },
  fiction: { label: 'Fiction', emoji: '📖', desc: 'Stories that reshape how you see the world.' },
  'cbc-education': { label: 'CBC Textbooks', emoji: '🏫', desc: 'KICD-approved books for every CBC grade level.' },
  storybooks: { label: 'Storybooks', emoji: '🌟', desc: 'African & world tales for every young reader.' },
  stationery: { label: 'Stationery', emoji: '✏️', desc: 'Pens, notebooks, art supplies & more.' },
  philosophy: { label: 'Philosophy & Life', emoji: '🤔', desc: 'Mindset, growth & personal development.' },
  'young-adults': { label: 'Young Adults', emoji: '🌙', desc: 'Teen fiction & coming-of-age stories.' },
  'african-writers': { label: 'African Writers', emoji: '🌍', desc: 'Local & continental voices, proudly African.' },
  'science-nature': { label: 'Science & Nature', emoji: '🔬', desc: 'Explore the natural world and beyond.' },
  bestsellers: { label: 'Bestsellers', emoji: '⭐', desc: 'Most loved books this month.' },
}

const GRADE_LEVELS = [
  { slug: 'pp1-pp2', label: 'PP1–PP2', icon: '🎨' },
  { slug: 'lower-primary', label: 'Grade 1–3', icon: '📖' },
  { slug: 'upper-primary', label: 'Grade 4–6', icon: '🔬' },
  { slug: 'junior-secondary', label: 'Grade 7–9', icon: '⚗️' },
  { slug: 'senior-school', label: 'Grade 10–12', icon: '🎓' },
]

const SUBJECTS = [
  { slug: 'mathematics', label: 'Mathematics', icon: '📐' },
  { slug: 'english', label: 'English', icon: '📝' },
  { slug: 'kiswahili', label: 'Kiswahili', icon: '🗣️' },
  { slug: 'science', label: 'Science & Tech', icon: '🔬' },
  { slug: 'social-studies', label: 'Social Studies', icon: '🌍' },
  { slug: 'cre', label: 'CRE / IRE', icon: '⛪' },
  { slug: 'creative-arts', label: 'Creative Arts', icon: '🎨' },
  { slug: 'phe', label: 'PE & Health', icon: '🏃' },
]

const AGE_RANGES = ['0-3 Years', '4-8 Years', '6-9 Years', '9-12 Years', '12-15 Years', '15-18 Years', 'Young Adult', 'Adult']
const FORMATS = ['Hardcover', 'Paperback', 'E-book', 'Audiobook']
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
  { value: 'rating', label: 'Top Rated' },
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
  const idx = parts.indexOf('category')
  return idx !== -1 && parts[idx + 1] ? parts[idx + 1] : 'all'
}

// ─────────────────────────────────────────────
// STARS
// ─────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-[11px] ${i <= Math.round(rating) ? 'text-[#a0693a]' : 'text-gray-300'}`}>★</span>
      ))}
    </span>
  )
}

// ─────────────────────────────────────────────
// GRID CARD
// ─────────────────────────────────────────────
function BookGridCard({ book, wishlisted, onWishlist, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov, setHov] = useState(false)
  const price = book.salePrice ?? book.price

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`
        rounded-[18px] overflow-hidden bg-white flex flex-col
        transition-all duration-250 ease-[ease]
        ${hov 
          ? 'border-[rgba(160,105,58,0.35)] shadow-[0_14px_40px_rgba(100,60,20,0.13)] -translate-y-1' 
          : 'border-[rgba(200,170,130,0.22)] shadow-[0_2px_10px_rgba(100,60,20,0.06)] translate-y-0'
        }
        border
      `}
    >
      <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
        <Link to={`/book/${book.slug}`} className="block h-full">
          {!imgErr && book.img ? (
            <img
              src={book.img}
              alt={book.title}
              loading="lazy"
              onError={() => setImgErr(true)}
              className={`
                w-full h-full object-cover block transition-transform duration-400
                ${hov ? 'scale-105' : 'scale-100'}
              `}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f5e8d5] to-[#e8d5b8] flex items-center justify-center text-5xl">
              📖
            </div>
          )}
        </Link>

        {book.badge && (
          <div 
            className="absolute top-2.5 left-2.5 text-white text-[9.5px] font-bold py-[3px] px-2.5 rounded-xl font-['DM_Sans',sans-serif] tracking-[0.04em] shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
            style={{ background: book.badgeColor || '#8a6030' }}
          >
            {book.badge}
          </div>
        )}

        <button
          onClick={e => { e.preventDefault(); onWishlist(book) }}
          className={`
            absolute top-2.5 right-2.5 w-8 h-8 rounded-full border-none cursor-pointer
            flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]
            transition-colors duration-200
            ${wishlisted ? 'bg-[rgba(160,105,58,0.95)]' : 'bg-[rgba(255,255,255,0.88)]'}
          `}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#fff' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
              stroke={wishlisted ? '#fff' : '#a0693a'} strokeWidth="1.4" />
          </svg>
        </button>

        {hov && (
          <Link to={`/book/${book.slug}`} className="absolute inset-0 bg-black/50 flex items-center justify-center no-underline z-10">
            <span className="bg-white text-[#a0693a] py-2 px-4 rounded-[20px] text-xs font-semibold font-['DM_Sans',sans-serif]">
              Quick View
            </span>
          </Link>
        )}
      </div>

      <div className="p-[14px_14px_16px] flex flex-col flex-1">
        {book.ageRange && (
          <div className="inline-block self-start text-[9.5px] font-bold bg-[rgba(160,105,58,0.09)] text-[#9a6030] py-[2px] px-[9px] rounded-lg font-['DM_Sans',sans-serif] mb-[7px]">
            {book.ageRange}
          </div>
        )}

        <Link to={`/book/${book.slug}`} className="no-underline flex-1">
          <div className="font-['Playfair_Display',serif] text-[14px] font-bold text-[#3d2010] leading-[1.3] mb-0.5 line-clamp-2">
            {book.title}
          </div>
        </Link>

        <div className="text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-2">
          {book.author}
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={book.rating} />
          <span className="text-[10.5px] text-[#b09070] font-['DM_Sans',sans-serif]">
            ({book.reviewCount.toLocaleString()})
          </span>
        </div>

        <Link to={`/book/${book.slug}`} className="no-underline mb-3 group">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#a0693a] font-['DM_Sans',sans-serif] transition-all duration-200 group-hover:gap-2">
            <span>View Details</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="#a0693a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-base font-bold text-[#7a4e22] font-['DM_Sans',sans-serif]">
              ${price.toFixed(2)}
            </span>
            {book.salePrice && (
              <span className="text-[11px] text-[#b09070] line-through font-['DM_Sans',sans-serif] ml-1.5">
                ${book.price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(book)}
            className={`
              text-white border-none py-[7px] px-4 rounded-[14px] text-xs font-bold
              font-['DM_Sans',sans-serif] cursor-pointer transition-colors duration-200
              ${hov ? 'bg-[#8a5830]' : 'bg-[#a0693a]'}
            `}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// LIST ROW
// ─────────────────────────────────────────────
function BookListRow({ book, wishlisted, onWishlist, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov, setHov] = useState(false)
  const price = book.salePrice ?? book.price

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`
        flex items-center gap-4 transition-all duration-220 ease-[ease]
        rounded-2xl p-[14px_18px] border
        ${hov 
          ? 'bg-[rgba(255,255,255,0.92)] border-[rgba(160,105,58,0.30)] shadow-[0_6px_24px_rgba(100,60,20,0.10)] translate-x-1' 
          : 'bg-[rgba(255,255,255,0.65)] border-[rgba(200,170,130,0.22)] shadow-none translate-x-0'
        }
      `}
    >
      <Link to={`/book/${book.slug}`} className="flex-shrink-0">
        <div className="w-[60px] h-[84px] rounded-[10px] overflow-hidden bg-gradient-to-br from-[#f5e8d5] to-[#e8d5b8]">
          {!imgErr && book.img ? (
            <img
              src={book.img}
              alt={book.title}
              loading="lazy"
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover block"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/book/${book.slug}`} className="no-underline">
          <div className="font-['Playfair_Display',serif] text-[14px] font-bold text-[#3d2010] mb-0.5 truncate">
            {book.title}
          </div>
        </Link>
        <div className="text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-1.5">
          {book.author}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
          <Stars rating={book.rating} />
          <span className="text-[10.5px] text-[#b09070] font-['DM_Sans',sans-serif]">
            ({book.reviewCount.toLocaleString()})
          </span>
          {book.ageRange && (
            <span className="text-[10px] bg-[rgba(160,105,58,0.09)] py-[2px] px-2 rounded-lg text-[#9a6030] font-['DM_Sans',sans-serif]">
              {book.ageRange}
            </span>
          )}
          {book.badge && (
            <span 
              className="text-[9.5px] font-bold text-white py-[2px] px-2 rounded-lg font-['DM_Sans',sans-serif]"
              style={{ background: book.badgeColor || '#8a6030' }}
            >
              {book.badge}
            </span>
          )}
        </div>

        <Link to={`/book/${book.slug}`} className="no-underline group">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-[#a0693a] font-['DM_Sans',sans-serif] transition-all duration-200 group-hover:gap-2">
            <span>View Details</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="#a0693a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <div className="text-[15px] font-bold text-[#7a4e22] font-['DM_Sans',sans-serif]">
            ${price.toFixed(2)}
          </div>
          {book.salePrice && (
            <div className="text-[10.5px] text-[#b09070] line-through font-['DM_Sans',sans-serif]">
              ${book.price.toFixed(2)}
            </div>
          )}
        </div>
        <button
          onClick={() => onWishlist(book)}
          className={`
            w-[34px] h-[34px] rounded-full border border-[rgba(180,140,90,0.3)]
            flex items-center justify-center cursor-pointer flex-shrink-0
            ${wishlisted ? 'bg-[rgba(160,105,58,0.12)]' : 'bg-[rgba(255,255,255,0.8)]'}
          `}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#a0693a' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
              stroke="#a0693a" strokeWidth="1.4" />
          </svg>
        </button>
        <button
          onClick={() => onAddToCart(book)}
          className="bg-[#a0693a] text-white border-none py-2 px-4 rounded-[14px] text-xs font-bold font-['DM_Sans',sans-serif] cursor-pointer"
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
    <label className="flex items-center gap-2.5 cursor-pointer py-1 text-[12.5px] font-['DM_Sans',sans-serif]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded flex-shrink-0 cursor-pointer accent-[#a0693a]"
      />
      <span className={checked ? 'text-[#5c3d1e] font-semibold' : 'text-[#9a7a5a] font-normal'}>
        {label}
      </span>
    </label>
  )
}

// ─────────────────────────────────────────────
// FILTER SECTION
// ─────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[rgba(180,140,90,0.15)] pb-[14px] mb-[14px]">
      <button onClick={() => setOpen(v => !v)} className="flex items-center justify-between w-full bg-none border-none cursor-pointer pt-0.5 pb-2.5">
        <span className="text-[12.5px] font-bold text-[#5c3d1e] font-['DM_Sans',sans-serif]">
          {title}
        </span>
        <svg 
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
    <div className="rounded-[18px] overflow-hidden bg-white border border-[rgba(200,170,130,0.18)]">
      <div className="aspect-[3/4] bg-gradient-to-r from-[#f0e8dc] via-[#e8ddd0] to-[#f0e8dc] bg-[length:200%_100%] animate-pulse" />
      <div className="p-[14px]">
        <div className="h-3 w-1/2 rounded-md bg-[#ede5d8] mb-2.5" />
        <div className="h-3.5 w-[90%] rounded-md bg-[#ede5d8] mb-1.5" />
        <div className="h-3 w-[70%] rounded-md bg-[#ede5d8]" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function CollectionPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const params = getParams()
  const categorySlug = getCategorySlug()
  
  // Get URL parameters
  const urlFilter = searchParams.get('filter')
  const searchQuery_param = searchParams.get('search')
  
  const meta = CATEGORY_META[categorySlug] || CATEGORY_META['all']

  const [sort, setSort] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedGrades, setSelectedGrades] = useState(params.grade ? [params.grade] : [])
  const [selectedSubjects, setSelectedSubjects] = useState(params.subject ? [params.subject] : [])
  const [selectedAges, setSelectedAges] = useState([])
  const [selectedFormats, setSelectedFormats] = useState([])
  const [mobileFilters, setMobileFilters] = useState(false)

  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [categorySlug, sort, selectedGrades, selectedSubjects, selectedAges, selectedFormats, urlFilter, searchQuery_param])

  // Filter books with URL parameters
  let books = [...ALL_BOOKS]

  // Apply URL filter (new-arrivals or bestsellers)
  if (urlFilter === 'new-arrivals') {
    books = books.filter(b => b.badge === 'New')
  } else if (urlFilter === 'bestsellers') {
    books = books.filter(b => b.categories?.includes('bestsellers') || b.badge?.includes('Bestseller'))
  }

  // Apply search query
  if (searchQuery_param) {
    const query = searchQuery_param.toLowerCase()
    books = books.filter(b => 
      b.title.toLowerCase().includes(query) || 
      b.author.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (categorySlug !== 'all') books = books.filter(b => b.categories?.includes(categorySlug))
  
  // Apply grade filters
  if (selectedGrades.length) books = books.filter(b => selectedGrades.some(g => b.categories?.includes(g)))
  
  // Apply subject filters
  if (selectedSubjects.length) books = books.filter(b => selectedSubjects.some(s => b.categories?.includes(s)))
  
  // Apply age filters
  if (selectedAges.length) books = books.filter(b => selectedAges.includes(b.ageRange))
  
  // Apply format filters
  if (selectedFormats.length) books = books.filter(b => selectedFormats.some(f => b.formats?.includes(f)))
  
  // Apply price filter
  books = books.filter(b => (b.salePrice ?? b.price) >= priceRange[0] && (b.salePrice ?? b.price) <= priceRange[1])

  // Sort
  if (sort === 'price-asc') books = [...books].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
  if (sort === 'price-desc') books = [...books].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
  if (sort === 'rating') books = [...books].sort((a, b) => b.rating - a.rating)

  const ITEMS_PER_PAGE = 12
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE)
  const displayed = books.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function toggle(arr, setArr, val) {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  }

  function resetFilters() {
    setSelectedGrades([])
    setSelectedSubjects([])
    setSelectedAges([])
    setSelectedFormats([])
    setPriceRange([0, 100])
  }

  const hasFilters = selectedGrades.length || selectedSubjects.length ||
    selectedAges.length || selectedFormats.length || priceRange[0] > 0 || priceRange[1] < 100

  const activeChips = [
    ...selectedGrades.map(g => ({ key: g, label: GRADE_LEVELS.find(x => x.slug === g)?.label || g, set: setSelectedGrades, arr: selectedGrades })),
    ...selectedSubjects.map(s => ({ key: s, label: SUBJECTS.find(x => x.slug === s)?.label || s, set: setSelectedSubjects, arr: selectedSubjects })),
    ...selectedAges.map(a => ({ key: a, label: a, set: setSelectedAges, arr: selectedAges })),
  ]

  // Add filter chip for URL filter
  if (urlFilter === 'new-arrivals') {
    activeChips.unshift({ key: 'new-arrivals', label: 'New Arrivals', set: () => {}, arr: [] })
  } else if (urlFilter === 'bestsellers') {
    activeChips.unshift({ key: 'bestsellers', label: 'Bestsellers', set: () => {}, arr: [] })
  }

  // Add search chip if search query exists
  if (searchQuery_param) {
    activeChips.unshift({ key: 'search', label: `Search: "${searchQuery_param}"`, set: () => {}, arr: [] })
  }

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-5">
        <span className="text-[13px] font-bold text-[#3d2010] font-['DM_Sans',sans-serif]">
          Filters
        </span>
        {hasFilters && (
          <button onClick={resetFilters} className="text-[11px] text-[#a0693a] bg-none border-none cursor-pointer font-['DM_Sans',sans-serif] font-semibold">
            Reset all
          </button>
        )}
      </div>

      <FilterSection title="Grade Level">
        <div className="flex flex-col gap-2">
          {GRADE_LEVELS.map(g => (
            <CheckBox key={g.slug} label={`${g.icon} ${g.label}`}
              checked={selectedGrades.includes(g.slug)}
              onChange={() => toggle(selectedGrades, setSelectedGrades, g.slug)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Subject">
        <div className="flex flex-col gap-2">
          {SUBJECTS.map(s => (
            <CheckBox key={s.slug} label={`${s.icon} ${s.label}`}
              checked={selectedSubjects.includes(s.slug)}
              onChange={() => toggle(selectedSubjects, setSelectedSubjects, s.slug)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Age Range" defaultOpen={false}>
        <div className="flex flex-col gap-2">
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
          className="w-full accent-[#a0693a] mb-1.5"
        />
        <div className="flex justify-between text-[11.5px] text-[#9a7a5a] font-['DM_Sans',sans-serif]">
          <span>$0</span><span>${priceRange[1]}+</span>
        </div>
      </FilterSection>

      <FilterSection title="Format" defaultOpen={false}>
        <div className="flex flex-col gap-2">
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

  // Get page title based on filters
  let pageTitle = meta.label
  let pageDesc = meta.desc
  
  if (urlFilter === 'new-arrivals') {
    pageTitle = 'New Arrivals'
    pageDesc = 'Discover our latest additions to the collection'
  } else if (urlFilter === 'bestsellers') {
    pageTitle = 'Bestsellers'
    pageDesc = 'Our most popular and loved books'
  } else if (searchQuery_param) {
    pageTitle = `Search Results for "${searchQuery_param}"`
    pageDesc = `Found ${books.length} books matching your search`
  }

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-20">
      <div className="max-w-[1280px] mx-auto px-[clamp(14px,4vw,40px)] py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-5">
          <Link to="/" className="text-[#9a7a5a] no-underline">Home</Link>
          <span className="text-[#c4a882]">›</span>
          <Link to="/books" className="text-[#9a7a5a] no-underline">Shop</Link>
          {!urlFilter && !searchQuery_param && (
            <>
              <span className="text-[#c4a882]">›</span>
              <span className="text-[#5c3d1e] font-medium">{meta.label}</span>
            </>
          )}
          {urlFilter === 'new-arrivals' && (
            <>
              <span className="text-[#c4a882]">›</span>
              <span className="text-[#5c3d1e] font-medium">New Arrivals</span>
            </>
          )}
          {urlFilter === 'bestsellers' && (
            <>
              <span className="text-[#c4a882]">›</span>
              <span className="text-[#5c3d1e] font-medium">Bestsellers</span>
            </>
          )}
          {searchQuery_param && (
            <>
              <span className="text-[#c4a882]">›</span>
              <span className="text-[#5c3d1e] font-medium">Search</span>
            </>
          )}
        </div>

        <div className="flex gap-[26px] items-start">

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:block w-[232px] flex-shrink-0 bg-[rgba(255,255,255,0.60)] border border-[rgba(200,170,130,0.28)] rounded-[20px] p-5 backdrop-blur-sm sticky top-[88px] max-h-[calc(100vh-108px)] overflow-y-auto">
            <SidebarContent />
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">

            {/* Header row */}
            <div className="flex items-start justify-between flex-wrap gap-2.5 mb-4">
              <div>
                <h1 className="font-['Playfair_Display',serif] text-[clamp(20px,3vw,28px)] font-bold text-[#3d2010] mb-0.5 flex items-center gap-2">
                  {!urlFilter && !searchQuery_param && meta.emoji && <span className="text-[22px]">{meta.emoji}</span>}
                  {urlFilter === 'new-arrivals' && '✨'}
                  {urlFilter === 'bestsellers' && '⭐'}
                  {searchQuery_param && '🔍'}
                  {pageTitle}
                </h1>
                <p className="text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif]">
                  {pageDesc}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile filter button */}
                <button onClick={() => setMobileFilters(true)} className="md:hidden flex items-center gap-1.5 py-2 px-3.5 rounded-[10px] text-xs font-semibold font-['DM_Sans',sans-serif] cursor-pointer transition-colors hover:bg-[rgba(160,105,58,0.1)]">
                  <span className={hasFilters ? 'text-[#7a4e22]' : 'text-[#5c3d1e]'}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M2 4h10M4 7h6M6 10h2" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  Filters{hasFilters && ` (${activeChips.length})`}
                </button>

                {/* Grid/List toggle */}
                <div className="flex bg-[rgba(255,255,255,0.65)] border border-[rgba(180,140,90,0.25)] rounded-[10px] overflow-hidden">
                  {[
                    { mode: 'grid', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /></svg> },
                    { mode: 'list', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3h9M4 7h9M4 11h9M1.5 3h.01M1.5 7h.01M1.5 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg> },
                  ].map(({ mode, svg }) => (
                    <button key={mode} onClick={() => setViewMode(mode)} className={`py-[7px] px-2.5 border-none cursor-pointer transition-all duration-180 ${viewMode === mode ? 'bg-[rgba(160,105,58,0.15)] text-[#a0693a]' : 'bg-transparent text-[#9a7a5a] hover:text-[#a0693a]'}`}>
                      {svg}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select value={sort} onChange={e => setSort(e.target.value)} className="py-2 px-3 text-xs bg-[rgba(255,255,255,0.65)] border border-[rgba(180,140,90,0.28)] rounded-[10px] text-[#5c3d1e] font-['DM_Sans',sans-serif] cursor-pointer outline-none hover:bg-[rgba(255,255,255,0.8)] transition-colors">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {activeChips.map(chip => (
                  <div key={chip.key} className="flex items-center gap-1.5 bg-[rgba(160,105,58,0.10)] border border-[rgba(160,105,58,0.28)] rounded-[14px] py-[3px] px-2.5 text-[11.5px] text-[#7a4e22] font-['DM_Sans',sans-serif]">
                    {chip.label}
                    {chip.key !== 'new-arrivals' && chip.key !== 'bestsellers' && chip.key !== 'search' && (
                      <button onClick={() => chip.set(prev => prev.filter(v => v !== chip.key))} className="bg-none border-none cursor-pointer text-[#a0693a] text-xs leading-none hover:text-red-500 transition-colors">
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Books Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[18px]">
                {[...Array(8)].map((_, i) => <SkeletonGridCard key={i} />)}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-[72px] px-5 bg-[rgba(255,255,255,0.55)] border border-[rgba(200,170,130,0.22)] rounded-[20px]">
                <div className="text-[40px] mb-3.5">📭</div>
                <h3 className="font-['Playfair_Display',serif] text-xl text-[#3d2010] mb-2">No books found</h3>
                <p className="text-[13px] text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-5">Try adjusting your filters.</p>
                <button onClick={resetFilters} className="bg-[#a0693a] text-white border-none py-2.5 px-6 rounded-[20px] cursor-pointer text-[12.5px] font-['DM_Sans',sans-serif] hover:bg-[#8a5830] transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[18px]">
                {displayed.map(book => (
                  <BookGridCard key={book._id} book={book}
                    wishlisted={isWishlisted(book._id)}
                    onWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
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
            {!loading && books.length > 0 && totalPages > 1 && (
              <div className="text-center mt-10">
                <p className="text-[11px] text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-3.5 uppercase tracking-[0.06em]">
                  Showing {Math.min(displayed.length, books.length)} of {books.length} books
                </p>
                <div className="flex justify-center gap-1.5 flex-wrap mb-3.5">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)} className={`py-[7px] px-[13px] rounded-[10px] text-[12.5px] font-['DM_Sans',sans-serif] cursor-pointer border border-[rgba(180,140,90,0.28)] transition-colors ${n === page ? 'bg-[#a0693a] text-white font-bold' : 'bg-[rgba(255,255,255,0.7)] text-[#7a4e22] font-normal hover:bg-[rgba(255,255,255,0.9)]'}`}>
                      {n}
                    </button>
                  ))}
                  {totalPages > 10 && page < totalPages && (
                    <>
                      <span className="py-[7px] px-[13px] text-[#9a7a5a]">...</span>
                      <button onClick={() => setPage(totalPages)} className="py-[7px] px-[13px] rounded-[10px] text-[12.5px] font-['DM_Sans',sans-serif] cursor-pointer border border-[rgba(180,140,90,0.28)] bg-[rgba(255,255,255,0.7)] text-[#7a4e22] hover:bg-[rgba(255,255,255,0.9)] transition-colors">
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilters && (
        <div onClick={() => setMobileFilters(false)} className="fixed inset-0 z-[8990] bg-[rgba(20,10,2,0.38)] backdrop-blur-sm" />
      )}
      <div className={`
        fixed top-0 left-0 bottom-0 z-[9000] w-[290px]
        bg-[rgba(248,244,236,0.98)] backdrop-blur-[24px]
        border-r border-[rgba(20,10,2,0.12)]
        shadow-[12px_0_48px_rgba(20,10,2,0.14)] flex flex-col
        transition-transform duration-340 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${mobileFilters ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between py-[14px] px-5 border-b border-[rgba(180,140,90,0.18)]">
          <span className="font-['Playfair_Display',serif] text-base font-semibold text-[#3d2010]">
            Filters
          </span>
          <button onClick={() => setMobileFilters(false)} className="w-8 h-8 rounded-full border border-[rgba(20,10,2,0.14)] bg-[rgba(255,255,255,0.7)] flex items-center justify-center cursor-pointer text-[13px] text-[#1a1008] hover:bg-[rgba(20,10,2,0.08)] transition-colors">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-5">
          <SidebarContent />
        </div>
        <div className="py-[14px] px-5 border-t border-[rgba(180,140,90,0.15)]">
          <button onClick={() => setMobileFilters(false)} className="w-full py-3 bg-[#a0693a] text-white border-none rounded-[14px] text-[13px] font-bold font-['DM_Sans',sans-serif] cursor-pointer hover:bg-[#8a5830] transition-colors">
            Show {books.length} Results
          </button>
        </div>
      </div>

    </div>
  )
}