import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCart, useWishlist } from "../../context/CartContext";
import { fetchFeaturedBooks, fetchFeaturedCarousel } from "../../lib/queries";
import ProductCard from "../ui/ProductCard";

const MOCK_FEATURED = [
  {
    _id: "f1",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 1200,
    rating: 4.4,
    reviewCount: 1240,
    badge: "Bestseller",
    img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
    slug: "the-midnight-library",
    type: "book",
  },
  {
    _id: "f2",
    title: "Before the Coffee Gets Cold",
    author: "Toshikazu Kawaguchi",
    price: 950,
    rating: 4.8,
    reviewCount: 876,
    badge: "New",
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80",
    slug: "before-the-coffee-gets-cold",
    type: "book",
  },
  {
    _id: "f3",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 1100,
    rating: 4.7,
    reviewCount: 2100,
    badge: "Reader Pick",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    slug: "where-the-crawdads-sing",
    type: "book",
  },
  {
    _id: "f4",
    title: "The Lion's Secret Garden",
    author: "Clara Moss",
    price: 780,
    rating: 4.6,
    reviewCount: 580,
    badge: "Kids Love It",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    slug: "lions-secret-garden",
    type: "book",
  },
];

function CarouselSkeleton() {
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

export default function FeaturedCarousel({
  books: propBooks,
  loading: propLoading,
  title = "Featured Books",
  subtitle = "Handpicked favorites, new discoveries, and books readers keep coming back for.",
  eyebrow = "Featured Shelf",
  viewAllHref = "/books",
  carouselSlug,
}) {
  const [items, setItems] = useState([]);
  const [cmsConfig, setCmsConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const railRef = useRef(null);
  const { addToCart } = useCart();
  const { toggleWishlist, wishlist } = useWishlist?.() || {};

  useEffect(() => {
    if (propBooks) {
      return;
    }

    fetchFeaturedCarousel(carouselSlug)
      .then((doc) => {
        if (doc?.items?.length) {
          setCmsConfig(doc);
          setItems(doc.items);
          setLoading(false);
          return;
        }
        fetchFeaturedBooks()
          .then((data) => setItems(data?.length ? data : MOCK_FEATURED))
          .finally(() => setLoading(false));
      })
      .catch(() => {
        fetchFeaturedBooks()
          .then((data) => setItems(data?.length ? data : MOCK_FEATURED))
          .catch(() => setItems(MOCK_FEATURED))
          .finally(() => setLoading(false));
      });
  }, [propBooks, carouselSlug]);

  const displayItems = useMemo(
    () => (propBooks ?? items).filter(Boolean).slice(0, 12),
    [items, propBooks],
  );
  const isLoading = propLoading ?? loading;
  const resolvedLoading = propBooks ? (propLoading ?? false) : isLoading;
  const displayTitle = cmsConfig?.title || title;
  const displaySubtitle = cmsConfig?.subtitle || subtitle;
  const displayEyebrow = cmsConfig?.eyebrow || eyebrow;
  const displayHref = cmsConfig?.viewAllHref || viewAllHref;

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
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#182a7a]">
            {displayEyebrow}
          </div>
          <h2 className="font-['Playfair_Display'] text-[clamp(24px,4vw,36px)] font-bold leading-tight text-[#20160d]">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#75624d]">
              {displaySubtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={displayHref}
            className="rounded-md border border-[#d9c8b4] bg-white px-4 py-2 text-sm font-bold text-[#20160d] no-underline hover:border-[#182a7a] hover:text-[#182a7a]"
          >
            View All
          </a>
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c8b4] bg-white text-[#20160d] hover:border-[#182a7a] hover:text-[#182a7a]"
            aria-label="Previous products"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c8b4] bg-white text-[#20160d] hover:border-[#182a7a] hover:text-[#182a7a]"
            aria-label="Next products"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {resolvedLoading ? (
        <CarouselSkeleton />
      ) : displayItems.length ? (
        <div
          ref={railRef}
          className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 scrollbar-none sm:mx-0 sm:px-0"
          tabIndex={0}
        >
          {displayItems.map((item, index) => (
            <div
              key={item._id || item.slug || index}
              className="w-[min(72vw,230px)] shrink-0 snap-start sm:w-[220px] lg:w-[225px]"
            >
              <ProductCard
                item={item}
                compact
                onAddToCart={addToCart}
                onWishlist={toggleWishlist}
                wishlisted={wishlist?.some(
                  (w) => w._id === item._id || w.slug === item.slug,
                )}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[#eadfce] bg-white p-8 text-center text-sm text-[#75624d]">
          No featured items yet.
        </div>
      )}
    </section>
  );
}
