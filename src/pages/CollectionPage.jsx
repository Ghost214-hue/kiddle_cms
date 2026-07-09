import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Link,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useCart, useWishlist } from "../context/CartContext";
import { fetchAllProducts } from "../lib/queries";
import { formatPrice } from "../utils/formatPrice";
import StationeryCard from "../components/ui/StationeryCard";
import BookCard from "../components/ui/BookCard";
import { CollectionSkeleton } from "../components/ui/Skeleton.jsx";

const MAIN_CATEGORIES = [
  {
    id: "all",
    label: "All",
    emoji: "🛍️",
    types: ["book", "stationery", "accessory"],
  },
  { id: "books", label: "Books", emoji: "📚", types: ["book"], isCBC: false },
  {
    id: "cbc-books",
    label: "CBC Textbooks",
    emoji: "📘",
    types: ["book"],
    isCBC: true,
  },
  { id: "stationery", label: "Stationery", emoji: "✏️", types: ["stationery"] },
  {
    id: "accessories",
    label: "Accessories",
    emoji: "🎒",
    types: ["accessory"],
  },
];

const BOOK_GENRES = [
  { slug: "fiction", label: "Fiction" },
  { slug: "storybooks", label: "Storybooks" },
  { slug: "african-writers", label: "African Writers" },
  { slug: "bestsellers", label: "Bestsellers" },
];
const CBC_SUBJECTS = [
  { slug: "mathematics", label: "Mathematics" },
  { slug: "english", label: "English" },
  { slug: "kiswahili", label: "Kiswahili" },
  { slug: "science", label: "Science" },
  { slug: "social-studies", label: "Social Studies" },
  { slug: "cre", label: "CRE" },
  { slug: "creative-arts", label: "Creative Arts" },
  { slug: "phe", label: "PE & Sports" },
  { slug: "encyclopaedias", label: "Encyclopaedias" },
];
const CBC_LEVELS = [
  { slug: "play-group", label: "Play Group", icon: "🎨" },
  { slug: "pp1", label: "PP1", icon: "🎨" },
  { slug: "pp2", label: "PP2", icon: "🎨" },
  { slug: "grade-1", label: "Grade 1", icon: "📖" },
  { slug: "grade-2", label: "Grade 2", icon: "📖" },
  { slug: "grade-3", label: "Grade 3", icon: "📖" },
  { slug: "grade-4", label: "Grade 4", icon: "🔬" },
  { slug: "grade-5", label: "Grade 5", icon: "🔬" },
  { slug: "grade-6", label: "Grade 6", icon: "🔬" },
  { slug: "grade-7", label: "Grade 7", icon: "⚗️" },
  { slug: "grade-8", label: "Grade 8", icon: "⚗️" },
  { slug: "grade-9", label: "Grade 9", icon: "⚗️" },
];
const STATIONERY_TYPES = [
  { slug: "notebooks", label: "Notebooks & Journals" },
  { slug: "pens", label: "Pens & Markers" },
  { slug: "pencils", label: "Pencils" },
  { slug: "art-supplies", label: "Art Supplies" },
  { slug: "planning", label: "Planning" },
  { slug: "writing", label: "Writing" },
];
const ACCESSORY_TYPES = [
  { slug: "bookmarks", label: "Bookmarks" },
  { slug: "book-stands", label: "Book Stands" },
  { slug: "bags", label: "Bags & Sleeves" },
  { slug: "reading-aids", label: "Reading Aids" },
  { slug: "gifts", label: "Gifts" },
  { slug: "home", label: "Home & Decor" },
];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
];

const PRICE_MAX = 5000;
const MOCK_PRODUCTS = [];

function CheckBox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer py-1 text-[12px] text-[#7a5c3a] hover:text-[#5c3d1e] transition-colors">
      <div
        onClick={onChange}
        className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all duration-150 cursor-pointer"
        style={{
          border: `1.5px solid ${checked ? "#a0693a" : "rgba(180,140,90,0.4)"}`,
          background: checked ? "#a0693a" : "rgba(255,255,255,0.7)",
        }}
      >
        {checked && (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5l2.5 2.5 4-4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label}
    </label>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[rgba(180,140,90,0.15)] pb-3 mb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full bg-none border-none cursor-pointer pt-0.5 pb-2"
      >
        <span className="text-[12px] font-bold text-[#5c3d1e]">{title}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="#a0693a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="col-span-full text-center py-16 px-5 bg-white/55 border border-[rgba(200,170,130,0.22)] rounded-xl">
      <div className="text-4xl mb-3">📭</div>
      <h3 className="font-['Playfair_Display',serif] text-xl text-[#3d2010] mb-2">
        Nothing found
      </h3>
      <p className="text-[13px] text-[#9a7a5a] mb-5">
        Try adjusting your filters or search terms.
      </p>
      <button
        onClick={onReset}
        className="bg-[#a0693a] text-white border-none py-2.5 px-6 rounded-full cursor-pointer text-[12.5px] font-bold hover:bg-[#8a5830] transition"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split("/");
  const categoryInPath = pathParts.includes("category")
    ? pathParts[pathParts.indexOf("category") + 1]
    : null;
  const initialMain =
    categoryInPath === "stationery"
      ? "stationery"
      : categoryInPath === "accessories"
        ? "accessories"
        : categoryInPath === "cbc-education" || categoryInPath === "cbc-books"
          ? "cbc-books"
          : categoryInPath === "books"
            ? "books"
            : "all";

  const [mainCat, setMainCat] = useState(initialMain);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX]);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [uiLoading, setUiLoading] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const urlFilter = searchParams.get("filter") || "";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    let cancelled = false;
    fetchAllProducts()
      .then((results) => {
        if (cancelled) return;
        setAllProducts(results.length ? results : MOCK_PRODUCTS);
        setDataLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setAllProducts(MOCK_PRODUCTS);
        setDataLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (dataLoading) return;
    const t = setTimeout(() => setUiLoading(false), 400);
    return () => clearTimeout(t);
  }, [
    mainCat,
    sort,
    selectedSubs,
    selectedGrades,
    selectedAvailability,
    selectedAuthors,
    selectedPublishers,
    minRating,
    priceRange,
    urlFilter,
    searchQuery,
  ]);

  function switchMainCat(id) {
    setMainCat(id);
    setSelectedSubs([]);
    setSelectedGrades([]);
    setSelectedAvailability([]);
    setSelectedAuthors([]);
    setSelectedPublishers([]);
    setMinRating(0);
    setPriceRange([0, PRICE_MAX]);
    setPage(1);
    if (id === "stationery") navigate("/category/stationery");
    else if (id === "accessories") navigate("/category/accessories");
    else if (id === "cbc-books") navigate("/category/cbc-education");
    else if (id === "all") navigate("/books");
    else navigate("/category/books");
  }

  const updateSearch = (q) => {
    if (q) searchParams.set("search", q);
    else searchParams.delete("search");
    setSearchParams(searchParams);
    setPage(1);
  };

  let products = [...allProducts];
  if (mainCat === "cbc-books")
    products = products.filter((p) => p.type === "book" && p.isCBC);
  else if (mainCat === "books")
    products = products.filter((p) => p.type === "book" && !p.isCBC);
  else if (mainCat === "stationery")
    products = products.filter((p) => p.type === "stationery");
  else if (mainCat === "accessories")
    products = products.filter((p) => p.type === "accessory");

  if (urlFilter === "new-arrivals")
    products = products.filter((p) => p.badge === "New");
  if (urlFilter === "bestsellers")
    products = products.filter(
      (p) =>
        p.categories?.includes("bestsellers") ||
        p.badge?.includes("Bestseller"),
    );

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    products = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.publisher?.toLowerCase().includes(q),
    );
  }
  if (selectedSubs.length)
    products = products.filter((p) =>
      selectedSubs.some((s) => p.categories?.includes(s)),
    );
  if (selectedGrades.length)
    products = products.filter((p) =>
      selectedGrades.some((g) => p.cbcLevel === g),
    );
  if (selectedAvailability.length)
    products = products.filter((p) =>
      selectedAvailability.includes(p.inStock === false ? "out" : "in"),
    );
  if (selectedAuthors.length)
    products = products.filter((p) =>
      selectedAuthors.includes(p.author || p.brand || "Kiddle"),
    );
  if (selectedPublishers.length)
    products = products.filter((p) =>
      selectedPublishers.includes(p.publisher || p.brand || "Kiddle"),
    );
  if (minRating)
    products = products.filter((p) => (p.rating || 0) >= minRating);

  products = products.filter((p) => {
    const price = p.salePrice ?? p.price;
    return price >= priceRange[0] && price <= priceRange[1];
  });
  if (sort === "price-asc")
    products = [...products].sort(
      (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
    );
  if (sort === "price-desc")
    products = [...products].sort(
      (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
    );
  if (sort === "rating")
    products = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const displayed = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  function toggle(arr, setArr, val) {
    setArr((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
    setPage(1);
  }
  function resetFilters() {
    setSelectedSubs([]);
    setSelectedGrades([]);
    setSelectedAvailability([]);
    setSelectedAuthors([]);
    setSelectedPublishers([]);
    setMinRating(0);
    setPriceRange([0, PRICE_MAX]);
    setPage(1);
  }

  const hasFilters =
    selectedSubs.length ||
    selectedGrades.length ||
    selectedAvailability.length ||
    selectedAuthors.length ||
    selectedPublishers.length ||
    minRating ||
    priceRange[1] < PRICE_MAX;
  const subFilters =
    mainCat === "stationery"
      ? STATIONERY_TYPES
      : mainCat === "accessories"
        ? ACCESSORY_TYPES
        : mainCat === "cbc-books"
          ? CBC_SUBJECTS
          : BOOK_GENRES;
  const subFilterTitle =
    mainCat === "cbc-books"
      ? "Subject"
      : mainCat === "stationery" || mainCat === "accessories"
        ? "Type"
        : "Genre";
  const maxPrice = PRICE_MAX;
  const activeCatDef =
    MAIN_CATEGORIES.find((c) => c.id === mainCat) || MAIN_CATEGORIES[0];
  const isLoading = dataLoading || uiLoading;
  const authorOptions = [
    ...new Set(allProducts.map((p) => p.author || p.brand).filter(Boolean)),
  ]
    .slice(0, 8)
    .map((name) => ({ slug: name, label: name }));
  const publisherOptions = [
    ...new Set(allProducts.map((p) => p.publisher || p.brand).filter(Boolean)),
  ]
    .slice(0, 8)
    .map((name) => ({ slug: name, label: name }));

  const pageTitle =
    urlFilter === "new-arrivals"
      ? "New Arrivals"
      : urlFilter === "bestsellers"
        ? "Bestselling Books"
        : activeCatDef.label;
  const pageDescription =
    urlFilter === "new-arrivals"
      ? "Discover the latest books, stationery, and accessories at Kiddle Bookshop. Fresh arrivals for children, students, and book lovers in Kenya."
      : urlFilter === "bestsellers"
        ? "Shop bestselling children's books and top-rated titles at Kiddle Bookshop. Fast delivery across Kenya."
        : `Browse ${activeCatDef.label.toLowerCase()} at Kiddle Bookshop. Wide selection of quality products for children and students.`;

  const sidebar = (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-bold text-[#3d2010]">Filters</span>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="text-[10px] text-[#a0693a] bg-none border-none cursor-pointer font-semibold hover:underline"
          >
            Reset all
          </button>
        )}
      </div>
      <FilterSection title={subFilterTitle}>
        <div className="space-y-1">
          {subFilters.map((f) => (
            <CheckBox
              key={f.slug}
              label={f.label}
              checked={selectedSubs.includes(f.slug)}
              onChange={() => toggle(selectedSubs, setSelectedSubs, f.slug)}
            />
          ))}
        </div>
      </FilterSection>
      {mainCat === "cbc-books" && (
        <FilterSection title="Grade Level" defaultOpen={false}>
          <div className="space-y-1">
            {CBC_LEVELS.map((g) => (
              <CheckBox
                key={g.slug}
                label={`${g.icon} ${g.label}`}
                checked={selectedGrades.includes(g.slug)}
                onChange={() =>
                  toggle(selectedGrades, setSelectedGrades, g.slug)
                }
              />
            ))}
          </div>
        </FilterSection>
      )}
      <FilterSection title="Availability">
        <div className="space-y-1">
          {[
            { slug: "in", label: "In stock" },
            { slug: "out", label: "Out of stock" },
          ].map((f) => (
            <CheckBox
              key={f.slug}
              label={f.label}
              checked={selectedAvailability.includes(f.slug)}
              onChange={() =>
                toggle(selectedAvailability, setSelectedAvailability, f.slug)
              }
            />
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Author / Brand" defaultOpen={false}>
        <div className="space-y-1">
          {authorOptions.map((f) => (
            <CheckBox
              key={f.slug}
              label={f.label}
              checked={selectedAuthors.includes(f.slug)}
              onChange={() =>
                toggle(selectedAuthors, setSelectedAuthors, f.slug)
              }
            />
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Publisher" defaultOpen={false}>
        <div className="space-y-1">
          {publisherOptions.map((f) => (
            <CheckBox
              key={f.slug}
              label={f.label}
              checked={selectedPublishers.includes(f.slug)}
              onChange={() =>
                toggle(selectedPublishers, setSelectedPublishers, f.slug)
              }
            />
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Rating" defaultOpen={false}>
        <select
          value={minRating}
          onChange={(e) => {
            setMinRating(Number(e.target.value));
            setPage(1);
          }}
          className="w-full rounded-lg border border-[rgba(180,140,90,0.28)] bg-white px-3 py-2 text-[12px] text-[#5c3d1e] outline-none focus:border-[#a0693a]"
        >
          <option value={0}>Any rating</option>
          <option value={4.5}>4.5 stars and up</option>
          <option value={4}>4 stars and up</option>
          <option value={3}>3 stars and up</option>
        </select>
      </FilterSection>
      <FilterSection title="Price">
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full accent-[#a0693a] mb-1"
        />
        <div className="flex justify-between text-[11px] text-[#9a7a5a]">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(priceRange[1])}+</span>
        </div>
      </FilterSection>
    </>
  );

  const countFor = (catId) => {
    if (catId === "all") return allProducts.length;
    if (catId === "cbc-books")
      return allProducts.filter((p) => p.type === "book" && p.isCBC).length;
    if (catId === "books")
      return allProducts.filter((p) => p.type === "book" && !p.isCBC).length;
    const def = MAIN_CATEGORIES.find((c) => c.id === catId);
    return allProducts.filter((p) => def?.types?.includes(p.type)).length;
  };

  return (
    <>
      <Helmet>
        <title>{`${pageTitle} | Kiddle Bookshop`}</title>
        <meta name="title" content={`${pageTitle} | Kiddle Bookshop`} />
        <meta name="description" content={pageDescription} />
        <link
          rel="canonical"
          href={`https://www.kiddlebookshop.com${location.pathname}`}
        />
        <meta
          property="og:url"
          content={`https://www.kiddlebookshop.com${location.pathname}`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pageTitle,
            description: pageDescription,
            url: `https://www.kiddlebookshop.com${location.pathname}`,
            mainEntity: { "@type": "OnlineStore", name: "Kiddle Bookshop" },
          })}
        </script>
      </Helmet>

      <div className="bg-[#f7f1e8] min-h-screen pt-20">
        <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} } .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}`}</style>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
          <div className="flex items-center gap-2 text-xs text-[#9a7a5a] mb-4">
            <Link
              to="/"
              className="text-[#9a7a5a] no-underline hover:text-[#a0693a]"
            >
              Home
            </Link>
            <span className="text-[#c4a882]">›</span>
            <Link
              to="/books"
              className="text-[#9a7a5a] no-underline hover:text-[#a0693a]"
            >
              Shop
            </Link>
            <span className="text-[#c4a882]">›</span>
            <span className="text-[#5c3d1e] font-medium">
              {urlFilter === "new-arrivals"
                ? "New Arrivals"
                : urlFilter === "bestsellers"
                  ? "Bestsellers"
                  : activeCatDef.label}
            </span>
          </div>

          <div className="mb-6 rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_12px_34px_rgba(53,34,16,0.06)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#182a7a]">
                  Catalog
                </p>
                <h1 className="font-['Playfair_Display',serif] text-[clamp(28px,5vw,42px)] font-bold leading-tight text-[#20160d]">
                  {urlFilter === "new-arrivals"
                    ? "New Arrivals"
                    : urlFilter === "bestsellers"
                      ? "Bestsellers"
                      : activeCatDef.label}
                </h1>
                <p className="mt-2 text-sm text-[#75624d]">
                  {isLoading
                    ? "Loading products..."
                    : `${products.length} products available`}
                </p>
              </div>
              <div className="relative w-full lg:max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => updateSearch(e.target.value)}
                  placeholder="Search title, author, publisher..."
                  className="w-full rounded-lg border border-[#d9c8b4] bg-[#fbf8f2] py-3 pl-4 pr-11 text-sm text-[#20160d] outline-none transition focus:border-[#182a7a] focus:bg-white"
                />
                <svg
                  className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7359]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-5 border-b border-[rgba(180,140,90,0.18)] pb-4 overflow-x-auto scrollbar-none">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => switchMainCat(cat.id)}
                className="flex items-center gap-1 py-1.5 px-3.5 rounded-full cursor-pointer transition-all duration-200 text-[12px] whitespace-nowrap"
                style={{
                  background:
                    mainCat === cat.id ? "#a0693a" : "rgba(255,255,255,0.65)",
                  border: `1px solid ${mainCat === cat.id ? "#a0693a" : "rgba(180,140,90,0.28)"}`,
                  color: mainCat === cat.id ? "#fff" : "#5c3d1e",
                  fontWeight: mainCat === cat.id ? "700" : "500",
                }}
              >
                <span className="text-[13px]">{cat.emoji}</span>
                {cat.label}
                <span
                  className="text-[9px] font-bold py-0.5 px-1.5 rounded-full ml-0.5"
                  style={{
                    background:
                      mainCat === cat.id
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(160,105,58,0.10)",
                    color: mainCat === cat.id ? "#fff" : "#a0693a",
                  }}
                >
                  {countFor(cat.id)}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-5 items-start">
            <aside className="w-[220px] flex-shrink-0 hidden md:block bg-white/60 border border-[rgba(200,170,130,0.28)] rounded-xl p-4 backdrop-blur-md sticky top-22 max-h-[calc(100vh-108px)] overflow-y-auto">
              {sidebar}
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div>
                  <p className="text-sm font-semibold text-[#20160d]">
                    {isLoading
                      ? "Preparing results"
                      : `Showing ${displayed.length} of ${products.length}`}
                  </p>
                  <p className="text-xs text-[#9a7a5a] mt-1">
                    Use filters and sorting to refine the shelf.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="md:hidden flex items-center gap-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold cursor-pointer transition-all"
                    onClick={() => setMobileFilters(true)}
                    style={{
                      background: hasFilters
                        ? "rgba(160,105,58,0.12)"
                        : "rgba(255,255,255,0.65)",
                      border: `1px solid ${hasFilters ? "rgba(160,105,58,0.35)" : "rgba(180,140,90,0.28)"}`,
                      color: hasFilters ? "#7a4e22" : "#5c3d1e",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 4h10M4 7h6M6 10h2"
                        stroke="#a0693a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Filters{hasFilters ? " active" : ""}
                  </button>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="py-1.5 px-3 text-[11px] bg-white/65 border border-[rgba(180,140,90,0.28)] rounded-lg text-[#5c3d1e] cursor-pointer outline-none"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(selectedSubs.length > 0 ||
                selectedGrades.length > 0 ||
                selectedAvailability.length > 0 ||
                selectedAuthors.length > 0 ||
                selectedPublishers.length > 0 ||
                minRating > 0) && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    ...selectedSubs.map((s) => ({
                      key: s,
                      label:
                        [...subFilters].find((x) => x.slug === s)?.label || s,
                      set: setSelectedSubs,
                    })),
                    ...selectedGrades.map((g) => ({
                      key: g,
                      label: CBC_LEVELS.find((x) => x.slug === g)?.label || g,
                      set: setSelectedGrades,
                    })),
                    ...selectedAvailability.map((a) => ({
                      key: a,
                      label: a === "in" ? "In stock" : "Out of stock",
                      set: setSelectedAvailability,
                    })),
                    ...selectedAuthors.map((a) => ({
                      key: a,
                      label: a,
                      set: setSelectedAuthors,
                    })),
                    ...selectedPublishers.map((p) => ({
                      key: p,
                      label: p,
                      set: setSelectedPublishers,
                    })),
                    ...(minRating
                      ? [
                          {
                            key: "rating",
                            label: `${minRating}+ stars`,
                            set: () => setMinRating(0),
                          },
                        ]
                      : []),
                  ].map((chip) => (
                    <div
                      key={chip.key}
                      className="flex items-center gap-1 bg-[rgba(160,105,58,0.10)] border border-[rgba(160,105,58,0.28)] rounded-full py-0.5 px-2.5 text-[11px] text-[#7a4e22]"
                    >
                      <span>{chip.label}</span>
                      <button
                        onClick={() => {
                          if (chip.key === "rating") chip.set();
                          else
                            chip.set((prev) =>
                              prev.filter((v) => v !== chip.key),
                            );
                        }}
                        className="bg-none border-none cursor-pointer text-[#a0693a] text-xs leading-none hover:text-[#8a5830]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isLoading ? (
                <CollectionSkeleton
                  count={8}
                  type={
                    mainCat === "stationery" || mainCat === "accessories"
                      ? "stationery"
                      : "book"
                  }
                />
              ) : products.length === 0 ? (
                <EmptyState onReset={resetFilters} />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-5">
                    {displayed.map((item) => (
                      <div key={item._id} className="min-w-0">
                        {item.type === "stationery" ||
                        item.type === "accessory" ? (
                          <StationeryCard
                            item={item}
                            wishlisted={isWishlisted(item._id)}
                            onWishlist={toggleWishlist}
                            onAddToCart={addToCart}
                          />
                        ) : (
                          <BookCard
                            item={item}
                            wishlisted={isWishlisted(item._id)}
                            onWishlist={toggleWishlist}
                            onAddToCart={addToCart}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex flex-col items-center gap-3 mt-8">
                      <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(160,105,58,0.22)] bg-white/95 shadow-sm px-2 py-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((n) => (
                          <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`min-w-[38px] h-10 rounded-full text-[12px] font-semibold transition-colors ${n === page ? "bg-[#a0693a] text-white" : "bg-transparent text-[#7a4e22] hover:bg-[#f5f0e8]"}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#9a7a5a] uppercase tracking-[0.16em]">
                        Page {page} of {totalPages}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {mobileFilters && (
          <div
            onClick={() => setMobileFilters(false)}
            className="fixed inset-0 z-[8990] bg-black/40 backdrop-blur-sm"
          />
        )}
        <div
          className="fixed top-0 left-0 bottom-0 z-[9000] w-[280px] bg-[rgba(248,244,236,0.98)] backdrop-blur-md border-r border-[rgba(20,10,2,0.12)] shadow-2xl flex flex-col transition-transform duration-300"
          style={{
            transform: mobileFilters ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div className="flex items-center justify-between py-3 px-4 border-b border-[rgba(180,140,90,0.18)]">
            <span className="font-['Playfair_Display',serif] text-base font-semibold text-[#3d2010]">
              Filters
            </span>
            <button
              onClick={() => setMobileFilters(false)}
              className="w-7 h-7 rounded-full border border-[rgba(20,10,2,0.14)] bg-white/70 flex items-center justify-center text-[12px]"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-3 px-4">
            <div className="mb-4">
              <span className="text-[12px] font-bold text-[#3d2010]">
                Filters
              </span>
            </div>
            <FilterSection title={subFilterTitle}>
              <div className="space-y-1">
                {subFilters.map((f) => (
                  <CheckBox
                    key={f.slug}
                    label={f.label}
                    checked={selectedSubs.includes(f.slug)}
                    onChange={() =>
                      toggle(selectedSubs, setSelectedSubs, f.slug)
                    }
                  />
                ))}
              </div>
            </FilterSection>
            {mainCat === "cbc-books" && (
              <FilterSection title="Grade Level" defaultOpen={false}>
                <div className="space-y-1">
                  {CBC_LEVELS.map((g) => (
                    <CheckBox
                      key={g.slug}
                      label={`${g.icon} ${g.label}`}
                      checked={selectedGrades.includes(g.slug)}
                      onChange={() =>
                        toggle(selectedGrades, setSelectedGrades, g.slug)
                      }
                    />
                  ))}
                </div>
              </FilterSection>
            )}
            <FilterSection title="Availability">
              <div className="space-y-1">
                {[
                  { slug: "in", label: "In stock" },
                  { slug: "out", label: "Out of stock" },
                ].map((f) => (
                  <CheckBox
                    key={f.slug}
                    label={f.label}
                    checked={selectedAvailability.includes(f.slug)}
                    onChange={() =>
                      toggle(
                        selectedAvailability,
                        setSelectedAvailability,
                        f.slug,
                      )
                    }
                  />
                ))}
              </div>
            </FilterSection>
            <FilterSection title="Author / Brand" defaultOpen={false}>
              <div className="space-y-1">
                {authorOptions.map((f) => (
                  <CheckBox
                    key={f.slug}
                    label={f.label}
                    checked={selectedAuthors.includes(f.slug)}
                    onChange={() =>
                      toggle(selectedAuthors, setSelectedAuthors, f.slug)
                    }
                  />
                ))}
              </div>
            </FilterSection>
            <FilterSection title="Publisher" defaultOpen={false}>
              <div className="space-y-1">
                {publisherOptions.map((f) => (
                  <CheckBox
                    key={f.slug}
                    label={f.label}
                    checked={selectedPublishers.includes(f.slug)}
                    onChange={() =>
                      toggle(selectedPublishers, setSelectedPublishers, f.slug)
                    }
                  />
                ))}
              </div>
            </FilterSection>
            <FilterSection title="Rating" defaultOpen={false}>
              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full rounded-lg border border-[rgba(180,140,90,0.28)] bg-white px-3 py-2 text-[12px] text-[#5c3d1e] outline-none focus:border-[#a0693a]"
              >
                <option value={0}>Any rating</option>
                <option value={4.5}>4.5 stars and up</option>
                <option value={4}>4 stars and up</option>
                <option value={3}>3 stars and up</option>
              </select>
            </FilterSection>
            <FilterSection title="Price">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-[#a0693a] mb-1"
              />
              <div className="flex justify-between text-[11px] text-[#9a7a5a]">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(priceRange[1])}+</span>
              </div>
            </FilterSection>
          </div>
          <div className="py-3 px-4 border-t border-[rgba(180,140,90,0.15)]">
            <button
              onClick={() => setMobileFilters(false)}
              className="w-full py-2.5 bg-[#a0693a] text-white border-none rounded-xl text-[13px] font-bold cursor-pointer hover:bg-[#8a5830] transition"
            >
              Show {products.length} Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
