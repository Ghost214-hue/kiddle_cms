const SIZES = {
  sm: { px: '10px', py: '5px', font: '11px', radius: '20px' },
  md: { px: '16px', py: '8px', font: '12.5px', radius: '24px' },
  lg: { px: '20px', py: '10px', font: '13.5px', radius: '28px' },
}

export default function CategoryPill({
  label,
  active = false,
  count,
  icon,
  onClick,
  size = 'md',
  variant = 'default',
}) {
  const s = SIZES[size] || SIZES.md

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    paddingLeft: s.px,
    paddingRight: s.py,
    paddingTop: s.py,
    paddingBottom: s.py,
    borderRadius: s.radius,
    fontSize: s.font,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    border: '1px solid',
    lineHeight: 1,
  }

  const styles = {
    default: {
      ...baseStyle,
      background: active
        ? 'rgba(160,105,58,0.18)'
        : 'rgba(255,255,255,0.5)',
      borderColor: active
        ? 'rgba(160,105,58,0.5)'
        : 'rgba(180,140,90,0.28)',
      color: active ? '#5c3520' : '#7a4e22',
      boxShadow: active
        ? '0 2px 10px rgba(160,105,58,0.15)'
        : 'none',
    },
    outlined: {
      ...baseStyle,
      background: active ? '#a0693a' : 'transparent',
      borderColor: '#a0693a',
      color: active ? '#fff' : '#a0693a',
    },
    solid: {
      ...baseStyle,
      background: active ? '#a0693a' : 'rgba(160,105,58,0.08)',
      borderColor: active ? '#a0693a' : 'rgba(160,105,58,0.15)',
      color: active ? '#fff' : '#7a4e22',
    },
  }

  return (
    <button
      onClick={onClick}
      style={styles[variant] || styles.default}
    >
      {icon && (
        <span style={{ fontSize: '13px', lineHeight: 1 }}>{icon}</span>
      )}
      <span>{label}</span>
      {count !== undefined && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '18px',
          height: '16px',
          padding: '0 5px',
          borderRadius: '10px',
          background: active
            ? 'rgba(255,255,255,0.3)'
            : 'rgba(160,105,58,0.15)',
          color: active ? '#fff' : '#a0693a',
          fontSize: '10px',
          fontWeight: '600',
          lineHeight: 1,
        }}>
          {count}
        </span>
      )}
    </button>
  )
}