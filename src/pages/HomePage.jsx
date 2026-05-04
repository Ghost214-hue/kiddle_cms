/**
 * HomePage.jsx — Kiddle Bookshop
 * Kenya's premier bookshop for CBC students, parents & book lovers
 *
 * Sections:
 *  1. Hero       — tagline left + rotating mini-carousel right
 *  2. Categories — 8 shop categories (grid cards with real images)
 *  3. CBC Grade   — grade-level pills + subject pills
 *  4. Offers      — OffersCarousel
 *  5. Featured    — FeaturedCarousel (bestsellers)
 *  6. Why Kiddle  — 4 trust pillars
 *  7. Newsletter  — email signup CTA
 */

import { useState, useEffect, useRef } from 'react'
import OffersCarousel   from '../components/carousel/OffersCarousel'
import FeaturedCarousel from '../components/carousel/FeaturedCarousel'
import CategoryPill     from '../components/ui/CategoryPill'
import { useCart }      from '../context/CartContext'
import { useWishlist }  from '../context/CartContext'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const CATEGORIES = [
  {
    slug: 'cbc-education',
    label: 'CBC Textbooks',
    icon: '📚',
    desc: 'KICD approved books',
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=75',
    accent: '#D97706',
  },
  {
    slug: 'storybooks',
    label: 'Storybooks',
    icon: '📖',
    desc: 'African & world tales',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=75',
    accent: '#059669',
  },
  {
    slug: 'stationery',
    label: 'Stationery',
    icon: '✏️',
    desc: 'Pens, notebooks, art',
    img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&q=75',
    accent: '#2563EB',
  },
  {
    slug: 'philosophy',
    label: 'Philosophy & Life',
    icon: '🤔',
    desc: 'Mindset & growth',
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=75',
    accent: '#7C3AED',
  },
  {
    slug: 'young-adults',
    label: 'Young Adults',
    icon: '🌟',
    desc: 'Teen fiction & discovery',
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&q=75',
    accent: '#DB2777',
  },
  {
    slug: 'african-writers',
    label: 'African Writers',
    icon: '🌍',
    desc: 'Local & continental voices',
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=75',
    accent: '#EA580C',
  },
  {
    slug: 'science-nature',
    label: 'Science & Nature',
    icon: '🔬',
    desc: 'Explore the world',
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=400&q=75',
    accent: '#0891B2',
  },
  {
    slug: 'bestsellers',
    label: 'Bestsellers',
    icon: '⭐',
    desc: 'Most loved this month',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75',
    accent: '#B45309',
  },
]

const GRADE_LEVELS = [
  { slug: 'pp1-pp2',          label: 'PP1–PP2',        icon: '🎨', age: '4–6 yrs',  count: 97  },
  { slug: 'lower-primary',    label: 'Grade 1–3',      icon: '📖', age: '6–9 yrs',  count: 156 },
  { slug: 'upper-primary',    label: 'Grade 4–6',      icon: '🔬', age: '9–12 yrs', count: 143 },
  { slug: 'junior-secondary', label: 'Grade 7–9',      icon: '⚗️', age: '12–15 yrs',count: 128 },
  { slug: 'senior-school',    label: 'Grade 10–12',    icon: '🎓', age: '15–18 yrs',count: 112 },
]

const SUBJECTS = [
  { slug: 'mathematics',   label: 'Mathematics',    icon: '📐' },
  { slug: 'english',       label: 'English',        icon: '📝' },
  { slug: 'kiswahili',     label: 'Kiswahili',      icon: '🗣️' },
  { slug: 'science',       label: 'Science & Tech', icon: '🔬' },
  { slug: 'social-studies',label: 'Social Studies', icon: '🌍' },
  { slug: 'cre',           label: 'CRE / IRE',      icon: '⛪' },
  { slug: 'creative-arts', label: 'Creative Arts',  icon: '🎨' },
  { slug: 'phe',           label: 'PE & Health',    icon: '🏃' },
]

const WHY_PILLARS = [
  {
    icon: '📚',
    title: 'Wide Selection',
    desc: 'CBC to philosophy — over 10,000 titles under one roof.',
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&q=70',
  },
  {
    icon: '🚚',
    title: 'Free Delivery Kenya',
    desc: 'Free nationwide shipping on orders above KSh 2,500.',
    img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=300&q=70',
  },
  {
    icon: '💰',
    title: 'Best Price Guarantee',
    desc: 'Competitive prices on all books and stationery.',
    img: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&q=70',
  },
  {
    icon: '⭐',
    title: 'Trusted by 50,000+',
    desc: '50,000 happy families across all 47 counties.',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=70',
  },
]

const HERO_SLIDES = [
  {
    tag: '🔥 LIMITED OFFER',
    tagBg: '#FEF3C7', tagColor: '#B45309',
    title: 'Back to School',
    sub:   '25% off CBC textbooks + free stationery kit on orders above KSh 3,000',
    cta:   'Shop the Deal',
    href:  '/category/cbc-education',
    img:   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    grad:  ['#FEF9EC', '#FEF3C7'],
    accent:'#D97706',
  },
  {
    tag: '✨ NEW ARRIVALS',
    tagBg: '#EFF6FF', tagColor: '#1D4ED8',
    title: 'Fresh Reads',
    sub:   'Latest philosophy, African fiction & CBC workbooks just landed this week',
    cta:   'Explore New Titles',
    href:  '/new-arrivals',
    img:   'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    grad:  ['#EFF6FF', '#DBEAFE'],
    accent:'#2563EB',
  },
  {
    tag: '✏️ STATIONERY',
    tagBg: '#F0FDF4', tagColor: '#166534',
    title: 'Premium Supplies',
    sub:   'Japanese pens, leather-bound notebooks & complete math sets',
    cta:   'Shop Stationery',
    href:  '/category/stationery',
    img:   'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&q=80',
    grad:  ['#F0FDF4', '#DCFCE7'],
    accent:'#059669',
  },
  {
    tag: '🌍 AFRICAN VOICES',
    tagBg: '#FFF7ED', tagColor: '#9A3412',
    title: 'Local Stories',
    sub:   "Ngũgĩ, Chimamanda, Yvonne Owuor — Kenya's best authors in one place",
    cta:   'Discover Authors',
    href:  '/category/african-writers',
    img:   'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
    grad:  ['#FFF7ED', '#FFEDD5'],
    accent:'#EA580C',
  },
]

const STATS = [
  { value: '50K+',   label: 'Happy Customers' },
  { value: '10K+',   label: 'Book Titles'      },
  { value: '1,200+', label: 'Partner Schools'  },
  { value: '47',     label: 'Counties Served'  },
]

// ─────────────────────────────────────────────
// SECTION FADE WRAPPER
// ─────────────────────────────────────────────
function FadeSection({ children, style = {}, delay = 0 }) {
  const ref       = useRef(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.07 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// HERO CAROUSEL (right side of hero)
// ─────────────────────────────────────────────
function HeroCarousel() {
  const [cur, setCur] = useState(0)
  const [imgErr, setImgErr] = useState({})
  const timerRef = useRef(null)

  function go(n) {
    setCur((n + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => go(cur + 1), 4800)
    return () => clearInterval(timerRef.current)
  }, [cur])

  const s = HERO_SLIDES[cur]

  return (
    <div style={{
      borderRadius: '28px',
      overflow: 'hidden',
      background: `linear-gradient(160deg, ${s.grad[0]}, ${s.grad[1]})`,
      boxShadow: '0 24px 60px rgba(0,0,0,0.13)',
      border: '1px solid rgba(255,255,255,0.8)',
      transition: 'background 0.6s ease',
      position: 'relative',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        {!imgErr[cur] && (
          <img
            key={cur}
            src={s.img}
            alt={s.title}
            onError={() => setImgErr(prev => ({ ...prev, [cur]: true }))}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              animation: 'ks-fadein-slide 0.6s ease both',
            }}
          />
        )}
        {imgErr[cur] && (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(145deg, ${s.grad[0]}, ${s.grad[1]})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '64px',
          }}>
            {s.tag.split(' ')[0]}
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.30))',
        }}/>
        {/* Tag badge */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          background: s.tagBg,
          color: s.tagColor,
          fontSize: '9.5px', fontWeight: '800',
          padding: '4px 12px', borderRadius: '20px',
          letterSpacing: '0.07em',
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        }}>
          {s.tag}
        </div>
      </div>

      {/* Text body */}
      <div style={{ padding: '22px 22px 18px' }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(20px, 2.5vw, 26px)',
          fontWeight: '700', color: '#1a0e04',
          marginBottom: '8px', lineHeight: 1.25,
          animation: 'ks-fadein-slide 0.5s ease both 0.1s',
        }}>
          {s.title}
        </h3>
        <p style={{
          fontSize: '13px', color: '#4a3520',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.6, marginBottom: '18px',
          animation: 'ks-fadein-slide 0.5s ease both 0.2s',
        }}>
          {s.sub}
        </p>
        <a
          href={s.href}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: s.accent, color: '#fff',
            padding: '9px 20px', borderRadius: '24px',
            fontSize: '12.5px', fontWeight: '700',
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: 'none',
            boxShadow: `0 6px 18px -4px ${s.accent}80`,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {s.cta}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </a>
      </div>

      {/* Dot controls */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '6px',
        padding: '0 22px 18px',
      }}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCur(i)}
            style={{
              height: '5px',
              width: cur === i ? '22px' : '5px',
              borderRadius: '3px',
              background: cur === i ? s.accent : 'rgba(0,0,0,0.18)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Arrow controls */}
      {[{ dir: -1, pos: 'left:10px' }, { dir: 1, pos: 'right:10px' }].map(({ dir, pos }) => (
        <button
          key={dir}
          onClick={() => go(cur + dir)}
          style={{
            position: 'absolute', top: '90px', [dir === -1 ? 'left' : 'right']: '10px',
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.80)',
            border: '1px solid rgba(0,0,0,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.98)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.80)'}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            {dir === -1
              ? <path d="M8 2L4 6l4 4" stroke="#1a0e04" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M4 2l4 4-4 4" stroke="#1a0e04" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            }
          </svg>
        </button>
      ))}

      <style>{`
        @keyframes ks-fadein-slide {
          from { opacity: 0; transform: translateY(10px) }
          to   { opacity: 1; transform: translateY(0)     }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────
// CATEGORY CARD
// ─────────────────────────────────────────────
function CategoryCard({ cat }) {
  const [hov, setHov]       = useState(false)
  const [imgErr, setImgErr] = useState(false)

  return (
    <a
      href={`/category/${cat.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        borderRadius: '20px', overflow: 'hidden',
        textDecoration: 'none',
        background: '#fff',
        border: `1px solid ${hov ? cat.accent + '70' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: hov
          ? `0 16px 40px -8px ${cat.accent}30`
          : '0 2px 10px rgba(0,0,0,0.05)',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{
        height: '130px', overflow: 'hidden', position: 'relative',
        background: `linear-gradient(145deg, ${cat.accent}22, ${cat.accent}10)`,
        flexShrink: 0,
      }}>
        {!imgErr ? (
          <img
            src={cat.img} alt={cat.label}
            onError={() => setImgErr(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hov ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '48px',
          }}>
            {cat.icon}
          </div>
        )}
        {/* Overlay tint */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${cat.accent}30 0%, transparent 60%)`,
        }}/>
      </div>

      {/* Text */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px',
        }}>
          <span style={{ fontSize: '18px', lineHeight: 1 }}>{cat.icon}</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '14.5px', fontWeight: '700', color: '#1a0e04',
          }}>
            {cat.label}
          </span>
        </div>
        <p style={{
          fontSize: '12px', color: '#7a5c3a',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.5,
        }}>
          {cat.desc}
        </p>
      </div>
    </a>
  )
}

// ─────────────────────────────────────────────
// WHY KIDDLE PILLAR CARD
// ─────────────────────────────────────────────
function PillarCard({ p, delay }) {
  const [hov, setHov]       = useState(false)
  const [imgErr, setImgErr] = useState(false)

  return (
    <FadeSection delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          borderRadius: '20px', overflow: 'hidden',
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: hov ? '0 14px 36px rgba(100,60,20,0.12)' : '0 3px 12px rgba(0,0,0,0.05)',
          transform: hov ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Image */}
        <div style={{ height: '120px', overflow: 'hidden', position: 'relative' }}>
          {!imgErr ? (
            <img
              src={p.img} alt={p.title}
              onError={() => setImgErr(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: hov ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.4s ease',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(145deg, #f5f0e8, #ede5d8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '40px',
            }}>
              {p.icon}
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ padding: '18px 18px 20px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px', lineHeight: 1 }}>
            {p.icon}
          </div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '15.5px', fontWeight: '700', color: '#1a0e04', marginBottom: '6px',
          }}>
            {p.title}
          </h3>
          <p style={{
            fontSize: '12.5px', color: '#7a5c3a',
            fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65,
          }}>
            {p.desc}
          </p>
        </div>
      </div>
    </FadeSection>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function HomePage() {
  const [activeGrade,   setActiveGrade]   = useState(null)
  const [activeSubject, setActiveSubject] = useState(null)
  const [email,  setEmail]  = useState('')
  const [joined, setJoined] = useState(false)
  const { addToCart }      = useCart()
  const { toggleWishlist } = useWishlist()

  return (
    <div style={{ background: '#faf7f2', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════
          1. HERO
      ══════════════════════════════════════ */}
      <section
        className="hero-section"
        style={{
          minHeight: '88vh',
          display: 'grid',
          gridTemplateColumns: '1fr 0.85fr',
          alignItems: 'center',
          gap: '48px',
          padding: 'clamp(100px,12vh,120px) clamp(20px,5vw,64px) clamp(48px,6vh,80px)',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* ── Left text ── */}
        <div>
          {/* Kenya badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#FEF9EC',
            border: '1px solid #FCD34D',
            borderRadius: '40px', padding: '6px 16px',
            marginBottom: '28px',
          }}>
            <span style={{ fontSize: '17px' }}>🇰🇪</span>
            <span style={{
              fontSize: '11px', color: '#B45309',
              fontWeight: '700', letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Kenya's Favourite Bookshop
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: '800', color: '#1a0e04',
            lineHeight: 1.18, marginBottom: '10px',
          }}>
            More Than Books.
          </h1>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: '800',
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.18, marginBottom: '22px',
          }}>
            Inspiration.
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 1.8vw, 17px)',
            color: '#4a3520',
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.75, maxWidth: '480px', marginBottom: '36px',
          }}>
            CBC textbooks, storybooks, philosophy, stationery & African
            literature — all under one roof.{' '}
            <strong style={{ color: '#B45309' }}>Free delivery</strong>{' '}
            nationwide on orders above KSh 2,500.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <a href="/books" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #D97706, #B45309)',
              color: '#fff', padding: '13px 30px', borderRadius: '40px',
              fontSize: '14px', fontWeight: '700',
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: 'none',
              boxShadow: '0 10px 28px -6px rgba(180,83,9,0.45)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px -6px rgba(180,83,9,0.50)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 28px -6px rgba(180,83,9,0.45)' }}
            >
              Shop All Books
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </a>
            <a href="/category/cbc-education" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(0,0,0,0.10)',
              color: '#1a0e04', padding: '13px 24px', borderRadius: '40px',
              fontSize: '14px', fontWeight: '500',
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: 'none', backdropFilter: 'blur(8px)',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.98)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
            >
              📚 CBC Textbooks
            </a>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 'clamp(20px, 3vw, 36px)',
            flexWrap: 'wrap',
            paddingTop: '24px',
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}>
            {STATS.map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(22px,3vw,30px)',
                  fontWeight: '800', color: '#B45309', lineHeight: 1,
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: '11.5px', color: '#7a5c3a',
                  fontFamily: "'DM Sans', sans-serif",
                  marginTop: '3px',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: hero carousel ── */}
        <HeroCarousel />

        <style>{`
          @media (max-width: 900px) {
            .hero-section {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
              text-align: center;
            }
            .hero-section > div:first-child {
              align-items: center;
              display: flex;
              flex-direction: column;
            }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════
          2. SHOP CATEGORIES
      ══════════════════════════════════════ */}
      <FadeSection style={{ padding: '56px clamp(20px,5vw,64px)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <div style={{
              fontSize: '11px', fontWeight: '700', color: '#D97706',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: "'DM Sans', sans-serif", marginBottom: '6px',
            }}>
              Browse the store
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: '700', color: '#1a0e04', margin: 0,
            }}>
              What Would You Like to Explore?
            </h2>
          </div>
          <a href="/books" style={{
            fontSize: '12.5px', color: '#D97706', fontWeight: '600',
            fontFamily: "'DM Sans', sans-serif", textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '4px',
            border: '1px solid rgba(217,119,6,0.3)',
            padding: '6px 14px', borderRadius: '20px',
            background: 'rgba(217,119,6,0.07)',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(217,119,6,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(217,119,6,0.07)'}
          >
            View all →
          </a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '18px',
        }}>
          {CATEGORIES.map(cat => <CategoryCard key={cat.slug} cat={cat} />)}
        </div>
      </FadeSection>

      {/* ══════════════════════════════════════
          3. CBC GRADE & SUBJECT PICKER
      ══════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(to bottom, #fff8f0, #fef9ec)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <FadeSection style={{ padding: '52px clamp(20px,5vw,64px)', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#FEF9EC', border: '1px solid #FCD34D',
              borderRadius: '20px', padding: '5px 14px', marginBottom: '12px',
            }}>
              <span style={{ fontSize: '14px' }}>📚</span>
              <span style={{
                fontSize: '10.5px', color: '#B45309', fontWeight: '700',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                CBC Kenya Curriculum
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: '700', color: '#1a0e04', marginBottom: '8px',
            }}>
              Find Books by Grade or Subject
            </h2>
            <p style={{
              fontSize: '14px', color: '#7a5c3a',
              fontFamily: "'DM Sans', sans-serif",
              maxWidth: '500px', margin: '0 auto', lineHeight: 1.7,
            }}>
              KICD-approved textbooks, workbooks, and revision guides
              for every level of the CBC curriculum
            </p>
          </div>

          {/* Grade pills */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontSize: '12px', fontWeight: '700', color: '#7a5c3a',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              By Grade Level
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {GRADE_LEVELS.map(g => (
                <CategoryPill
                  key={g.slug}
                  label={`${g.label} · ${g.age}`}
                  icon={g.icon}
                  count={g.count}
                  active={activeGrade === g.slug}
                  onClick={() => setActiveGrade(activeGrade === g.slug ? null : g.slug)}
                  size="md"
                />
              ))}
            </div>
          </div>

          {/* Subject pills */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              fontSize: '12px', fontWeight: '700', color: '#7a5c3a',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              By Subject
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {SUBJECTS.map(s => (
                <CategoryPill
                  key={s.slug}
                  label={s.label}
                  icon={s.icon}
                  active={activeSubject === s.slug}
                  onClick={() => setActiveSubject(activeSubject === s.slug ? null : s.slug)}
                  size="md"
                />
              ))}
            </div>
          </div>

          {/* Find books CTA */}
          {(activeGrade || activeSubject) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 22px',
              background: '#FEF9EC',
              border: '1px solid #FCD34D',
              borderRadius: '16px',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '13.5px', color: '#B45309', fontFamily: "'DM Sans', sans-serif" }}>
                {activeGrade
                  ? `Showing books for: ${GRADE_LEVELS.find(g => g.slug === activeGrade)?.label}`
                  : ''}
                {activeGrade && activeSubject ? ' · ' : ''}
                {activeSubject
                  ? `${SUBJECTS.find(s => s.slug === activeSubject)?.label}`
                  : ''}
              </span>
              <a href={`/books?grade=${activeGrade || ''}&subject=${activeSubject || ''}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#D97706', color: '#fff',
                  padding: '9px 20px', borderRadius: '20px',
                  fontSize: '12.5px', fontWeight: '700',
                  fontFamily: "'DM Sans', sans-serif", textDecoration: 'none',
                }}>
                Find Books →
              </a>
              <button onClick={() => { setActiveGrade(null); setActiveSubject(null) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '12px', color: '#9a7a5a',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                Clear filters
              </button>
            </div>
          )}
        </FadeSection>
      </div>

      {/* ══════════════════════════════════════
          4. SPECIAL OFFERS CAROUSEL
      ══════════════════════════════════════ */}
      <FadeSection style={{ padding: '56px clamp(20px,5vw,64px)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(160deg, #fffbf2 0%, #fff8e8 100%)',
          border: '1px solid rgba(252,211,77,0.40)',
          borderRadius: '28px', padding: '32px 28px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}>
          <OffersCarousel
            title="Special Offers"
            subtitle="Limited-time deals on books & stationery"
          />
        </div>
      </FadeSection>

      {/* divider */}
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '0 clamp(20px,5vw,64px)' }}/>

      {/* ══════════════════════════════════════
          5. FEATURED PICKS
      ══════════════════════════════════════ */}
      <FadeSection style={{ padding: '56px clamp(20px,5vw,64px)', maxWidth: '1280px', margin: '0 auto' }}>
        <FeaturedCarousel
          title="⭐ Bestsellers This Month"
          viewAllHref="/books/bestsellers"
        />
      </FadeSection>

      {/* ══════════════════════════════════════
          6. WHY KIDDLE
      ══════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(to bottom, #fff8f0, #fef9ec)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: '60px 0',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(20px,5vw,64px)' }}>
          <FadeSection style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: '700', color: '#1a0e04',
            }}>
              Why Choose Kiddle?
            </h2>
            <p style={{
              fontSize: '14px', color: '#7a5c3a',
              fontFamily: "'DM Sans', sans-serif",
              maxWidth: '440px', margin: '10px auto 0', lineHeight: 1.7,
            }}>
              More than a bookshop — a community of curious minds across Kenya
            </p>
          </FadeSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px',
          }}>
            {WHY_PILLARS.map((p, i) => <PillarCard key={i} p={p} delay={i * 80} />)}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          7. NEWSLETTER
      ══════════════════════════════════════ */}
      <FadeSection style={{
        padding: '64px clamp(20px,5vw,64px)',
        maxWidth: '1280px', margin: '0 auto',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #FEF9EC 0%, #FEF3C7 100%)',
          border: '1px solid rgba(252,211,77,0.5)',
          borderRadius: '32px', padding: 'clamp(36px,5vw,56px) clamp(24px,5vw,48px)',
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '14px' }}>📬</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(24px, 3.5vw, 34px)',
            fontWeight: '700', color: '#78350F', marginBottom: '10px',
          }}>
            Get Book Recommendations
          </h2>
          <p style={{
            fontSize: '14.5px', color: '#92400E',
            fontFamily: "'DM Sans', sans-serif",
            maxWidth: '440px', margin: '0 auto 28px', lineHeight: 1.75,
          }}>
            Weekly picks, CBC updates, author interviews & exclusive discounts —
            join 50,000 readers across Kenya.
          </p>

          {joined ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '50px', padding: '13px 28px',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="#059669" strokeWidth="1.4"/>
                <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: '14px', color: '#065F46', fontWeight: '700', fontFamily: "'DM Sans', sans-serif" }}>
                Welcome to the Kiddle community! 🎉
              </span>
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setJoined(true) }}
              style={{ display: 'flex', gap: '0', maxWidth: '440px', margin: '0 auto 12px' }}
            >
              <input
                type="email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email…"
                style={{
                  flex: 1, padding: '13px 20px',
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(0,0,0,0.10)', borderRight: 'none',
                  borderRadius: '40px 0 0 40px', outline: 'none',
                  fontSize: '13.5px', color: '#1a0e04',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button type="submit" style={{
                padding: '13px 26px',
                background: 'linear-gradient(135deg, #D97706, #B45309)',
                color: '#fff', border: 'none',
                borderRadius: '0 40px 40px 0',
                fontSize: '13.5px', fontWeight: '700',
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                Subscribe
              </button>
            </form>
          )}
          <p style={{ fontSize: '11px', color: '#B45309', fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}>
            No spam. Only great books.
          </p>
        </div>
      </FadeSection>

    </div>
  )
}