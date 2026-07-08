/**
 * Badge.jsx — Kiddle Design System
 * Consistent badge/tag component
 */
export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) {
  const variants = {
    default:
      "bg-[rgba(160,105,58,0.10)] text-[#9a6030] border-[rgba(160,105,58,0.20)]",
    sale: "bg-[rgba(220,38,38,0.10)] text-[#b91c1c] border-[rgba(220,38,38,0.20)]",
    new: "bg-[rgba(45,122,69,0.10)] text-[#2d7a45] border-[rgba(45,122,69,0.20)]",
    bestseller:
      "bg-[rgba(217,119,6,0.10)] text-[#B45309] border-[rgba(217,119,6,0.20)]",
    cbc: "bg-[rgba(217,119,6,0.10)] text-[#B45309] border-[rgba(217,119,6,0.20)]",
  };

  const sizes = {
    xs: "text-[9px] py-0.5 px-1.5 rounded",
    sm: "text-[10px] py-0.5 px-2 rounded-md",
    md: "text-[11px] py-1 px-2.5 rounded-lg",
  };

  return (
    <span
      className={`
        inline-flex items-center font-semibold border
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.sm}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
