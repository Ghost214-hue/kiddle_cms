import { useState, useEffect, useRef } from 'react'
import OffersCarousel from '../components/carousel/OffersCarousel'
import FeaturedCarousel from '../components/carousel/FeaturedCarousel'
import CategoryPill from '../components/ui/CategoryPill'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/CartContext'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const CATEGORIES = [
  {
    slug: 'cbc-education',
    label: 'CBC Textbooks',
    icon: '📚',
    desc: 'KICD approved books for all levels',
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=75',
    accent: '#D97706',
  },
  {
    slug: 'stationery',
    label: 'Stationery',
    icon: '✏️',
    desc: 'Pens, notebooks, art supplies & more',
    img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&q=75',
    accent: '#2563EB',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    icon: '🎒',
    desc: 'Bookmarks, bags, reading lights',
    img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&q=75',
    accent: '#7C3AED',
  },
]

const GRADE_LEVELS = [
  { slug: 'pp1-pp2', label: 'PP1–PP2', icon: '🎨', age: '4–6 yrs', count: 97 },
  { slug: 'lower-primary', label: 'Grade 1–3', icon: '📖', age: '6–9 yrs', count: 156 },
  { slug: 'upper-primary', label: 'Grade 4–6', icon: '🔬', age: '9–12 yrs', count: 143 },
  { slug: 'junior-secondary', label: 'Grade 7–9', icon: '⚗️', age: '12–15 yrs', count: 128 },
  { slug: 'senior-school', label: 'Grade 10–12', icon: '🎓', age: '15–18 yrs', count: 112 },
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
    sub: '25% off CBC textbooks + free stationery kit on orders above KSh 3,000',
    cta: 'Shop the Deal',
    href: '/category/cbc-education',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    grad: ['#FEF9EC', '#FEF3C7'],
    accent: '#D97706',
  },
  {
    tag: '✨ NEW ARRIVALS',
    tagBg: '#EFF6FF', tagColor: '#1D4ED8',
    title: 'Fresh Reads',
    sub: 'Latest philosophy, African fiction & workbooks just landed this week',
    cta: 'Explore New Titles',
    href: '/new-arrivals',
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    grad: ['#EFF6FF', '#DBEAFE'],
    accent: '#2563EB',
  },
  {
    tag: '✏️ STATIONERY',
    tagBg: '#F0FDF4', tagColor: '#166534',
    title: 'Premium Supplies',
    sub: 'Japanese pens, leather-bound notebooks & complete math sets',
    cta: 'Shop Stationery',
    href: '/category/stationery',
    img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&q=80',
    grad: ['#F0FDF4', '#DCFCE7'],
    accent: '#059669',
  },
  {
    tag: '🌍 AFRICAN VOICES',
    tagBg: '#FFF7ED', tagColor: '#9A3412',
    title: 'Local Stories',
    sub: "Ngũgĩ, Chimamanda, Yvonne Owuor — Kenya's best authors in one place",
    cta: 'Discover Authors',
    href: '/category/african-writers',
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
    grad: ['#FFF7ED', '#FFEDD5'],
    accent: '#EA580C',
  },
]

const STATS = [
  { value: '50K+', label: 'Happy Customers', icon: '😊' },
  { value: '10K+', label: 'Book Titles', icon: '📚' },
  { value: '1,200+', label: 'Partner Schools', icon: '🏫' },
  { value: '47', label: 'Counties Served', icon: '🇰🇪' },
]

// ─────────────────────────────────────────────
// SECTION FADE WRAPPER
// ─────────────────────────────────────────────
function FadeSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
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
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(28px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// STATS SECTION COMPONENT
// ─────────────────────────────────────────────
function StatsSection() {
  return (
    <div className="bg-gradient-to-br from-[#FEF9EC] to-[#FFF8E8] border-y border-[rgba(252,211,77,0.3)] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <FadeSection className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-[#FCD34D] rounded-full py-1.5 px-4 mb-4">
            <span className="text-sm md:text-base">📊</span>
            <span className="text-[10px] md:text-[11px] text-[#B45309] font-bold tracking-wider uppercase">
              Our Impact Across Kenya
            </span>
          </div>
          <h2 className="font-['Playfair_Display'] font-bold text-[#1a0e04] text-2xl sm:text-3xl md:text-4xl">
            Trusted by Readers Nationwide
          </h2>
          <p className="text-sm md:text-base text-[#7a5c3a] max-w-lg mx-auto mt-3 leading-relaxed">
            Join thousands of happy customers who choose Kiddle for their reading journey
          </p>
        </FadeSection>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, index) => (
            <FadeSection key={index} delay={index * 100}>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl mb-2 md:mb-3 transition-transform duration-300 group-hover:scale-110">
                  {stat.icon}
                </div>
                <div className="font-['Playfair_Display'] font-extrabold text-[#B45309] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs md:text-sm text-[#7a5c3a] mt-1.5 md:mt-2 font-medium tracking-wide">
                  {stat.label}
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
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
    <div
      className="relative rounded-[28px] overflow-hidden shadow-xl border border-white/80 transition-all duration-500"
      style={{ background: `linear-gradient(160deg, ${s.grad[0]}, ${s.grad[1]})` }}
    >
      <div className="relative h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden">
        {!imgErr[cur] && (
          <img
            key={cur}
            src={s.img}
            alt={s.title}
            onError={() => setImgErr(prev => ({ ...prev, [cur]: true }))}
            className="w-full h-full object-cover animate-[ks-fadein-slide_0.6s_ease_both]"
          />
        )}
        {imgErr[cur] && (
          <div
            className="w-full h-full flex items-center justify-center text-6xl"
            style={{ background: `linear-gradient(145deg, ${s.grad[0]}, ${s.grad[1]})` }}
          >
            {s.tag.split(' ')[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div
          className="absolute top-3.5 left-3.5 text-[9.5px] font-extrabold py-1 px-3 rounded-full shadow-sm tracking-wide"
          style={{ background: s.tagBg, color: s.tagColor }}
        >
          {s.tag}
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-[22px]">
        <h3 className="font-['Playfair_Display'] font-bold text-[#1a0e04] mb-2 leading-tight text-lg sm:text-xl md:text-2xl animate-[ks-fadein-slide_0.5s_ease_both_0.1s]">
          {s.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-[#4a3520] leading-relaxed mb-3 sm:mb-4 animate-[ks-fadein-slide_0.5s_ease_both_0.2s]">
          {s.sub}
        </p>
        <a
          href={s.href}
          className="inline-flex items-center gap-1.5 text-white py-1.5 sm:py-2 px-4 sm:px-5 rounded-full text-xs font-bold no-underline transition-opacity hover:opacity-90"
          style={{ background: s.accent, boxShadow: `0 6px 18px -4px ${s.accent}80` }}
        >
          {s.cta}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </a>
      </div>

      <div className="flex justify-center gap-1.5 pb-4 sm:pb-5">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCur(i)}
            className="h-1 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: cur === i ? '22px' : '5px',
              background: cur === i ? s.accent : 'rgba(0,0,0,0.18)',
            }}
          />
        ))}
      </div>

      <button
        onClick={() => go(cur - 1)}
        className="absolute top-[90px] left-2.5 w-7 h-7 rounded-full bg-white/80 border border-black/10 flex items-center justify-center cursor-pointer backdrop-blur-md shadow-sm transition-colors hover:bg-white/95"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M8 2L4 6l4 4" stroke="#1a0e04" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={() => go(cur + 1)}
        className="absolute top-[90px] right-2.5 w-7 h-7 rounded-full bg-white/80 border border-black/10 flex items-center justify-center cursor-pointer backdrop-blur-md shadow-sm transition-colors hover:bg-white/95"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M4 2l4 4-4 4" stroke="#1a0e04" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <style>{`
        @keyframes ks-fadein-slide {
          from { opacity: 0; transform: translateY(10px) }
          to { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────
// CATEGORY CARD (compact with image and overlay)
// ─────────────────────────────────────────────
function CategoryCard({ cat }) {
  const [hov, setHov] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  return (
    <a
      href={`/category/${cat.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="group relative flex flex-col rounded-2xl overflow-hidden no-underline transition-all duration-300 cursor-pointer h-full"
      style={{
        background: '#fff',
        boxShadow: hov ? `0 20px 40px -12px ${cat.accent}40` : '0 4px 12px rgba(0,0,0,0.08)',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div className="h-32 sm:h-36 md:h-40 overflow-hidden relative">
        {!imgErr ? (
          <img
            src={cat.img}
            alt={cat.label}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: `linear-gradient(145deg, ${cat.accent}22, ${cat.accent}10)` }}
          >
            {cat.icon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 text-2xl sm:text-3xl drop-shadow-lg">
          {cat.icon}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-['Playfair_Display'] text-sm sm:text-base font-bold text-[#1a0e04] mb-0.5 sm:mb-1">
          {cat.label}
        </h3>
        <p className="text-[11px] sm:text-xs text-[#7a5c3a] leading-relaxed">
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
  const [hov, setHov] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  return (
    <FadeSection delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="rounded-2xl overflow-hidden bg-white border border-black/10 transition-all duration-200"
        style={{
          boxShadow: hov ? '0 14px 36px rgba(100,60,20,0.12)' : '0 3px 12px rgba(0,0,0,0.05)',
          transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div className="h-[100px] sm:h-[110px] md:h-[120px] overflow-hidden relative">
          {!imgErr ? (
            <img
              src={p.img}
              alt={p.title}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover transition-transform duration-400"
              style={{ transform: hov ? 'scale(1.06)' : 'scale(1)' }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f5f0e8] to-[#ede5d8] flex items-center justify-center text-4xl">
              {p.icon}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-xl sm:text-2xl mb-1 sm:mb-2 leading-none">{p.icon}</div>
          <h3 className="font-['Playfair_Display'] text-sm sm:text-[15.5px] font-bold text-[#1a0e04] mb-1 sm:mb-1.5">
            {p.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#7a5c3a] leading-relaxed">
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
  const [activeGrade, setActiveGrade] = useState(null)
  const [activeSubject, setActiveSubject] = useState(null)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const { addToCart } = useCart()
  const { toggleWishlist } = useWishlist()

  return (
    <div className="bg-[#faf7f2] min-h-screen pt-20 md:pt-20">
      
      {/* ══════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-12 pb-8 md:pb-12 px-5 md:px-8 max-w-7xl mx-auto">
          
          {/* Left content */}
          <div>
            {/* Kenya badge */}
            <div className="inline-flex items-center gap-2 bg-[#FEF9EC] border border-[#FCD34D] rounded-full py-1.5 px-4 mb-5 md:mb-6">
              <span className="text-base md:text-lg">🇰🇪</span>
              <span className="text-[10px] md:text-[11px] text-[#B45309] font-bold tracking-wider uppercase">
                Kenya's Favourite Bookshop
              </span>
            </div>

            <h1 className="font-['Playfair_Display'] font-extrabold text-[#1a0e04] leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              More Than Books.
            </h1>
            <h1 className="font-['Playfair_Display'] font-extrabold italic mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-[#D97706] to-[#B45309] bg-clip-text text-transparent">
              Inspiration.
            </h1>

            <p className="text-sm sm:text-base text-[#4a3520] leading-relaxed max-w-lg mb-8 md:mb-10">
              CBC textbooks, storybooks, philosophy, stationery & African
              literature — all under one roof.{' '}
              <strong className="text-[#B45309]">Free delivery</strong>{' '}
              nationwide on orders above KSh 2,500.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10 md:mb-12">
              <a
                href="/books"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D97706] to-[#B45309] text-white py-2.5 px-5 sm:py-3 sm:px-7 rounded-full text-xs sm:text-sm font-bold no-underline shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Shop All Books
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </a>
              <a
                href="/category/cbc-education"
                className="inline-flex items-center gap-2 bg-white/85 border border-black/10 text-[#1a0e04] py-2.5 px-5 sm:py-3 sm:px-6 rounded-full text-xs sm:text-sm font-medium no-underline backdrop-blur-sm transition-colors hover:bg-white/95"
              >
                📚 CBC Textbooks
              </a>
            </div>

            {/* 3 Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              {CATEGORIES.map(cat => (
                <CategoryCard key={cat.slug} cat={cat} />
              ))}
            </div>
          </div>

          {/* Right: Hero Carousel */}
          <div className="lg:sticky lg:top-24 mt-8 lg:mt-0">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* Responsive fix for mobile */}
      <style>{`
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .grid > div:first-child {
            order: 1;
          }
          .grid > div:last-child {
            order: 0;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════
          2. STATS SECTION (NEW)
      ══════════════════════════════════════ */}
      <StatsSection />

      {/* ══════════════════════════════════════
          3. CBC GRADE & SUBJECT PICKER
      ══════════════════════════════════════ */}
      <div className="bg-gradient-to-b from-[#fff8f0] to-[#fef9ec] border-y border-black/10">
        <FadeSection className="px-5 md:px-8 max-w-7xl mx-auto py-12 md:py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#FEF9EC] border border-[#FCD34D] rounded-full py-1.5 px-4 mb-4">
              <span className="text-sm md:text-base">📚</span>
              <span className="text-[10px] md:text-[11px] text-[#B45309] font-bold tracking-wider uppercase">
                CBC Kenya Curriculum
              </span>
            </div>
            <h2 className="font-['Playfair_Display'] font-bold text-[#1a0e04] text-2xl sm:text-3xl md:text-4xl mb-3">
              Find Books by Grade or Subject
            </h2>
            <p className="text-sm md:text-base text-[#7a5c3a] max-w-md mx-auto leading-relaxed">
              KICD-approved textbooks, workbooks, and revision guides
              for every level of the CBC curriculum
            </p>
          </div>

          {/* Grade pills */}
          <div className="mb-8">
            <div className="text-xs md:text-sm font-bold text-[#7a5c3a] tracking-wide uppercase mb-4">
              By Grade Level
            </div>
            <div className="flex flex-wrap gap-3">
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
          <div className="mb-8">
            <div className="text-xs md:text-sm font-bold text-[#7a5c3a] tracking-wide uppercase mb-4">
              By Subject
            </div>
            <div className="flex flex-wrap gap-3">
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
            <div className="flex items-center gap-4 p-4 bg-[#FEF9EC] border border-[#FCD34D] rounded-xl flex-wrap">
              <span className="text-sm md:text-base text-[#B45309]">
                {activeGrade && `Showing books for: ${GRADE_LEVELS.find(g => g.slug === activeGrade)?.label}`}
                {activeGrade && activeSubject && ' · '}
                {activeSubject && SUBJECTS.find(s => s.slug === activeSubject)?.label}
              </span>
              <a
                href={`/books?grade=${activeGrade || ''}&subject=${activeSubject || ''}`}
                className="inline-flex items-center gap-1.5 bg-[#D97706] text-white py-2 px-5 rounded-full text-sm font-bold no-underline"
              >
                Find Books →
              </a>
              <button
                onClick={() => { setActiveGrade(null); setActiveSubject(null) }}
                className="bg-none border-none cursor-pointer text-sm text-[#9a7a5a] hover:text-[#7a5c3a] transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </FadeSection>
      </div>

      {/* ══════════════════════════════════════
          4. SPECIAL OFFERS CAROUSEL
      ══════════════════════════════════════ */}
      <FadeSection className="px-5 md:px-8 max-w-7xl mx-auto py-14 md:py-16">
        <div className="bg-gradient-to-br from-[#fffbf2] to-[#fff8e8] border border-[rgba(252,211,77,0.4)] rounded-2xl md:rounded-[28px] p-6 md:p-8 shadow-sm">
          <OffersCarousel
            title="Special Offers"
            subtitle="Limited-time deals on books & stationery"
          />
        </div>
      </FadeSection>

      {/* divider */}
      <div className="h-px bg-black/10 mx-5 md:mx-8" />

      {/* ══════════════════════════════════════
          5. FEATURED PICKS
      ══════════════════════════════════════ */}
      <FadeSection className="px-5 md:px-8 max-w-7xl mx-auto py-14 md:py-16">
        <FeaturedCarousel
          title="⭐ Bestsellers This Month"
          viewAllHref="/books/bestsellers"
        />
      </FadeSection>

      {/* ══════════════════════════════════════
          6. WHY KIDDLE
      ══════════════════════════════════════ */}
      <div className="bg-gradient-to-b from-[#fff8f0] to-[#fef9ec] border-t border-black/10 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <FadeSection className="text-center mb-10 md:mb-12">
            <h2 className="font-['Playfair_Display'] font-bold text-[#1a0e04] text-2xl sm:text-3xl md:text-4xl">
              Why Choose Kiddle?
            </h2>
            <p className="text-sm md:text-base text-[#7a5c3a] max-w-md mx-auto mt-3 leading-relaxed">
              More than a bookshop — a community of curious minds across Kenya
            </p>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {WHY_PILLARS.map((p, i) => <PillarCard key={i} p={p} delay={i * 80} />)}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          7. NEWSLETTER
      ══════════════════════════════════════ */}
      <FadeSection className="px-5 md:px-8 max-w-7xl mx-auto py-14 md:py-16">
        <div className="bg-gradient-to-br from-[#FEF9EC] to-[#FEF3C7] border border-[rgba(252,211,77,0.5)] rounded-2xl md:rounded-3xl p-8 md:p-12 text-center shadow-md">
          <div className="text-4xl md:text-5xl mb-4 md:mb-5">📬</div>
          <h2 className="font-['Playfair_Display'] font-bold text-[#78350F] text-2xl sm:text-3xl md:text-4xl mb-3">
            Get Book Recommendations
          </h2>
          <p className="text-sm md:text-base text-[#92400E] max-w-md mx-auto mb-8 leading-relaxed">
            Weekly picks, CBC updates, author interviews & exclusive discounts —
            join 50,000 readers across Kenya.
          </p>

          {joined ? (
            <div className="inline-flex items-center gap-3 bg-white/85 border border-black/10 rounded-full py-3 px-6 md:py-3 md:px-8">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="#059669" strokeWidth="1.4" />
                <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm md:text-base text-[#065F46] font-bold">
                Welcome to the Kiddle community! 🎉
              </span>
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setJoined(true) }}
              className="flex max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email…"
                className="flex-1 py-3 px-5 bg-white/85 border border-black/10 border-r-0 rounded-l-full outline-none text-sm md:text-base text-[#1a0e04]"
              />
              <button
                type="submit"
                className="py-3 px-6 md:py-3 md:px-8 bg-gradient-to-r from-[#D97706] to-[#B45309] text-white border-none rounded-r-full text-sm md:text-base font-bold cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-[11px] md:text-xs text-[#B45309] opacity-70 mt-4">
            No spam. Only great books.
          </p>
        </div>
      </FadeSection>

    </div>
  )
}