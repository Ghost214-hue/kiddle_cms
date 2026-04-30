/**
 * AboutPage.jsx — The Kiddle Aesthetic · Sunlit, Cozy, Refined
 * Sections: Hero · Design Pillars · Consistency section · Contact Cards · Footer CTA
 * Matches Visily design page 5 exactly
 */

import { useState, useEffect, useRef } from 'react'

// ── Section fade-in on scroll ────────────────────────────────────────────────
function Section({ children, style = {}, delay = 0 }) {
  const ref       = useRef(null)
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
        transform:  vis ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Design pillar card ───────────────────────────────────────────────────────
function PillarCard({ icon, title, desc, delay }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Section delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(200,170,130,0.30)',
          borderRadius: '20px',
          padding: '28px 24px',
          backdropFilter: 'blur(14px)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 14px 40px rgba(100,60,20,0.14)'
            : '0 3px 16px rgba(100,60,20,0.06)',
          height: '100%',
        }}
      >
        <div style={{
          width: '48px', height: '48px', borderRadius: '13px',
          background: 'rgba(160,105,58,0.10)',
          border: '1px solid rgba(160,105,58,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '18px',
        }}>
          {icon}
        </div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '16px', fontWeight: '600',
          color: '#3d2010', marginBottom: '8px',
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '13px', color: '#9a7a5a',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.75,
        }}>
          {desc}
        </p>
      </div>
    </Section>
  )
}

// ── Contact card ─────────────────────────────────────────────────────────────
function ContactCard({ icon, title, lines, cta, href, delay }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Section delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(200,170,130,0.28)',
          borderRadius: '20px', padding: '28px 24px',
          backdropFilter: 'blur(14px)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 12px 36px rgba(100,60,20,0.12)'
            : '0 3px 14px rgba(100,60,20,0.06)',
          height: '100%',
        }}
      >
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(160,105,58,0.10)',
          border: '1px solid rgba(160,105,58,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px',
        }}>
          {icon}
        </div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '15px', fontWeight: '600',
          color: '#3d2010', marginBottom: '10px',
        }}>
          {title}
        </h3>
        {lines.map((line, i) => (
          <p key={i} style={{
            fontSize: '13px', color: '#7a5c3a',
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.65, marginBottom: '2px',
          }}>
            {line}
          </p>
        ))}
        {cta && (
          <a
            href={href || '#'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              marginTop: '14px', fontSize: '12.5px', fontWeight: '600',
              color: '#a0693a', fontFamily: "'DM Sans', sans-serif",
              textDecoration: 'none',
              transition: 'gap 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.gap = '8px'}
            onMouseLeave={e => e.currentTarget.style.gap = '5px'}
          >
            {cta}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 2.5l3.5 3.5-3.5 3.5" stroke="#a0693a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
    </Section>
  )
}

// ── Timeline item ─────────────────────────────────────────────────────────────
function TimelineItem({ year, text, last = false }) {
  return (
    <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(160,105,58,0.14)',
          border: '2px solid rgba(160,105,58,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: '700', color: '#a0693a',
          fontFamily: "'DM Sans', sans-serif",
          flexShrink: 0,
        }}>
          {year.slice(-2)}
        </div>
        {!last && (
          <div style={{
            width: '1.5px', flex: 1, minHeight: '32px',
            background: 'linear-gradient(to bottom, rgba(160,105,58,0.3), rgba(160,105,58,0.05))',
            margin: '4px 0',
          }}/>
        )}
      </div>
      <div style={{ paddingBottom: last ? '0' : '24px' }}>
        <div style={{
          fontSize: '11px', fontWeight: '700', color: '#a0693a',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginBottom: '4px',
        }}>
          {year}
        </div>
        <p style={{
          fontSize: '13.5px', color: '#5c3d1e',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.7,
        }}>
          {text}
        </p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story')

  const TABS = [
    { id: 'story',    label: 'Our Story'    },
    { id: 'aesthetic',label: 'The Aesthetic'},
    { id: 'team',     label: 'The Team'     },
  ]

  const TEAM = [
    { name: 'Emma Reed',    role: 'Curating Editor',     emoji: '👩‍💼', bio: 'Passionate about 19th-century fiction and the perfect cup of Earl Grey.' },
    { name: 'Oliver Chase', role: 'Head of Design',      emoji: '🎨', bio: 'Believes every cover tells a story before you open the first page.' },
    { name: 'Priya Nair',   role: 'Children\'s Curator', emoji: '📚', bio: 'Former school librarian who knows every Roald Dahl by heart.' },
    { name: 'Leo Manders',  role: 'Community Lead',      emoji: '🤝', bio: 'Organises monthly author Q&As and the annual Kiddle Reading Marathon.' },
  ]

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', paddingTop: '68px' }}>

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(56px,8vw,100px) clamp(20px,5vw,80px) clamp(48px,6vw,80px)',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(160,105,58,0.10)',
          border: '1px solid rgba(160,105,58,0.22)',
          borderRadius: '20px', padding: '5px 16px',
          fontSize: '10.5px', fontWeight: '700', color: '#a0693a',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: '24px',
        }}>
          Design Documentation
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: '700', color: '#3d2010',
          lineHeight: 1.2, marginBottom: '8px',
        }}>
          The Kiddle Aesthetic:
        </h1>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: '700', color: '#a0693a',
          fontStyle: 'italic', lineHeight: 1.2,
          marginBottom: '24px',
        }}>
          Sunlit, Cozy, Refined.
        </h1>

        <p style={{
          fontSize: 'clamp(14px,2vw,16px)',
          color: '#7a5c3a',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 36px',
        }}>
          Kiddle Bookshop isn't just a store; it's a sanctuary for the curious mind. Our digital space is designed to mirror the warmth of a sun-drenched library on a Sunday afternoon.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/books" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#a0693a', color: '#fff',
            padding: '13px 28px', borderRadius: '32px',
            fontSize: '13.5px', fontWeight: '600',
            fontFamily: "'DM Sans', sans-serif", textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(160,105,58,0.30)',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#8a5830'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#a0693a'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Browse Collection
          </a>
          <a href="#philosophy" style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(180,140,90,0.35)',
            color: '#7a4e22', padding: '13px 24px', borderRadius: '32px',
            fontSize: '13.5px', fontFamily: "'DM Sans', sans-serif",
            textDecoration: 'none', backdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.65)'}
          >
            Our Philosophy
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          DESIGN PILLARS
      ══════════════════════════════════════════════════════════════ */}
      <section id="philosophy" style={{
        padding: '0 clamp(20px,5vw,80px) 72px',
        maxWidth: '1280px', margin: '0 auto',
      }}>
        <Section style={{ marginBottom: '36px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px,3vw,30px)',
            fontWeight: '600', color: '#3d2010',
          }}>
            Our Design Language
          </h2>
        </Section>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}
          className="pillars-grid"
        >
          <PillarCard
            delay={0}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h10M4 18h7" stroke="#a0693a" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M17 14l4 4-4 4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
              </svg>
            }
            title="Tactile Typography"
            desc="Using Playfair Display for headers to evoke the classic feel of printed book covers. Every headline should feel like it belongs on a dust jacket."
          />
          <PillarCard
            delay={80}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#a0693a" strokeWidth="1.5"/>
                <path d="M12 3C12 3 15 7 15 12C15 17 12 21 12 21" stroke="#a0693a" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M3 12h18" stroke="#a0693a" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            }
            title="Warm Palette"
            desc="A combination of Cream (#F5F0E8) and Terracotta (#A0693A) for a sunlit glow — colours that feel like warm paper in afternoon light."
          />
          <PillarCard
            delay={160}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="#a0693a" strokeWidth="1.5" opacity="0.4"/>
                <rect x="6" y="6" width="12" height="12" rx="3" stroke="#a0693a" strokeWidth="1.5" opacity="0.6"/>
                <rect x="9" y="9" width="6" height="6" rx="2" fill="#a0693a" opacity="0.7"/>
              </svg>
            }
            title="Soft Glassmorphism"
            desc="Translucent layers with subtle white borders and backdrop blurs. Cards should feel like frosted glass held up to autumn sunlight."
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TABS — Story / Aesthetic / Team
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '0 clamp(20px,5vw,80px) 72px',
        maxWidth: '1280px', margin: '0 auto',
      }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex', borderBottom: '1px solid rgba(180,140,90,0.20)',
          marginBottom: '40px', gap: '0',
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '12px 28px', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === t.id ? '#a0693a' : 'transparent'}`,
                color: activeTab === t.id ? '#a0693a' : '#9a7a5a',
                fontSize: '13.5px',
                fontWeight: activeTab === t.id ? '600' : '400',
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer', transition: 'all 0.2s',
                marginBottom: '-1px',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Our Story ── */}
        {activeTab === 'story' && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '56px', alignItems: 'center',
          }}
            className="story-grid"
          >
            <Section>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(24px,3.5vw,36px)',
                fontWeight: '700', color: '#3d2010',
                lineHeight: 1.25, marginBottom: '20px',
              }}>
                Consistency in every<br/>
                <em style={{ color: '#a0693a' }}>digital corner.</em>
              </h2>
              <div style={{
                width: '40px', height: '3px',
                background: '#a0693a',
                borderRadius: '2px', marginBottom: '24px',
              }}/>
              <p style={{
                fontSize: '14px', color: '#5c3d1e',
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.8, marginBottom: '16px',
              }}>
                The footer is often the final interaction a user has with our platform. We treat it as a parting gift — a well-organized, comprehensive guide that reinforces our commitment to transparency and community.
              </p>
              <p style={{
                fontSize: '14px', color: '#7a5c3a',
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.8, marginBottom: '28px',
              }}>
                By utilizing a grid-based approach, we ensure that contact information, social presence, and newsletter engagement are all given their rightful place without cluttering the user experience.
              </p>
              <a href="#" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', fontWeight: '600', color: '#a0693a',
                fontFamily: "'DM Sans', sans-serif", textDecoration: 'none',
                transition: 'gap 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                onMouseLeave={e => e.currentTarget.style.gap = '6px'}
              >
                View Developer Guidelines
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </Section>

            {/* Book stack image + quote */}
            <Section delay={100}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  borderRadius: '20px', overflow: 'hidden',
                  background: 'linear-gradient(145deg, #2a1f14, #5c3d1e)',
                  aspectRatio: '4/3',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 20px 60px rgba(100,60,20,0.22)',
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80"
                    alt="Kiddle Bookshop collection"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    onError={e => e.target.style.display = 'none'}
                  />
                  {/* Illustrated book spines fallback */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'flex-end',
                    padding: '20px', gap: '6px',
                  }}>
                    {[
                      { h: '75%', bg: '#c9865a', t: 'Zero to One' },
                      { h: '60%', bg: '#8aaccb', t: 'Ego is the Enemy' },
                      { h: '85%', bg: '#a0b870', t: 'The Obstacle Is the Way' },
                      { h: '65%', bg: '#d4a060', t: 'Startup Manual' },
                      { h: '70%', bg: '#c890b0', t: 'Corporate Startup' },
                    ].map((b, i) => (
                      <div key={i} style={{
                        height: b.h, flex: 1,
                        background: b.bg,
                        borderRadius: '3px 5px 5px 3px',
                        position: 'relative', minWidth: 0,
                        boxShadow: '2px 3px 10px rgba(0,0,0,0.2)',
                      }}>
                        <div style={{
                          position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px',
                          background: 'rgba(0,0,0,0.18)', borderRadius: '3px 0 0 3px',
                        }}/>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating quote card */}
                <div style={{
                  position: 'absolute', bottom: '-16px', right: '-16px',
                  background: 'rgba(245,240,232,0.97)',
                  border: '1px solid rgba(200,170,130,0.3)',
                  borderRadius: '18px', padding: '16px 20px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 28px rgba(100,60,20,0.14)',
                  maxWidth: '240px',
                }}>
                  <p style={{
                    fontSize: '12px', color: '#5c3d1e',
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic', lineHeight: 1.6,
                    marginBottom: '8px',
                  }}>
                    "We believe every book deserves a sunlit shelf and every reader a cozy corner."
                  </p>
                  <div style={{
                    fontSize: '10px', fontWeight: '700', color: '#a0693a',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    — THE KIDDLE CURATORS
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ── The Aesthetic ── */}
        {activeTab === 'aesthetic' && (
          <div>
            {/* Color swatches */}
            <Section style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '20px', fontWeight: '600', color: '#3d2010',
                marginBottom: '20px',
              }}>
                Colour Palette
              </h3>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { name: 'Cream',        hex: '#F5F0E8', dark: false },
                  { name: 'Off-White',    hex: '#EDE5D8', dark: false },
                  { name: 'Terracotta',   hex: '#A0693A', dark: true  },
                  { name: 'Amber Light',  hex: '#C48B52', dark: false },
                  { name: 'Espresso',     hex: '#3D2F1F', dark: true  },
                  { name: 'Warm Taupe',   hex: '#7A5C3A', dark: true  },
                  { name: 'Muted Tan',    hex: '#9A7A5A', dark: true  },
                  { name: 'Sand Border',  hex: '#C4A882', dark: false },
                ].map(c => (
                  <div key={c.hex} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '72px', height: '72px', borderRadius: '16px',
                      background: c.hex,
                      border: '1px solid rgba(180,140,90,0.25)',
                      boxShadow: '0 4px 16px rgba(100,60,20,0.10)',
                      marginBottom: '8px',
                    }}/>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#3d2010', fontFamily: "'DM Sans',sans-serif" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", fontVariant: 'all-small-caps' }}>
                      {c.hex}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Typography showcase */}
            <Section delay={100} style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '20px', fontWeight: '600', color: '#3d2010', marginBottom: '20px',
              }}>
                Typography
              </h3>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
              }}
                className="typo-grid"
              >
                {[
                  {
                    face: 'Playfair Display',
                    use: 'Display / Headings',
                    sample: 'The Art of Slow Reading',
                    style: { fontFamily: "'Playfair Display',serif", fontSize: '28px', fontWeight: '700', color: '#3d2010' },
                  },
                  {
                    face: 'DM Sans',
                    use: 'Body / UI',
                    sample: 'Curated books for curious minds of every age.',
                    style: { fontFamily: "'DM Sans',sans-serif", fontSize: '16px', fontWeight: '400', color: '#5c3d1e' },
                  },
                ].map(t => (
                  <div key={t.face} style={{
                    background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(200,170,130,0.28)',
                    borderRadius: '18px', padding: '24px 22px',
                    backdropFilter: 'blur(12px)',
                  }}>
                    <div style={{
                      fontSize: '10.5px', fontWeight: '700', color: '#a0693a',
                      fontFamily: "'DM Sans',sans-serif",
                      letterSpacing: '0.07em', textTransform: 'uppercase',
                      marginBottom: '14px',
                    }}>
                      {t.face} · {t.use}
                    </div>
                    <div style={t.style}>{t.sample}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Glass card showcase */}
            <Section delay={200}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '20px', fontWeight: '600', color: '#3d2010', marginBottom: '20px',
              }}>
                Glassmorphism System
              </h3>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Card (default)',  alpha: 0.52, blur: '14px', border: '200,170,130', radius: '18px' },
                  { label: 'Navbar',          alpha: 0.82, blur: '14px', border: '180,140,90',  radius: '0px'  },
                  { label: 'Modal / Drawer',  alpha: 0.97, blur: '20px', border: '200,170,130', radius: '24px' },
                  { label: 'Pill / Tag',      alpha: 0.50, blur: '8px',  border: '180,140,90',  radius: '24px' },
                ].map(g => (
                  <div key={g.label} style={{
                    background: `rgba(255,255,255,${g.alpha})`,
                    border: `1px solid rgba(${g.border},0.30)`,
                    borderRadius: g.radius === '0px' ? '12px' : g.radius,
                    padding: '20px', backdropFilter: `blur(${g.blur})`,
                    minWidth: '160px', flex: '1',
                    boxShadow: '0 4px 20px rgba(100,60,20,0.08)',
                  }}>
                    <div style={{ fontSize: '11.5px', fontWeight: '600', color: '#5c3d1e', fontFamily: "'DM Sans',sans-serif", marginBottom: '8px' }}>
                      {g.label}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
                      bg: rgba(255,255,255,{g.alpha})<br/>
                      blur: {g.blur}<br/>
                      radius: {g.radius}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ── Team ── */}
        {activeTab === 'team' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {TEAM.map((member, i) => (
              <Section key={member.name} delay={i * 80}>
                <div style={{
                  background: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(200,170,130,0.28)',
                  borderRadius: '20px', padding: '28px 22px',
                  backdropFilter: 'blur(14px)',
                  textAlign: 'center',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(100,60,20,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: `hsl(${i * 60 + 20}, 50%, 82%)`,
                    border: '3px solid rgba(160,105,58,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', margin: '0 auto 14px',
                  }}>
                    {member.emoji}
                  </div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '16px', fontWeight: '600', color: '#3d2010', marginBottom: '4px',
                  }}>
                    {member.name}
                  </h3>
                  <div style={{
                    fontSize: '11px', fontWeight: '600', color: '#a0693a',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}>
                    {member.role}
                  </div>
                  <p style={{
                    fontSize: '12.5px', color: '#7a5c3a',
                    fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7,
                  }}>
                    {member.bio}
                  </p>
                </div>
              </Section>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════
          OUR STORY — TIMELINE
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '64px clamp(20px,5vw,80px)',
        background: 'rgba(160,105,58,0.05)',
        borderTop: '1px solid rgba(180,140,90,0.15)',
        borderBottom: '1px solid rgba(180,140,90,0.15)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Section style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <div style={{
                width: '40px', height: '1.5px',
                background: 'linear-gradient(to right, transparent, #a0693a)',
              }}/>
              <span style={{
                fontSize: '11px', fontWeight: '700', color: '#a0693a',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Since 1994
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(22px,3vw,30px)',
              fontWeight: '600', color: '#3d2010',
            }}>
              Our Journey
            </h2>
          </Section>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '48px',
          }}
            className="timeline-grid"
          >
            <div>
              <TimelineItem year="1994" text="Founded as a small corner bookshop in Storybrook Village, NY by Eleanor Vance with a single shelf of hand-picked titles." />
              <TimelineItem year="2003" text="Expanded to a second location and launched our first curated subscription box — 'The Monthly Chapter'." />
              <TimelineItem year="2012" text="Opened our children's wing, dedicated entirely to young readers, featuring story-time events and author visits." />
            </div>
            <div>
              <TimelineItem year="2018" text="Launched our online store, bringing hand-selected editions to readers across the globe." />
              <TimelineItem year="2022" text="Introduced the Kiddle Book Club, now with 12,000+ members across 40 countries." />
              <TimelineItem year="2024" text="Redesigned our digital presence with the Sunlit aesthetic — cozy, warm, and unmistakably Kiddle." last />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CONTACT CARDS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '72px clamp(20px,5vw,80px)',
        maxWidth: '1280px', margin: '0 auto',
      }}>
        <Section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: '1.5px solid rgba(160,105,58,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 1l1.8 5.5H17l-4.9 3.6 1.8 5.5L9 12.1 4.1 15.6l1.8-5.5L1 6.5h6.2L9 1Z" fill="#a0693a" opacity="0.6"/>
            </svg>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px,3vw,30px)',
            fontWeight: '600', color: '#3d2010',
          }}>
            Come Find Us
          </h2>
        </Section>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}
          className="contact-grid"
        >
          <ContactCard
            delay={0}
            icon={
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path d="M11 2C7.7 2 5 4.7 5 8c0 5 6 11 6 11s6-6 6-11c0-3.3-2.7-6-6-6Z" stroke="#a0693a" strokeWidth="1.5"/>
                <circle cx="11" cy="8" r="2" fill="#a0693a"/>
              </svg>
            }
            title="Store Location"
            lines={['123 Literature Lane,', 'Storybrook Village, NY 10012']}
            cta="Get Directions"
            href="https://maps.google.com"
          />
          <ContactCard
            delay={80}
            icon={
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path d="M4 4h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2Z" stroke="#a0693a" strokeWidth="1.5"/>
                <path d="M2 6l9 6 9-6" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
            title="Email Inquiry"
            lines={['General: hello@kiddle.com', 'Orders: shipping@kiddle.com']}
            cta="Contact Form"
            href="/contact"
          />
          <ContactCard
            delay={160}
            icon={
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path d="M5 4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H5Z" stroke="#a0693a" strokeWidth="1.5"/>
                <path d="M8 4V2M14 4V2M5 9h12" stroke="#a0693a" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            }
            title="Call Us"
            lines={['Customer Support: (555) 234-BOOK', 'Mon–Sat: 9:00 AM – 8:00 PM']}
            cta="Schedule a Call"
            href="/schedule"
          />
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .pillars-grid  { grid-template-columns: 1fr !important }
          .contact-grid  { grid-template-columns: 1fr !important }
          .story-grid    { grid-template-columns: 1fr !important }
          .timeline-grid { grid-template-columns: 1fr !important }
          .typo-grid     { grid-template-columns: 1fr !important }
        }
        @media (max-width: 640px) {
          .pillars-grid  { grid-template-columns: 1fr !important }
        }
      `}</style>
    </div>
  )
}