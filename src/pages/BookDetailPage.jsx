import { useState, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import StarRating from "../components/ui/StarRating";
const FeaturedCarousel = lazy(
  () => import("../components/carousel/FeaturedCarousel"),
);
import CountdownTimer from "../components/ui/CountdownTimer";
import { useCart, useWishlist } from "../context/CartContext";
import { formatPrice, formatReviewCount } from "../utils/formatPrice";
import { fetchProductBySlug } from "../lib/queries";

// ─────────────────────────────────────────────
// MOCK BOOK DATA (fallback)
// ─────────────────────────────────────────────
const MOCK_BOOKS = [
  {
    _id: "b1",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 24.99,
    salePrice: null,
    rating: 4.4,
    reviewCount: 1240,
    ageRange: "Young Adult",
    badge: "#1 Bestseller",
    badgeColor: "#8a6030",
    slug: "the-midnight-library",
    categories: ["fiction", "young-adults", "bestsellers"],
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80",
    description: `Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices...\n\nWould you have done anything different, if you had the chance to undo your regrets?\n\nNora Seed finds herself in the Midnight Library. Until she decides to live the life of her dreams, she will keep visiting this magical realm of possibilities.`,
    pageCount: 304,
    publisher: "Viking",
    publishedDate: "August 13, 2020",
    isbn: "978-0-525-55947-4",
    language: "English",
    formats: ["Hardcover", "Paperback", "E-book", "Audiobook"],
  },
  {
    _id: "b2",
    title: "Before the Coffee Gets Cold",
    author: "Toshikazu Kawaguchi",
    price: 18.99,
    salePrice: null,
    rating: 4.8,
    reviewCount: 876,
    ageRange: "Adult",
    badge: "New",
    badgeColor: "#2d7a4f",
    slug: "before-the-coffee-gets-cold",
    categories: ["fiction", "bestsellers"],
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    description: `In a small back alley in Tokyo, there is a café which has been serving carefully brewed coffee for more than one hundred years. But this coffee shop offers its customers a unique experience: the chance to travel back in time.`,
    pageCount: 213,
    publisher: "Hanover Square Press",
    publishedDate: "November 17, 2020",
    isbn: "978-1-335-43198-7",
    language: "English",
    formats: ["Hardcover", "Paperback", "E-book"],
  },
  {
    _id: "b3",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 23.0,
    salePrice: null,
    rating: 4.7,
    reviewCount: 2100,
    ageRange: "Adult",
    badge: null,
    badgeColor: null,
    slug: "where-the-crawdads-sing",
    categories: ["fiction", "bestsellers"],
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    description: `For years, rumors of the "Marsh Girl" have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl.`,
    pageCount: 368,
    publisher: "G.P. Putnam's Sons",
    publishedDate: "August 14, 2018",
    isbn: "978-0-735-21909-0",
    language: "English",
    formats: ["Hardcover", "Paperback", "E-book", "Audiobook"],
  },
  {
    _id: "b9",
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    price: 19.99,
    salePrice: null,
    rating: 4.9,
    reviewCount: 3200,
    ageRange: "Adult",
    badge: "#1 Bestseller",
    badgeColor: "#8a6030",
    slug: "things-fall-apart",
    categories: ["fiction", "african-writers", "bestsellers"],
    img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80",
    description: `A classic novel that depicts the life of Okonkwo, a leader and local wrestling champion in Umuofia. It explores the clash between traditional Igbo culture and the forces of European colonialism.`,
    pageCount: 209,
    publisher: "Heinemann",
    publishedDate: "1958",
    isbn: "978-0-385-47454-2",
    language: "English",
    formats: ["Paperback", "E-book", "Audiobook"],
  },
  {
    _id: "cbc1",
    title: "Mathematics Learner's Book Grade 7",
    author: "KICD",
    price: 850,
    salePrice: 765,
    rating: 4.7,
    reviewCount: 245,
    ageRange: "12-15 Years",
    badge: "CBC Approved",
    badgeColor: "#D97706",
    slug: "mathematics-learner-grade-7",
    categories: ["cbc-education", "junior-secondary", "mathematics"],
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
    description: `Complete coverage of the Grade 7 mathematics curriculum with clear explanations, examples, and practice exercises aligned with CBC requirements.`,
    pageCount: 342,
    publisher: "Kenya Institute of Curriculum Development",
    publishedDate: "January 2023",
    isbn: "978-9966-34-567-8",
    language: "English",
    formats: ["Paperback"],
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function generateMockReviews(bookId, rating, reviewCount) {
  const names = [
    "Sarah M.",
    "James T.",
    "Priya K.",
    "Michael R.",
    "Emma W.",
    "David L.",
    "Lisa C.",
    "John B.",
  ];
  const texts = [
    "Absolutely breathtaking. This book changed my perspective.",
    "A wonderful read that I couldn't put down. Highly recommended!",
    "One of those rare books that stays with you long after you finish.",
    "Thought-provoking and touching. The concept is brilliant.",
    "Beautifully written with incredible depth. A must-read!",
    "Exceeded all my expectations. Will definitely read again.",
    "The author has created something truly special here.",
    "Engaging from start to finish. Worth every penny!",
  ];
  const count = Math.min(6, Math.floor(reviewCount / 200) + 3);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    rating:
      Math.round(
        Math.min(5, Math.max(4, rating + (Math.random() - 0.5) * 0.8)) * 2,
      ) / 2,
    date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Math.floor(Math.random() * 12)]} 2024`,
    text: texts[i % texts.length] + (i === 0 ? " Truly unforgettable." : ""),
  }));
}

function getRatingBreakdown(rating) {
  const d = rating - 4;
  const v = [
    Math.min(85, Math.max(40, 60 + d * 15)),
    Math.min(30, Math.max(15, 25 - d * 5)),
    Math.min(20, Math.max(5, 10 - d * 3)),
    Math.min(10, Math.max(1, 4 - d)),
    Math.max(1, 3 - d * 0.5),
  ];
  const total = v.reduce((a, b) => a + b, 0);
  return [5, 4, 3, 2, 1].map((stars, i) => ({
    stars,
    pct: Math.round((v[i] / total) * 100),
  }));
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="bg-[rgba(255,255,255,0.52)] border border-[rgba(200,170,130,0.28)] rounded-2xl p-[18px_20px] backdrop-blur-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold text-white"
            style={{ background: `hsl(${review.id * 47}, 45%, 75%)` }}
          >
            {review.name[0]}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#3d2010]">
              {review.name}
            </div>
            <div className="text-[11px] text-[#9a7a5a]">{review.date}</div>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" showCount={false} />
      </div>
      <p className="text-[13px] text-[#5c3d1e] leading-[1.7]">{review.text}</p>
    </div>
  );
}

function BookCover({ book, imageOverride }) {
  const [imgErr, setImgErr] = useState(false);
  const src = imageOverride || book.img || book.coverImage;
  const fallbackIcon =
    book.type === "stationery" ? "✏️" : book.type === "accessory" ? "🎒" : "📖";

  if (!imgErr && src) {
    return (
      <img
        src={src}
        alt={book.title}
        onError={() => setImgErr(true)}
        className="w-full h-full object-cover block"
      />
    );
  }
  // Fallback illustrated cover
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "linear-gradient(145deg, #8aaccb, #6a8cb0)" }}
    >
      <div className="w-[55%] h-[75%] bg-gradient-to-br from-white/12 to-white/04 rounded-[4px_12px_12px_4px] border border-white/20 shadow-[8px_12px_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-5 relative">
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20 rounded-l-[4px]" />
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mb-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="opacity-80"
          >
            <path
              d="M12 2L9 8H3l5 4-2 6 6-4 6 4-2-6 5-4h-6L12 2Z"
              fill="rgba(255,255,255,0.9)"
            />
          </svg>
        </div>
        <div className="text-[11px] text-white/90 font-['Playfair_Display',serif] font-semibold text-center leading-[1.4] mb-1.5">
          {fallbackIcon} {book.title}
        </div>
        <div className="text-[9px] text-white/60">
          {book.author || book.brand}
        </div>
      </div>
    </div>
  );
}

function productTypeName(item) {
  if (item.type === "stationery") return "Stationery";
  if (item.type === "accessory") return "Accessory";
  return item.isCBC ? "CBC Textbook" : "Book";
}

function productBackHref(item) {
  if (item.type === "stationery") return "/category/stationery";
  if (item.type === "accessory") return "/category/accessories";
  if (item.isCBC) return "/category/cbc-education";
  return "/books";
}

function LoadingSkeleton() {
  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-20">
      <div className="px-[clamp(48px,6vw,100px)] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[56px]">
          <div className="rounded-[20px] overflow-hidden aspect-[3/4] max-h-[520px] bg-gradient-to-r from-[#f0e8dc] via-[#e8ddd0] to-[#f0e8dc] animate-pulse" />
          <div className="space-y-4 pt-4">
            <div className="h-4 w-24 bg-[#ede5d8] rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-[#ede5d8] rounded animate-pulse" />
            <div className="h-4 w-40 bg-[#ede5d8] rounded animate-pulse" />
            <div className="h-8 w-32 bg-[#ede5d8] rounded animate-pulse" />
            <div className="space-y-2 pt-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 bg-[#ede5d8] rounded animate-pulse"
                  style={{ width: `${85 - i * 8}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function BookDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState("Paperback");
  const [selectedImage, setSelectedImage] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [ratingBreakdown, setRatingBreakdown] = useState([]);
  const [countdownExpiry] = useState(() =>
    new Date(
      Date.now() + 1000 * 60 * 60 * 2 + 1000 * 60 * 44 + 12000,
    ).toISOString(),
  );

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // ── Fetch from Sanity, fall back to mock ──
  useEffect(() => {
    setLoading(true);
    setBook(null);

    fetchProductBySlug(slug)
      .then((data) => {
        if (!data) {
          // Try mock fallback
          const mock = MOCK_BOOKS.find((b) => b.slug === slug);
          data = mock || null;
        }
        if (data) {
          setBook((prev) => {
            if (prev?._id === data._id) return prev;
            return data;
          });
          // Set default format to first available
          if (data.formats?.length) {
            setSelectedFormat((prev) => {
              if (prev && data.formats.includes(prev)) return prev;
              return data.formats[0];
            });
          }
        }
        setLoading((prev) => prev);
      })
      .catch(() => {
        // Network error — use mock
        const mock = MOCK_BOOKS.find((b) => b.slug === slug);
        setBook(mock ?? null);
        setLoading(false);
      });
  }, [slug]);

  // Generate reviews when book loads
  useEffect(() => {
    if (!book) return;
    const reviews = generateMockReviews(
      book._id,
      book.rating ?? 4.0,
      book.reviewCount ?? 100,
    );
    const ratingBreakdown = getRatingBreakdown(book.rating ?? 4.0);
    setReviews(reviews);
    setRatingBreakdown(ratingBreakdown);
    setSelectedImage(book.img || book.coverImage || null);
  }, [book]);

  if (loading) return <LoadingSkeleton />;

  if (!book) {
    return (
      <div className="bg-[#f5f0e8] min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="font-['Playfair_Display',serif] text-2xl text-[#3d2010] mb-4">
            Item not found
          </h2>
          <Link
            to="/books"
            className="text-[#a0693a] no-underline hover:underline"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(book._id);
  const isBook = !book.type || book.type === "book";
  const typeName = productTypeName(book);
  const finalPrice = book.salePrice ?? book.price;
  const savePercent = book.salePrice
    ? Math.round(((book.price - book.salePrice) / book.price) * 100)
    : 0;
  const displayPrice = (p) => formatPrice(p);
  const categoryName = book.categories?.[0]
    ? book.categories[0]
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : typeName;

  function handleAddToCart() {
    addToCart(
      {
        ...book,
        price: finalPrice,
        format: isBook ? selectedFormat : undefined,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAddToCart();
    navigate("/cart");
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: book.title, url }).catch(() => {});
      return;
    }
    navigator.clipboard?.writeText(url);
  }

  const detailRows = [
    ["Item Type", typeName],
    ["Brand", !isBook ? book.brand || book.author : null],
    ["SKU", book.sku],
    ["Category", book.category],
    ["Material", book.material],
    ["Color", book.color],
    ["Size", book.size],
    ["Dimensions", book.dimensions],
    ["Pack Size", book.packSize],
    ["ISBN", book.isbn],
    ["Pages", book.pageCount],
    ["Published", book.publishedDate],
    ["Publisher", book.publisher],
    ["Language", book.language],
    ["Age Range", book.ageRange],
    ["Care", book.careInstructions],
    ["Categories", book.categories?.join(", ")],
  ].filter(([, v]) => v);
  const gallery = [
    book.img,
    book.coverImage,
    ...(Array.isArray(book.images) ? book.images : []),
  ].filter((src, index, arr) => src && arr.indexOf(src) === index);

  // SEO data for product
  const productSeo = {
    title: book.title,
    description:
      book.description?.slice(0, 160).replace(/\n/g, " ") ||
      `${typeName} by ${book.author || "Kiddle"}`,
    image: book.img || book.coverImage,
    type: isBook ? "book" : "product",
    price: formatPrice(finalPrice),
    availability: book.inStock === false ? "OutOfStock" : "InStock",
  };

  return (
    <>
      <Helmet>
        <title>{productSeo.title} | Kiddle Bookshop</title>
        <meta name="title" content={`${productSeo.title} | Kiddle Bookshop`} />
        <meta name="description" content={productSeo.description} />
        <link
          rel="canonical"
          href={`https://www.kiddlebookshop.com/book/${book.slug}`}
        />
        <meta
          property="og:url"
          content={`https://www.kiddlebookshop.com/book/${book.slug}`}
        />
        <meta property="og:image" content={productSeo.image} />
        <meta name="twitter:image" content={productSeo.image} />

        {/* Product structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": isBook ? "Book" : "Product",
            name: book.title,
            description: productSeo.description,
            image: productSeo.image,
            author: isBook
              ? {
                  "@type": "Person",
                  name: book.author,
                }
              : undefined,
            publisher: book.publisher
              ? {
                  "@type": "Organization",
                  name: book.publisher,
                }
              : undefined,
            datePublished: book.publishedDate,
            isbn: book.isbn,
            numberOfPages: book.pageCount,
            offers: {
              "@type": "Offer",
              price: book.price,
              priceCurrency: "KES",
              availability: `https://schema.org/${productSeo.availability}`,
              url: `https://www.kiddlebookshop.com/book/${book.slug}`,
              seller: {
                "@type": "Organization",
                name: "Kiddle Bookshop",
              },
            },
            aggregateRating: book.rating
              ? {
                  "@type": "AggregateRating",
                  ratingValue: book.rating,
                  reviewCount: book.reviewCount,
                }
              : undefined,
            brand: isBook
              ? undefined
              : {
                  "@type": "Brand",
                  name: book.brand || "Kiddle",
                },
          })}
        </script>
      </Helmet>

      <div className="bg-[#f7f1e8] min-h-screen pt-[68px]">
        {/* Countdown banner — only for the first highlighted book */}
        {book._id === "b1" && (
          <div className="bg-[rgba(160,105,58,0.10)] border-b border-[rgba(180,140,90,0.20)] py-2.5 px-10 flex items-center justify-center gap-2.5 flex-wrap">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#a0693a" strokeWidth="1.2" />
              <path
                d="M7 4v3l2 2"
                stroke="#a0693a"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[12.5px] text-[#5c3d1e] font-medium">
              LIMITED EDITION SIGNED COPIES:
            </span>
            <CountdownTimer expiresAt={countdownExpiry} variant="inline" />
            <span className="text-xs text-[#7a5c3a]">REMAINING</span>
          </div>
        )}

        <div className="px-4 py-8 sm:px-6 lg:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#9a7a5a] mb-8 flex-wrap">
            <Link
              to="/"
              className="text-[#9a7a5a] no-underline hover:text-[#a0693a]"
            >
              Home
            </Link>
            <span className="text-[#c4a882]">›</span>
            <Link
              to={productBackHref(book)}
              className="text-[#9a7a5a] no-underline hover:text-[#a0693a]"
            >
              {typeName}
            </Link>
            <span className="text-[#c4a882]">›</span>
            <span className="text-[#5c3d1e] font-medium">{book.title}</span>
          </div>

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 mb-16 items-start">
            {/* Left — Cover */}
            <div>
              <div className="relative mx-auto max-w-[460px] overflow-hidden rounded-xl border border-[#eadfce] bg-white aspect-[3/4] shadow-[0_24px_64px_rgba(53,34,16,0.16)]">
                <BookCover
                  key={selectedImage || book.img || book.coverImage || book._id}
                  book={book}
                  imageOverride={selectedImage}
                />

                {book.badge && (
                  <div className="absolute top-4 left-4 rounded-full bg-[#182a7a] py-1.5 px-3 text-[10.5px] font-bold uppercase tracking-wide text-white shadow-sm">
                    {book.badge}
                  </div>
                )}

                <button
                  onClick={handleShare}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm border border-[rgba(180,140,90,0.3)] flex items-center justify-center cursor-pointer hover:bg-white hover:scale-105 transition-all duration-200"
                  aria-label="Share product"
                  title="Share product"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="13"
                      cy="3"
                      r="1.5"
                      stroke="#7a4e22"
                      strokeWidth="1.3"
                    />
                    <circle
                      cx="13"
                      cy="13"
                      r="1.5"
                      stroke="#7a4e22"
                      strokeWidth="1.3"
                    />
                    <circle
                      cx="3"
                      cy="8"
                      r="1.5"
                      stroke="#7a4e22"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M4.5 8.7L11.5 12M11.5 4L4.5 7.3"
                      stroke="#7a4e22"
                      strokeWidth="1.2"
                    />
                  </svg>
                </button>
              </div>
              {gallery.length > 1 && (
                <div className="mx-auto mt-4 flex max-w-[460px] gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {gallery.map((src) => (
                    <button
                      key={src}
                      onClick={() => setSelectedImage(src)}
                      className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg border bg-white p-1 transition ${
                        selectedImage === src
                          ? "border-[#182a7a] shadow-md"
                          : "border-[#eadfce] hover:border-[#d7b58a]"
                      }`}
                      aria-label="View product image"
                    >
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full rounded-md object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Info */}
            <div className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_14px_42px_rgba(53,34,16,0.07)] sm:p-7">
              <div className="flex items-center gap-2 text-[11.5px] text-[#a0693a] font-semibold tracking-[0.04em] uppercase mb-2.5 flex-wrap">
                {categoryName}
                <span className="text-[#c4a882]">›</span>
                <span className="text-[#9a7a5a] font-normal normal-case tracking-normal">
                  {isBook
                    ? `${selectedFormat} Edition`
                    : book.brand || "Kiddle"}
                </span>
              </div>

              <h1 className="font-['Playfair_Display',serif] text-[clamp(26px,3.5vw,38px)] font-bold text-[#3d2010] leading-[1.2] mb-1.5">
                {book.title}
              </h1>
              <p className="text-[15px] text-[#9a7a5a] italic mb-3.5">
                {isBook ? "by" : "from"}{" "}
                <span className="text-[#a0693a] not-italic">
                  {book.author || book.brand || "Kiddle"}
                </span>
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    book.inStock === false
                      ? "bg-[#fae8e8] text-[#a23b3b]"
                      : "bg-[#e8f5ee] text-[#21744b]"
                  }`}
                >
                  {book.inStock === false ? "Out of stock" : "In stock"}
                </span>
                {book.isbn && (
                  <span className="rounded-full bg-[#f2eadf] px-3 py-1 text-[11px] font-bold text-[#7a4e22]">
                    ISBN {book.isbn}
                  </span>
                )}
                {book.publisher && (
                  <span className="rounded-full bg-[#eef1fb] px-3 py-1 text-[11px] font-bold text-[#182a7a]">
                    {book.publisher}
                  </span>
                )}
              </div>

              {/* Rating (only if book has one) */}
              {book.rating && (
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <StarRating
                    rating={book.rating}
                    size="md"
                    showCount={false}
                  />
                  <span className="text-[13px] text-[#a0693a] font-semibold">
                    {book.rating}
                  </span>
                  <span className="text-[12.5px] text-[#9a7a5a]">
                    ({formatReviewCount(book.reviewCount)})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 flex-wrap">
                <span className="font-['Playfair_Display',serif] text-[32px] font-bold text-[#3d2010]">
                  {displayPrice(finalPrice)}
                </span>
                {book.salePrice && (
                  <>
                    <span className="text-base text-[#b8998a] line-through">
                      {displayPrice(book.price)}
                    </span>
                    <span className="text-xs font-bold text-[#2d7a45] bg-[rgba(60,140,80,0.10)] py-[3px] px-[9px] rounded-[10px]">
                      Save {savePercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Format selector */}
              {isBook && book.formats?.length > 0 && (
                <div className="mb-6">
                  <div className="text-[11px] font-semibold text-[#5c3d1e] uppercase tracking-[0.07em] mb-2.5">
                    Select Format
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {book.formats.map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setSelectedFormat(fmt)}
                        className="px-4 py-2 rounded-[20px] border-[1.5px] text-[12.5px] transition-all duration-200 cursor-pointer"
                        style={{
                          borderColor:
                            selectedFormat === fmt
                              ? "#a0693a"
                              : "rgba(180,140,90,0.3)",
                          background:
                            selectedFormat === fmt
                              ? "rgba(160,105,58,0.14)"
                              : "rgba(255,255,255,0.6)",
                          color: selectedFormat === fmt ? "#5c3520" : "#7a5c3a",
                          fontWeight: selectedFormat === fmt ? "600" : "400",
                        }}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <div className="text-[11px] font-semibold text-[#5c3d1e] uppercase tracking-[0.07em] mb-2.5">
                  Quantity
                </div>
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-[38px] h-[38px] bg-[rgba(255,255,255,0.6)] border border-[rgba(180,140,90,0.3)] border-r-0 rounded-l-[10px] cursor-pointer text-base text-[#7a4e22] flex items-center justify-center hover:bg-[rgba(255,255,255,0.8)] transition-all duration-200"
                  >
                    −
                  </button>
                  <div className="w-12 h-[38px] bg-[rgba(255,255,255,0.7)] border border-[rgba(180,140,90,0.3)] flex items-center justify-center text-[14px] font-semibold text-[#3d2010]">
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-[38px] h-[38px] bg-[rgba(255,255,255,0.6)] border border-[rgba(180,140,90,0.3)] border-l-0 rounded-r-[10px] cursor-pointer text-base text-[#7a4e22] flex items-center justify-center hover:bg-[rgba(255,255,255,0.8)] transition-all duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 mb-5 flex-wrap">
                <button
                  onClick={handleAddToCart}
                  disabled={book.inStock === false}
                  className={`flex-1 min-w-[170px] flex items-center justify-center gap-2 py-[14px] px-6 rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-250 disabled:cursor-not-allowed disabled:bg-[#c9c1b8] ${added ? "bg-[rgba(60,140,80,0.15)] border-[1.5px] border-[rgba(60,140,80,0.35)] text-[#2d7a45] shadow-none" : "bg-[#182a7a] text-white shadow-[0_8px_26px_rgba(24,42,122,0.22)] hover:bg-[#233b9e] hover:-translate-y-px"}`}
                >
                  {added ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="7"
                          stroke="#2d7a45"
                          strokeWidth="1.4"
                        />
                        <path
                          d="M5 8l2.5 2.5 4-4"
                          stroke="#2d7a45"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>{" "}
                      Added to Basket!
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 2H3.5L5.5 10H12L13.5 5H4.5"
                          stroke="white"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="6.5" cy="12.5" r="1" fill="white" />
                        <circle cx="11.5" cy="12.5" r="1" fill="white" />
                      </svg>{" "}
                      Add to Basket
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={book.inStock === false}
                  className="flex-1 min-w-[150px] rounded-lg border border-[#182a7a] bg-white px-6 py-[14px] text-[14px] font-bold text-[#182a7a] transition hover:bg-[#eef1fb] disabled:cursor-not-allowed disabled:border-[#c9c1b8] disabled:text-[#9d8a78]"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => toggleWishlist(book)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 border-[1.5px] hover:scale-105 ${wishlisted ? "bg-[#eef1fb] border-[#182a7a]" : "bg-white border-[#d9c8b4] hover:border-[#182a7a]"}`}
                  aria-label={
                    wishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  title={
                    wishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 15.5C9 15.5 2 11 2 6.5C2 4.3 3.8 2.5 6 2.5C7.4 2.5 8.6 3.3 9 4.2C9.4 3.3 10.6 2.5 12 2.5C14.2 2.5 16 4.3 16 6.5C16 11 9 15.5 9 15.5Z"
                      fill={wishlisted ? "#182a7a" : "none"}
                      stroke="#182a7a"
                      strokeWidth="1.4"
                    />
                  </svg>
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex gap-5 flex-wrap pt-3.5 border-t border-[rgba(180,140,90,0.18)]">
                <div className="flex items-center gap-1.5 text-xs text-[#7a5c3a]">
                  <span className="text-sm">🚚</span> Ships in 24 hours
                </div>
                {isBook && (
                  <div className="flex items-center gap-1.5 text-xs text-[#7a5c3a]">
                    <span className="text-sm">📖</span> Free chapter preview
                  </div>
                )}
                {book.ageRange && (
                  <div className="flex items-center gap-1.5 text-xs text-[#7a5c3a]">
                    <span className="text-sm">🎯</span> Ages {book.ageRange}
                  </div>
                )}
                {!isBook && book.inStock !== false && (
                  <div className="flex items-center gap-1.5 text-xs text-[#7a5c3a]">
                    <span className="text-sm">✓</span> In stock
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="mb-16" id="reviews">
            <div className="flex border-b border-[rgba(180,140,90,0.2)] mb-7 gap-0 flex-wrap">
              {["description", "details", "reviews"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-3 px-6 bg-none border-none border-b-2 text-[13.5px] cursor-pointer transition-all duration-200 capitalize mb-px ${tab === t ? "border-[#a0693a] text-[#a0693a] font-semibold" : "border-transparent text-[#9a7a5a] font-normal hover:text-[#a0693a]"}`}
                >
                  {t}
                  {t === "reviews"
                    ? ` (${(book.reviewCount || 0).toLocaleString()})`
                    : ""}
                </button>
              ))}
            </div>

            {tab === "description" && (
              <div className="max-w-[720px]">
                {(book.description || "No description available.")
                  .split("\n\n")
                  .map((para, i) => (
                    <p
                      key={i}
                      className="text-[14px] text-[#5c3d1e] leading-[1.8] mb-4"
                    >
                      {para}
                    </p>
                  ))}
              </div>
            )}

            {tab === "details" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[720px]">
                {detailRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-[rgba(255,255,255,0.52)] border border-[rgba(200,170,130,0.25)] rounded-xl p-3 backdrop-blur-sm hover:shadow-sm transition-all duration-200"
                  >
                    <div className="text-[10px] text-[#9a7a5a] font-semibold uppercase tracking-[0.06em] mb-1">
                      {label}
                    </div>
                    <div className="text-[13.5px] text-[#3d2010] font-medium">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 items-start">
                {/* Rating breakdown */}
                <div className="bg-[rgba(255,255,255,0.52)] border border-[rgba(200,170,130,0.28)] rounded-[20px] p-6 backdrop-blur-sm sticky top-[84px]">
                  <div className="text-center mb-5">
                    <div className="font-['Playfair_Display',serif] text-[52px] font-bold text-[#3d2010] leading-none">
                      {book.rating ?? "—"}
                    </div>
                    {book.rating && (
                      <StarRating
                        rating={book.rating}
                        size="lg"
                        showCount={false}
                      />
                    )}
                    <div className="text-xs text-[#9a7a5a] mt-1.5">
                      {formatReviewCount(book.reviewCount ?? 0)}
                    </div>
                  </div>
                  {ratingBreakdown.map(({ stars, pct }) => (
                    <div key={stars} className="flex items-center gap-2.5 mb-2">
                      <span className="text-[11px] text-[#7a5c3a] w-[10px]">
                        {stars}
                      </span>
                      <span className="text-[11px] text-[#a0693a]">★</span>
                      <div className="flex-1 h-1.5 bg-[rgba(160,105,58,0.12)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#a0693a] rounded-full transition-all duration-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#9a7a5a] w-[28px] text-right">
                        {pct}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Review cards */}
                <div className="flex flex-col gap-3.5">
                  {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Related books ── */}
          <div className="border-t border-[rgba(180,140,90,0.18)] pt-12">
            <div className="mb-1">
              <div className="text-[11px] text-[#a0693a] font-bold tracking-[0.08em] uppercase mb-1">
                CURATED FOR YOU
              </div>
            </div>
            <Suspense
              fallback={
                <div className="h-40 flex items-center justify-center">
                  Loading related…
                </div>
              }
            >
              <FeaturedCarousel
                title="Readers Also Loved"
                viewAllHref="/books"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
