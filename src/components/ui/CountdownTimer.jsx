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

  const bgColor = urgent ? 'bg-red-800/15' : 'bg-amber-800/15'
  const borderColor = urgent ? 'border-red-700/25' : 'border-amber-700/25'
  const iconColor = urgent ? '#b43c1e' : '#a0693a'
  const textColor = urgent ? 'text-red-800' : 'text-amber-800'

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full ${bgColor} border ${borderColor} pl-1.5 pr-2.5 py-0.5`}>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke={iconColor} strokeWidth="1.2"/>
        <path d="M6 3.5V6l2 1.5" stroke={iconColor} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <span className={`text-[10.5px] font-semibold font-['DM_Sans',sans-serif] tracking-wide ${textColor}`}>
        {label}
      </span>
    </div>
  )
}

/* ── Inline variant ── */
function InlineTimer({ time, urgent }) {
  const textColor = urgent ? 'text-red-800' : 'text-amber-900/80'
  const separatorColor = 'text-amber-300'

  return (
    <div className="inline-flex items-center gap-1.5 font-['DM_Sans',sans-serif]">
      <span className="text-xs text-amber-600">Ends in</span>
      {[
        time.days > 0 ? `${time.days}d` : null,
        pad(time.hours),
        pad(time.minutes),
        pad(time.seconds),
      ].filter(Boolean).map((seg, i, arr) => (
        <span key={i} className="flex items-center gap-1">
          <span className={`font-bold text-[13px] tabular-nums -tracking-wide ${textColor}`}>
            {seg}
          </span>
          {i < arr.length - 1 && (
            <span className={`font-bold text-[13px] ${separatorColor}`}>:</span>
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

  const urgentStyles = urgent
    ? {
        blockBg: 'bg-red-800/10',
        blockBorder: 'border-red-700/20',
        numberColor: 'text-red-800',
        separatorColor: 'text-red-700'
      }
    : {
        blockBg: 'bg-white/60',
        blockBorder: 'border-amber-700/25',
        numberColor: 'text-amber-950',
        separatorColor: 'text-amber-300'
      }

  return (
    <div className="flex items-center gap-2">
      {blocks.map(({ label, val }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-0.5">
            <div className={`${urgentStyles.blockBg} border ${urgentStyles.blockBorder} rounded-[10px] px-3 py-2 min-w-[46px] text-center`}>
              <span className={`text-xl font-bold font-['Playfair_Display',serif] tabular-nums -tracking-wide leading-none ${urgentStyles.numberColor}`}>
                {val}
              </span>
            </div>
            <span className="text-[9.5px] text-amber-600 font-['DM_Sans',sans-serif] uppercase tracking-wide font-medium">
              {label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className={`text-xl font-bold ${urgentStyles.separatorColor} pb-[18px] leading-none`}>
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
    <span className="text-[11px] text-amber-600 font-['DM_Sans',sans-serif] italic">
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