import { useState } from "react";
import StarRating from "../ui/StarRating";
import CountdownTimer from "../ui/CountdownTimer";
import { formatPrice } from "../../utils/formatPrice";

const COVER_FALLBACKS = [
  ["#f5d5a8", "#e0a870"],
  ["#c8d8e8", "#8aaccb"],
  ["#d8e8c0", "#9aba6a"],
  ["#e8c8d8", "#c890b0"],
  ["#d8d0e8", "#a898cc"],
  ["#e8dac8", "#c0a878"],
  ["#f0d8c0", "#d4956a"],
  ["#cce8d8", "#78b898"],
];

function getCoverColors(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return COVER_FALLBACKS[Math.abs(h) % COVER_FALLBACKS.length];
}

export default function OfferCard({
  offer = {},
  onAddToCart,
  onWishlist,
  wishlisted = false,
  active = false,
}) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const {
    book = {},
    discountPercent,
    originalPrice = 0,
    salePrice = 0,
    badgeLabel,
    expiresAt,
  } = offer;

  const {
    title = "Untitled",
    author = "",
    coverImage,
    rating = 0,
    reviewCount,
    slug = "#",
    ageRange,
  } = book;

  const [c1, c2] = getCoverColors(title);
  const savePct =
    discountPercent ?? Math.round((1 - salePrice / originalPrice) * 100);
  const isLifted = hovered || active;

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.({
      ...book,
      price: originalPrice,
      salePrice: salePrice,
      originalPrice: originalPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleWish(e) {
    e.preventDefault();
    e.stopPropagation();
    onWishlist?.(book);
  }

  // Dynamic classes for the card wrapper
  const cardClasses = `
    relative w-full overflow-hidden rounded-2xl backdrop-blur-md
    transition-all duration-300 ease-out
    ${isLifted ? "-translate-y-1.5" : "translate-y-0"}
    ${
      isLifted
        ? "shadow-[0_16px_48px_rgba(100,60,20,0.18)]"
        : active
          ? "shadow-[0_8px_28px_rgba(100,60,20,0.12)]"
          : "shadow-[0_3px_14px_rgba(100,60,20,0.07)]"
    }
    ${active ? "border border-[rgba(160,105,58,0.4)]" : "border border-[rgba(160,105,58,0.24)]"}
    bg-white
  `;

  // Cover image hover scale
  const coverImgClasses = `
    w-full h-full object-cover transition-transform duration-400 ease
    ${isLifted ? "scale-105" : "scale-100"}
  `;

  // Fallback book illustration
  const fallbackBookClasses = `
    w-full h-full flex items-center justify-center
    transition-transform duration-300 ease
    ${isLifted ? "scale-108 -rotate-1" : "scale-100"}
  `;

  // Wishlist button opacity
  const wishlistBtnClasses = `
    absolute bottom-2 right-2 w-7 h-7 rounded-full
    bg-white/80 border border-amber-800/20
    flex items-center justify-center cursor-pointer
    transition-opacity duration-200
    ${hovered || wishlisted ? "opacity-100" : "opacity-0"}
  `;

  // Add to cart button classes
  const addButtonClasses = `
    flex items-center gap-1.5 rounded-2xl py-1.5 px-3.5
    cursor-pointer transition-all duration-200
    text-[11px] font-semibold font-['DM_Sans',sans-serif] whitespace-nowrap
    ${
      added
        ? "bg-green-800/15 border border-green-700/30 text-green-800"
        : "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-800/25"
    }
  `;

  return (
    <a
      href={`/book/${slug}`}
      className="block no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cardClasses}>
        {/* Cover area */}
        <div
          className="relative h-40 overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${c1}, ${c2})` }}
        >
          {coverImage && !imgError ? (
            <img
              src={
                typeof coverImage === "string"
                  ? coverImage
                  : coverImage?.asset?.url
              }
              alt={title}
              onError={() => setImgError(true)}
              className={coverImgClasses}
            />
          ) : (
            <div className={fallbackBookClasses}>
              <div className="relative w-[70px] h-[100px] bg-white/25 rounded-[2px_8px_8px_2px] border border-white/45 flex flex-col items-center justify-center p-2">
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/15 rounded-l-[2px]" />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="opacity-75"
                >
                  <path
                    d="M4 19V5a2 2 0 012-2h13a1 1 0 011 1v13"
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 19a2 2 0 002 2h14"
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 7h6M9 11h4"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-[7px] text-white/90 font-['Playfair_Display',serif] text-center mt-1 font-semibold leading-tight">
                  {title.split(" ").slice(0, 3).join(" ")}
                </div>
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Discount badge */}
          {savePct > 0 && (
            <div className="absolute top-2.5 right-2.5 bg-amber-700 text-white text-[10px] font-bold px-2 py-1 rounded-xl font-['DM_Sans',sans-serif] tracking-wide shadow-md shadow-amber-900/30">
              -{savePct}%
            </div>
          )}

          {/* Custom badge label */}
          {badgeLabel && (
            <div className="absolute top-2.5 left-2.5 bg-white/80 backdrop-blur-sm border border-amber-700/30 text-amber-800 text-[9.5px] font-bold px-2 py-0.5 rounded-xl font-['DM_Sans',sans-serif] tracking-wide">
              {badgeLabel}
            </div>
          )}

          {/* Wishlist button */}
          <button onClick={handleWish} className={wishlistBtnClasses}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 12C7 12 1.5 8.5 1.5 4.8C1.5 3 3 1.5 4.8 1.5C5.9 1.5 6.8 2.2 7 2.8C7.2 2.2 8.1 1.5 9.2 1.5C11 1.5 12.5 3 12.5 4.8C12.5 8.5 7 12 7 12Z"
                fill={wishlisted ? "#a0693a" : "none"}
                stroke="#a0693a"
                strokeWidth="1.3"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-2 sm:p-2.5">
          {/* Age range */}
          {ageRange && (
            <div className="inline-flex items-center bg-amber-800/10 rounded-[10px] px-2 py-0.5 mb-1.5">
              <span className="text-[9.5px] text-amber-700 font-['DM_Sans',sans-serif] font-medium">
                {ageRange}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="text-[11px] sm:text-[12px] font-['Playfair_Display',serif] font-semibold text-amber-950 leading-tight mb-0.5 line-clamp-2">
            {title}
          </div>

          {/* Author */}
          <div className="text-[9px] text-amber-600/70 font-['DM_Sans',sans-serif] mb-1 truncate">
            by {author}
          </div>

          {/* Price row + Add to cart */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[12px] sm:text-[13px] font-bold text-amber-800">
                {formatPrice(salePrice)}
              </span>
              {originalPrice > salePrice && (
                <span className="text-[8px] text-amber-400/80 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAdd(e);
              }}
              className="border-none text-white py-1 px-2 rounded-md text-[9px] font-bold cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: added
                  ? "#2d7a45"
                  : "linear-gradient(135deg, #D97706, #B45309)",
              }}
            >
              {added ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#2d7a45"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1.5 2H3l1.8 6H9l1.5-4H4"
                      stroke="white"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="5.5" cy="10" r="0.9" fill="white" />
                    <circle cx="9" cy="10" r="0.9" fill="white" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </a>
  );
}
