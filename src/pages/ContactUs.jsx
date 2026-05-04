import { useState } from 'react'

// ── Small info row used in the left panel ─────────────────────────────────────
function InfoRow({ icon, label, value, href }) {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0,
        background: 'rgba(160,105,58,0.10)',
        border: '1px solid rgba(160,105,58,0.20)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '10.5px', fontWeight: '700', color: '#a0693a',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.07em', textTransform: 'uppercase',
          marginBottom: '3px',
        }}>
          {label}
        </div>
        {href ? (
          <a href={href} style={{
            fontSize: '13.5px', color: '#3d2010',
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: 'none', lineHeight: 1.6,
            transition: 'color 0.18s', whiteSpace: 'pre-line',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#a0693a'}
            onMouseLeave={e => e.currentTarget.style.color = '#3d2010'}
          >
            {value}
          </a>
        ) : (
          <p style={{
            fontSize: '13.5px', color: '#3d2010',
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line',
          }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '11px', fontWeight: '700', color: '#a0693a',
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '0.07em', textTransform: 'uppercase',
      }}>
        {label}
        {children}
      </label>
    </div>
  )
}

const INPUT_BASE = {
  width: '100%',
  padding: '11px 14px',
  fontSize: '13.5px',
  color: '#3d2010',
  fontFamily: "'DM Sans', sans-serif",
  background: 'rgba(255,252,246,0.70)',
  border: '1px solid rgba(180,140,90,0.30)',
  borderRadius: '12px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent]   = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const { name, email, subject, message } = form

    // Build a mailto link and open it — no server needed
    const body = encodeURIComponent(
      `Name: ${name}\nFrom: ${email}\n\n${message}`
    )
    const mailtoHref = `mailto:hello@kiddle.com?subject=${encodeURIComponent(subject || 'Contact form enquiry')}&body=${body}`
    window.location.href = mailtoHref
    setSent(true)
  }

  const ready = form.name.trim() && form.email.trim() && form.message.trim()

  return (
    <div style={{
      background: '#f5f0e8',
      minHeight: '100vh',
      paddingTop: '80px',      // clear fixed navbar
    }}>

      {/* ── Page header ── */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: 'clamp(40px,6vw,72px) clamp(20px,4vw,48px) 0',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(160,105,58,0.10)',
          border: '1px solid rgba(160,105,58,0.22)',
          borderRadius: '20px', padding: '5px 16px',
          fontSize: '10.5px', fontWeight: '700', color: '#a0693a',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          We'd love to hear from you
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px,5vw,48px)',
          fontWeight: '700', color: '#3d2010',
          lineHeight: 1.2, marginBottom: '12px',
        }}>
          Get in Touch
        </h1>
        <p style={{
          fontSize: '14px', color: '#7a5c3a',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.75, maxWidth: '460px',
          marginBottom: '0',
        }}>
          Whether you're looking for a recommendation, chasing a rare edition, or just want to say hello — our team is happy to help.
        </p>
      </div>

      {/* ── Two-column body ── */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: 'clamp(32px,5vw,56px) clamp(20px,4vw,48px) clamp(48px,7vw,96px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1.55fr',
        gap: 'clamp(32px,5vw,64px)',
        alignItems: 'start',
      }}
        className="contact-layout"
      >

        {/* ════════ LEFT — Details ════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Glass card */}
          <div style={{
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(200,170,130,0.28)',
            borderRadius: '22px',
            padding: '32px 28px',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 4px 24px rgba(100,60,20,0.07)',
            display: 'flex', flexDirection: 'column', gap: '24px',
          }}>
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

            <div style={{ height: '1px', background: 'rgba(180,140,90,0.18)' }}/>

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

            <div style={{ height: '1px', background: 'rgba(180,140,90,0.18)' }}/>

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
            <p style={{
              fontSize: '11px', fontWeight: '700', color: '#a0693a',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              Follow Us
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
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
                <a key={s.label} href={s.href} aria-label={s.label} style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  border: '1px solid rgba(160,105,58,0.25)',
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,105,58,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; e.currentTarget.style.transform = 'none' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ════════ RIGHT — Contact Form ════════ */}
        <div style={{
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(200,170,130,0.28)',
          borderRadius: '22px',
          padding: 'clamp(24px,4vw,40px)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 4px 24px rgba(100,60,20,0.07)',
        }}>
          {sent ? (
            /* ── Success state ── */
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', minHeight: '360px', gap: '16px',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(160,105,58,0.12)',
                border: '2px solid rgba(160,105,58,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px',
              }}>
                ✉️
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px', fontWeight: '600', color: '#3d2010',
              }}>
                Your email client should open!
              </h2>
              <p style={{
                fontSize: '13px', color: '#7a5c3a',
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.7, maxWidth: '340px',
              }}>
                We've pre-filled a draft in your default email app. Hit send and we'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                style={{
                  marginTop: '8px', padding: '10px 24px',
                  background: 'none', border: '1px solid rgba(160,105,58,0.35)',
                  borderRadius: '24px', cursor: 'pointer',
                  fontSize: '12.5px', fontWeight: '600', color: '#a0693a',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(160,105,58,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                Send another message
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px', fontWeight: '600', color: '#3d2010',
                marginBottom: '6px',
              }}>
                Send a Message
              </h2>
              <p style={{
                fontSize: '12.5px', color: '#9a7a5a',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: '28px', lineHeight: 1.6,
              }}>
                Fill in the form below and we'll reply within one business day.
              </p>

              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
              >
                {/* Name + Email row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                }}
                  className="form-row"
                >
                  <Field label="Your Name">
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Emma Reed"
                      value={form.name}
                      onChange={handleChange}
                      style={INPUT_BASE}
                      onFocus={e => { e.target.style.borderColor = 'rgba(160,105,58,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(160,105,58,0.10)' }}
                      onBlur={e  => { e.target.style.borderColor = 'rgba(180,140,90,0.30)';  e.target.style.boxShadow = 'none' }}
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
                      style={INPUT_BASE}
                      onFocus={e => { e.target.style.borderColor = 'rgba(160,105,58,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(160,105,58,0.10)' }}
                      onBlur={e  => { e.target.style.borderColor = 'rgba(180,140,90,0.30)';  e.target.style.boxShadow = 'none' }}
                    />
                  </Field>
                </div>

                <Field label="Subject">
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    style={{ ...INPUT_BASE, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(160,105,58,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(160,105,58,0.10)' }}
                    onBlur={e  => { e.target.style.borderColor = 'rgba(180,140,90,0.30)';  e.target.style.boxShadow = 'none' }}
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
                    style={{ ...INPUT_BASE, resize: 'vertical', minHeight: '140px' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(160,105,58,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(160,105,58,0.10)' }}
                    onBlur={e  => { e.target.style.borderColor = 'rgba(180,140,90,0.30)';  e.target.style.boxShadow = 'none' }}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={!ready}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: ready ? '#a0693a' : 'rgba(160,105,58,0.30)',
                    color: ready ? '#fff' : 'rgba(255,255,255,0.65)',
                    border: 'none', borderRadius: '14px',
                    fontSize: '13.5px', fontWeight: '700',
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: ready ? 'pointer' : 'not-allowed',
                    letterSpacing: '0.03em',
                    boxShadow: ready ? '0 6px 22px rgba(160,105,58,0.28)' : 'none',
                    transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { if (ready) { e.currentTarget.style.background = '#8a5830'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                  onMouseLeave={e => { if (ready) { e.currentTarget.style.background = '#a0693a'; e.currentTarget.style.transform = 'none' } }}
                >
                  Send Message →
                </button>

                <p style={{
                  fontSize: '11px', color: '#b09070',
                  fontFamily: "'DM Sans', sans-serif",
                  textAlign: 'center', lineHeight: 1.5,
                }}>
                  This will open your email client with the message pre-filled. Your email is sent directly to{' '}
                  <a href="mailto:hello@kiddle.com" style={{ color: '#a0693a', textDecoration: 'none' }}>
                    hello@kiddle.com
                  </a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ── Responsive overrides ── */}
      <style>{`
        @media (max-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}