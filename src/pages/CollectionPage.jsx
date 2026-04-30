/**
 * CollectionPage.jsx — Browse & Category listing page
 * Features: filter sidebar, sort, grid/list view toggle, pagination
 */

import { useState, useEffect } from 'react'
import BookCard     from '../components/ui/BookCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import CategoryPill from '../components/ui/CategoryPill'
import { useCart }     from '../context/CartContext'
import { useWishlist } from '../context/CartContext'

// ── mock data ────────────────────────────────────────────────────────────────
const ALL_BOOKS = [
  { _id:'b1', title:'The Midnight Library',         author:'Matt Haig',               price:24.99, rating:4.4, reviewCount:1240, ageRange:'Young Adult', badge:'#1 Bestseller', badgeColor:'tan',   slug:'the-midnight-library',          categories:['fiction','adult']      },
  { _id:'b2', title:'Before the Coffee Gets Cold',  author:'Toshikazu Kawaguchi',      price:18.99, rating:4.8, reviewCount:876,  ageRange:'Adult',       badge:'New',           badgeColor:'green', slug:'before-the-coffee-gets-cold',   categories:['fiction','adult']      },
  { _id:'b3', title:"Where the Crawdads Sing",      author:'Delia Owens',              price:23.00, rating:4.7, reviewCount:2100, ageRange:'Adult',                                                  slug:'where-the-crawdads-sing',       categories:['fiction','adult']      },
  { _id:'b4', title:"The Lion's Secret Garden",     author:'Clara Moss',               price:12.99, rating:4.6, reviewCount:580,  ageRange:'4-8 Years',   badge:'New',           badgeColor:'green', slug:'lions-secret-garden',           categories:['childrens']            },
  { _id:'b5', title:'Klara and the Sun',            author:'Kazuo Ishiguro',           price:20.00, rating:4.6, reviewCount:940,  ageRange:'Adult',                                                  slug:'klara-and-the-sun',             categories:['fiction','adult']      },
  { _id:'b6', title:'Stars & Beyond',               author:'J. Hartley',               price:9.50,  rating:4.2, reviewCount:310,  ageRange:'9-12 Years',  badge:'Sale',          badgeColor:'red',   slug:'stars-and-beyond',              categories:['childrens','educational']},
  { _id:'b7', title:'The Forest Alphabet',          author:'Nora Fynn',                price:8.99,  rating:4.9, reviewCount:430,  ageRange:'0-3 Years',                                              slug:'forest-alphabet',               categories:['childrens']            },
  { _id:'b8', title:'Wings of Tomorrow',            author:'Sol Rivera',               price:11.00, rating:4.3, reviewCount:195,  ageRange:'9-12 Years',                                             slug:'wings-of-tomorrow',             categories:['childrens','educational']},
  { _id:'b9', title:'The Starless Sea',             author:'Erin Morgenstern',         price:22.50, rating:4.9, reviewCount:1540, ageRange:'Adult',       badge:'Bestseller',    badgeColor:'tan',   slug:'the-starless-sea',              categories:['fiction','adult']      },
  { _id:'b10',title:'Wildwood Whispers',            author:'Elena Rosewood',           price:16.99, rating:4.5, reviewCount:268,  ageRange:'Young Adult',                                            slug:'wildwood-whispers',             categories:['fiction']              },
  { _id:'b11',title:'The Architecture of Light',   author:'Julian Thorne',            price:42.50, rating:4.7, reviewCount:88,   ageRange:'Adult',                                                  slug:'architecture-of-light',         categories:['educational']          },
  { _id:'b12',title:'Colours of the Sky',          author:'A. Linden',                price:11.00, rating:4.8, reviewCount:340,  ageRange:'4-8 Years',   badge:'Sale',          badgeColor:'red',   slug:'colours-of-the-sky',            categories:['childrens','storybooks']},
]

const CATEGORY_META = {
  all:        { label: 'All Books',        desc: 'Showing all of our wonderful collection.' },
  fiction:    { label: 'Fiction',          desc: 'Stories that reshape how you see the world.' },
  childrens:  { label: "Children's Collection", desc: 'Showing 1–12 of 156 wonderful stories for young explorers.' },
  educational:{ label: 'Educational',     desc: 'Knowledge that lasts a lifetime.' },
  storybooks: { label: 'Storybooks',      desc: 'Timeless tales for every bedtime.' },
  new:        { label: 'New Arrivals',     desc: 'Fresh off the press — discover our latest additions.' },
  classics:   { label: 'Classics',        desc: 'The books that shaped literature.' },
}

const AGE_RANGES   = ['0-3 Years','4-8 Years','9-12 Years','Young Adult','Adult']
const FORMATS      = ['Hardcover','Paperback','E-book','Audiobook']
const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'       },
  { value: 'newest',     label: 'Newest'         },
  { value: 'price-asc',  label: 'Price: Low–High'},
  { value: 'price-desc', label: 'Price: High–Low'},
  { value: 'rating',     label: 'Top Rated'      },
]

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid rgba(180,140,90,0.15)', paddingBottom: '16px', marginBottom: '16px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 0 12px', marginBottom: open ? '12px' : '0',
        }}
      >
        <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#5c3d1e', fontFamily: "'DM Sans',sans-serif" }}>
          {title}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M2 4l4 4 4-4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && children}
    </div>
  )
}

function CheckBox({ label, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
      padding: '4px 0', fontSize: '12.5px', color: checked ? '#5c3d1e' : '#9a7a5a',
      fontFamily: "'DM Sans',sans-serif", fontWeight: checked ? '500' : '400',
      transition: 'color 0.2s',
    }}>
      <div style={{
        width: '16px', height: '16px', borderRadius: '4px',
        border: `1.5px solid ${checked ? '#a0693a' : 'rgba(180,140,90,0.4)'}`,
        background: checked ? '#a0693a' : 'rgba(255,255,255,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', flexShrink: 0,
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

export default function CollectionPage() {
  // In a real app, read from URL params: useParams() / useSearchParams()
  const slug      = 'childrens'
  const meta      = CATEGORY_META[slug] || CATEGORY_META['all']

  const [sort,      setSort]      = useState('featured')
  const [viewMode,  setViewMode]  = useState('grid')   // 'grid' | 'list'
  const [loading,   setLoading]   = useState(true)
  const [page,      setPage]      = useState(1)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedAges,    setSelectedAges]    = useState([])
  const [selectedFormats, setSelectedFormats] = useState([])
  const [selectedRatings, setSelectedRatings] = useState([])
  const [filterOpen, setFilterOpen] = useState(false) // mobile

  const { addToCart }      = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [slug, sort, selectedAges, selectedFormats])

  // Filter books
  let books = [...ALL_BOOKS]
  if (slug !== 'all') books = books.filter(b => b.categories?.includes(slug))
  if (selectedAges.length)    books = books.filter(b => selectedAges.includes(b.ageRange))
  if (selectedRatings.length) books = books.filter(b => b.rating >= Math.min(...selectedRatings))
  books = books.filter(b => b.price >= priceRange[0] && b.price <= priceRange[1])

  // Sort
  if (sort === 'price-asc')  books = [...books].sort((a,b) => a.price - b.price)
  if (sort === 'price-desc') books = [...books].sort((a,b) => b.price - a.price)
  if (sort === 'rating')     books = [...books].sort((a,b) => b.rating - a.rating)

  const ITEMS_PER_PAGE = 12
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE)
  const displayedBooks = books.slice(0, page * ITEMS_PER_PAGE)

  function toggleFilter(arr, setArr, val) {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  }

  function resetFilters() {
    setSelectedAges([]); setSelectedFormats([]); setSelectedRatings([]); setPriceRange([0,100])
  }

  const hasFilters = selectedAges.length || selectedFormats.length || selectedRatings.length || priceRange[0] > 0 || priceRange[1] < 100

  const Sidebar = () => (
    <aside style={{
      width: '240px', flexShrink: 0,
      background: 'rgba(255,255,255,0.52)',
      border: '1px solid rgba(200,170,130,0.28)',
      borderRadius: '20px', padding: '20px',
      backdropFilter: 'blur(14px)',
      height: 'fit-content',
      position: 'sticky', top: '84px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#3d2010', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M4 7h6M6 10h2" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Filters
        </span>
        {hasFilters && (
          <button onClick={resetFilters} style={{
            fontSize: '11px', color: '#a0693a', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: '500',
          }}>
            Reset
          </button>
        )}
      </div>

      <FilterSection title="Age Range">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {AGE_RANGES.map(age => (
            <CheckBox key={age} label={age}
              checked={selectedAges.includes(age)}
              onChange={() => toggleFilter(selectedAges, setSelectedAges, age)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div style={{ padding: '4px 0' }}>
          <input
            type="range" min="0" max="100" value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            style={{ width: '100%', accentColor: '#a0693a', marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif" }}>
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Book Format">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {FORMATS.map(f => (
            <CheckBox key={f} label={f}
              checked={selectedFormats.includes(f)}
              onChange={() => toggleFilter(selectedFormats, setSelectedFormats, f)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Customer Rating" defaultOpen={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[5,4,3].map(r => (
            <label key={r} style={{
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              fontSize: '12.5px', color: selectedRatings.includes(r) ? '#5c3d1e' : '#9a7a5a',
              fontFamily: "'DM Sans',sans-serif",
            }}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '4px',
                border: `1.5px solid ${selectedRatings.includes(r) ? '#a0693a' : 'rgba(180,140,90,0.4)'}`,
                background: selectedRatings.includes(r) ? '#a0693a' : 'rgba(255,255,255,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}
                onClick={() => toggleFilter(selectedRatings, setSelectedRatings, r)}
              >
                {selectedRatings.includes(r) && (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(r)].map((_, i) => <span key={i} style={{ fontSize: '11px', color: '#a0693a' }}>★</span>)}
                {[...Array(5 - r)].map((_, i) => <span key={i} style={{ fontSize: '11px', color: '#ddd' }}>★</span>)}
              </div>
              <span style={{ fontSize: '11px' }}>& up</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  )

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', paddingTop: '68px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', color: '#9a7a5a',
          fontFamily: "'DM Sans',sans-serif", marginBottom: '28px',
        }}>
          {['Home','Shop', meta.label].map((crumb, i, arr) => (
            <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i < arr.length - 1
                ? <a href="#" style={{ color: '#9a7a5a', textDecoration: 'none' }}>{crumb}</a>
                : <span style={{ color: '#5c3d1e', fontWeight: '500' }}>{crumb}</span>
              }
              {i < arr.length - 1 && <span style={{ color: '#c4a882' }}>›</span>}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Sidebar — desktop */}
          <div className="collection-sidebar">
            <Sidebar />
          </div>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header row */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: '24px',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <div>
                <h1 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(22px,3vw,30px)', fontWeight: '600',
                  color: '#3d2010', marginBottom: '4px',
                }}>
                  {meta.label}
                </h1>
                <p style={{ fontSize: '12.5px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif" }}>
                  {meta.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Grid/List toggle */}
                <div style={{
                  display: 'flex', background: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(180,140,90,0.25)', borderRadius: '10px',
                  overflow: 'hidden',
                }}>
                  {[
                    { mode: 'grid', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
                    { mode: 'list', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3h9M4 7h9M4 11h9M1.5 3h.01M1.5 7h.01M1.5 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
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
                    padding: '8px 14px', fontSize: '12px',
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

            {/* Active filters chips */}
            {hasFilters && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px',
              }}>
                {selectedAges.map(a => (
                  <div key={a} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(160,105,58,0.12)',
                    border: '1px solid rgba(160,105,58,0.28)',
                    borderRadius: '16px', padding: '4px 10px',
                    fontSize: '11.5px', color: '#7a4e22',
                    fontFamily: "'DM Sans',sans-serif",
                  }}>
                    {a}
                    <button onClick={() => toggleFilter(selectedAges, setSelectedAges, a)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0693a', fontSize: '12px', lineHeight: 1, padding: '0 2px' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Book grid */}
            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
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
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '20px', color: '#3d2010', marginBottom: '8px' }}>
                  No books found
                </h3>
                <p style={{ fontSize: '13px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginBottom: '20px' }}>
                  Try adjusting your filters to find more books.
                </p>
                <button onClick={resetFilters} style={{
                  background: '#a0693a', color: '#fff', border: 'none',
                  padding: '10px 24px', borderRadius: '20px', cursor: 'pointer',
                  fontSize: '12.5px', fontFamily: "'DM Sans',sans-serif",
                }}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div style={{
                  display: viewMode === 'grid'
                    ? 'grid'
                    : 'flex',
                  gridTemplateColumns: viewMode === 'grid'
                    ? 'repeat(auto-fill, minmax(160px, 1fr))'
                    : undefined,
                  flexDirection: viewMode === 'list' ? 'column' : undefined,
                  gap: '16px',
                }}>
                  {displayedBooks.map((book, i) => (
                    viewMode === 'grid' ? (
                      <BookCard
                        key={book._id}
                        book={book}
                        wishlisted={isWishlisted(book._id)}
                        onWishlist={toggleWishlist}
                        onAddToCart={addToCart}
                        size="md"
                      />
                    ) : (
                      /* List view row */
                      <div key={book._id} style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        background: 'rgba(255,255,255,0.55)',
                        border: '1px solid rgba(200,170,130,0.28)',
                        borderRadius: '16px', padding: '14px 18px',
                        backdropFilter: 'blur(12px)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(100,60,20,0.10)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                      >
                        <div style={{
                          width: '56px', height: '80px', borderRadius: '8px', flexShrink: 0,
                          background: ['#f5d5a8','#c8d8e8','#d8e8c0','#e8c8d8'][i%4],
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '20px',
                        }}>
                          📖
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '14px', fontWeight: '600', color: '#3d2010', marginBottom: '2px' }}>{book.title}</div>
                          <div style={{ fontSize: '12px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginBottom: '6px' }}>{book.author}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '10px', color: '#a0693a' }}>{'★'.repeat(Math.round(book.rating))}</span>
                            {book.ageRange && <span style={{ fontSize: '10px', background: 'rgba(160,105,58,0.09)', padding: '1px 7px', borderRadius: '8px', color: '#9a6030' }}>{book.ageRange}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: '#7a4e22', fontFamily: "'DM Sans',sans-serif" }}>
                            ${book.price.toFixed(2)}
                          </span>
                          <button onClick={() => addToCart(book)} style={{
                            background: '#a0693a', color: '#fff', border: 'none',
                            padding: '7px 16px', borderRadius: '16px',
                            fontSize: '11.5px', fontWeight: '600',
                            fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
                          }}>
                            Add
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Load more / Pagination */}
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <p style={{ fontSize: '12px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    YOU'VE VIEWED {Math.min(displayedBooks.length, books.length)} OF {books.length} PRODUCTS
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                    {['Previous', ...Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1), '…', totalPages, 'Next']
                      .filter((item, idx, arr) => arr.indexOf(item) === idx)
                      .map((item, i) => (
                        <button key={i} style={{
                          padding: '7px 14px', borderRadius: '10px',
                          background: item === page ? '#a0693a' : 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(180,140,90,0.28)',
                          color: item === page ? '#fff' : '#7a4e22',
                          fontSize: '12.5px', fontFamily: "'DM Sans',sans-serif",
                          cursor: typeof item === 'number' ? 'pointer' : 'default',
                          fontWeight: item === page ? '600' : '400',
                        }}>
                          {item}
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
                        transition: 'all 0.2s',
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
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .collection-sidebar { display: none }
        }
      `}</style>
    </div>
  )
}