/**
 * HomePage.jsx — Kiddle Bookshop Homepage
 * Sections: Hero · Categories · Special Offers · Featured Picks · Editorial · Why Kiddle · Book Club
 */

import { useState, useEffect, useRef } from 'react'
import OffersCarousel  from '../components/carousel/OffersCarousel'
import FeaturedCarousel from '../components/carousel/FeaturedCarousel'
import CategoryPill    from '../components/ui/CategoryPill'
import { useCart }     from '../context/CartContext'
import { useWishlist } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'

// ── mock categories ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { slug: 'all',        label: 'All Books',    icon: '📚', count: 312 },
  { slug: 'fiction',    label: 'Fiction',      icon: '🌙', count: 98  },
  { slug: 'childrens',  label: "Children's",   icon: '🧒', count: 76  },
  { slug: 'educational',label: 'Educational',  icon: '🎓', count: 54  },
  { slug: 'storybooks', label: 'Storybooks',   icon: '🌿', count: 43  },
  { slug: 'new',        label: 'New Arrivals', icon: '✨', count: 28  },
  { slug: 'classics',   label: 'Classics',     icon: '🏛️', count: 65  },
  { slug: 'nature',     label: 'Nature',       icon: '🌱', count: 32  },
]

// ── Why Kiddle pillars ────────────────────────────────────────────────────────
const PILLARS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 22V6a2 2 0 012-2h16a2 2 0 012 2v16" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 22a2 2 0 002 2h16a2 2 0 002-2" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 8h8M10 12h6" stroke="#a0693a" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Hand-Selected Editions',
    desc:  'We only stock writers that feel as good as they read. From cloth-board classics to artisan papers.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="10" width="20" height="14" rx="2" stroke="#a0693a" strokeWidth="1.5"/>
        <path d="M9 10V7a5 5 0 0110 0v3" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="17" r="2" fill="#a0693a"/>
      </svg>
    ),
    title: 'Eco-Friendly Shipping',
    desc:  'Our book series is 100% natural, plastic-free packaging designed to protect and delight.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#a0693a" strokeWidth="1.5"/>
        <path d="M14 8v6l4 4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Readers First',
    desc:  'Not happy with your pick? Enjoy 30-day effortless returns and personal book recommendations.',
  },
]

// ── Animated number on scroll ────────────────────────────────────────────────
function StatBadge({ value, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        overflow: 'hidden', border: '2px solid rgba(255,255,255,0.5)',
        background: 'rgba(160,105,58,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="5" r="2.5" fill="#a0693a"/>
          <path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#a0693a" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>
      <span style={{ fontSize: '12px', color: '#7a5c3a', fontFamily: "'DM Sans',sans-serif" }}>
        <strong style={{ color: '#5c3d1e' }}>{value}</strong> {label}
      </span>
    </div>
  )
}

// ── Section wrapper with fade-in on scroll ───────────────────────────────────
function Section({ children, style = {} }) {
  const ref     = useRef(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [email, setEmail]   = useState('')
  const [joined, setJoined] = useState(false)
  const { addToCart }       = useCart()
  const { toggleWishlist }  = useWishlist()

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '90vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '0',
        padding: '100px 60px 60px',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
        className="hero-section"
      >
        {/* Left — text */}
        <div style={{ paddingRight: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(160,105,58,0.12)',
            border: '1px solid rgba(160,105,58,0.25)',
            borderRadius: '20px', padding: '5px 14px',
            marginBottom: '24px',
          }}>
            <span style={{ fontSize: '10px', color: '#a0693a', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '700', fontFamily: "'DM Sans',sans-serif" }}>
              ✦ Curated with love
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 5vw, 58px)',
            fontWeight: '700',
            color: '#3d2010',
            lineHeight: 1.15,
            marginBottom: '8px',
          }}>
            The Art of
          </h1>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 5vw, 58px)',
            fontWeight: '700',
            color: '#a0693a',
            fontStyle: 'italic',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            Slow Reading
          </h1>

          <p style={{
            fontSize: '15px', color: '#7a5c3a', lineHeight: 1.75,
            maxWidth: '420px', marginBottom: '32px',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Reconnect with your shelf. Discover hand-picked editions, artisanal stationery, and a community of kindred spirits.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <a href="/books" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#a0693a', color: '#fff',
              padding: '13px 28px', borderRadius: '32px',
              fontSize: '13.5px', fontWeight: '600',
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: 'none',
              boxShadow: '0 6px 24px rgba(160,105,58,0.35)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#8a5830'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#a0693a'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Shop the Collection
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/about" style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(180,140,90,0.35)',
              color: '#7a4e22', padding: '13px 24px', borderRadius: '32px',
              fontSize: '13.5px', fontWeight: '500',
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: 'none', backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
            >
              Our Story
            </a>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: '2px solid #f5f0e8',
                  background: ['#e8c99a','#c8d8e8','#d8e8c0','#e8c8d8'][i],
                  marginLeft: i > 0 ? '-8px' : '0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px',
                }}>
                  {['👩','👨','👧','👦'][i]}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '12px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif" }}>
              Joined by <strong style={{ color: '#5c3d1e' }}>12,000+</strong> readers this month
            </span>
          </div>
        </div>

        {/* Right — book stack visual */}
        <div style={{
          position: 'relative', height: '480px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Soft glow blob */}
          <div style={{
            position: 'absolute', width: '320px', height: '320px',
            background: 'radial-gradient(circle, rgba(160,105,58,0.15) 0%, transparent 70%)',
            borderRadius: '50%', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
          }}/>

          {/* Book stack container */}
          <div style={{
            position: 'relative', width: '280px', height: '340px',
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(200,170,130,0.3)',
            borderRadius: '20px',
            backdropFilter: 'blur(14px)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(100,60,20,0.18)',
          }}>
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"
              alt="Stack of books"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none' }}
            />
            {/* Fallback illustrated stack */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '8px', padding: '24px',
            }}>
              {[
                { bg: '#c9965a', title: 'The Corporate Startup', w: '85%' },
                { bg: '#8aaccb', title: 'Value Proposition Design', w: '78%' },
                { bg: '#9aba6a', title: 'Zero to One', w: '90%' },
              ].map((b, i) => (
                <div key={i} style={{
                  width: b.w, height: '52px',
                  background: b.bg,
                  borderRadius: '4px 6px 6px 4px',
                  display: 'flex', alignItems: 'center', padding: '0 12px',
                  position: 'relative',
                  boxShadow: '2px 4px 12px rgba(0,0,0,0.15)',
                }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: '8px', background: 'rgba(0,0,0,0.15)',
                    borderRadius: '4px 0 0 4px',
                  }}/>
                  <span style={{
                    fontSize: '9px', color: 'rgba(255,255,255,0.9)',
                    fontFamily: "'Playfair Display',serif", fontWeight: '600',
                    marginLeft: '10px',
                  }}>
                    {b.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Floating badge */}
            <div style={{
              position: 'absolute', bottom: '16px', right: '16px',
              background: 'rgba(245,240,232,0.95)',
              border: '1px solid rgba(180,140,90,0.3)',
              borderRadius: '14px', padding: '10px 14px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 6px 20px rgba(100,60,20,0.12)',
            }}>
              <div style={{ fontSize: '9px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginBottom: '2px' }}>
                This month's pick
              </div>
              <div style={{ fontSize: '12px', fontFamily: "'Playfair Display',serif", fontWeight: '600', color: '#3d2010' }}>
                The Midnight Library
              </div>
            </div>
          </div>

          {/* Floating review card */}
          <div style={{
            position: 'absolute', top: '40px', right: '-20px',
            background: 'rgba(255,255,255,0.82)',
            border: '1px solid rgba(200,170,130,0.3)',
            borderRadius: '16px', padding: '12px 16px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(100,60,20,0.12)',
            maxWidth: '150px',
            animation: 'ks-float 4s ease-in-out infinite',
          }}>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '5px' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ fontSize: '10px', color: '#a0693a' }}>★</span>
              ))}
            </div>
            <div style={{ fontSize: '10.5px', color: '#5c3d1e', fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4 }}>
              "A sanctuary for the curious mind."
            </div>
          </div>
        </div>

        <style>{`
          @keyframes ks-float {
            0%,100% { transform: translateY(0) }
            50%      { transform: translateY(-10px) }
          }
          @media (max-width: 768px) {
            .hero-section {
              grid-template-columns: 1fr !important;
              padding: 88px 20px 40px !important;
              text-align: center;
            }
            .hero-section > div:first-child { padding-right: 0 !important }
            .hero-section > div:last-child  { display: none !important }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════════════════ */}
      <Section style={{ padding: '0 60px 48px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '18px',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: '22px', fontWeight: '600', color: '#3d2010',
          }}>
            Explore by Genre
          </h2>
          <a href="/books" style={{
            fontSize: '12px', color: '#a0693a', fontWeight: '600',
            fontFamily: "'DM Sans',sans-serif", textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            View All →
          </a>
        </div>
        <div style={{
          display: 'flex', gap: '10px',
          overflowX: 'auto', paddingBottom: '6px',
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <CategoryPill
              key={cat.slug}
              label={cat.label}
              icon={cat.icon}
              count={cat.count}
              active={activeCategory === cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              size="md"
            />
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          SPECIAL OFFERS CAROUSEL
      ══════════════════════════════════════════════════════════════ */}
      <Section style={{ padding: '0 60px 56px', maxWidth: '1280px', margin: '0 auto' }}>
        <OffersCarousel />
      </Section>

      <div style={{ height: '1px', background: 'rgba(180,140,90,0.18)', margin: '0 60px 56px' }}/>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED PICKS
      ══════════════════════════════════════════════════════════════ */}
      <Section style={{ padding: '0 60px 60px', maxWidth: '1280px', margin: '0 auto' }}>
        <FeaturedCarousel />
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          EDITORIAL PICK
      ══════════════════════════════════════════════════════════════ */}
      <Section style={{ padding: '0 60px 64px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '240px 1fr',
          gap: '0', borderRadius: '24px',
          background: 'rgba(255,255,255,0.52)',
          border: '1px solid rgba(200,170,130,0.32)',
          backdropFilter: 'blur(14px)',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(100,60,20,0.10)',
        }}
          className="editorial-grid"
        >
          {/* Cover */}
          <div style={{
            background: 'linear-gradient(145deg,#2a1f14,#4a3020)',
            minHeight: '320px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80"
              alt="Editorial pick"
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: 0.7 }}
              onError={e => e.target.style.display = 'none'}
            />
            <div style={{
              position: 'relative', width: '100px', height: '140px',
              background: 'linear-gradient(145deg,#3d2a18,#2a1a0e)',
              borderRadius: '4px 10px 10px 4px',
              boxShadow: '6px 10px 30px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', padding: '12px',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '10px',
                background: 'rgba(0,0,0,0.3)', borderRadius: '4px 0 0 4px',
              }}/>
              <div style={{
                fontSize: '10px', color: 'rgba(255,255,255,0.8)',
                fontFamily: "'Playfair Display',serif", fontWeight: '600',
                textAlign: 'center', lineHeight: 1.4, marginTop: '8px',
              }}>
                milk and honey
              </div>
              <div style={{
                fontSize: '8px', color: 'rgba(255,255,255,0.5)',
                fontFamily: "'DM Sans',sans-serif", marginTop: '4px',
              }}>
                rupi kaur
              </div>
            </div>
          </div>

          {/* Text */}
          <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(160,105,58,0.12)',
              border: '1px solid rgba(160,105,58,0.25)',
              borderRadius: '12px', padding: '4px 12px',
              fontSize: '10px', color: '#a0693a', fontWeight: '700',
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: '0.06em', textTransform: 'uppercase',
              marginBottom: '20px', width: 'fit-content',
            }}>
              Editorial Pick
            </div>

            <blockquote style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(18px,2.5vw,24px)',
              fontWeight: '500', color: '#3d2010',
              fontStyle: 'italic', lineHeight: 1.5,
              marginBottom: '8px',
            }}>
              "Reading is the ultimate act of empathy."
            </blockquote>
            <cite style={{
              fontSize: '12px', color: '#9a7a5a',
              fontFamily: "'DM Sans',sans-serif",
              fontStyle: 'normal', marginBottom: '20px',
            }}>
              — Emma Reed, Curating Editor
            </cite>

            <h3 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: '18px', fontWeight: '600', color: '#3d2010',
              marginBottom: '10px',
            }}>
              The Great Reset of Imagination
            </h3>
            <p style={{
              fontSize: '13px', color: '#7a5c3a', lineHeight: 1.75,
              fontFamily: "'DM Sans',sans-serif", marginBottom: '28px',
              maxWidth: '480px',
            }}>
              In our latest feature, we explore how 19th-century classics are finding new life in the modern workspace. Discover the editions that define our current zeitgeist.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="/book/milk-and-honey" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#a0693a', color: '#fff',
                padding: '11px 22px', borderRadius: '24px',
                fontSize: '12.5px', fontWeight: '600',
                fontFamily: "'DM Sans',sans-serif", textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#8a5830'}
                onMouseLeave={e => e.currentTarget.style.background = '#a0693a'}
              >
                Read the Essay
              </a>
              <a href="/books" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(160,105,58,0.10)',
                border: '1px solid rgba(160,105,58,0.28)',
                color: '#7a4e22', padding: '11px 22px', borderRadius: '24px',
                fontSize: '12.5px', fontFamily: "'DM Sans',sans-serif",
                textDecoration: 'none', transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(160,105,58,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(160,105,58,0.10)'}
              >
                Explore Collection →
              </a>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width:768px) {
            .editorial-grid { grid-template-columns: 1fr !important }
          }
        `}</style>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          WHY KIDDLE
      ══════════════════════════════════════════════════════════════ */}
      <Section style={{
        padding: '56px 60px',
        background: 'rgba(160,105,58,0.05)',
        borderTop: '1px solid rgba(180,140,90,0.15)',
        borderBottom: '1px solid rgba(180,140,90,0.15)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(22px,3vw,30px)',
              fontWeight: '600', color: '#3d2010', marginBottom: '10px',
            }}>
              Why Kiddle Bookshop?
            </h2>
            <p style={{
              fontSize: '13.5px', color: '#9a7a5a',
              fontFamily: "'DM Sans',sans-serif", maxWidth: '400px', margin: '0 auto', lineHeight: 1.7,
            }}>
              More than just a store, we are a sanctuary for those who believe in the tangible magic of a physical book.
            </p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: '24px',
          }}
            className="pillars-grid"
          >
            {PILLARS.map((p, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(200,170,130,0.28)',
                  borderRadius: '20px', padding: '28px 24px',
                  backdropFilter: 'blur(12px)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(100,60,20,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(160,105,58,0.10)',
                  border: '1px solid rgba(160,105,58,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '18px',
                }}>
                  {p.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: '16px', fontWeight: '600', color: '#3d2010', marginBottom: '8px',
                }}>
                  {p.title}
                </h3>
                <p style={{
                  fontSize: '13px', color: '#9a7a5a',
                  fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7,
                }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
          <style>{`
            @media (max-width:768px) {
              .pillars-grid { grid-template-columns: 1fr !important }
            }
          `}</style>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          BOOK CLUB CTA
      ══════════════════════════════════════════════════════════════ */}
      <Section style={{ padding: '72px 60px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: '2px solid rgba(160,105,58,0.3)',
              background: ['#e8c99a','#c8d8e8','#d8e8c0','#e8c8d8','#e8dac8'][i],
              marginLeft: i > 0 ? '-6px' : '0',
              fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {['👩','👨','👧','👦','👩‍🦳'][i]}
            </div>
          ))}
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: 'clamp(26px,4vw,38px)',
          fontWeight: '700', color: '#3d2010', marginBottom: '12px',
        }}>
          Join the Kiddle Book Club
        </h2>
        <p style={{
          fontSize: '14px', color: '#9a7a5a',
          fontFamily: "'DM Sans',sans-serif",
          maxWidth: '420px', margin: '0 auto 32px', lineHeight: 1.75,
        }}>
          Receive monthly curated boxes, access to exclusive author Q&As, and 10% off all your lifetime purchases.
        </p>

        {joined ? (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(60,140,80,0.12)',
            border: '1px solid rgba(60,140,80,0.3)',
            borderRadius: '28px', padding: '14px 28px',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#2d7a45" strokeWidth="1.4"/>
              <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#2d7a45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '14px', color: '#2d7a45', fontWeight: '600', fontFamily: "'DM Sans',sans-serif" }}>
              You're in! Welcome to the club. 🎉
            </span>
          </div>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); if (email) setJoined(true) }}
            style={{ display: 'flex', gap: '0', maxWidth: '420px', margin: '0 auto 14px' }}
          >
            <input
              type="email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email to join…"
              style={{
                flex: 1, padding: '13px 20px',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(180,140,90,0.3)', borderRight: 'none',
                borderRadius: '28px 0 0 28px', outline: 'none',
                fontSize: '13px', color: '#3d2f1f',
                fontFamily: "'DM Sans',sans-serif",
              }}
            />
            <button type="submit" style={{
              padding: '13px 24px',
              background: '#a0693a', color: '#fff',
              border: '1px solid #a0693a',
              borderRadius: '0 28px 28px 0',
              fontSize: '13px', fontWeight: '600',
              fontFamily: "'DM Sans',sans-serif",
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#8a5830'}
              onMouseLeave={e => e.currentTarget.style.background = '#a0693a'}
            >
              Join for Free
            </button>
          </form>
        )}
        <p style={{ fontSize: '11px', color: '#b09070', fontFamily: "'DM Sans',sans-serif" }}>
          No spam. Only beautiful books. Ever.
        </p>
      </Section>

    </div>
  )
}