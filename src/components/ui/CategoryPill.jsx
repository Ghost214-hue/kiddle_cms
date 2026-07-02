
import { useState } from 'react'

const sizeClasses = {
  sm: {
    padding: 'px-3.5 py-1.5',
    fontSize: 'text-xs',
    gap: 'gap-1',
    iconSize: 'text-base',
  },
  md: {
    padding: 'px-4.5 py-2',
    fontSize: 'text-sm',
    gap: 'gap-1.5',
    iconSize: 'text-lg',
  },
  lg: {
    padding: 'px-5.5 py-2.5',
    fontSize: 'text-sm',
    gap: 'gap-2',
    iconSize: 'text-xl',
  },
}

export default function CategoryPill({ 
  label, 
  icon, 
  count, 
  active = false, 
  onClick, 
  size = 'md',
  style = {}
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  const currentSize = sizeClasses[size] || sizeClasses.md

  // Base classes that don't change with state
  const baseClasses = `
    inline-flex items-center
    rounded-full
    font-medium font-['DM_Sans',sans-serif]
    whitespace-nowrap
    transition-all duration-200 ease
    cursor-pointer
    ${currentSize.padding}
    ${currentSize.fontSize}
    ${currentSize.gap}
  `

  // Conditional classes based on active/hover
  const activeClasses = active
    ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 -translate-y-0.5'
    : `
      bg-white border border-amber-300 text-amber-800
      hover:bg-amber-50 hover:-translate-y-0.5
      ${isHovered ? 'bg-amber-50 -translate-y-0.5' : ''}
    `

  // When active, we don't want hover effects, but we keep the active transform always
  // For non-active, we need to ensure the hover state is managed by CSS, not React state.
  // The React state `isHovered` is still used to decide some inline? But we can rely purely on CSS hover.
  // Actually original logic: active always has transform; non-active has transform only on hover.
  // We can achieve this with group or hover: modifier. Since we already have CSS hover, remove React hover state.
  // However the original also had a box shadow on active. We'll use Tailwind's hover: for non-active and active: for active.
  
  // Simpler: Use Tailwind's hover: modifier for non-active, and active styles for active.
  // But because we have dynamic `active` prop, we can conditionally apply classes.
  
  // Let's rewrite without the isHovered React state, using pure CSS hover.
  // But note: the original component prevented hover styles on active by checking !active. 
  // With Tailwind, we can apply hover: only when not active using condition.
  
  // I'll remove the React hover state and rely on conditional class strings.

  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        ${active
          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 -translate-y-0.5'
          : 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 hover:-translate-y-0.5'
        }
      `}
      style={style}
      // No need for onMouseEnter/Leave because CSS handles it
    >
      <span className={`${currentSize.iconSize} leading-none`}>{icon}</span>
      <span>{label}</span>
      {count !== undefined && (
        <span className={`
          ml-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
          ${active
            ? 'bg-white/20 text-white'
            : 'bg-amber-50 text-amber-600'
          }
        `}>
          {count}
        </span>
      )}
    </button>
  )
}