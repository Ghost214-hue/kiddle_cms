import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart, useWishlist } from '../../context/CartContext'

let logoSrc = null
try {
  logoSrc = new URL('../../assets/kiddle1.png', import.meta.url).href
} catch (_) {}

const NAV_LINKS = [
  { label: 'Browse Books', href: '/books', filter: null },
  { label: 'New Arrivals', href: '/books?filter=new-arrivals', filter: 'new-arrivals' },
  { label: 'Bestsellers', href: '/books?filter=bestsellers', filter: 'bestsellers' },
  { label: "contact us", href: "/contact", filter: null }
]

const DRAWER_LINKS = [
  { label: 'Browse Books', href: '/books', icon: '📚', filter: null },
  { label: 'New Arrivals', href: '/books?filter=new-arrivals', icon: '✨', filter: 'new-arrivals' },
  { label: 'Bestsellers', href: '/books?filter=bestsellers', icon: '🏆', filter: 'bestsellers' },
  { label: "Children's Collection", href: '/category/childrens', icon: '🧒', filter: null },
  { label: 'Rare Finds', href: '/category/rare', icon: '🔍', filter: null },
  { label: 'Gifts & Stationery', href: '/category/gifts', icon: '🎁', filter: null },
  { label: 'contact us', href: '/contact', icon: '🌿', filter: null },
]

function NavIconBtn({ children, badge = 0, onClick, title, size = 38 }) {
  const [hov, setHov] = useState(false)
  
  const sizeClasses = {
    38: 'w-[38px] h-[38px]',
    36: 'w-[36px] h-[36px]'
  }
  
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`
        relative rounded-full flex items-center justify-center flex-shrink-0
        transition-all duration-200 backdrop-blur-sm
        ${sizeClasses[size] || 'w-[38px] h-[38px]'}
        ${hov 
          ? 'bg-[rgba(255,252,246,0.82)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),_0_3px_12px_rgba(20,10,2,0.09)]' 
          : 'bg-[rgba(255,252,246,0.50)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
        }
        border border-[rgba(20,10,2,0.12)] cursor-pointer
      `}
    >
      {children}
      {badge > 0 && (
        <span className="absolute -top-[3px] -right-[3px] min-w-[17px] h-[17px] bg-[#1a1008] text-[#f5f0e8] text-[8px] font-extrabold rounded-[9px] px-1 flex items-center justify-center font-['DM_Sans',sans-serif] border-[1.5px] border-[rgba(245,240,230,0.9)] leading-none tracking-[-0.02em]">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}

function KiddleLogo({ size = 'md' }) {
  const [imgError, setImgError] = useState(false)
  const height = size === 'sm' ? 60 : 68

  return (
    <a
      href="/"
      className="flex items-center no-underline flex-shrink-0 group"
    >
      {logoSrc && !imgError ? (
        <img
          src={logoSrc}
          alt="Kiddle Bookshop"
          onError={() => setImgError(true)}
          className={`
            rounded-full object-cover object-center block flex-shrink-0
            border-3 border-[rgba(20,10,2,0.22)]
            shadow-[0_4px_18px_rgba(20,10,2,0.22),_inset_0_1px_0_rgba(255,255,255,0.3)]
            transition-all duration-250 group-hover:shadow-[0_6px_24px_rgba(20,10,2,0.30),_inset_0_1px_0_rgba(255,255,255,0.3)]
            group-hover:scale-104
          `}
          style={{ height, width: height }}
        />
      ) : (
        <span 
          className="rounded-full bg-[#1a1008] border-3 border-[rgba(20,10,2,0.22)] shadow-[0_4px_18px_rgba(20,10,2,0.18)] flex items-center justify-center flex-shrink-0"
          style={{ width: height, height: height }}
        >
          <svg width={height * 0.5} height={height * 0.5} viewBox="0 0 20 20" fill="none">
            <rect x="1" y="2" width="7" height="16" rx="1.5" fill="#f5f0e8"/>
            <rect x="11" y="2" width="7" height="16" rx="1.5" fill="#f5f0e8" opacity="0.40"/>
          </svg>
        </span>
      )}
    </a>
  )
}

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activePath, setActivePath] = useState('/')
  
  const navigate = useNavigate()
  const location = useLocation()

  const { cart, itemCount: contextItemCount } = useCart()
  const { wishlist } = useWishlist()
  
  const itemCount = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + (item.qty || 0), 0)
    : contextItemCount || 0
  
  const wishCount = wishlist?.length ?? 0

  useEffect(() => {
    console.log('Navbar - Cart updated:', { cartLength: cart?.length, itemCount })
  }, [cart, itemCount])

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setActivePath(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const t = Math.min(scrollY / 80, 1)
  const bgAlpha = (0.78 + t * 0.19).toFixed(3)
  const blur = Math.round(16 + t * 8)
  const shadow = (t * 0.18).toFixed(3)

  const ICON_COLOR = '#1a1008'
  const ICON_STYLE = { opacity: 0.75 }

  const handleNavigation = useCallback((href, filter = null) => {
    // If it's a books page with filter, navigate to books with query param
    if (filter && href.includes('/books')) {
      navigate(`/books?filter=${filter}`)
    } else {
      navigate(href)
    }
    setActivePath(href)
    setMenuOpen(false)
  }, [navigate])

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-[9000] transition-shadow duration-400"
        style={{
          background: `rgba(245, 240, 230, ${bgAlpha})`,
          backdropFilter: `blur(${blur}px) saturate(165%)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(165%)`,
          borderBottom: '1px solid rgba(20, 10, 2, 0.20)',
          boxShadow: `inset 0 1px 0 rgba(255, 252, 246, 0.72), 0 6px 36px rgba(20, 10, 2, ${shadow})`,
        }}
      >
        <div className="max-w-[1280px] mx-auto px-[clamp(16px,3vw,32px)]">
          <div className="flex items-center justify-between h-20 gap-3">
            <KiddleLogo />

            <nav className="hidden md:flex items-center gap-[2px]">
              {NAV_LINKS.map(link => {
                const isActive = activePath === '/books' && link.filter ? 
                  new URLSearchParams(location.search).get('filter') === link.filter :
                  activePath === link.href
                
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(link.href, link.filter)
                    }}
                    className={`
                      relative px-[15px] py-[7px] text-[13px] rounded-[9px] no-underline
                      font-['DM_Sans',sans-serif] tracking-[0.01em] transition-all duration-180 cursor-pointer
                      ${isActive 
                        ? 'font-bold bg-[rgba(20,10,2,0.07)]' 
                        : 'font-medium bg-transparent hover:bg-[rgba(20,10,2,0.04)]'
                      }
                      text-[#1a1008]
                    `}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-[15px] right-[15px] h-[1.5px] rounded-[1px] bg-[#1a1008]" />
                    )}
                  </a>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-[7px]">
              <div
                onClick={() => !searchOpen && setSearchOpen(true)}
                className={`
                  flex items-center gap-2 overflow-hidden
                  backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex-shrink-0
                  border border-[rgba(20,10,2,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]
                  ${searchOpen 
                    ? 'w-[220px] rounded-[20px] bg-[rgba(255,252,246,0.80)] px-[14px] justify-start' 
                    : 'w-[38px] rounded-full bg-[rgba(255,252,246,0.50)] p-0 justify-center cursor-pointer'
                  }
                  h-[38px]
                `}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                  <circle cx="6" cy="6" r="4.5" stroke={ICON_COLOR} strokeWidth="1.6" style={ICON_STYLE}/>
                  <path d="M9.5 9.5L12.5 12.5" stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" style={ICON_STYLE}/>
                </svg>
                {searchOpen && (
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchOpen(false)
                        setSearchQuery('')
                      } else if (e.key === 'Enter') {
                        handleSearch(e)
                      }
                    }}
                    onBlur={() => { 
                      setTimeout(() => setSearchOpen(false), 200)
                      setSearchQuery('')
                    }}
                    placeholder="Search title, author…"
                    className="flex-1 text-[12.5px] text-[#1a1008] bg-transparent border-none outline-none font-['DM_Sans',sans-serif]"
                  />
                )}
              </div>

              <NavIconBtn title="Wishlist" badge={wishCount} onClick={() => handleNavigation('/wishlist')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
                    stroke={ICON_COLOR} strokeWidth="1.5" style={ICON_STYLE}/>
                </svg>
              </NavIconBtn>

              <NavIconBtn title="Cart" badge={itemCount} onClick={() => handleNavigation('/cart')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={ICON_STYLE}/>
                  <circle cx="6.5" cy="12.5" r="1" fill={ICON_COLOR} style={ICON_STYLE}/>
                  <circle cx="11.5" cy="12.5" r="1" fill={ICON_COLOR} style={ICON_STYLE}/>
                </svg>
              </NavIconBtn>

              <button className="w-[38px] h-[38px] rounded-full border-[1.5px] border-[rgba(20,10,2,0.16)] bg-[rgba(232,215,192,0.85)] flex items-center justify-center cursor-pointer overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-colors duration-200 hover:border-[rgba(20,10,2,0.35)]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="7" r="3" fill={ICON_COLOR} style={ICON_STYLE}/>
                  <path d="M2 16c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke={ICON_COLOR} strokeWidth="1.4" strokeLinecap="round" style={ICON_STYLE}/>
                </svg>
              </button>
            </div>

            <div className="flex md:hidden items-center gap-[7px]">
              <NavIconBtn size={36} title="Search" onClick={() => setSearchOpen(v => !v)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke={ICON_COLOR} strokeWidth="1.6" style={ICON_STYLE}/>
                  <path d="M9.5 9.5L12.5 12.5" stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" style={ICON_STYLE}/>
                </svg>
              </NavIconBtn>

              <NavIconBtn size={36} title="Cart" badge={itemCount} onClick={() => handleNavigation('/cart')}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={ICON_STYLE}/>
                  <circle cx="6.5" cy="12.5" r="1" fill={ICON_COLOR} style={ICON_STYLE}/>
                  <circle cx="11.5" cy="12.5" r="1" fill={ICON_COLOR} style={ICON_STYLE}/>
                </svg>
              </NavIconBtn>

              <button
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Toggle navigation"
                className="w-[36px] h-[36px] rounded-full bg-[rgba(255,252,246,0.50)] border border-[rgba(20,10,2,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-sm flex flex-col items-center justify-center gap-1.5 cursor-pointer px-[10px] transition-colors duration-200"
              >
                {[
                  { w: 'w-4', rotate: menuOpen ? 'rotate-45 translate-x-[4.5px] translate-y-[4.5px]' : '' },
                  { w: 'w-3', opacity: menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100' },
                  { w: 'w-4', rotate: menuOpen ? '-rotate-45 translate-x-[4.5px] -translate-y-[4.5px]' : '' },
                ].map((bar, i) => (
                  <span 
                    key={i} 
                    className={`
                      block h-[1.5px] bg-[#1a1008] rounded-[2px] transition-all duration-280 ease-[ease]
                      ${bar.w} ${bar.rotate || ''} ${bar.opacity || ''}
                    `}
                    style={{ transformOrigin: 'center' }}
                  />
                ))}
              </button>
            </div>
          </div>

          <div className={`
            md:hidden overflow-hidden transition-all duration-300 ease-[ease]
            ${searchOpen ? 'max-h-16' : 'max-h-0'}
          `}>
            <div className="flex items-center gap-2.5 bg-[rgba(255,252,246,0.80)] border border-[rgba(20,10,2,0.14)] rounded-[20px] p-[9px_16px] mb-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke={ICON_COLOR} strokeWidth="1.5" opacity="0.6"/>
                <path d="M9.5 9.5L12.5 12.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              </svg>
              <input
                autoFocus={searchOpen}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchOpen(false)
                    setSearchQuery('')
                  } else if (e.key === 'Enter') {
                    handleSearch(e)
                  }
                }}
                placeholder="Search by title, author…"
                className="flex-1 text-[13px] text-[#1a1008] bg-transparent border-none outline-none font-['DM_Sans',sans-serif]"
              />
              <button 
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="bg-none border-none cursor-pointer text-[#3d2010] text-[13px] leading-none"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        onClick={() => setMenuOpen(false)}
        className={`
          fixed inset-0 z-[8990] bg-[rgba(20,10,2,0.38)] backdrop-blur-sm
          transition-opacity duration-300 ease-[ease]
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      <aside className={`
        fixed top-0 right-0 bottom-0 z-[9100] w-[288px]
        bg-[rgba(248,244,236,0.98)] backdrop-blur-[24px] saturate-180
        border-l border-[rgba(20,10,2,0.14)]
        shadow-[-12px_0_48px_rgba(20,10,2,0.18),inset_1px_0_0_rgba(255,252,246,0.5)]
        flex flex-col transition-transform duration-360 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-[rgba(20,10,2,0.10)]">
          <KiddleLogo size="sm" />
          <button 
            onClick={() => setMenuOpen(false)} 
            className="w-8 h-8 rounded-full border border-[rgba(20,10,2,0.14)] bg-[rgba(255,252,246,0.7)] flex items-center justify-center cursor-pointer text-[#1a1008] text-[13px] leading-none transition-colors duration-200 hover:bg-[rgba(20,10,2,0.08)]"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {DRAWER_LINKS.map((link) => {
            const isActive = activePath === '/books' && link.filter ? 
              new URLSearchParams(location.search).get('filter') === link.filter :
              activePath === link.href
            
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation(link.href, link.filter)
                }}
                className={`
                  flex items-center justify-between px-[14px] py-[11px] rounded-xl mb-[2px]
                  text-[13.5px] no-underline font-['DM_Sans',sans-serif] transition-colors duration-180 cursor-pointer
                  ${isActive 
                    ? 'font-bold bg-[rgba(20,10,2,0.07)]' 
                    : 'font-medium bg-transparent hover:bg-[rgba(20,10,2,0.05)]'
                  }
                  text-[#1a1008]
                `}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-[15px] leading-none">{link.icon}</span>
                  {link.label}
                </span>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" opacity="0.3">
                  <path d="M5 3l4 4-4 4" stroke="#1a1008" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )
          })}
        </nav>

        <div className="p-4 pb-6 pt-4 border-t border-[rgba(20,10,2,0.10)]">
          <button className="w-full py-3 bg-[#1a1008] text-[#f5f0e8] border-none rounded-xl text-[13px] font-bold font-['DM_Sans',sans-serif] cursor-pointer tracking-[0.03em] mb-[14px] shadow-[0_4px_16px_rgba(20,10,2,0.22)] transition-colors duration-200 hover:bg-[#2d1a08]">
            Sign In
          </button>

          <div className="flex justify-center gap-2.5">
            {[
              { label: 'Instagram', vb: '0 0 14 14', d: <><rect x="2" y="2" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="10.5" cy="3.5" r="0.7" fill="currentColor"/></> },
              { label: 'X', vb: '0 0 13 13', d: <path d="M1 1.5l4.5 5.5L1 12h1.5l3.5-4 3 4H12L7.2 6.2 11.5 1H10L6.8 4.7 4 1H1Z" fill="currentColor"/> },
              { label: 'Facebook', vb: '0 0 13 13', d: <path d="M8 1H6C4.9 1 4 1.9 4 3v1H2v2h2v6h2V6h2l.5-2H6V3c0-.3.2-.5.5-.5H8V1Z" fill="currentColor"/> },
            ].map(s => (
              <a key={s.label} href="#" aria-label={s.label} className="w-[34px] h-[34px] rounded-full border border-[rgba(20,10,2,0.14)] bg-[rgba(255,252,246,0.6)] flex items-center justify-center text-[#3d2a18] no-underline transition-all duration-200 hover:text-[#1a1008] hover:bg-[rgba(20,10,2,0.08)]">
                <svg width="13" height="13" viewBox={s.vb} fill="none">{s.d}</svg>
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}