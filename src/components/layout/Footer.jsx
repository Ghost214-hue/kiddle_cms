import { useState } from 'react'

const SHOP_LINKS = [
  { label: 'All Books',              href: '/books' },
  { label: "Children's Collection", href: '/category/childrens' },
  { label: 'Rare Finds',            href: '/category/rare' },
  { label: 'Gifts & Stationery',    href: '/category/gifts' },
]

const SUPPORT_LINKS = [
  { label: 'Track Order',    href: '/track' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Refunds',        href: '/refunds' },
  { label: 'Contact Us',     href: '/contact' },
]

const SOCIAL = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="11.8" cy="4.2" r="0.8" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1.5 1.5l5 6.2L1.5 13.5H3l4-4.5 3.5 4.5H13.5L8.2 7 13 1.5H11.5L7.8 5.7 4.5 1.5H1.5Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M9.5 1H7C5.3 1 4 2.3 4 4v1.5H2v2.5h2V14h3V8h2.3L9.8 5.5H7V4c0-.3.2-.5.5-.5H9.5V1Z" fill="currentColor"/>
      </svg>
    ),
  },
]

function FooterSection({ title, links }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[rgba(180,140,90,0.15)] md:border-0">
      {/* Mobile accordion toggle */}
      <button
        className="md:hidden w-full flex items-center justify-between py-4 text-[13px] font-semibold text-[#5c3d1e] uppercase tracking-widest"
        onClick={() => setOpen(v => !v)}
      >
        {title}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Desktop always visible title */}
      <p className="hidden md:block text-[11px] font-semibold text-[#5c3d1e] uppercase tracking-widest mb-4">
        {title}
      </p>

      {/* Links */}
      <ul className={`
        md:block space-y-2.5 overflow-hidden transition-all duration-300
        ${open ? 'max-h-60 pb-4' : 'max-h-0 md:max-h-none'}
      `}>
        {links.map(link => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[13px] text-[#9a7a5a] hover:text-[#5c3d1e] transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer className="bg-[#f0e9dc] border-t border-[rgba(180,140,90,0.2)] mt-16">

      {/* ── Book Club Banner ── */}
      <div className="bg-[rgba(160,105,58,0.10)] border-b border-[rgba(180,140,90,0.18)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                {/* decorative stars */}
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1l1.2 3.6H11L8.1 6.8l1.2 3.6L6 8.4 2.7 10.4l1.2-3.6L1 4.6h3.8L6 1Z" fill="#a0693a" opacity={i < 4 ? '1' : '0.4'}/>
                  </svg>
                ))}
              </div>
              <h3 className="font-serif text-[22px] md:text-[26px] font-semibold text-[#3d2010] mb-1">
                Join the Kiddle Book Club
              </h3>
              <p className="text-[13px] text-[#9a7a5a] max-w-md">
                Receive monthly curated boxes, access to exclusive author Q&amp;As, and 10% off all your lifetime purchases.
              </p>
            </div>

            {/* Newsletter form */}
            {subscribed ? (
              <div className="flex items-center gap-2 bg-white/60 border border-[rgba(160,105,58,0.3)] rounded-full px-6 py-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#a0693a" strokeWidth="1.4"/>
                  <path d="M5 8l2 2 4-4" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[13px] text-[#5c3d1e] font-medium">You're in! Welcome to the club.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-0 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email to join…"
                  required
                  className="
                    flex-1 md:w-64 px-5 py-3 text-[13px]
                    bg-white/70 border border-[rgba(180,140,90,0.3)] border-r-0
                    rounded-l-full outline-none text-[#3d2f1f]
                    placeholder:text-[#b09070]
                    focus:bg-white/90 transition-colors duration-200
                  "
                />
                <button
                  type="submit"
                  className="
                    px-6 py-3 bg-[#a0693a] hover:bg-[#8a5830]
                    text-white text-[13px] font-medium
                    rounded-r-full border border-[#a0693a]
                    transition-colors duration-200 whitespace-nowrap
                  "
                >
                  Join for Free
                </button>
              </form>
            )}
          </div>
          <p className="text-center text-[11px] text-[#b09070] mt-4">
            No spam. Only beautiful books. Ever.
          </p>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-12">

          {/* Brand col */}
          <div className="pb-6 md:pb-0 border-b border-[rgba(180,140,90,0.15)] md:border-0">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full border-2 border-[#a0693a] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="12" rx="1" fill="#a0693a"/>
                  <rect x="9" y="2" width="5" height="12" rx="1" fill="#c48b52" opacity="0.6"/>
                </svg>
              </span>
              <span className="font-serif text-[16px] font-semibold text-[#5c3d1e]">
                Kiddle <span className="text-[#a0693a]">Bookshop</span>
              </span>
            </a>
            <p className="text-[12.5px] text-[#9a7a5a] leading-relaxed mb-5 max-w-[220px]">
              Curating refined reading experiences since 1994. Join our community for exclusive early releases and cozy reading recommendations.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="
                    w-9 h-9 rounded-full border border-[rgba(180,140,90,0.3)]
                    bg-white/40 flex items-center justify-center
                    text-[#9a7a5a] hover:text-[#a0693a] hover:bg-white/70
                    transition-all duration-200
                  "
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <FooterSection title="Shop" links={SHOP_LINKS} />

          {/* Support links */}
          <FooterSection title="Support" links={SUPPORT_LINKS} />

          {/* Address / contact col */}
          <div className="pt-4 md:pt-0">
            <p className="hidden md:block text-[11px] font-semibold text-[#5c3d1e] uppercase tracking-widest mb-4">
              Follow Us
            </p>
            <p className="hidden md:block text-[12.5px] text-[#9a7a5a] leading-relaxed mb-4">
              123 Literature Lane,<br />
              Storybrook Village, NY 10012
            </p>
            <a
              href="mailto:hello@kiddle.com"
              className="hidden md:block text-[12.5px] text-[#a0693a] hover:text-[#7a4e22] transition-colors duration-200 mb-1"
            >
              hello@kiddle.com
            </a>
            <a
              href="tel:+15552344266"
              className="hidden md:block text-[12.5px] text-[#9a7a5a] hover:text-[#5c3d1e] transition-colors duration-200"
            >
              (555) 234-BOOK
            </a>

            {/* Newsletter label mobile */}
            <div className="md:hidden border-t border-[rgba(180,140,90,0.15)] pt-4 mt-2">
              <p className="text-[11px] font-semibold text-[#5c3d1e] uppercase tracking-widest mb-3">Newsletter</p>
              <div className="flex gap-0">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 text-[12px] bg-white/60 border border-[rgba(180,140,90,0.25)] border-r-0 rounded-l-full outline-none text-[#3d2f1f] placeholder:text-[#b09070]"
                />
                <button className="px-4 py-2.5 bg-[#a0693a] rounded-r-full border border-[#a0693a] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[rgba(180,140,90,0.18)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11.5px] text-[#b09070] text-center sm:text-left">
              © 2024 Kiddle Bookshop. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {['Privacy Policy', 'Terms of Service', 'Accessibility'].map(item => (
                <a
                  key={item}
                  href="#"
                  className="text-[11px] text-[#b09070] hover:text-[#7a4e22] transition-colors duration-200 uppercase tracking-wider"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
