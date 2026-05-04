// components/ui/CategoryPill.jsx
export default function CategoryPill({ 
  label, 
  icon, 
  count, 
  active = false, 
  onClick, 
  size = 'md',
  style = {}
}) {
  const sizes = {
    sm: { padding: '6px 14px', fontSize: '12px', gap: '4px' },
    md: { padding: '8px 18px', fontSize: '13px', gap: '6px' },
    lg: { padding: '10px 22px', fontSize: '14px', gap: '8px' },
  }

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizes[size].gap,
        padding: sizes[size].padding,
        borderRadius: '40px',
        background: active ? 'linear-gradient(135deg, #D97706, #B45309)' : 'white',
        border: active ? 'none' : '1px solid #FCD34D',
        fontSize: sizes[size].fontSize,
        fontWeight: '500',
        fontFamily: "'DM Sans', sans-serif",
        color: active ? 'white' : '#78350F',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        boxShadow: active ? '0 4px 12px rgba(217,119,6,0.3)' : 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = '#FEF3C7'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'white'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      <span style={{ fontSize: size === 'lg' ? '18px' : '14px' }}>{icon}</span>
      <span>{label}</span>
      {count !== undefined && (
        <span style={{
          background: active ? 'rgba(255,255,255,0.2)' : '#FEF3C7',
          borderRadius: '30px',
          padding: '2px 8px',
          fontSize: '11px',
          fontWeight: '600',
          color: active ? 'white' : '#D97706',
          marginLeft: '4px',
        }}>
          {count}
        </span>
      )}
    </button>
  )
}