import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";

function productHref(item) {
  return `/${item?.type === "book" || item?._type === "book" ? "book" : "product"}/${item?.slug || ""}`;
}

function productKind(item) {
  if (item?.type === "stationery") return "Stationery";
  if (item?.type === "accessory") return "Accessory";
  if (item?.isCBC) return "CBC Textbook";
  return "Book";
}

export default function ProductCard({
  item,
  wishlisted = false,
  onWishlist,
  onAddToCart,
  compact = false,
  saleBadge,
}) {
  const [imgErr, setImgErr] = useState(false);
  const price = item?.salePrice ?? item?.price ?? 0;
  const hasSale = item?.salePrice && item?.salePrice < item?.price;
  const image = item?.img || item?.coverImage;
  const fallback = item?.type === "stationery" ? "Pencil" : item?.type === "accessory" ? "Gift" : "Book";

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-[#eadfce] bg-white shadow-[0_10px_28px_rgba(53,34,16,0.07)] transition duration-200 hover:-translate-y-1 hover:border-[#d7b58a] hover:shadow-[0_18px_42px_rgba(53,34,16,0.13)]">
      <Link
        to={productHref(item)}
        className="relative block aspect-[4/5] overflow-hidden bg-[#f1eadf]"
        aria-label={item?.title}
      >
        {!imgErr && image ? (
          <img
            src={image}
            alt={item?.title}
            loading="lazy"
            onError={() => setImgErr(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#f7efe3,#dfc7a5)] text-sm font-bold text-[#7a4e22]">
            {fallback}
          </div>
        )}

        {(saleBadge || item?.badge || hasSale) && (
          <span className="absolute left-3 top-3 max-w-[calc(100%-56px)] truncate rounded-full bg-[#182a7a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {saleBadge || item?.badge || "Sale"}
          </span>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onWishlist?.(item);
          }}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 ${wishlisted ? "text-[#182a7a]" : "text-[#7b644b]"}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "gap-2 p-3" : "gap-3 p-4"}`}>
        <div className="flex items-center justify-between gap-3 text-[11px] text-[#8a7359]">
          <span className="truncate">{productKind(item)}</span>
          {item?.inStock === false ? (
            <span className="shrink-0 font-semibold text-[#a23b3b]">Out</span>
          ) : (
            <span className="shrink-0 font-semibold text-[#21744b]">In stock</span>
          )}
        </div>

        <Link to={productHref(item)} className="no-underline">
          <h3 className={`${compact ? "text-[13px]" : "text-[14px]"} line-clamp-2 min-h-[2.55em] font-semibold leading-snug text-[#24190f]`}>
            {item?.title}
          </h3>
        </Link>

        <p className="truncate text-[12px] text-[#8a7359]">
          {item?.author || item?.brand || "Kiddle Bookshop"}
        </p>

        {item?.rating ? (
          <div className="flex items-center gap-1 text-[11px] text-[#8a7359]">
            <Star size={13} fill="#e2a329" className="text-[#e2a329]" />
            <span className="font-semibold text-[#4d3822]">{item.rating}</span>
            {item.reviewCount ? <span>({item.reviewCount})</span> : null}
          </div>
        ) : (
          <div className="h-[17px]" />
        )}

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="font-bold text-[#182a7a]">{formatPrice(price)}</div>
            {hasSale && (
              <div className="text-[11px] text-[#9d8a78] line-through">
                {formatPrice(item.price)}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onAddToCart?.(item);
            }}
            disabled={item?.inStock === false}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md bg-[#182a7a] px-3 text-[12px] font-bold text-white transition hover:bg-[#233b9e] disabled:cursor-not-allowed disabled:bg-[#c9c1b8]"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
