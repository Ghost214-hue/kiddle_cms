import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  Backpack,
  BookOpen,
  GraduationCap,
  Library,
  NotebookPen,
  Palette,
  PencilRuler,
  Sparkles,
} from "lucide-react";
import { fetchAllProducts, fetchHomePage } from "../lib/queries";

const OffersCarousel = lazy(
  () => import("../components/carousel/OffersCarousel"),
);
const FeaturedCarousel = lazy(
  () => import("../components/carousel/FeaturedCarousel"),
);

const FALLBACK_CATEGORIES = [
  {
    slug: "cbc-education",
    label: "CBC Textbooks",
    desc: "Curriculum-ready learning materials",
    icon: GraduationCap,
  },
  {
    slug: "books",
    label: "Story Books",
    desc: "Bright reads for curious children",
    icon: BookOpen,
  },
  {
    slug: "books",
    label: "Children's Books",
    desc: "Picture books, readers, and classics",
    icon: Library,
  },
  {
    slug: "stationery",
    label: "Stationery",
    desc: "School and office essentials",
    icon: NotebookPen,
  },
  {
    slug: "accessories",
    label: "Accessories",
    desc: "Bags, gifts, and reading extras",
    icon: Backpack,
  },
  {
    slug: "books?filter=african-writers",
    label: "African Literature",
    desc: "Stories rooted close to home",
    icon: Sparkles,
  },
  {
    slug: "books",
    label: "Novels",
    desc: "Fiction, romance, thrillers, and more",
    icon: PencilRuler,
  },
  {
    slug: "cbc-education",
    label: "Educational Materials",
    desc: "Revision guides and workbooks",
    icon: Palette,
  },
];

function FadeSection({ children, className = "" }) {
  return (
    <section className={`animate-fade-slide ${className}`}>{children}</section>
  );
}

function CategoryCard({ category, index }) {
  const Icon = category.icon || FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length].icon;
  const href = category.slug?.startsWith("books?")
    ? `/${category.slug}`
    : category.slug === "books"
      ? "/books"
      : `/category/${category.slug || "books"}`;

  return (
    <a
      href={href}
      className="group flex min-w-[210px] flex-1 items-center gap-4 rounded-lg border border-[#eadfce] bg-white p-4 no-underline shadow-[0_8px_26px_rgba(53,34,16,0.06)] transition hover:-translate-y-1 hover:border-[#d7b58a] hover:shadow-[0_18px_42px_rgba(53,34,16,0.12)] sm:min-w-0"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f2eadf] text-[#182a7a] transition group-hover:bg-[#182a7a] group-hover:text-white">
        {typeof Icon === "function" ? (
          <Icon size={23} />
        ) : (
          <span className="text-xl">{Icon || <Sparkles size={23} />}</span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-[#20160d]">
          {category.label}
        </span>
        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-[#75624d]">
          {category.desc || "Browse curated picks from Kiddle Bookshop"}
        </span>
      </span>
    </a>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#182a7a]">
        {eyebrow}
      </div>
      <h1 className="font-['Playfair_Display'] text-[clamp(28px,5vw,44px)] font-bold leading-tight text-[#20160d]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#75624d]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  const [cmsData, setCmsData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([fetchHomePage(), fetchAllProducts()]).then(
      ([homeResult, productsResult]) => {
        if (!mounted) return;
        if (homeResult.status === "fulfilled") setCmsData(homeResult.value);
        if (productsResult.status === "fulfilled") {
          setProducts(productsResult.value || []);
        }
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const cmsCategories = cmsData?.categories?.length
      ? cmsData.categories.map((category, index) => ({
          ...category,
          icon:
            category.icon ||
            FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length].icon,
        }))
      : [];
    return cmsCategories.length ? cmsCategories : FALLBACK_CATEGORIES;
  }, [cmsData]);

  const autoStationery = products
    .filter((item) => item.type === "stationery")
    .slice(0, 12);
  const autoAccessories = products
    .filter((item) => item.type === "accessory")
    .slice(0, 12);
  const legacyFeaturedProducts = cmsData?.featuredProducts || [];
  const cmsStationery = cmsData?.featuredStationery?.length
    ? cmsData.featuredStationery
    : legacyFeaturedProducts.filter((item) => item.type === "stationery");
  const cmsAccessories = cmsData?.featuredAccessories?.length
    ? cmsData.featuredAccessories
    : legacyFeaturedProducts.filter((item) => item.type === "accessory");
  const stationery = cmsStationery.length ? cmsStationery : autoStationery;
  const accessories = cmsAccessories.length ? cmsAccessories : autoAccessories;
  const featuredBooks =
    cmsData?.featuredBooks?.length > 0
      ? cmsData.featuredBooks
      : products
          .filter((item) => item.type === "book" && item.featured)
          .slice(0, 12);

  return (
    <div className="min-h-screen bg-[#f7f1e8] pt-20">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <FadeSection className="pb-10">
          <SectionHeader
            eyebrow="Shop By Category"
            title="Find the next book, tool, or school essential faster."
            subtitle="Browse polished category shortcuts first, then move straight into curated shelves."
          />

          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-3 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={`${category.slug}-${category.label}-${index}`}
                category={category}
                index={index}
              />
            ))}
          </div>
        </FadeSection>

        <div className="space-y-14 pb-14">
          <FadeSection>
            <Suspense fallback={<div className="py-10 text-center">Loading featured books...</div>}>
              <FeaturedCarousel
                books={featuredBooks.length ? featuredBooks : undefined}
                title="Featured Books"
                eyebrow="Your Next Read"
                viewAllHref="/books"
              />
            </Suspense>
          </FadeSection>

          <FadeSection>
            <Suspense fallback={<div className="py-10 text-center">Loading stationery...</div>}>
              <FeaturedCarousel
                books={stationery}
                title="Stationery"
                subtitle="Pens, notebooks, art supplies, and desk essentials for school or work."
                eyebrow="Write, Draw, Plan"
                viewAllHref="/category/stationery"
              />
            </Suspense>
          </FadeSection>

          <FadeSection>
            <Suspense fallback={<div className="py-10 text-center">Loading accessories...</div>}>
              <FeaturedCarousel
                books={accessories}
                title="Accessories"
                subtitle="Practical extras and thoughtful gifts for readers and students."
                eyebrow="Reader Extras"
                viewAllHref="/category/accessories"
              />
            </Suspense>
          </FadeSection>

          <FadeSection>
            <Suspense fallback={<div className="py-10 text-center">Loading offers...</div>}>
              <OffersCarousel />
            </Suspense>
          </FadeSection>
        </div>
      </div>
    </div>
  );
}
