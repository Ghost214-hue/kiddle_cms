import { useState, useEffect } from 'react'
import { useCart }     from '../../../context/CartContext'
import { useWishlist } from '../../../context/CartContext'

let logoSrc = null
try {
  logoSrc = new URL('../assets/kiddle1.jpeg', import.meta.url).href
} catch (_) {}

const NAV_LINKS = [
  { label: 'Browse Books', href: '/books'       },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Bestsellers',  href: '/bestsellers'  },
]

const DRAWER_LINKS = [
  { label: 'Browse Books',           href: '/books',              icon: '📚' },
  { label: 'New Arrivals',           href: '/new-arrivals',       icon: '✨' },
  { label: 'Bestsellers',            href: '/bestsellers',        icon: '🏆' },
  { label: "Children's Collection",  href: '/category/childrens', icon: '🧒' },
  { label: 'Rare Finds',             href: '/category/rare',      icon: '🔍' },
  { label: 'Gifts & Stationery',     href: '/category/gifts',     icon: '🎁' },
  { label: 'About Us',               href: '/about',              icon: '🌿' },
]

// ── Shared icon button ────────────────────────────────────────────────────────
function NavIconBtn({ children, badge = 0, onClick, title, size = 38 }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        width: size, height: size,
        borderRadius: '50%',
        background: hov ? 'rgba(255,252,246,0.82)' : 'rgba(255,252,246,0.50)',
        border: '1px solid rgba(20,10,2,0.12)',
        boxShadow: hov
          ? 'inset 0 1px 0 rgba(255,255,255,0.65), 0 3px 12px rgba(20,10,2,0.09)'
          : 'inset 0 1px 0 rgba(255,255,255,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'background 0.2s, box-shadow 0.2s',
      }}
    >
      {children}
      {badge > 0 && (
        <span style={{
          position: 'absolute', top: '-3px', right: '-3px',
          minWidth: '17px', height: '17px',
          background: '#1a1008', color: '#f5f0e8',
          fontSize: '8px', fontWeight: '800',
          borderRadius: '9px', padding: '0 4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif",
          border: '1.5px solid rgba(245,240,230,0.9)',
          lineHeight: 1, letterSpacing: '-0.02em',
        }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}

// ── Logo mark ─────────────────────────────────────────────────────────────────
function KiddleLogo({ size = 'md' }) {
  const [imgError, setImgError] = useState(false)
  const h = size === 'sm' ? 30 : 36

  return (
    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
      {/* Image logo */}
      {logoSrc && !imgError ? (
        <img
          src={logoSrc}
          alt="Kiddle Bookshop logo"
          onError={() => setImgError(true)}
          style={{
            height: h, width: h, borderRadius: '10px', objectFit: 'cover',
            border: '1.5px solid rgba(20,10,2,0.14)',
            boxShadow: '0 2px 8px rgba(20,10,2,0.10)',
          }}
        />
      ) : (
        /* SVG fallback — two book spines */
        <span style={{
          width: h, height: h, borderRadius: '10px',
          background: 'rgba(255,252,246,0.7)',
          border: '1.5px solid rgba(20,10,2,0.16)',
          boxShadow: '0 2px 8px rgba(20,10,2,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width={h * 0.55} height={h * 0.55} viewBox="0 0 20 20" fill="none">
            <rect x="1" y="2" width="7" height="16" rx="1.5" fill="#1a1008"/>
            <rect x="11" y="2" width="7" height="16" rx="1.5" fill="#1a1008" opacity="0.30"/>
          </svg>
        </span>
      )}

      {/* Wordmark */}
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: size === 'sm' ? '15px' : '17px',
        fontWeight: '700',
        color: '#1a1008',
        letterSpacing: '0.01em',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        Kiddle{' '}
        <span style={{ fontWeight: '400', fontStyle: 'italic', color: '#1a1008', opacity: 0.55 }}>
          Bookshop
        </span>
      </span>
    </a>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrollY,     setScrollY]     = useState(0)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activePath,  setActivePath]  = useState('/')

  const { itemCount }       = useCart()
  const { wishlist }        = useWishlist()
  const wishCount           = wishlist?.length ?? 0

  // Scroll depth tracking
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Active path
  useEffect(() => {
    setActivePath(window.location.pathname)
  }, [])

  // Resize — close drawer on desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Body scroll lock when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Interpolate navbar appearance based on scroll
  const t       = Math.min(scrollY / 80, 1)
  const bgAlpha = (0.78 + t * 0.19).toFixed(3)   // 0.78 → 0.97
  const blur    = Math.round(16 + t * 8)           // 16 → 24
  const shadow  = (t * 0.18).toFixed(3)

  const ICON_COLOR = '#1a1008'
  const ICON_STYLE = { opacity: 0.75 }

  return (
    <>
      {/* ══════════════ HEADER BAR ══════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
        /* CREAM glass */
        background: `rgba(245, 240, 230, ${bgAlpha})`,
        backdropFilter: `blur(${blur}px) saturate(165%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(165%)`,
        /* Dark ink border bottom */
        borderBottom: '1px solid rgba(20, 10, 2, 0.20)',
        /* Frosted inner edge + scroll shadow */
        boxShadow: [
          'inset 0 1px 0 rgba(255, 252, 246, 0.72)',
          `0 6px 36px rgba(20, 10, 2, ${shadow})`,
        ].join(', '),
        transition: 'box-shadow 0.4s ease',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px,3vw,32px)' }}>

          {/* ── Main row ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '66px', gap: '12px' }}>

            {/* Logo */}
            <KiddleLogo />

            {/* Desktop center nav */}
            <nav className="k-desk-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {NAV_LINKS.map(link => {
                const active = activePath === link.href
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setActivePath(link.href)}
                    style={{
                      position: 'relative',
                      padding: '7px 15px',
                      fontSize: '13px',
                      fontWeight: active ? '700' : '500',
                      color: '#1a1008',
                      textDecoration: 'none',
                      borderRadius: '9px',
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: '0.01em',
                      background: active ? 'rgba(20,10,2,0.07)' : 'transparent',
                      transition: 'background 0.18s, color 0.18s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(20,10,2,0.04)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    {link.label}
                    {active && (
                      <span style={{
                        position: 'absolute', bottom: '4px',
                        left: '15px', right: '15px',
                        height: '1.5px', borderRadius: '1px',
                        background: '#1a1008',
                      }}/>
                    )}
                  </a>
                )
              })}
            </nav>

            {/* Desktop right icons */}
            <div className="k-desk-icons" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>

              {/* Expandable search pill */}
              <div
                onClick={() => !searchOpen && setSearchOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  overflow: 'hidden',
                  background: searchOpen ? 'rgba(255,252,246,0.80)' : 'rgba(255,252,246,0.50)',
                  border: '1px solid rgba(20,10,2,0.12)',
                  borderRadius: searchOpen ? '20px' : '50%',
                  width:  searchOpen ? '220px' : '38px',
                  height: '38px',
                  padding: searchOpen ? '0 14px' : '0',
                  justifyContent: searchOpen ? 'flex-start' : 'center',
                  cursor: searchOpen ? 'default' : 'pointer',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transition: 'width 0.32s cubic-bezier(0.4,0,0.2,1), border-radius 0.28s, background 0.2s',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="6" cy="6" r="4.5" stroke={ICON_COLOR} strokeWidth="1.6" style={ICON_STYLE}/>
                  <path d="M9.5 9.5L12.5 12.5" stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" style={ICON_STYLE}/>
                </svg>
                {searchOpen && (
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onBlur={() => { setSearchOpen(false); setSearchQuery('') }}
                    onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                    placeholder="Search title, author…"
                    style={{
                      flex: 1, fontSize: '12.5px', color: '#1a1008',
                      background: 'transparent', border: 'none', outline: 'none',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                )}
              </div>

              {/* Wishlist */}
              <NavIconBtn title="Wishlist" badge={wishCount} onClick={() => window.location.href = '/wishlist'}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
                    stroke={ICON_COLOR} strokeWidth="1.5" style={ICON_STYLE}/>
                </svg>
              </NavIconBtn>

              {/* Cart */}
              <NavIconBtn title="Cart" badge={itemCount} onClick={() => window.location.href = '/cart'}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={ICON_STYLE}/>
                  <circle cx="6.5" cy="12.5" r="1" fill={ICON_COLOR} style={ICON_STYLE}/>
                  <circle cx="11.5" cy="12.5" r="1" fill={ICON_COLOR} style={ICON_STYLE}/>
                </svg>
              </NavIconBtn>

              {/* Avatar */}
              <button style={{
                width: '38px', height: '38px', borderRadius: '50%',
                border: '1.5px solid rgba(20,10,2,0.16)',
                background: 'rgba(232,215,192,0.85)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(20,10,2,0.35)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(20,10,2,0.16)'}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="7" r="3" fill={ICON_COLOR} style={ICON_STYLE}/>
                  <path d="M2 16c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke={ICON_COLOR} strokeWidth="1.4" strokeLinecap="round" style={ICON_STYLE}/>
                </svg>
              </button>
            </div>

            {/* Mobile right icons */}
            <div className="k-mob-icons" style={{ display: 'none', alignItems: 'center', gap: '7px' }}>
              <NavIconBtn size={36} title="Search" onClick={() => setSearchOpen(v => !v)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke={ICON_COLOR} strokeWidth="1.6" style={ICON_STYLE}/>
                  <path d="M9.5 9.5L12.5 12.5" stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" style={ICON_STYLE}/>
                </svg>
              </NavIconBtn>

              <NavIconBtn size={36} title="Cart" badge={itemCount} onClick={() => window.location.href = '/cart'}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={ICON_STYLE}/>
                  <circle cx="6.5" cy="12.5" r="1" fill={ICON_COLOR} style={ICON_STYLE}/>
                  <circle cx="11.5" cy="12.5" r="1" fill={ICON_COLOR} style={ICON_STYLE}/>
                </svg>
              </NavIconBtn>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Toggle navigation"
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,252,246,0.50)',
                  border: '1px solid rgba(20,10,2,0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '5px', cursor: 'pointer', padding: '0 10px',
                  transition: 'background 0.2s',
                }}
              >
                {[
                  { w: '16px', rotate: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' },
                  { w: '12px', opacity: menuOpen ? '0' : '1',  scale: menuOpen ? 'scaleX(0)' : 'none' },
                  { w: '16px', rotate: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' },
                ].map((bar, i) => (
                  <span key={i} style={{
                    display: 'block', height: '1.5px',
                    width: bar.w,
                    background: '#1a1008', borderRadius: '2px',
                    transformOrigin: 'center',
                    transition: 'transform 0.28s ease, opacity 0.2s',
                    transform: bar.rotate || bar.scale || 'none',
                    opacity: bar.opacity || '1',
                  }}/>
                ))}
              </button>
            </div>
          </div>

          {/* ── Mobile search bar (slides down below header) ── */}
          <div className="k-mob-search" style={{
            maxHeight: searchOpen ? '64px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            display: 'none',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(255,252,246,0.80)',
              border: '1px solid rgba(20,10,2,0.14)',
              borderRadius: '20px', padding: '9px 16px',
              marginBottom: '12px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke={ICON_COLOR} strokeWidth="1.5" opacity="0.6"/>
                <path d="M9.5 9.5L12.5 12.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              </svg>
              <input
                autoFocus={searchOpen}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                placeholder="Search by title, author…"
                style={{
                  flex: 1, fontSize: '13px', color: '#1a1008',
                  background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d2010', fontSize: '13px', lineHeight: 1 }}>
                ✕
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════ DRAWER BACKDROP ══════════════ */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 8990,
          background: 'rgba(20,10,2,0.38)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ══════════════ MOBILE DRAWER ══════════════ */}
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9100,
        width: '288px',
        background: 'rgba(248,244,236,0.98)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderLeft: '1px solid rgba(20,10,2,0.14)',
        boxShadow: '-12px 0 48px rgba(20,10,2,0.18), inset 1px 0 0 rgba(255,252,246,0.5)',
        display: 'flex', flexDirection: 'column',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.36s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 16px',
          borderBottom: '1px solid rgba(20,10,2,0.10)',
        }}>
          <KiddleLogo size="sm" />
          <button onClick={() => setMenuOpen(false)} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            border: '1px solid rgba(20,10,2,0.14)',
            background: 'rgba(255,252,246,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#1a1008', fontSize: '13px', lineHeight: 1,
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,10,2,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,252,246,0.7)'}
          >
            ✕
          </button>
        </div>

        {/* Links */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {DRAWER_LINKS.map((link, i) => {
            const active = activePath === link.href
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => { setActivePath(link.href); setMenuOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 14px', borderRadius: '12px', marginBottom: '2px',
                  fontSize: '13.5px', fontWeight: active ? '700' : '500',
                  color: '#1a1008', textDecoration: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  background: active ? 'rgba(20,10,2,0.07)' : 'transparent',
                  transition: 'background 0.18s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,10,2,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = active ? 'rgba(20,10,2,0.07)' : 'transparent'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px', lineHeight: 1 }}>{link.icon}</span>
                  {link.label}
                </span>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" opacity="0.3">
                  <path d="M5 3l4 4-4 4" stroke="#1a1008" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )
          })}
        </nav>

        {/* Drawer footer */}
        <div style={{ padding: '16px 20px 24px', borderTop: '1px solid rgba(20,10,2,0.10)' }}>
          <button style={{
            width: '100%', padding: '12px',
            background: '#1a1008', color: '#f5f0e8',
            border: 'none', borderRadius: '14px',
            fontSize: '13px', fontWeight: '700',
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer', letterSpacing: '0.03em',
            marginBottom: '14px',
            boxShadow: '0 4px 16px rgba(20,10,2,0.22)',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#2d1a08'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a1008'}
          >
            Sign In
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {[
              { label: 'Instagram', vb: '0 0 14 14', d: <><rect x="2" y="2" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="10.5" cy="3.5" r="0.7" fill="currentColor"/></> },
              { label: 'X',        vb: '0 0 13 13', d: <path d="M1 1.5l4.5 5.5L1 12h1.5l3.5-4 3 4H12L7.2 6.2 11.5 1H10L6.8 4.7 4 1H1Z" fill="currentColor"/> },
              { label: 'Facebook', vb: '0 0 13 13', d: <path d="M8 1H6C4.9 1 4 1.9 4 3v1H2v2h2v6h2V6h2l.5-2H6V3c0-.3.2-.5.5-.5H8V1Z" fill="currentColor"/> },
            ].map(s => (
              <a key={s.label} href="#" aria-label={s.label} style={{
                width: '34px', height: '34px', borderRadius: '50%',
                border: '1px solid rgba(20,10,2,0.14)',
                background: 'rgba(255,252,246,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#3d2a18', textDecoration: 'none',
                transition: 'color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#1a1008'; e.currentTarget.style.background = 'rgba(20,10,2,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#3d2a18'; e.currentTarget.style.background = 'rgba(255,252,246,0.6)' }}
              >
                <svg width="13" height="13" viewBox={s.vb} fill="none">{s.d}</svg>
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* ══════════════ RESPONSIVE RULES ══════════════ */}
      <style>{`
        /* Desktop */
        .k-desk-nav   { display: flex   !important }
        .k-desk-icons { display: flex   !important }
        .k-mob-icons  { display: none   !important }
        .k-mob-search { display: none   !important }

        @media (max-width: 767px) {
          .k-desk-nav   { display: none  !important }
          .k-desk-icons { display: none  !important }
          .k-mob-icons  { display: flex  !important }
          .k-mob-search { display: block !important }
        }
      `}</style>
    </>
  )
}