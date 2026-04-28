import { useState, useEffect, useRef } from 'react'

function getTimeLeft(expiresAt) {
  const diff = Math.max(0, new Date(expiresAt) - Date.now())
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
    total:   diff,
  }
}

function pad(n) { return String(n).padStart(2, '0') }

/* ── Badge variant ── */
function BadgeTimer({ time, urgent }) {
  const label =
    time.days > 0
      ? `${time.days}d ${time.hours}h left`
      : time.hours > 0
      ? `${time.hours}h ${pad(time.minutes)}m left`
      : `${pad(time.minutes)}m ${pad(time.seconds)}s left`

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      background: urgent
        ? 'rgba(180,60,30,0.12)'
        : 'rgba(160,105,58,0.12)',
      border: `1px solid ${urgent ? 'rgba(180,60,30,0.25)' : 'rgba(160,105,58,0.25)'}`,
      borderRadius: '20px',
      padding: '3px 10px 3px 7px',
    }}>
      {/* clock icon */}
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke={urgent ? '#b43c1e' : '#a0693a'} strokeWidth="1.2"/>
        <path d="M6 3.5V6l2 1.5" stroke={urgent ? '#b43c1e' : '#a0693a'} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <span style={{
        fontSize: '10.5px',
        fontWeight: '600',
        color: urgent ? '#b43c1e' : '#7a4e22',
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '0.01em',
      }}>
        {label}
      </span>
    </div>
  )
}

/* ── Inline variant ── */
function InlineTimer({ time, urgent }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontSize: '12px', color: '#9a7a5a' }}>Ends in</span>
      {[
        time.days > 0 ? `${time.days}d` : null,
        pad(time.hours),
        pad(time.minutes),
        pad(time.seconds),
      ].filter(Boolean).map((seg, i, arr) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            fontWeight: '700',
            fontSize: '13px',
            color: urgent ? '#b43c1e' : '#5c3d1e',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.01em',
          }}>
            {seg}
          </span>
          {i < arr.length - 1 && (
            <span style={{ color: '#c4a882', fontWeight: '700', fontSize: '13px' }}>:</span>
          )}
        </span>
      ))}
    </div>
  )
}

/* ── Full variant ── */
function FullTimer({ time, urgent }) {
  const blocks = time.days > 0
    ? [
        { label: 'Days',    val: pad(time.days) },
        { label: 'Hours',   val: pad(time.hours) },
        { label: 'Minutes', val: pad(time.minutes) },
        { label: 'Seconds', val: pad(time.seconds) },
      ]
    : [
        { label: 'Hours',   val: pad(time.hours) },
        { label: 'Minutes', val: pad(time.minutes) },
        { label: 'Seconds', val: pad(time.seconds) },
      ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {blocks.map(({ label, val }, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
          }}>
            <div style={{
              background: urgent
                ? 'rgba(180,60,30,0.10)'
                : 'rgba(255,255,255,0.60)',
              border: `1px solid ${urgent ? 'rgba(180,60,30,0.2)' : 'rgba(180,140,90,0.25)'}`,
              borderRadius: '10px',
              padding: '8px 12px',
              minWidth: '46px',
              textAlign: 'center',
            }}>
              <span style={{
                fontSize: '20px',
                fontWeight: '700',
                color: urgent ? '#b43c1e' : '#3d2010',
                fontFamily: "'Playfair Display', serif",
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                {val}
              </span>
            </div>
            <span style={{
              fontSize: '9.5px',
              color: '#9a7a5a',
              fontFamily: "'DM Sans', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: '500',
            }}>
              {label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: urgent ? '#b43c1e' : '#c4a882',
              paddingBottom: '18px',
              lineHeight: 1,
            }}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Expired state ── */
function Expired() {
  return (
    <span style={{
      fontSize: '11px',
      color: '#9a7a5a',
      fontFamily: "'DM Sans', sans-serif",
      fontStyle: 'italic',
    }}>
      Offer expired
    </span>
  )
}

export default function CountdownTimer({
  expiresAt,
  variant = 'badge',
  onExpire,
}) {
  const [time, setTime] = useState(() => getTimeLeft(expiresAt))
  const expiredRef = useRef(false)

  useEffect(() => {
    if (time.total === 0) return
    const id = setInterval(() => {
      const t = getTimeLeft(expiresAt)
      setTime(t)
      if (t.total === 0 && !expiredRef.current) {
        expiredRef.current = true
        onExpire?.()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  if (time.total === 0) return <Expired />

  // Urgent = less than 1 hour remaining
  const urgent = time.total < 3600000

  if (variant === 'badge')  return <BadgeTimer  time={time} urgent={urgent} />
  if (variant === 'inline') return <InlineTimer time={time} urgent={urgent} />
  if (variant === 'full')   return <FullTimer   time={time} urgent={urgent} />
  return null
}