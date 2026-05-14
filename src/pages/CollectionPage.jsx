/**
 * CollectionPage.jsx — Kiddle Bookshop
 * Category tabs mirror the Navbar: Books · Stationery · Accessories
 * Filters inside each category are contextual
 */

import { useState, useEffect } from 'react'
import { Link, useSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCart, useWishlist } from '../context/CartContext'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const ALL_PRODUCTS = [
  // ── REGULAR BOOKS (Non-CBC) ─────────────────
  {
    _id: 'b1', title: 'The Midnight Library', author: 'Matt Haig',
    price: 24.99, salePrice: null, reviewCount: 1240,
    ageRange: 'Young Adult', badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'the-midnight-library', type: 'book', isCBC: false, cbcLevel: null,
    categories: ['fiction', 'young-adults', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
  },
  {
    _id: 'b2', title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi',
    price: 18.99, salePrice: null, reviewCount: 876,
    ageRange: 'Adult', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'before-the-coffee-gets-cold', type: 'book', isCBC: false, cbcLevel: null,
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
  },
  {
    _id: 'b3', title: 'Where the Crawdads Sing', author: 'Delia Owens',
    price: 23.00, salePrice: null, reviewCount: 2100,
    ageRange: 'Adult', badge: null, badgeColor: null,
    slug: 'where-the-crawdads-sing', type: 'book', isCBC: false, cbcLevel: null,
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
  },
  {
    _id: 'b4', title: "The Lion's Secret Garden", author: 'Clara Moss',
    price: 12.99, salePrice: null, reviewCount: 580,
    ageRange: '4-8 Years', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'lions-secret-garden', type: 'book', isCBC: false, cbcLevel: null,
    categories: ['storybooks', 'lower-primary'],
    img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&q=80',
  },
  {
    _id: 'b5', title: 'Klara and the Sun', author: 'Kazuo Ishiguro',
    price: 20.00, salePrice: null, reviewCount: 940,
    ageRange: 'Adult', badge: null, badgeColor: null,
    slug: 'klara-and-the-sun', type: 'book', isCBC: false, cbcLevel: null,
    categories: ['fiction'],
    img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80',
  },
  {
    _id: 'b6', title: 'Stars & Beyond', author: 'J. Hartley',
    price: 9.50, salePrice: 7.50, reviewCount: 310,
    ageRange: '9-12 Years', badge: 'Sale', badgeColor: '#b03030',
    slug: 'stars-and-beyond', type: 'book', isCBC: false, cbcLevel: null,
    categories: ['storybooks', 'upper-primary', 'science-nature'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=500&q=80',
  },
  {
    _id: 'b7', title: 'The Forest Alphabet', author: 'Nora Fynn',
    price: 8.99, salePrice: null, reviewCount: 430,
    ageRange: '0-3 Years', badge: null, badgeColor: null,
    slug: 'forest-alphabet', type: 'book', isCBC: false, cbcLevel: null,
    categories: ['storybooks', 'pp1-pp2'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
  {
    _id: 'b8', title: 'Wings of Tomorrow', author: 'Sol Rivera',
    price: 11.00, salePrice: null, reviewCount: 195,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'wings-of-tomorrow', type: 'book', isCBC: false, cbcLevel: null,
    categories: ['storybooks', 'upper-primary'],
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80',
  },
  {
    _id: 'b9', title: 'Things Fall Apart', author: 'Chinua Achebe',
    price: 19.99, salePrice: null, reviewCount: 3200,
    ageRange: 'Adult', badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'things-fall-apart', type: 'book', isCBC: false, cbcLevel: null,
    categories: ['fiction', 'african-writers', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80',
  },
  
  // ── CBC TEXTBOOKS (Kenya Curriculum) ──
  {
    _id: 'cbc1', title: 'Mathematics Learner\'s Book Grade 7', author: 'Kenya Institute of Curriculum Development',
    price: 850, salePrice: 765, reviewCount: 245,
    ageRange: '12-15 Years', badge: 'CBC Approved', badgeColor: '#D97706',
    slug: 'mathematics-learner-grade-7', type: 'book', isCBC: true, cbcLevel: 'junior-secondary',
    categories: ['cbc-education', 'junior-secondary', 'mathematics', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
  },
  {
    _id: 'cbc2', title: 'English Learner\'s Book Grade 4', author: 'KICD',
    price: 750, salePrice: null, reviewCount: 189,
    ageRange: '9-12 Years', badge: 'New Edition', badgeColor: '#2d7a4f',
    slug: 'english-learner-grade-4', type: 'book', isCBC: true, cbcLevel: 'upper-primary',
    categories: ['cbc-education', 'upper-primary', 'english', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
  },
  {
    _id: 'cbc3', title: 'Science & Technology Grade 5', author: 'KIE Press',
    price: 820, salePrice: null, reviewCount: 156,
    ageRange: '9-12 Years', badge: 'KICD Approved', badgeColor: '#D97706',
    slug: 'science-technology-grade-5', type: 'book', isCBC: true, cbcLevel: 'upper-primary',
    categories: ['cbc-education', 'upper-primary', 'science', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=500&q=80',
  },
  {
    _id: 'cbc4', title: 'Kiswahili Kitabu cha Mwanafunzi Grade 3', author: 'KICD',
    price: 680, salePrice: 612, reviewCount: 234,
    ageRange: '6-9 Years', badge: 'Sale', badgeColor: '#b03030',
    slug: 'kiswahili-grade-3', type: 'book', isCBC: true, cbcLevel: 'lower-primary',
    categories: ['cbc-education', 'lower-primary', 'kiswahili', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
  },
  {
    _id: 'cbc5', title: 'Social Studies Grade 6', author: 'Oxford Kenya',
    price: 890, salePrice: null, reviewCount: 167,
    ageRange: '9-12 Years', badge: 'Top Seller', badgeColor: '#8a6030',
    slug: 'social-studies-grade-6', type: 'book', isCBC: true, cbcLevel: 'upper-primary',
    categories: ['cbc-education', 'upper-primary', 'social-studies', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
  },
  {
    _id: 'cbc6', title: 'CRE Learner\'s Book Grade 8', author: 'Moran Publishers',
    price: 780, salePrice: null, reviewCount: 98,
    ageRange: '12-15 Years', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'cre-grade-8', type: 'book', isCBC: true, cbcLevel: 'junior-secondary',
    categories: ['cbc-education', 'junior-secondary', 'cre', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
  },
  {
    _id: 'cbc7', title: 'Pre-Primary 2 Language Activities', author: 'Storymoja',
    price: 550, salePrice: null, reviewCount: 312,
    ageRange: '4-6 Years', badge: 'Bestseller', badgeColor: '#8a6030',
    slug: 'pp2-language-activities', type: 'book', isCBC: true, cbcLevel: 'pp1-pp2',
    categories: ['cbc-education', 'pp1-pp2', 'english', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
  {
    _id: 'cbc8', title: 'Mathematics Revision Guide Grade 9', author: 'Kenya Literature Bureau',
    price: 950, salePrice: 855, reviewCount: 203,
    ageRange: '12-15 Years', badge: 'Sale', badgeColor: '#b03030',
    slug: 'maths-revision-grade-9', type: 'book', isCBC: true, cbcLevel: 'junior-secondary',
    categories: ['cbc-education', 'junior-secondary', 'mathematics', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
  },
  {
    _id: 'cbc9', title: 'Creative Arts Grade 1', author: 'Longhorn Publishers',
    price: 620, salePrice: null, reviewCount: 178,
    ageRange: '6-9 Years', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'creative-arts-grade-1', type: 'book', isCBC: true, cbcLevel: 'lower-primary',
    categories: ['cbc-education', 'lower-primary', 'creative-arts', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&q=80',
  },
  {
    _id: 'cbc10', title: 'Physical Education & Sports Grade 7', author: 'KLB',
    price: 720, salePrice: null, reviewCount: 145,
    ageRange: '12-15 Years', badge: 'CBC Approved', badgeColor: '#D97706',
    slug: 'pe-sports-grade-7', type: 'book', isCBC: true, cbcLevel: 'junior-secondary',
    categories: ['cbc-education', 'junior-secondary', 'phe', 'cbc-textbooks'],
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80',
  },

  // ── STATIONERY ─────────────────────────────
  {
    _id: 's1', title: 'Sakura Pigma Micron Pen Set', author: 'Sakura',
    price: 12.99, salePrice: null, reviewCount: 542,
    badge: 'New', badgeColor: '#2d7a4f',
    slug: 'sakura-micron-pens', type: 'stationery', isCBC: false, cbcLevel: null,
    categories: ['pens', 'art-supplies'],
    img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=500&q=80',
  },
  {
    _id: 's2', title: 'Moleskine Classic Notebook A5', author: 'Moleskine',
    price: 22.00, salePrice: 17.50, reviewCount: 891,
    badge: 'Sale', badgeColor: '#b03030',
    slug: 'moleskine-a5', type: 'stationery', isCBC: false, cbcLevel: null,
    categories: ['notebooks', 'writing'],
    img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80',
  },
  {
    _id: 's3', title: 'Staedtler Mars Pencil Set', author: 'Staedtler',
    price: 8.50, salePrice: null, reviewCount: 330,
    badge: null, badgeColor: null,
    slug: 'staedtler-pencils', type: 'stationery', isCBC: false, cbcLevel: null,
    categories: ['pencils', 'art-supplies'],
    img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80',
  },
  {
    _id: 's4', title: 'Leuchtturm1917 Bullet Journal', author: 'Leuchtturm',
    price: 29.99, salePrice: null, reviewCount: 1120,
    badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'leuchtturm-bullet', type: 'stationery', isCBC: false, cbcLevel: null,
    categories: ['notebooks', 'planning'],
    img: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=500&q=80',
  },
  {
    _id: 's5', title: 'Pilot G2 Gel Pen 12-Pack', author: 'Pilot',
    price: 14.99, salePrice: 11.99, reviewCount: 780,
    badge: 'Sale', badgeColor: '#b03030',
    slug: 'pilot-g2-12pack', type: 'stationery', isCBC: false, cbcLevel: null,
    categories: ['pens', 'writing'],
    img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&q=80',
  },
  {
    _id: 's6', title: 'Rhodia Dotpad A4', author: 'Rhodia',
    price: 9.50, salePrice: null, reviewCount: 412,
    badge: null, badgeColor: null,
    slug: 'rhodia-dotpad', type: 'stationery', isCBC: false, cbcLevel: null,
    categories: ['notebooks', 'art-supplies'],
    img: 'https://images.unsplash.com/photo-1586892478025-2b5472316994?w=500&q=80',
  },

  // ── ACCESSORIES ────────────────────────────
  {
    _id: 'a1', title: 'Genuine Leather Bookmark Set', author: 'Kiddle',
    price: 16.99, salePrice: null, reviewCount: 234,
    badge: 'New', badgeColor: '#2d7a4f',
    slug: 'leather-bookmark-set', type: 'accessory', isCBC: false, cbcLevel: null,
    categories: ['bookmarks', 'gifts'],
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
  },
  {
    _id: 'a2', title: 'Bamboo Book Stand & Holder', author: 'Kiddle',
    price: 34.99, salePrice: 27.99, reviewCount: 178,
    badge: 'Sale', badgeColor: '#b03030',
    slug: 'bamboo-book-stand', type: 'accessory', isCBC: false, cbcLevel: null,
    categories: ['book-stands', 'home'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
  {
    _id: 'a3', title: 'Canvas Book Tote Bag', author: 'Kiddle',
    price: 19.99, salePrice: null, reviewCount: 567,
    badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'canvas-tote-bag', type: 'accessory', isCBC: false, cbcLevel: null,
    categories: ['bags', 'gifts'],
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
  },
  {
    _id: 'a4', title: 'Reading Light Clip-On USB', author: 'Lumio',
    price: 12.50, salePrice: null, reviewCount: 312,
    badge: null, badgeColor: null,
    slug: 'reading-light-usb', type: 'accessory', isCBC: false, cbcLevel: null,
    categories: ['reading-aids', 'home'],
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80',
  },
  {
    _id: 'a5', title: 'Linen Book Sleeve 13"', author: 'Kiddle',
    price: 22.00, salePrice: null, reviewCount: 145,
    badge: 'New', badgeColor: '#2d7a4f',
    slug: 'linen-book-sleeve', type: 'accessory', isCBC: false, cbcLevel: null,
    categories: ['bags', 'gifts'],
    img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&q=80',
  },
]

// ── Top-level category tabs (mirrors Navbar exactly) ──
const MAIN_CATEGORIES = [
  { id: 'all',         label: 'All',         emoji: '🛍️',  types: ['book', 'stationery', 'accessory'] },
  { id: 'books',       label: 'Books',       emoji: '📚',  types: ['book'], isCBC: false },
  { id: 'cbc-books',   label: 'CBC Textbooks', emoji: '📘', types: ['book'], isCBC: true },
  { id: 'stationery',  label: 'Stationery',  emoji: '✏️',   types: ['stationery'] },
  { id: 'accessories', label: 'Accessories', emoji: '🎒',  types: ['accessory']  },
]

// ── Sub-filters per category ──
const BOOK_GENRES = [
  { slug: 'fiction',          label: 'Fiction'           },
  { slug: 'storybooks',       label: 'Storybooks'        },
  { slug: 'african-writers',  label: 'African Writers'   },
  { slug: 'bestsellers',      label: 'Bestsellers'       },
]

const CBC_SUBJECTS = [
  { slug: 'mathematics',     label: 'Mathematics'    },
  { slug: 'english',         label: 'English'        },
  { slug: 'kiswahili',       label: 'Kiswahili'      },
  { slug: 'science',         label: 'Science'        },
  { slug: 'social-studies',  label: 'Social Studies' },
  { slug: 'cre',             label: 'CRE'            },
  { slug: 'creative-arts',   label: 'Creative Arts'  },
  { slug: 'phe',             label: 'PE & Sports'    },
]

const CBC_LEVELS = [
  { slug: 'pp1-pp2',          label: 'PP1–PP2',     icon: '🎨' },
  { slug: 'lower-primary',    label: 'Grade 1–3',   icon: '📖' },
  { slug: 'upper-primary',    label: 'Grade 4–6',   icon: '🔬' },
  { slug: 'junior-secondary', label: 'Grade 7–9',   icon: '⚗️' },
]

const STATIONERY_TYPES = [
  { slug: 'notebooks',   label: 'Notebooks & Journals' },
  { slug: 'pens',        label: 'Pens & Markers'       },
  { slug: 'pencils',     label: 'Pencils'              },
  { slug: 'art-supplies',label: 'Art Supplies'         },
  { slug: 'planning',    label: 'Planning'             },
  { slug: 'writing',     label: 'Writing'              },
]

const ACCESSORY_TYPES = [
  { slug: 'bookmarks',   label: 'Bookmarks'     },
  { slug: 'book-stands', label: 'Book Stands'   },
  { slug: 'bags',        label: 'Bags & Sleeves'},
  { slug: 'reading-aids',label: 'Reading Aids'  },
  { slug: 'gifts',       label: 'Gifts'         },
  { slug: 'home',        label: 'Home & Decor'  },
]

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'        },
  { value: 'price-asc',  label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
  { value: 'newest',     label: 'Newest'          },
]

// ─────────────────────────────────────────────
// SMALL SHARED COMPONENTS
// ─────────────────────────────────────────────
function CheckBox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer py-1 text-[12.5px]"
      style={{ color: checked ? '#5c3d1e' : '#9a7a5a', fontFamily: "'DM Sans',sans-serif", fontWeight: checked ? '600' : '400' }}>
      <div onClick={onChange} className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all duration-150"
        style={{
          border: `1.5px solid ${checked ? '#a0693a' : 'rgba(180,140,90,0.4)'}`,
          background: checked ? '#a0693a' : 'rgba(255,255,255,0.7)',
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

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[rgba(180,140,90,0.15)] pb-3.5 mb-3.5">
      <button onClick={() => setOpen(v => !v)} className="flex items-center justify-between w-full bg-none border-none cursor-pointer pt-0.5 pb-2.5">
        <span className="text-[12.5px] font-bold text-[#5c3d1e] font-['DM_Sans',sans-serif]">
          {title}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
          <path d="M2 4l4 4 4-4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && children}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-white border border-[rgba(200,170,130,0.18)]">
      <div className="aspect-[3/4] bg-gradient-to-r from-[#f0e8dc] via-[#e8ddd0] to-[#f0e8dc] bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]"/>
      <div className="p-3.5">
        <div className="h-[11px] w-[55%] rounded bg-[#ede5d8] mb-2.5"/>
        <div className="h-[14px] w-[88%] rounded bg-[#ede5d8] mb-1.5"/>
        <div className="h-[11px] w-[65%] rounded bg-[#ede5d8]"/>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PRODUCT GRID CARD (without rating)
// ─────────────────────────────────────────────
function ProductCard({ item, wishlisted, onWishlist, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov, setHov] = useState(false)
  const price = item.salePrice ?? item.price
  const isKES = item.price > 100 // If price > 100, assume it's KES

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rounded-xl overflow-hidden bg-white flex flex-col transition-all duration-200"
      style={{
        border: `1px solid ${hov ? 'rgba(160,105,58,0.35)' : 'rgba(200,170,130,0.20)'}`,
        boxShadow: hov ? '0 14px 40px rgba(100,60,20,0.13)' : '0 2px 10px rgba(100,60,20,0.05)',
        transform: hov ? 'translateY(-4px)' : 'none',
      }}
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
        <Link to={`/${item.type === 'book' ? 'book' : 'product'}/${item.slug}`} className="block h-full">
          {!imgErr && item.img ? (
            <img src={item.img} alt={item.title} loading="lazy"
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover block transition-transform duration-400"
              style={{ transform: hov ? 'scale(1.05)' : 'scale(1)' }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f5e8d5] to-[#e8d5b8] flex items-center justify-center text-5xl">
              {item.type === 'book' ? '📖' : item.type === 'stationery' ? '✏️' : '🎒'}
            </div>
          )}
        </Link>

        {item.badge && (
          <div className="absolute top-2.5 left-2.5 text-[9.5px] font-bold py-0.5 px-2.5 rounded-full text-white shadow"
            style={{ background: item.badgeColor || '#8a6030', fontFamily: "'DM Sans',sans-serif" }}>
            {item.badge}
          </div>
        )}

        <button
          onClick={e => { e.preventDefault(); onWishlist(item) }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full border-none cursor-pointer flex items-center justify-center shadow transition-colors duration-200"
          style={{
            background: wishlisted ? 'rgba(160,105,58,0.95)' : 'rgba(255,255,255,0.90)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#fff' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
              stroke={wishlisted ? '#fff' : '#a0693a'} strokeWidth="1.4"/>
          </svg>
        </button>

        {hov && (
          <Link to={`/${item.type === 'book' ? 'book' : 'product'}/${item.slug}`}
            className="absolute inset-0 bg-black/45 flex items-center justify-center no-underline z-10">
            <span className="bg-white text-[#a0693a] py-2 px-4.5 rounded-full text-[11.5px] font-semibold font-['DM_Sans',sans-serif]">
              Quick View
            </span>
          </Link>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 pb-4 flex flex-col flex-1">
        {(item.ageRange || item.type !== 'book') && (
          <div className="inline-block self-start text-[9.5px] font-bold bg-[rgba(160,105,58,0.09)] text-[#9a6030] py-0.5 px-2 rounded mb-1.5 font-['DM_Sans',sans-serif]">
            {item.ageRange || (item.type === 'stationery' ? 'Stationery' : 'Accessory')}
          </div>
        )}

        <Link to={`/${item.type === 'book' ? 'book' : 'product'}/${item.slug}`} className="no-underline flex-1">
          <div className="font-['Playfair_Display',serif] text-sm font-bold text-[#3d2010] leading-tight mb-0.5 line-clamp-2">
            {item.title}
          </div>
        </Link>

        <div className="text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-1">
          {item.author}
        </div>

        <div className="text-[10.5px] text-[#b09070] font-['DM_Sans',sans-serif] mb-3">
          {item.reviewCount.toLocaleString()} reviews
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-base font-bold text-[#7a4e22] font-['DM_Sans',sans-serif]">
              {isKES ? `KES ${price.toFixed(2)}` : `$${price.toFixed(2)}`}
            </span>
            {item.salePrice && (
              <span className="text-[11px] text-[#b09070] line-through font-['DM_Sans',sans-serif] ml-1.5">
                {isKES ? `KES ${item.price.toFixed(2)}` : `$${item.price.toFixed(2)}`}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(item)}
            className="border-none text-white py-1.5 px-4 rounded-xl text-xs font-bold font-['DM_Sans',sans-serif] cursor-pointer transition-colors duration-200"
            style={{ background: hov ? '#8a5830' : '#a0693a' }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// LIST ROW (without rating)
// ─────────────────────────────────────────────
function ProductListRow({ item, wishlisted, onWishlist, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov, setHov] = useState(false)
  const price = item.salePrice ?? item.price
  const isKES = item.price > 100

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center gap-4 rounded-xl p-3.5 transition-all duration-200"
      style={{
        background: hov ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)',
        border: `1px solid ${hov ? 'rgba(160,105,58,0.30)' : 'rgba(200,170,130,0.20)'}`,
        boxShadow: hov ? '0 6px 24px rgba(100,60,20,0.10)' : 'none',
        transform: hov ? 'translateX(4px)' : 'none',
      }}
    >
      <div className="w-[60px] h-[84px] rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#f5e8d5] to-[#e8d5b8]">
        {!imgErr && item.img ? (
          <img src={item.img} alt={item.title} loading="lazy" onError={() => setImgErr(true)}
            className="w-full h-full object-cover block"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {item.type === 'book' ? '📖' : item.type === 'stationery' ? '✏️' : '🎒'}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-['Playfair_Display',serif] text-sm font-bold text-[#3d2010] mb-0.5 truncate">
          {item.title}
        </div>
        <div className="text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-1">
          {item.author}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10.5px] text-[#b09070] font-['DM_Sans',sans-serif]">
            ({item.reviewCount.toLocaleString()} reviews)
          </span>
          {item.ageRange && (
            <span className="text-[10px] bg-[rgba(160,105,58,0.09)] py-0.5 px-2 rounded text-[#9a6030] font-['DM_Sans',sans-serif]">
              {item.ageRange}
            </span>
          )}
          {item.badge && (
            <span className="text-[9.5px] font-bold py-0.5 px-2 rounded text-white"
              style={{ background: item.badgeColor || '#8a6030', fontFamily: "'DM Sans',sans-serif" }}>
              {item.badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <div className="text-[15px] font-bold text-[#7a4e22] font-['DM_Sans',sans-serif]">
            {isKES ? `KES ${price.toFixed(2)}` : `$${price.toFixed(2)}`}
          </div>
          {item.salePrice && (
            <div className="text-[10.5px] text-[#b09070] line-through font-['DM_Sans',sans-serif]">
              {isKES ? `KES ${item.price.toFixed(2)}` : `$${item.price.toFixed(2)}`}
            </div>
          )}
        </div>
        <button onClick={() => onWishlist(item)} className="w-[34px] h-[34px] rounded-full border border-[rgba(180,140,90,0.3)] flex items-center justify-center cursor-pointer flex-shrink-0"
          style={{ background: wishlisted ? 'rgba(160,105,58,0.12)' : 'rgba(255,255,255,0.8)' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#a0693a' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" stroke="#a0693a" strokeWidth="1.4"/>
          </svg>
        </button>
        <button onClick={() => onAddToCart(item)} className="bg-[#a0693a] text-white border-none py-2 px-4 rounded-xl text-xs font-bold font-['DM_Sans',sans-serif] cursor-pointer">
          + Add
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// SEARCH BAR COMPONENT
// ─────────────────────────────────────────────
function SearchBar({ searchQuery, onSearchChange, onClear }) {
  return (
    <div className="relative flex-1 max-w-md">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search books, stationery, accessories..."
        className="w-full py-2 px-4 pr-10 rounded-full border border-[rgba(180,140,90,0.28)] bg-white/65 text-sm text-[#3d2010] placeholder:text-[#9a7a5a] outline-none focus:border-[#a0693a] transition-colors"
      />
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a7a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {searchQuery && (
        <button
          onClick={onClear}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-[#9a7a5a] hover:text-[#a0693a]"
        >
          ✕
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// PRICE RANGE FILTER
// ─────────────────────────────────────────────
function PriceRangeFilter({ priceRange, setPriceRange, isKES }) {
  const maxPrice = isKES ? 5000 : 100
  
  return (
    <FilterSection title="Price Range">
      <input 
        type="range" 
        min="0" 
        max={maxPrice} 
        value={priceRange[1]}
        onChange={e => { setPriceRange([0, Number(e.target.value)]); }}
        className="w-full accent-[#a0693a] mb-1.5"
      />
      <div className="flex justify-between text-[11.5px] text-[#9a7a5a] font-['DM_Sans',sans-serif]">
        <span>{isKES ? 'KES 0' : '$0'}</span>
        <span>{isKES ? `KES ${priceRange[1]}+` : `$${priceRange[1]}+`}</span>
      </div>
    </FilterSection>
  )
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // ── Determine active main category from URL ──
  const pathParts = location.pathname.split('/')
  const categoryInPath = pathParts.includes('category') ? pathParts[pathParts.indexOf('category') + 1] : null
  
  const initialMain = categoryInPath === 'stationery' ? 'stationery'
    : categoryInPath === 'accessories' ? 'accessories'
    : categoryInPath === 'cbc-education' || categoryInPath === 'cbc-books' ? 'cbc-books'
    : 'books'

  const [mainCat, setMainCat] = useState(initialMain)
  const [sort, setSort] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [priceRange, setPriceRange] = useState([0, 5000]) // For KES
  const [selectedSubs, setSelectedSubs] = useState([])
  const [selectedGrades, setSelectedGrades] = useState([])
  const [mobileFilters, setMobileFilters] = useState(false)

  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const urlFilter = searchParams.get('filter') || ''
  const searchQuery = searchParams.get('search') || ''

  // Pre-select filter from URL
  useEffect(() => {
    if (urlFilter === 'bestsellers' && !selectedSubs.includes('bestsellers')) {
      setSelectedSubs(['bestsellers'])
    }
  }, [urlFilter])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [mainCat, sort, selectedSubs, selectedGrades, priceRange, urlFilter, searchQuery])

  // Reset sub-filters when switching main category
  function switchMainCat(id) {
    setMainCat(id)
    setSelectedSubs([])
    setSelectedGrades([])
    setPriceRange(id === 'cbc-books' ? [0, 5000] : [0, 100])
    setPage(1)
    
    if (id === 'stationery') navigate('/category/stationery')
    else if (id === 'accessories') navigate('/category/accessories')
    else if (id === 'cbc-books') navigate('/category/cbc-education')
    else navigate('/books')
  }

  // Update search param
  const updateSearch = (query) => {
    if (query) {
      searchParams.set('search', query)
    } else {
      searchParams.delete('search')
    }
    setSearchParams(searchParams)
    setPage(1)
  }

  // ── Filter products ──
  let products = [...ALL_PRODUCTS]

  // Main category type filter
  const activeCatDef = MAIN_CATEGORIES.find(c => c.id === mainCat) || MAIN_CATEGORIES[0]
  
  if (mainCat === 'cbc-books') {
    products = products.filter(p => p.type === 'book' && p.isCBC === true)
  } else if (mainCat === 'books') {
    products = products.filter(p => p.type === 'book' && p.isCBC === false)
  } else if (mainCat !== 'all') {
    products = products.filter(p => activeCatDef.types?.includes(p.type))
  }

  // URL special filters
  if (urlFilter === 'new-arrivals') products = products.filter(p => p.badge === 'New')
  if (urlFilter === 'bestsellers') products = products.filter(p => p.categories?.includes('bestsellers') || p.badge?.includes('Bestseller'))

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    products = products.filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
  }

  // Sub-filters
  if (selectedSubs.length) products = products.filter(p => selectedSubs.some(s => p.categories?.includes(s)))
  if (selectedGrades.length) products = products.filter(p => selectedGrades.some(g => p.cbcLevel === g))

  // Price
  products = products.filter(p => (p.salePrice ?? p.price) >= priceRange[0] && (p.salePrice ?? p.price) <= priceRange[1])

  // Sort
  if (sort === 'price-asc') products = [...products].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
  if (sort === 'price-desc') products = [...products].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))

  const ITEMS_PER_PAGE = 12
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const displayed = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function toggle(arr, setArr, val) {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
    setPage(1)
  }

  function resetFilters() {
    setSelectedSubs([])
    setSelectedGrades([])
    setPriceRange(mainCat === 'cbc-books' ? [0, 5000] : [0, 100])
    setPage(1)
  }

  const hasFilters = selectedSubs.length || selectedGrades.length || 
    (mainCat === 'cbc-books' ? priceRange[1] < 5000 : priceRange[1] < 100)

  // ── Contextual sub-filter list ──
  const subFilters = mainCat === 'stationery' ? STATIONERY_TYPES
    : mainCat === 'accessories' ? ACCESSORY_TYPES
    : mainCat === 'cbc-books' ? CBC_SUBJECTS
    : BOOK_GENRES

  const subFilterTitle = mainCat === 'stationery' ? 'Type'
    : mainCat === 'accessories' ? 'Type'
    : mainCat === 'cbc-books' ? 'Subject'
    : 'Genre'

  const isKES = mainCat === 'cbc-books'

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

      <FilterSection title={subFilterTitle}>
        <div className="flex flex-col gap-2">
          {subFilters.map(f => (
            <CheckBox key={f.slug} label={f.label}
              checked={selectedSubs.includes(f.slug)}
              onChange={() => toggle(selectedSubs, setSelectedSubs, f.slug)}
            />
          ))}
        </div>
      </FilterSection>

      {/* CBC Grade Level filter */}
      {mainCat === 'cbc-books' && (
        <FilterSection title="Grade Level" defaultOpen={false}>
          <div className="flex flex-col gap-2">
            {CBC_LEVELS.map(g => (
              <CheckBox key={g.slug} label={`${g.icon} ${g.label}`}
                checked={selectedGrades.includes(g.slug)}
                onChange={() => toggle(selectedGrades, setSelectedGrades, g.slug)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} isKES={isKES} />
    </>
  )

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-20">
      <style>{`
        @keyframes shimmer { 0% { background-position:-200% 0 } 100% { background-position:200% 0 } }
        .books-grid { display:grid; gap:18px; grid-template-columns:repeat(3,1fr) }
        @media(min-width:1200px) { .books-grid { grid-template-columns:repeat(4,1fr) } }
        @media(max-width:900px)  { .books-grid { grid-template-columns:repeat(2,1fr) } }
        @media(max-width:540px)  { .books-grid { grid-template-columns:1fr } }
        @media(max-width:768px)  { .col-sidebar { display:none!important } .mob-filter-btn { display:flex!important } }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto px-[clamp(14px,4vw,40px)] py-6">

        {/* ── TOP CATEGORY TABS ── */}
        <div className="flex gap-2 flex-wrap mb-7 border-b border-[rgba(180,140,90,0.18)] pb-4">
          {MAIN_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => switchMainCat(cat.id)}
              className="flex items-center gap-1.5 py-2 px-5 rounded-full cursor-pointer transition-all duration-200 text-[13.5px] font-['DM_Sans',sans-serif]"
              style={{
                background: mainCat === cat.id ? '#a0693a' : 'rgba(255,255,255,0.65)',
                border: `1px solid ${mainCat === cat.id ? '#a0693a' : 'rgba(180,140,90,0.28)'}`,
                color: mainCat === cat.id ? '#fff' : '#5c3d1e',
                fontWeight: mainCat === cat.id ? '700' : '500',
                boxShadow: mainCat === cat.id ? '0 4px 16px rgba(160,105,58,0.28)' : 'none',
              }}
            >
              <span className="text-[15px]">{cat.emoji}</span>
              {cat.label}
              <span className="text-[10px] font-bold py-0.5 px-1.5 rounded-full"
                style={{
                  background: mainCat === cat.id ? 'rgba(255,255,255,0.25)' : 'rgba(160,105,58,0.10)',
                  color: mainCat === cat.id ? '#fff' : '#a0693a',
                }}>
                {ALL_PRODUCTS.filter(p => {
                  if (cat.id === 'all') return true
                  if (cat.id === 'cbc-books') return p.type === 'book' && p.isCBC === true
                  if (cat.id === 'books') return p.type === 'book' && p.isCBC === false
                  return cat.types?.includes(p.type)
                }).length}
              </span>
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-5">
          <Link to="/" className="text-[#9a7a5a] no-underline">Home</Link>
          <span className="text-[#c4a882]">›</span>
          <Link to="/books" className="text-[#9a7a5a] no-underline">Shop</Link>
          <span className="text-[#c4a882]">›</span>
          <span className="text-[#5c3d1e] font-medium">
            {urlFilter === 'new-arrivals' ? 'New Arrivals' : urlFilter === 'bestsellers' ? 'Bestsellers' : activeCatDef.label}
          </span>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={updateSearch}
            onClear={() => updateSearch('')}
          />
        </div>

        <div className="flex gap-6 items-start">

          {/* ════ DESKTOP SIDEBAR ════ */}
          <aside className="col-sidebar w-[232px] flex-shrink-0 hidden md:block bg-white/60 border border-[rgba(200,170,130,0.28)] rounded-xl p-5 backdrop-blur-md sticky top-22 max-h-[calc(100vh-108px)] overflow-y-auto">
            <SidebarContent/>
          </aside>

          {/* ════ MAIN ════ */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-start justify-between flex-wrap gap-2.5 mb-4">
              <div>
                <h1 className="font-['Playfair_Display',serif] text-[clamp(20px,3vw,28px)] font-bold text-[#3d2010] mb-0.5 flex items-center gap-2">
                  <span className="text-[22px]">{activeCatDef.emoji}</span>
                  {urlFilter === 'new-arrivals' ? '✨ New Arrivals' : urlFilter === 'bestsellers' ? '⭐ Bestsellers' : activeCatDef.label}
                </h1>
                <p className="text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif]">
                  {products.length} items
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile filter btn */}
                <button className="mob-filter-btn hidden md:hidden items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-semibold font-['DM_Sans',sans-serif] cursor-pointer"
                  onClick={() => setMobileFilters(true)}
                  style={{
                    background: hasFilters ? 'rgba(160,105,58,0.12)' : 'rgba(255,255,255,0.65)',
                    border: `1px solid ${hasFilters ? 'rgba(160,105,58,0.35)' : 'rgba(180,140,90,0.28)'}`,
                    color: hasFilters ? '#7a4e22' : '#5c3d1e',
                  }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4h10M4 7h6M6 10h2" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Filters{hasFilters ? ` (${selectedSubs.length + selectedGrades.length})` : ''}
                </button>

                {/* Grid/List toggle */}
                <div className="flex bg-white/65 border border-[rgba(180,140,90,0.25)] rounded-lg overflow-hidden">
                  {[
                    { mode: 'grid', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
                    { mode: 'list', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3h9M4 7h9M4 11h9M1.5 3h.01M1.5 7h.01M1.5 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  ].map(({ mode, svg }) => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      className="py-1.5 px-2.5 border-none cursor-pointer transition-all duration-150"
                      style={{
                        background: viewMode === mode ? 'rgba(160,105,58,0.15)' : 'transparent',
                        color: viewMode === mode ? '#a0693a' : '#9a7a5a',
                      }}>
                      {svg}
                    </button>
                  ))}
                </div>

                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="py-2 px-3 text-xs bg-white/65 border border-[rgba(180,140,90,0.28)] rounded-lg text-[#5c3d1e] font-['DM_Sans',sans-serif] cursor-pointer outline-none">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Active chips */}
            {(selectedSubs.length > 0 || selectedGrades.length > 0) && (
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {[
                  ...selectedSubs.map(s => ({ key: s, label: [...subFilters].find(x => x.slug === s)?.label || s, set: setSelectedSubs, arr: selectedSubs })),
                  ...selectedGrades.map(g => ({ key: g, label: CBC_LEVELS.find(x => x.slug === g)?.label || g, set: setSelectedGrades, arr: selectedGrades })),
                ].map(chip => (
                  <div key={chip.key} className="flex items-center gap-1 bg-[rgba(160,105,58,0.10)] border border-[rgba(160,105,58,0.28)] rounded-xl py-0.5 px-2.5 text-[11.5px] text-[#7a4e22] font-['DM_Sans',sans-serif]">
                    {chip.label}
                    <button onClick={() => chip.set(prev => prev.filter(v => v !== chip.key))}
                      className="bg-none border-none cursor-pointer text-[#a0693a] text-xs leading-none">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div className="books-grid">{[...Array(8)].map((_, i) => <SkeletonCard key={i}/>)}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-18 px-5 bg-white/55 border border-[rgba(200,170,130,0.22)] rounded-xl">
                <div className="text-4xl mb-3.5">📭</div>
                <h3 className="font-['Playfair_Display',serif] text-xl text-[#3d2010] mb-2">Nothing found</h3>
                <p className="text-[13px] text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-5">Try adjusting your filters.</p>
                <button onClick={resetFilters} className="bg-[#a0693a] text-white border-none py-2.5 px-6 rounded-full cursor-pointer text-[12.5px] font-['DM_Sans',sans-serif]">
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="books-grid">
                {displayed.map(item => (
                  <ProductCard key={item._id} item={item}
                    wishlisted={isWishlisted(item._id)}
                    onWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {displayed.map(item => (
                  <ProductListRow key={item._id} item={item}
                    wishlisted={isWishlisted(item._id)}
                    onWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="text-center mt-10">
                <p className="text-[11px] text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-3.5 uppercase tracking-wide">
                  Page {page} of {totalPages}
                </p>
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)}
                      className="py-1.5 px-3 rounded-lg text-[12.5px] font-['DM_Sans',sans-serif] cursor-pointer"
                      style={{
                        background: n === page ? '#a0693a' : 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(180,140,90,0.28)',
                        color: n === page ? '#fff' : '#7a4e22',
                        fontWeight: n === page ? '700' : '400',
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div onClick={() => setMobileFilters(false)} className="fixed inset-0 z-[8990] bg-black/40 backdrop-blur-sm"/>
      )}
      <div className="fixed top-0 left-0 bottom-0 z-[9000] w-[290px] bg-[rgba(248,244,236,0.98)] backdrop-blur-md border-r border-[rgba(20,10,2,0.12)] shadow-2xl flex flex-col transition-transform duration-300"
        style={{ transform: mobileFilters ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="flex items-center justify-between py-4 px-5 pb-3.5 border-b border-[rgba(180,140,90,0.18)]">
          <span className="font-['Playfair_Display',serif] text-base font-semibold text-[#3d2010]">Filters</span>
          <button onClick={() => setMobileFilters(false)} className="w-8 h-8 rounded-full border border-[rgba(20,10,2,0.14)] bg-white/70 flex items-center justify-center cursor-pointer text-[13px] text-[#1a1008]">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-5">
          <SidebarContent/>
        </div>
        <div className="py-3.5 px-5 border-t border-[rgba(180,140,90,0.15)]">
          <button onClick={() => setMobileFilters(false)} className="w-full py-3 bg-[#a0693a] text-white border-none rounded-xl text-[13px] font-bold font-['DM_Sans',sans-serif] cursor-pointer">
            Show {products.length} Results
          </button>
        </div>
      </div>
    </div>
  )
}