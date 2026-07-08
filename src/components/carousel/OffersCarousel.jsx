import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useCart, useWishlist } from "../../context/CartContext";
import { fetchActiveOffers, fetchSaleProductOffers } from "../../lib/queries";
import ProductCard from "../ui/ProductCard";

function getTimeRemaining(expiresAt) {
  if (!expiresAt) return "Limited time";
  const diff = new Date(expiresAt) - new Date();
  if (!Number.isFinite(diff) || diff <= 0) return "Limited time";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${Math.max(1, minutes)}m left`;
}

function OfferProductCard({ offer, onAddToCart, onWishlist, wishlisted }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(offer.expiresAt));

  useEffect(() => {
    const id = setInterval(
      () => setTimeLeft(getTimeRemaining(offer.expiresAt)),
      30000,
    );
    return () => clearInterval(id);
  }, [offer.expiresAt]);

  const item = {
    ...offer.book,
    price: offer.originalPrice ?? offer.book?.price,
    salePrice: offer.salePrice ?? offer.book?.salePrice,
  };

  return (
    <div className="relative h-full">
      <ProductCard
        item={item}
        compact
        saleBadge={`-${offer.discountPercent}%`}
        onAddToCart={() => onAddToCart?.(item)}
        onWishlist={() => onWishlist?.(offer.book)}
        wishlisted={wishlisted}
      />
      <div className="pointer-events-none absolute bottom-[88px] left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#7a4e22] shadow-sm">
        <Clock size={12} />
        {timeLeft}
      </div>
    </div>
  );
}

function OfferSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="h-[360px] rounded-lg bg-[linear-gradient(90deg,#efe6d8,#f8f2e9,#efe6d8)] bg-[length:200%_100%] animate-shimmer"
        />
      ))}
    </div>
  );
}

export default function OffersCarousel({
  offers: propOffers,
  loading: propLoading,
  title = "Special Offers",
  subtitle = "Limited-time deals on books, stationery, and accessories.",
}) {
  const [sanityOffers, setSanityOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const railRef = useRef(null);
  const { addToCart } = useCart();
  const { toggleWishlist, wishlist } = useWishlist?.() || {};

  useEffect(() => {
    if (propOffers) {
      return;
    }
    fetchActiveOffers()
      .then((data) => {
        if (data?.length) {
          setSanityOffers(data);
          setLoading(false);
          return;
        }
        fetchSaleProductOffers()
          .then((fallbackData) => setSanityOffers(fallbackData || []))
          .finally(() => setLoading(false));
      })
      .catch(() => {
        fetchSaleProductOffers()
          .then((fallbackData) => setSanityOffers(fallbackData || []))
          .finally(() => setLoading(false));
      });
  }, [propOffers]);

  const offers = useMemo(
    () => (propOffers ?? sanityOffers).filter((offer) => offer?.book),
    [propOffers, sanityOffers],
  );
  const isLoading = propLoading ?? loading;
  const resolvedLoading = propOffers ? (propLoading ?? false) : isLoading;

  const scroll = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.max(260, rail.clientWidth * 0.82),
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#a24f12]">
            Limited Time
          </div>
          <h2 className="font-['Playfair_Display'] text-[clamp(24px,4vw,36px)] font-bold leading-tight text-[#20160d]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#75624d]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c8b4] bg-white text-[#20160d] hover:border-[#182a7a] hover:text-[#182a7a]"
            aria-label="Previous offers"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c8b4] bg-white text-[#20160d] hover:border-[#182a7a] hover:text-[#182a7a]"
            aria-label="Next offers"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {resolvedLoading ? (
        <OfferSkeleton />
      ) : offers.length ? (
        <div
          ref={railRef}
          className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 scrollbar-none sm:mx-0 sm:px-0"
          tabIndex={0}
        >
          {offers.map((offer, index) => (
            <div
              key={offer._id || offer.book?.slug || index}
              className="w-[min(72vw,230px)] shrink-0 snap-start sm:w-[220px] lg:w-[225px]"
            >
              <OfferProductCard
                offer={offer}
                onAddToCart={addToCart}
                onWishlist={toggleWishlist}
                wishlisted={wishlist?.some(
                  (w) =>
                    w._id === offer.book?._id || w.slug === offer.book?.slug,
                )}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[#eadfce] bg-white p-8 text-center text-sm text-[#75624d]">
          No live offers yet. Add sale prices or active offers in Sanity.
        </div>
      )}
    </section>
  );
}
