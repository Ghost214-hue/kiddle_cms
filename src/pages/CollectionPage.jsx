/**
 * CollectionPage.jsx — Kiddle Bookshop
 * Fetches Books, CBC Books, Stationery & Accessories from Sanity CMS.
 * Falls back to mock data automatically when Sanity has no content yet.
 */

import { useState, useEffect } from 'react'
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useCart, useWishlist } from '../context/CartContext'
import { fetchAllProducts } from '../lib/queries'
import { formatPrice } from '../utils/formatPrice'

const MAIN_CATEGORIES = [
  { id:'all',         label:'All',           emoji:'🛍️', types:['book','stationery','accessory'] },
  { id:'books',       label:'Books',         emoji:'📚', types:['book'], isCBC:false },
  { id:'cbc-books',   label:'CBC Textbooks', emoji:'📘', types:['book'], isCBC:true  },
  { id:'stationery',  label:'Stationery',    emoji:'✏️', types:['stationery'] },
  { id:'accessories', label:'Accessories',   emoji:'🎒', types:['accessory'] },
]

const BOOK_GENRES = [
  { slug:'fiction',         label:'Fiction'         },
  { slug:'storybooks',      label:'Storybooks'      },
  { slug:'african-writers', label:'African Writers' },
  { slug:'bestsellers',     label:'Bestsellers'     },
]
const CBC_SUBJECTS = [
  { slug:'mathematics',    label:'Mathematics'    },
  { slug:'english',        label:'English'        },
  { slug:'kiswahili',      label:'Kiswahili'      },
  { slug:'science',        label:'Science'        },
  { slug:'social-studies', label:'Social Studies' },
  { slug:'cre',            label:'CRE'            },
  { slug:'creative-arts',  label:'Creative Arts'  },
  { slug:'phe',            label:'PE & Sports'    },
]
const CBC_LEVELS = [
  { slug:'pp1-pp2',          label:'PP1–PP2',   icon:'🎨' },
  { slug:'lower-primary',    label:'Grade 1–3', icon:'📖' },
  { slug:'upper-primary',    label:'Grade 4–6', icon:'🔬' },
  { slug:'junior-secondary', label:'Grade 7–9', icon:'⚗️' },
]
const STATIONERY_TYPES = [
  { slug:'notebooks',    label:'Notebooks & Journals' },
  { slug:'pens',         label:'Pens & Markers'       },
  { slug:'pencils',      label:'Pencils'              },
  { slug:'art-supplies', label:'Art Supplies'         },
  { slug:'planning',     label:'Planning'             },
  { slug:'writing',      label:'Writing'              },
]
const ACCESSORY_TYPES = [
  { slug:'bookmarks',    label:'Bookmarks'      },
  { slug:'book-stands',  label:'Book Stands'    },
  { slug:'bags',         label:'Bags & Sleeves' },
  { slug:'reading-aids', label:'Reading Aids'   },
  { slug:'gifts',        label:'Gifts'          },
  { slug:'home',         label:'Home & Decor'   },
]
const SORT_OPTIONS = [
  { value:'featured',   label:'Featured'        },
  { value:'price-asc',  label:'Price: Low–High' },
  { value:'price-desc', label:'Price: High–Low' },
  { value:'newest',     label:'Newest'          },
]

const PRICE_MAX = 5000
const MOCK_PRODUCTS = []

// ─────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────
function CheckBox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer py-1 text-[12.5px]"
      style={{ color: checked ? '#5c3d1e' : '#9a7a5a', fontFamily:"'DM Sans',sans-serif", fontWeight: checked ? '600' : '400' }}>
      <div onClick={onChange} className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all duration-150"
        style={{ border:`1.5px solid ${checked ? '#a0693a' : 'rgba(180,140,90,0.4)'}`, background: checked ? '#a0693a' : 'rgba(255,255,255,0.7)' }}>
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
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full bg-none border-none cursor-pointer pt-0.5 pb-2.5">
        <span className="text-[12.5px] font-bold text-[#5c3d1e]">{title}</span>
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

function ProductCard({ item, wishlisted, onWishlist, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov, setHov] = useState(false)
  const price = item.salePrice ?? item.price

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="rounded-xl overflow-hidden bg-white flex flex-col transition-all duration-200"
      style={{
        border:`1px solid ${hov ? 'rgba(160,105,58,0.35)' : 'rgba(200,170,130,0.20)'}`,
        boxShadow: hov ? '0 14px 40px rgba(100,60,20,0.13)' : '0 2px 10px rgba(100,60,20,0.05)',
        transform: hov ? 'translateY(-4px)' : 'none',
      }}>
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
        <Link to={`/${item.type === 'book' ? 'book' : 'product'}/${item.slug}`} className="block h-full">
          {!imgErr && item.img ? (
            <img src={item.img} alt={item.title} loading="lazy" onError={() => setImgErr(true)}
              className="w-full h-full object-cover block transition-transform duration-400"
              style={{ transform: hov ? 'scale(1.05)' : 'scale(1)' }}/>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f5e8d5] to-[#e8d5b8] flex items-center justify-center text-5xl">
              {item.type === 'book' ? '📖' : item.type === 'stationery' ? '✏️' : '🎒'}
            </div>
          )}
        </Link>
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 text-[9.5px] font-bold py-0.5 px-2.5 rounded-full text-white shadow"
            style={{ background: item.badgeColor || '#8a6030' }}>
            {item.badge}
          </div>
        )}
        <button onClick={e => { e.preventDefault(); onWishlist(item) }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full border-none cursor-pointer flex items-center justify-center shadow transition-colors duration-200"
          style={{ background: wishlisted ? 'rgba(160,105,58,0.95)' : 'rgba(255,255,255,0.90)' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#fff' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
              stroke={wishlisted ? '#fff' : '#a0693a'} strokeWidth="1.4"/>
          </svg>
        </button>
        {hov && (
          <Link to={`/${item.type === 'book' ? 'book' : 'product'}/${item.slug}`}
            className="absolute inset-0 bg-black/45 flex items-center justify-center no-underline z-10">
            <span className="bg-white text-[#a0693a] py-2 px-4 rounded-full text-[11.5px] font-semibold">Quick View</span>
          </Link>
        )}
      </div>
      {/* Info */}
      <div className="p-3.5 pb-4 flex flex-col flex-1">
        {(item.ageRange || item.type !== 'book') && (
          <div className="inline-block self-start text-[9.5px] font-bold bg-[rgba(160,105,58,0.09)] text-[#9a6030] py-0.5 px-2 rounded mb-1.5">
            {item.ageRange || (item.type === 'stationery' ? 'Stationery' : 'Accessory')}
          </div>
        )}
        <Link to={`/${item.type === 'book' ? 'book' : 'product'}/${item.slug}`} className="no-underline flex-1">
          <div className="font-['Playfair_Display',serif] text-sm font-bold text-[#3d2010] leading-tight mb-0.5 line-clamp-2">
            {item.title}
          </div>
        </Link>
        <div className="text-xs text-[#9a7a5a] mb-1">{item.author}</div>
        <div className="text-[10.5px] text-[#b09070] mb-3">
          {(item.reviewCount || 0).toLocaleString()} reviews
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-base font-bold text-[#7a4e22]">
              {formatPrice(price)}
            </span>
            {item.salePrice && (
              <span className="text-[11px] text-[#b09070] line-through ml-1.5">
                {formatPrice(item.price)}
              </span>
            )}
          </div>
          <button onClick={() => onAddToCart(item)}
            className="border-none text-white py-1.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors duration-200"
            style={{ background: hov ? '#8a5830' : '#a0693a' }}>
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}

function ProductListRow({ item, wishlisted, onWishlist, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov, setHov] = useState(false)
  const price = item.salePrice ?? item.price

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex items-center gap-4 rounded-xl p-3.5 transition-all duration-200"
      style={{
        background: hov ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)',
        border:`1px solid ${hov ? 'rgba(160,105,58,0.30)' : 'rgba(200,170,130,0.20)'}`,
        boxShadow: hov ? '0 6px 24px rgba(100,60,20,0.10)' : 'none',
        transform: hov ? 'translateX(4px)' : 'none',
      }}>
      <div className="w-[60px] h-[84px] rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#f5e8d5] to-[#e8d5b8]">
        {!imgErr && item.img ? (
          <img src={item.img} alt={item.title} loading="lazy" onError={() => setImgErr(true)} className="w-full h-full object-cover block"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {item.type === 'book' ? '📖' : item.type === 'stationery' ? '✏️' : '🎒'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-['Playfair_Display',serif] text-sm font-bold text-[#3d2010] mb-0.5 truncate">{item.title}</div>
        <div className="text-xs text-[#9a7a5a] mb-1">{item.author}</div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10.5px] text-[#b09070]">({(item.reviewCount || 0).toLocaleString()} reviews)</span>
          {item.ageRange && <span className="text-[10px] bg-[rgba(160,105,58,0.09)] py-0.5 px-2 rounded text-[#9a6030]">{item.ageRange}</span>}
          {item.badge && <span className="text-[9.5px] font-bold py-0.5 px-2 rounded text-white" style={{ background: item.badgeColor || '#8a6030' }}>{item.badge}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <div className="text-[15px] font-bold text-[#7a4e22]">
            {formatPrice(price)}
          </div>
          {item.salePrice && (
            <div className="text-[10.5px] text-[#b09070] line-through">
              {formatPrice(item.price)}
            </div>
          )}
        </div>
        <button onClick={() => onWishlist(item)}
          className="w-[34px] h-[34px] rounded-full border border-[rgba(180,140,90,0.3)] flex items-center justify-center cursor-pointer flex-shrink-0"
          style={{ background: wishlisted ? 'rgba(160,105,58,0.12)' : 'rgba(255,255,255,0.8)' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#a0693a' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" stroke="#a0693a" strokeWidth="1.4"/>
          </svg>
        </button>
        <button onClick={() => onAddToCart(item)} className="bg-[#a0693a] text-white border-none py-2 px-4 rounded-xl text-xs font-bold cursor-pointer">
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
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  // ── Determine active tab from URL path ──
  const pathParts = location.pathname.split('/')
  const categoryInPath = pathParts.includes('category')
    ? pathParts[pathParts.indexOf('category') + 1] : null
  const initialMain =
    categoryInPath === 'stationery'  ? 'stationery'
    : categoryInPath === 'accessories' ? 'accessories'
    : (categoryInPath === 'cbc-education' || categoryInPath === 'cbc-books') ? 'cbc-books'
    : categoryInPath === 'books' ? 'books'
    : 'all'

  const [mainCat, setMainCat]             = useState(initialMain)
  const [sort, setSort]                   = useState('featured')
  const [viewMode, setViewMode]           = useState('grid')
  const [page, setPage]                   = useState(1)
  const [priceRange, setPriceRange]       = useState([0, PRICE_MAX])
  const [selectedSubs, setSelectedSubs]   = useState([])
  const [selectedGrades, setSelectedGrades] = useState([])
  const [mobileFilters, setMobileFilters] = useState(false)

  // ── Sanity data state ──
  const [allProducts, setAllProducts]   = useState([])
  const [dataLoading, setDataLoading]   = useState(true)

  // ── UI loading (filter transitions) ──
  const [uiLoading, setUiLoading]       = useState(false)

  const { addToCart }                   = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const urlFilter   = searchParams.get('filter')  || ''
  const searchQuery = searchParams.get('search')  || ''

  // ── Fetch all products from Sanity on mount ──
  useEffect(() => {
    setDataLoading(true)
    fetchAllProducts().then(results => {
      setAllProducts(results.length ? results : MOCK_PRODUCTS)
      setDataLoading(false)
    }).catch(() => {
      setAllProducts(MOCK_PRODUCTS)
      setDataLoading(false)
    })
  }, [])

  // Pre-select filter from URL
  useEffect(() => {
    if (urlFilter === 'bestsellers' && !selectedSubs.includes('bestsellers')) {
      setSelectedSubs(['bestsellers'])
    }
  }, [urlFilter])

  // UI shimmer on filter change
  useEffect(() => {
    if (dataLoading) return
    setUiLoading(true)
    const t = setTimeout(() => setUiLoading(false), 400)
    return () => clearTimeout(t)
  }, [mainCat, sort, selectedSubs, selectedGrades, priceRange, urlFilter, searchQuery])

  function switchMainCat(id) {
    setMainCat(id)
    setSelectedSubs([])
    setSelectedGrades([])
    setPriceRange([0, PRICE_MAX])
    setPage(1)
    if (id === 'stationery')   navigate('/category/stationery')
    else if (id === 'accessories') navigate('/category/accessories')
    else if (id === 'cbc-books')   navigate('/category/cbc-education')
    else if (id === 'all')         navigate('/books')
    else                           navigate('/category/books')
  }

  const updateSearch = (q) => {
    if (q) searchParams.set('search', q)
    else searchParams.delete('search')
    setSearchParams(searchParams)
    setPage(1)
  }

  // ── Filter products ──
  let products = [...allProducts]

  if (mainCat === 'cbc-books')    products = products.filter(p => p.type === 'book' && p.isCBC)
  else if (mainCat === 'books')   products = products.filter(p => p.type === 'book' && !p.isCBC)
  else if (mainCat === 'stationery')  products = products.filter(p => p.type === 'stationery')
  else if (mainCat === 'accessories') products = products.filter(p => p.type === 'accessory')

  if (urlFilter === 'new-arrivals') products = products.filter(p => p.badge === 'New')
  if (urlFilter === 'bestsellers')  products = products.filter(p =>
    p.categories?.includes('bestsellers') || p.badge?.includes('Bestseller'))

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    products = products.filter(p =>
      p.title?.toLowerCase().includes(q) || p.author?.toLowerCase().includes(q))
  }

  if (selectedSubs.length)   products = products.filter(p => selectedSubs.some(s => p.categories?.includes(s)))
  if (selectedGrades.length) products = products.filter(p => selectedGrades.some(g => p.cbcLevel === g))

  products = products.filter(p => {
    const price = p.salePrice ?? p.price
    return price >= priceRange[0] && price <= priceRange[1]
  })

  if (sort === 'price-asc')  products = [...products].sort((a,b) => (a.salePrice??a.price) - (b.salePrice??b.price))
  if (sort === 'price-desc') products = [...products].sort((a,b) => (b.salePrice??b.price) - (a.salePrice??a.price))

  const ITEMS_PER_PAGE = 12
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const displayed  = products.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE)

  function toggle(arr, setArr, val) {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
    setPage(1)
  }
  function resetFilters() {
    setSelectedSubs([])
    setSelectedGrades([])
    setPriceRange([0, PRICE_MAX])
    setPage(1)
  }

  const hasFilters = selectedSubs.length || selectedGrades.length ||
    priceRange[1] < PRICE_MAX

  const subFilters = mainCat === 'stationery' ? STATIONERY_TYPES
    : mainCat === 'accessories' ? ACCESSORY_TYPES
    : mainCat === 'cbc-books' ? CBC_SUBJECTS
    : BOOK_GENRES

  const subFilterTitle = mainCat === 'cbc-books' ? 'Subject'
    : (mainCat === 'stationery' || mainCat === 'accessories') ? 'Type'
    : 'Genre'

  const maxPrice = PRICE_MAX
  const activeCatDef = MAIN_CATEGORIES.find(c => c.id === mainCat) || MAIN_CATEGORIES[0]
  const isLoading = dataLoading || uiLoading

  // Count per tab from live data
  const countFor = (catId) => {
    if (catId === 'all')       return allProducts.length
    if (catId === 'cbc-books') return allProducts.filter(p => p.type === 'book' && p.isCBC).length
    if (catId === 'books')     return allProducts.filter(p => p.type === 'book' && !p.isCBC).length
    const def = MAIN_CATEGORIES.find(c => c.id === catId)
    return allProducts.filter(p => def?.types?.includes(p.type)).length
  }

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-5">
        <span className="text-[13px] font-bold text-[#3d2010]">Filters</span>
        {hasFilters && (
          <button onClick={resetFilters} className="text-[11px] text-[#a0693a] bg-none border-none cursor-pointer font-semibold">
            Reset all
          </button>
        )}
      </div>

      <FilterSection title={subFilterTitle}>
        <div className="flex flex-col gap-2">
          {subFilters.map(f => (
            <CheckBox key={f.slug} label={f.label}
              checked={selectedSubs.includes(f.slug)}
              onChange={() => toggle(selectedSubs, setSelectedSubs, f.slug)}/>
          ))}
        </div>
      </FilterSection>

      {mainCat === 'cbc-books' && (
        <FilterSection title="Grade Level" defaultOpen={false}>
          <div className="flex flex-col gap-2">
            {CBC_LEVELS.map(g => (
              <CheckBox key={g.slug} label={`${g.icon} ${g.label}`}
                checked={selectedGrades.includes(g.slug)}
                onChange={() => toggle(selectedGrades, setSelectedGrades, g.slug)}/>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price range */}
      <FilterSection title="Price Range">
        <input type="range" min="0" max={maxPrice} value={priceRange[1]}
          onChange={e => setPriceRange([0, Number(e.target.value)])}
          className="w-full accent-[#a0693a] mb-1.5"/>
        <div className="flex justify-between text-[11.5px] text-[#9a7a5a]">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(priceRange[1])}+</span>
        </div>
      </FilterSection>
    </>
  )

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-20">
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .books-grid{display:grid;gap:18px;grid-template-columns:repeat(3,1fr)}
        @media(min-width:1200px){.books-grid{grid-template-columns:repeat(4,1fr)}}
        @media(max-width:900px){.books-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:540px){.books-grid{grid-template-columns:1fr}}
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      `}</style>

      <div className="max-w-[1280px] mx-auto px-[clamp(14px,4vw,40px)] py-6">

        {/* ── CATEGORY TABS ── */}
        <div className="flex gap-2 flex-wrap mb-7 border-b border-[rgba(180,140,90,0.18)] pb-4">
          {MAIN_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => switchMainCat(cat.id)}
              className="flex items-center gap-1.5 py-2 px-5 rounded-full cursor-pointer transition-all duration-200 text-[13.5px]"
              style={{
                background: mainCat === cat.id ? '#a0693a' : 'rgba(255,255,255,0.65)',
                border:`1px solid ${mainCat === cat.id ? '#a0693a' : 'rgba(180,140,90,0.28)'}`,
                color: mainCat === cat.id ? '#fff' : '#5c3d1e',
                fontWeight: mainCat === cat.id ? '700' : '500',
                boxShadow: mainCat === cat.id ? '0 4px 16px rgba(160,105,58,0.28)' : 'none',
              }}>
              <span className="text-[15px]">{cat.emoji}</span>
              {cat.label}
              <span className="text-[10px] font-bold py-0.5 px-1.5 rounded-full"
                style={{
                  background: mainCat === cat.id ? 'rgba(255,255,255,0.25)' : 'rgba(160,105,58,0.10)',
                  color: mainCat === cat.id ? '#fff' : '#a0693a',
                }}>
                {countFor(cat.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#9a7a5a] mb-5">
          <Link to="/" className="text-[#9a7a5a] no-underline">Home</Link>
          <span className="text-[#c4a882]">›</span>
          <Link to="/books" className="text-[#9a7a5a] no-underline">Shop</Link>
          <span className="text-[#c4a882]">›</span>
          <span className="text-[#5c3d1e] font-medium">
            {urlFilter === 'new-arrivals' ? 'New Arrivals' : urlFilter === 'bestsellers' ? 'Bestsellers' : activeCatDef.label}
          </span>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative flex-1 max-w-md">
            <input type="text" value={searchQuery} onChange={e => updateSearch(e.target.value)}
              placeholder="Search books, stationery, accessories..."
              className="w-full py-2 px-4 pr-10 rounded-full border border-[rgba(180,140,90,0.28)] bg-white/65 text-sm text-[#3d2010] placeholder:text-[#9a7a5a] outline-none focus:border-[#a0693a] transition-colors"/>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a7a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            {searchQuery && (
              <button onClick={() => updateSearch('')}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-[#9a7a5a] hover:text-[#a0693a]">✕</button>
            )}
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="w-[232px] flex-shrink-0 hidden md:block bg-white/60 border border-[rgba(200,170,130,0.28)] rounded-xl p-5 backdrop-blur-md sticky top-22 max-h-[calc(100vh-108px)] overflow-y-auto">
            <SidebarContent/>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-start justify-between flex-wrap gap-2.5 mb-4">
              <div>
                <h1 className="font-['Playfair_Display',serif] text-[clamp(20px,3vw,28px)] font-bold text-[#3d2010] mb-0.5 flex items-center gap-2">
                  <span className="text-[22px]">{activeCatDef.emoji}</span>
                  {urlFilter === 'new-arrivals' ? '✨ New Arrivals'
                   : urlFilter === 'bestsellers' ? '⭐ Bestsellers'
                   : activeCatDef.label}
                </h1>
                <p className="text-xs text-[#9a7a5a]">
                  {isLoading ? 'Loading…' : `${products.length} items`}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile filter btn */}
                <button className="md:hidden flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-semibold cursor-pointer"
                  onClick={() => setMobileFilters(true)}
                  style={{
                    background: hasFilters ? 'rgba(160,105,58,0.12)' : 'rgba(255,255,255,0.65)',
                    border:`1px solid ${hasFilters ? 'rgba(160,105,58,0.35)' : 'rgba(180,140,90,0.28)'}`,
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
                    { mode:'grid', icon:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
                    { mode:'list', icon:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3h9M4 7h9M4 11h9M1.5 3h.01M1.5 7h.01M1.5 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  ].map(({ mode, icon }) => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      className="py-1.5 px-2.5 border-none cursor-pointer transition-all duration-150"
                      style={{ background: viewMode===mode ? 'rgba(160,105,58,0.15)' : 'transparent', color: viewMode===mode ? '#a0693a' : '#9a7a5a' }}>
                      {icon}
                    </button>
                  ))}
                </div>

                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="py-2 px-3 text-xs bg-white/65 border border-[rgba(180,140,90,0.28)] rounded-lg text-[#5c3d1e] cursor-pointer outline-none">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {(selectedSubs.length > 0 || selectedGrades.length > 0) && (
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {[
                  ...selectedSubs.map(s => ({ key:s, label:[...subFilters].find(x=>x.slug===s)?.label||s, set:setSelectedSubs })),
                  ...selectedGrades.map(g => ({ key:g, label:CBC_LEVELS.find(x=>x.slug===g)?.label||g, set:setSelectedGrades })),
                ].map(chip => (
                  <div key={chip.key} className="flex items-center gap-1 bg-[rgba(160,105,58,0.10)] border border-[rgba(160,105,58,0.28)] rounded-xl py-0.5 px-2.5 text-[11.5px] text-[#7a4e22]">
                    {chip.label}
                    <button onClick={() => chip.set(prev => prev.filter(v => v !== chip.key))}
                      className="bg-none border-none cursor-pointer text-[#a0693a] text-xs leading-none">✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Products */}
            {isLoading ? (
              <div className="books-grid">{[...Array(8)].map((_,i) => <SkeletonCard key={i}/>)}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 px-5 bg-white/55 border border-[rgba(200,170,130,0.22)] rounded-xl">
                <div className="text-4xl mb-3.5">📭</div>
                <h3 className="font-['Playfair_Display',serif] text-xl text-[#3d2010] mb-2">Nothing found</h3>
                <p className="text-[13px] text-[#9a7a5a] mb-5">Try adjusting your filters.</p>
                <button onClick={resetFilters} className="bg-[#a0693a] text-white border-none py-2.5 px-6 rounded-full cursor-pointer text-[12.5px]">
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="books-grid">
                {displayed.map(item => (
                  <ProductCard key={item._id} item={item}
                    wishlisted={isWishlisted(item._id)}
                    onWishlist={toggleWishlist}
                    onAddToCart={addToCart}/>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {displayed.map(item => (
                  <ProductListRow key={item._id} item={item}
                    wishlisted={isWishlisted(item._id)}
                    onWishlist={toggleWishlist}
                    onAddToCart={addToCart}/>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="text-center mt-10">
                <p className="text-[11px] text-[#9a7a5a] mb-3.5 uppercase tracking-wide">
                  Page {page} of {totalPages}
                </p>
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {Array.from({ length: totalPages }, (_,i) => i+1).map(n => (
                    <button key={n} onClick={() => setPage(n)}
                      className="py-1.5 px-3 rounded-lg text-[12.5px] cursor-pointer"
                      style={{
                        background: n===page ? '#a0693a' : 'rgba(255,255,255,0.7)',
                        border:'1px solid rgba(180,140,90,0.28)',
                        color: n===page ? '#fff' : '#7a4e22',
                        fontWeight: n===page ? '700' : '400',
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
          <button onClick={() => setMobileFilters(false)}
            className="w-8 h-8 rounded-full border border-[rgba(20,10,2,0.14)] bg-white/70 flex items-center justify-center cursor-pointer text-[13px]">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-5">
          <SidebarContent/>
        </div>
        <div className="py-3.5 px-5 border-t border-[rgba(180,140,90,0.15)]">
          <button onClick={() => setMobileFilters(false)}
            className="w-full py-3 bg-[#a0693a] text-white border-none rounded-xl text-[13px] font-bold cursor-pointer">
            Show {products.length} Results
          </button>
        </div>
      </div>
    </div>
  )
}
