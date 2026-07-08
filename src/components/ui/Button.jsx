/**
 * Button.jsx — Kiddle Design System
 * Unified button component with variants
 */
import { useState } from "react";

const variants = {
  primary:
    "bg-gradient-to-r from-[#D97706] to-[#B45309] text-white shadow-[0_4px_16px_rgba(160,105,58,0.28)] hover:shadow-[0_6px_24px_rgba(160,105,58,0.35)]",
  secondary:
    "bg-white/85 border border-[rgba(20,10,2,0.12)] text-[#1a0e04] hover:bg-white/95",
  ghost:
    "bg-transparent border border-[rgba(180,140,90,0.28)] text-[#7a4e22] hover:bg-[rgba(160,105,58,0.08)]",
  danger:
    "bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white shadow-[0_4px_16px_rgba(220,38,38,0.28)]",
};

const sizes = {
  sm: "py-1.5 px-3 text-[11px] rounded-lg",
  md: "py-2 px-4 text-[12.5px] rounded-xl",
  lg: "py-2.5 px-5 sm:py-3 sm:px-7 text-xs sm:text-sm rounded-full",
  xl: "py-3.5 px-7 text-[14px] rounded-2xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  fullWidth = false,
  ...props
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={`
        inline-flex items-center justify-center gap-2
        font-bold no-underline
        transition-all duration-200
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-0.5"}
        ${pressed && !disabled ? "scale-[0.98]" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
