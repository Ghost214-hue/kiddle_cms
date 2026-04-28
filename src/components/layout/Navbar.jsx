import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Browse Books', href: '/books' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Bestsellers', href: '/bestsellers' },
]

const MOBILE_MENU_LINKS = [
  { label: 'Browse Books',      href: '/books' },
  { label: 'New Arrivals',      href: '/new-arrivals' },
  { label: 'Bestsellers',       href: '/bestsellers' },
  { label: "Children's Collection", href: '/category/childrens' },
  { label: 'Rare Finds',        href: '/category/rare' },
  { label: 'Gifts & Stationery',href: '/category/gifts' },
  { label: 'About Us',          href: '/about' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cartCount = 2 // replace with useCart() hook later

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${scrolled
            ? 'bg-[rgba(245,240,232,0.95)] shadow-[0_2px_24px_rgba(100,60,20,0.10)]'
            : 'bg-[rgba(245,240,232,0.75)]'}
          backdrop-blur-[14px]
          border-b border-[rgba(180,140,90,0.18)]
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* ── Logo ── */}
            <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <span className="w-8 h-8 rounded-full border-2 border-[#a0693a] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="12" rx="1" fill="#a0693a"/>
                  <rect x="9" y="2" width="5" height="12" rx="1" fill="#c48b52" opacity="0.6"/>
                </svg>
              </span>
              <span className="font-serif text-[17px] font-semibold text-[#5c3d1e] tracking-wide leading-none">
                Kiddle <span className="text-[#a0693a]">Bookshop</span>
              </span>
            </a>

            {/* ── Desktop Nav Links (center) ── */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="
                    text-[13px] font-medium text-[#7a5c3a]
                    hover:text-[#3d2010] transition-colors duration-200
                    relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px]
                    after:w-0 after:bg-[#a0693a] after:transition-all after:duration-300
                    hover:after:w-full
                  "
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* ── Desktop Right Icons ── */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search Bar */}
              <div className={`
                flex items-center gap-2 overflow-hidden transition-all duration-300
                bg-white/50 border border-[rgba(180,140,90,0.25)] rounded-full
                ${searchOpen ? 'w-48 px-4 py-2' : 'w-10 h-10 justify-center cursor-pointer'}
              `}
                onClick={() => !searchOpen && setSearchOpen(true)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                  <circle cx="6" cy="6" r="4.5" stroke="#a0693a" strokeWidth="1.5"/>
                  <path d="M9.5 9.5L12 12" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {searchOpen && (
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onBlur={() => { setSearchOpen(false); setSearchQuery('') }}
                    placeholder="Search by title, author…"
                    className="text-[12px] text-[#3d2f1f] bg-transparent outline-none w-full placeholder:text-[#9a7a5a]"
                  />
                )}
              </div>

              {/* Wishlist */}
              <button className="
                w-10 h-10 rounded-full bg-white/50 border border-[rgba(180,140,90,0.25)]
                flex items-center justify-center hover:bg-white/80 transition-colors duration-200
                text-[#a0693a]
              ">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" stroke="#a0693a" strokeWidth="1.4"/>
                </svg>
              </button>

              {/* Cart */}
              <button className="relative w-10 h-10 rounded-full bg-white/50 border border-[rgba(180,140,90,0.25)] flex items-center justify-center hover:bg-white/80 transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke="#a0693a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="6.5" cy="12.5" r="1" fill="#a0693a"/>
                  <circle cx="11.5" cy="12.5" r="1" fill="#a0693a"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-[#a0693a] text-white text-[9px] font-bold flex items-center justify-center leading-none px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Avatar */}
              <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-[rgba(180,140,90,0.35)] flex items-center justify-center bg-[#e8d5bb]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="7" r="3" fill="#a0693a"/>
                  <path d="M2 16c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#a0693a" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* ── Mobile Right ── */}
            <div className="flex md:hidden items-center gap-2.5">
              {/* Mobile Search toggle */}
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="w-9 h-9 rounded-full bg-white/50 border border-[rgba(180,140,90,0.25)] flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="#a0693a" strokeWidth="1.5"/>
                  <path d="M9.5 9.5L12 12" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Mobile Cart */}
              <button className="relative w-9 h-9 rounded-full bg-white/50 border border-[rgba(180,140,90,0.25)] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke="#a0693a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="6.5" cy="12.5" r="1" fill="#a0693a"/>
                  <circle cx="11.5" cy="12.5" r="1" fill="#a0693a"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] min-h-[16px] rounded-full bg-[#a0693a] text-white text-[8px] font-bold flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="w-9 h-9 rounded-full bg-white/50 border border-[rgba(180,140,90,0.25)] flex flex-col items-center justify-center gap-[5px] px-2.5"
                aria-label="Toggle menu"
              >
                <span className={`block h-[1.5px] bg-[#7a4e22] transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px] w-4' : 'w-4'}`}/>
                <span className={`block h-[1.5px] bg-[#7a4e22] w-3 transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}/>
                <span className={`block h-[1.5px] bg-[#7a4e22] transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px] w-4' : 'w-4'}`}/>
              </button>
            </div>

          </div>

          {/* ── Mobile Search Bar (expands below navbar) ── */}
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${searchOpen ? 'max-h-16 pb-3' : 'max-h-0'}`}>
            <div className="flex items-center gap-2 bg-white/60 border border-[rgba(180,140,90,0.25)] rounded-full px-4 py-2.5">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#a0693a" strokeWidth="1.5"/>
                <path d="M9.5 9.5L12 12" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                autoFocus={searchOpen}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title, author…"
                className="flex-1 text-[13px] text-[#3d2f1f] bg-transparent outline-none placeholder:text-[#9a7a5a]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer Menu ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-[#3d2010]/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer panel */}
      <div className={`
        fixed top-0 right-0 bottom-0 z-50 w-[280px] md:hidden
        bg-[rgba(248,243,235,0.98)] backdrop-blur-[20px]
        border-l border-[rgba(180,140,90,0.2)]
        shadow-[-8px_0_40px_rgba(100,60,20,0.12)]
        flex flex-col
        transition-transform duration-400 ease-in-out
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(180,140,90,0.15)]">
          <span className="font-serif text-[15px] font-semibold text-[#5c3d1e]">
            Kiddle <span className="text-[#a0693a]">Bookshop</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 rounded-full border border-[rgba(180,140,90,0.25)] flex items-center justify-center text-[#7a4e22] text-lg"
          >
            ✕
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
          {MOBILE_MENU_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="
                flex items-center justify-between
                px-4 py-3.5 rounded-2xl
                text-[14px] font-medium text-[#5c3d1e]
                hover:bg-[rgba(160,105,58,0.10)] hover:text-[#3d2010]
                transition-colors duration-200
              "
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {link.label}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" opacity="0.4">
                <path d="M5 3l4 4-4 4" stroke="#7a4e22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="px-6 py-5 border-t border-[rgba(180,140,90,0.15)] space-y-3">
          <button className="w-full bg-[#a0693a] text-white text-[13px] font-medium py-3 rounded-full hover:bg-[#8a5830] transition-colors duration-200">
            Sign In
          </button>
          <div className="flex justify-center gap-4 pt-1">
            {/* Instagram */}
            <a href="#" className="w-8 h-8 rounded-full border border-[rgba(180,140,90,0.25)] flex items-center justify-center text-[#9a7a5a] hover:text-[#a0693a] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="10.5" cy="3.5" r="0.7" fill="currentColor"/></svg>
            </a>
            {/* Twitter */}
            <a href="#" className="w-8 h-8 rounded-full border border-[rgba(180,140,90,0.25)] flex items-center justify-center text-[#9a7a5a] hover:text-[#a0693a] transition-colors">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 1.5l4.5 5.5L1 12h1.5l3.5-4 3 4H12L7.2 6.2 11.5 1H10L6.8 4.7 4 1H1Z" fill="currentColor"/></svg>
            </a>
            {/* Facebook */}
            <a href="#" className="w-8 h-8 rounded-full border border-[rgba(180,140,90,0.25)] flex items-center justify-center text-[#9a7a5a] hover:text-[#a0693a] transition-colors">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 1H6C4.9 1 4 1.9 4 3v1H2v2h2v6h2V6h2l.5-2H6V3c0-.3.2-.5.5-.5H8V1Z" fill="currentColor"/></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}