import { useState } from 'react'

// ── Small info row used in the left panel ─────────────────────────────────────
function InfoRow({ icon, label, value, href }) {
  return (
    <div className="flex gap-[14px] items-start">
      <div className="w-10 h-10 rounded-[11px] flex-shrink-0 bg-[rgba(160,105,58,0.10)] border border-[rgba(160,105,58,0.20)] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-[10.5px] font-bold text-[#a0693a] font-['DM_Sans',sans-serif] tracking-[0.07em] uppercase mb-0.5">
          {label}
        </div>
        {href ? (
          <a 
            href={href} 
            className="text-[13.5px] text-[#3d2010] font-['DM_Sans',sans-serif] no-underline leading-[1.6] whitespace-pre-line transition-colors duration-180 hover:text-[#a0693a]"
          >
            {value}
          </a>
        ) : (
          <p className="text-[13.5px] text-[#3d2010] font-['DM_Sans',sans-serif] leading-[1.6] m-0 whitespace-pre-line">
            {value}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Reusable input / textarea wrapper ─────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-[#a0693a] font-['DM_Sans',sans-serif] tracking-[0.07em] uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const { name, email, subject, message } = form

    const body = encodeURIComponent(
      `Name: ${name}\nFrom: ${email}\n\n${message}`
    )
    const mailtoHref = `mailto:hello@kiddle.com?subject=${encodeURIComponent(subject || 'Contact form enquiry')}&body=${body}`
    window.location.href = mailtoHref
    setSent(true)
  }

  const ready = form.name.trim() && form.email.trim() && form.message.trim()

  const inputClasses = `
    w-full px-[14px] py-[11px] text-[13.5px] text-[#3d2010]
    font-['DM_Sans',sans-serif] bg-[rgba(255,252,246,0.70)]
    border border-[rgba(180,140,90,0.30)] rounded-xl outline-none
    transition-all duration-200
    focus:border-[rgba(160,105,58,0.55)] focus:shadow-[0_0_0_3px_rgba(160,105,58,0.10)]
    hover:border-[rgba(160,105,58,0.40)]
  `

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-20">
      {/* Page header */}
      <div className="max-w-[1100px] mx-auto px-[clamp(20px,4vw,48px)] pt-[clamp(40px,6vw,72px)] pb-0">
        <div className="inline-flex items-center bg-[rgba(160,105,58,0.10)] border border-[rgba(160,105,58,0.22)] rounded-[20px] px-4 py-[5px] text-[10.5px] font-bold text-[#a0693a] font-['DM_Sans',sans-serif] tracking-[0.08em] uppercase mb-4">
          We'd love to hear from you
        </div>

        <h1 className="font-['Playfair_Display',serif] text-[clamp(28px,5vw,48px)] font-bold text-[#3d2010] leading-[1.2] mb-3">
          Get in Touch
        </h1>
        <p className="text-[14px] text-[#7a5c3a] font-['DM_Sans',sans-serif] leading-[1.75] max-w-[460px] mb-0">
          Whether you're looking for a recommendation, chasing a rare edition, or just want to say hello — our team is happy to help.
        </p>
      </div>

      {/* Two-column body */}
      <div className="max-w-[1100px] mx-auto px-[clamp(20px,4vw,48px)] py-[clamp(32px,5vw,56px)] pb-[clamp(48px,7vw,96px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.55fr] gap-[clamp(32px,5vw,64px)] items-start">
          
          {/* LEFT — Details */}
          <div className="flex flex-col gap-8">
            {/* Glass card */}
            <div className="bg-[rgba(255,255,255,0.55)] border border-[rgba(200,170,130,0.28)] rounded-[22px] p-[clamp(24px,4vw,32px)_clamp(20px,4vw,28px)] backdrop-blur-sm shadow-[0_4px_24px_rgba(100,60,20,0.07)] flex flex-col gap-6">
              <InfoRow
                label="Store Address"
                value={"123 Literature Lane\nStorybrook Village, NY 10012"}
                icon={
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                    <path d="M11 2C7.7 2 5 4.7 5 8c0 5 6 11 6 11s6-6 6-11c0-3.3-2.7-6-6-6Z" stroke="#a0693a" strokeWidth="1.5"/>
                    <circle cx="11" cy="8" r="2" fill="#a0693a"/>
                  </svg>
                }
              />

              <div className="h-px bg-[rgba(180,140,90,0.18)]" />

              <InfoRow
                label="Email"
                value="hello@kiddle.com"
                href="mailto:hello@kiddle.com"
                icon={
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                    <path d="M4 4h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2Z" stroke="#a0693a" strokeWidth="1.5"/>
                    <path d="M2 6l9 6 9-6" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                }
              />

              <InfoRow
                label="Orders & Shipping"
                value="shipping@kiddle.com"
                href="mailto:shipping@kiddle.com"
                icon={
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="6" width="14" height="11" rx="2" stroke="#a0693a" strokeWidth="1.5"/>
                    <path d="M16 9h2l2 4v3h-4V9Z" stroke="#a0693a" strokeWidth="1.5" strokeLinejoin="round"/>
                    <circle cx="6" cy="19" r="1.5" fill="#a0693a"/>
                    <circle cx="14" cy="19" r="1.5" fill="#a0693a"/>
                  </svg>
                }
              />

              <div className="h-px bg-[rgba(180,140,90,0.18)]" />

              <InfoRow
                label="Phone"
                value="(555) 234-BOOK"
                href="tel:+15552342665"
                icon={
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                    <path d="M4 4h4l2 5-2.5 1.5A11 11 0 0012.5 14.5L14 12l5 2v4a2 2 0 01-2 2A16 16 0 014 4Z" stroke="#a0693a" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                }
              />

              <InfoRow
                label="Opening Hours"
                value={"Mon – Sat: 9:00 AM – 8:00 PM\nSunday: 10:00 AM – 6:00 PM"}
                icon={
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="11" r="8.5" stroke="#a0693a" strokeWidth="1.5"/>
                    <path d="M11 6v5l3 3" stroke="#a0693a" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                }
              />
            </div>

            {/* Social links */}
            <div>
              <p className="text-[11px] font-bold text-[#a0693a] font-['DM_Sans',sans-serif] tracking-[0.08em] uppercase mb-3">
                Follow Us
              </p>
              <div className="flex gap-2.5">
                {[
                  { label: 'Instagram', href: '#', icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="#a0693a" strokeWidth="1.4"/>
                      <circle cx="8" cy="8" r="3" stroke="#a0693a" strokeWidth="1.4"/>
                      <circle cx="11.5" cy="4.5" r="0.8" fill="#a0693a"/>
                    </svg>
                  )},
                  { label: 'X / Twitter', href: '#', icon: (
                    <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                      <path d="M1 1.5l4.5 5.5L1 12h1.5l3.5-4 3 4H12L7.2 6.2 11.5 1H10L6.8 4.7 4 1H1Z" fill="#a0693a"/>
                    </svg>
                  )},
                  { label: 'Facebook', href: '#', icon: (
                    <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                      <path d="M8 1H6C4.9 1 4 1.9 4 3v1H2v2h2v6h2V6h2l.5-2H6V3c0-.3.2-.5.5-.5H8V1Z" fill="#a0693a"/>
                    </svg>
                  )},
                ].map(s => (
                  <a 
                    key={s.label} 
                    href={s.href} 
                    aria-label={s.label} 
                    className="w-10 h-10 rounded-full border border-[rgba(160,105,58,0.25)] bg-[rgba(255,255,255,0.55)] backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-[rgba(160,105,58,0.12)] hover:-translate-y-0.5"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Contact Form */}
          <div className="bg-[rgba(255,255,255,0.55)] border border-[rgba(200,170,130,0.28)] rounded-[22px] p-[clamp(24px,4vw,40px)] backdrop-blur-sm shadow-[0_4px_24px_rgba(100,60,20,0.07)]">
            {sent ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center text-center min-h-[360px] gap-4">
                <div className="w-16 h-16 rounded-full bg-[rgba(160,105,58,0.12)] border-2 border-[rgba(160,105,58,0.30)] flex items-center justify-center text-[28px]">
                  ✉️
                </div>
                <h2 className="font-['Playfair_Display',serif] text-[22px] font-semibold text-[#3d2010]">
                  Your email client should open!
                </h2>
                <p className="text-[13px] text-[#7a5c3a] font-['DM_Sans',sans-serif] leading-[1.7] max-w-[340px]">
                  We've pre-filled a draft in your default email app. Hit send and we'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="mt-2 py-2.5 px-6 bg-none border border-[rgba(160,105,58,0.35)] rounded-[24px] cursor-pointer text-[12.5px] font-semibold text-[#a0693a] font-['DM_Sans',sans-serif] transition-all duration-200 hover:bg-[rgba(160,105,58,0.08)]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              /* Form */
              <>
                <h2 className="font-['Playfair_Display',serif] text-[22px] font-semibold text-[#3d2010] mb-1.5">
                  Send a Message
                </h2>
                <p className="text-[12.5px] text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-7 leading-[1.6]">
                  Fill in the form below and we'll reply within one business day.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                    <Field label="Your Name">
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="Emma Reed"
                        value={form.name}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </Field>
                    <Field label="Email Address">
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="emma@email.com"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </Field>
                  </div>

                  <Field label="Subject">
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={`${inputClasses} appearance-none cursor-pointer bg-[rgba(255,252,246,0.70)]`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a0693a' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                      }}
                    >
                      <option value="">Select a topic…</option>
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Book Recommendation">Book Recommendation</option>
                      <option value="Order & Shipping">Order & Shipping</option>
                      <option value="Rare & Collector Editions">Rare & Collector Editions</option>
                      <option value="Events & Book Club">Events & Book Club</option>
                      <option value="Press & Partnerships">Press & Partnerships</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <Field label="Message">
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder="Tell us how we can help…"
                      value={form.message}
                      onChange={handleChange}
                      className={`${inputClasses} resize-vertical min-h-[140px]`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={!ready}
                    className={`
                      w-full py-[13px] rounded-[14px] text-[13.5px] font-bold
                      font-['DM_Sans',sans-serif] tracking-[0.03em] border-none
                      transition-all duration-200
                      ${ready 
                        ? 'bg-[#a0693a] text-white shadow-[0_6px_22px_rgba(160,105,58,0.28)] cursor-pointer hover:bg-[#8a5830] hover:-translate-y-px' 
                        : 'bg-[rgba(160,105,58,0.30)] text-[rgba(255,255,255,0.65)] cursor-not-allowed shadow-none'
                      }
                    `}
                  >
                    Send Message →
                  </button>

                  <p className="text-[11px] text-[#b09070] font-['DM_Sans',sans-serif] text-center leading-[1.5]">
                    This will open your email client with the message pre-filled. Your email is sent directly to{' '}
                    <a href="mailto:hello@kiddle.com" className="text-[#a0693a] no-underline hover:underline">
                      hello@kiddle.com
                    </a>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}