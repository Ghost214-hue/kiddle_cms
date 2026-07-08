// src/lib/queries.js
import { client, urlFor } from "./sanity";

// ─── SHARED HELPERS ────────────────────────────────────────────────────────

function toImageUrl(image, width = 500) {
  if (!image) return null;
  if (typeof image === "string") return image; // already a URL
  return image?.asset ? urlFor(image).width(width).url() : null;
}

export const fetchContactPage = () =>
  client
    .fetch(
      `
    *[_type == "contactUs"][0] {
      contactEmail, contactPhone, address[], mapEmbed,
      contactMethods[]{type,label,value,icon}, 
      openingHours[]{day,open,close,closed}
    }
  `,
    )
    .then((doc) => {
      if (!doc) return null;
      // No heroImage to process anymore
      return doc;
    });
function toSlug(slug) {
  return slug?.current ?? slug ?? "";
}

export function normalizeBook(b) {
  if (!b) return null;

  const isCBC = b.gradeLevel && b.gradeLevel !== "na";

  const cats = [];

  if (Array.isArray(b.genres) && b.genres.length) {
    cats.push(...b.genres);
  }

  if (isCBC) {
    // Always include these so CBC tab + grade/subject filters work
    if (!cats.includes("cbc-education")) cats.push("cbc-education");
    if (!cats.includes("cbc-textbooks")) cats.push("cbc-textbooks");
    if (b.gradeLevel) cats.push(b.gradeLevel);
  }

  if (b.subject && !cats.includes(b.subject)) cats.push(b.subject);

  // Handle publisher - can be a reference object or string (legacy)
  let publisherName = null;
  if (typeof b.publisher === "object" && b.publisher?.name) {
    publisherName = b.publisher.name;
  } else if (typeof b.publisher === "string") {
    publisherName = b.publisher;
  }

  return {
    ...b,
    _type: "book",
    type: "book",
    slug: toSlug(b.slug),
    img: toImageUrl(b.coverImage) ?? b.img ?? null,
    coverImage: toImageUrl(b.coverImage) ?? null,
    isCBC,
    cbcLevel: isCBC ? b.gradeLevel : null,
    categories: [...new Set(cats)],
    author: b.author ?? "",
    currency: "KES",
    price: b.price ?? 0,
    salePrice: b.salePrice ?? null,
    rating: b.rating ?? 4.0,
    reviewCount: b.reviewCount ?? 0,
    badge: b.badge ?? null,
    badgeColor: b.badgeColor ?? null,
    ageRange: b.ageRange ?? "",
    description: b.description ?? "",
    pageCount: b.pageCount ?? null,
    publisher: publisherName,
    publishedDate: b.publishedDate ?? null,
    isbn: b.isbn ?? null,
    language: b.language ?? "English",
    formats: b.formats ?? ["Paperback"],
  };
}

export function normalizeStationery(s) {
  if (!s) return null;
  return {
    ...s,
    _type: "stationery",
    type: "stationery",
    slug: toSlug(s.slug),
    img: toImageUrl(s.coverImage) ?? s.img ?? null,
    coverImage: toImageUrl(s.coverImage) ?? null,
    author: s.brand ?? "",
    categories: s.category ? [s.category] : [],
    isCBC: false,
    cbcLevel: null,
    currency: "KES",
    price: s.price ?? 0,
    salePrice: s.salePrice ?? null,
    rating: null,
    reviewCount: s.reviewCount ?? 0,
    badge: s.badge ?? null,
    badgeColor: s.badgeColor ?? null,
    ageRange: null,
    material: s.material ?? null,
    color: s.color ?? null,
    size: s.size ?? null,
    dimensions: s.dimensions ?? null,
    packSize: s.packSize ?? null,
    sku: s.sku ?? null,
    careInstructions: s.careInstructions ?? null,
  };
}

export function normalizeAccessory(a) {
  if (!a) return null;
  return {
    ...a,
    _type: "accessory",
    type: "accessory",
    slug: toSlug(a.slug),
    img: toImageUrl(a.coverImage) ?? a.img ?? null,
    coverImage: toImageUrl(a.coverImage) ?? null,
    author: a.brand ?? "Kiddle",

    categories: a.category ? [a.category] : [],
    isCBC: false,
    cbcLevel: null,
    currency: "KES",
    price: a.price ?? 0,
    salePrice: a.salePrice ?? null,
    rating: null,
    reviewCount: a.reviewCount ?? 0,
    badge: a.badge ?? null,
    badgeColor: a.badgeColor ?? null,
    ageRange: null,
    material: a.material ?? null,
    color: a.color ?? null,
    size: a.size ?? null,
    dimensions: a.dimensions ?? null,
    packSize: a.packSize ?? null,
    sku: a.sku ?? null,
    careInstructions: a.careInstructions ?? null,
  };
}

export function normalizeOffer(o) {
  if (!o) return null;
  const item =
    o.book?._type === "stationery"
      ? normalizeStationery(o.book)
      : o.book?._type === "accessory"
        ? normalizeAccessory(o.book)
        : normalizeBook(o.book);

  return {
    ...o,
    book: item,
  };
}

function saleItemToOffer(item) {
  const product =
    item?._type === "stationery"
      ? normalizeStationery(item)
      : item?._type === "accessory"
        ? normalizeAccessory(item)
        : normalizeBook(item);

  if (!product?.salePrice || product.salePrice >= product.price) return null;
  return {
    _id: `sale-${product._id}`,
    discountPercent: Math.round((1 - product.salePrice / product.price) * 100),
    originalPrice: product.price,
    salePrice: product.salePrice,
    badgeLabel: product.badge || "Sale",
    badgeColor: product.badgeColor || "#E53935",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    book: product,
  };
}

const BOOK_FIELDS = `
  _id, title, author, price, salePrice, rating, reviewCount,
  ageRange, badge, badgeColor, coverImage, inStock, featured,
  category, genres, gradeLevel, subject,
  description, pageCount, publisher-> { name, "slug": slug.current }, publishedDate, isbn, language, formats,
  "slug": slug.current
`;

const PRODUCT_REFERENCE_FIELDS = `
  _id, _type, title, author, brand, price, salePrice, rating, reviewCount,
  ageRange, badge, badgeColor, coverImage, inStock, featured,
  category, genres, gradeLevel, subject,
  description, pageCount, publisher-> { name, "slug": slug.current }, publishedDate, isbn, language, formats,
  material, color, size, dimensions, packSize, sku, careInstructions,
  "slug": slug.current
`;

function normalizeProduct(item) {
  if (!item) return null;
  if (item._type === "book") return normalizeBook(item);
  if (item._type === "stationery") return normalizeStationery(item);
  if (item._type === "accessory") return normalizeAccessory(item);
  return item;
}

export const fetchBooks = () =>
  client
    .fetch(
      `*[_type == "book" && (gradeLevel == "na" || !defined(gradeLevel))] | order(_createdAt desc) { ${BOOK_FIELDS} }`,
    )
    .then((r) => r.map(normalizeBook));

export const fetchCBCBooks = () =>
  client
    .fetch(
      `*[_type == "book" && defined(gradeLevel) && gradeLevel != "na"] | order(_createdAt desc) { ${BOOK_FIELDS} }`,
    )
    .then((r) => r.map(normalizeBook));

export const fetchFeaturedBooks = () =>
  client
    .fetch(
      `*[_type == "book" && featured == true] | order(_createdAt desc) { ${BOOK_FIELDS} }`,
    )
    .then((r) => r.map(normalizeBook));

export const fetchBookBySlug = (slug) =>
  client
    .fetch(
      `*[_type == "book" && slug.current == $slug][0] { ${BOOK_FIELDS} }`,
      { slug },
    )
    .then(normalizeBook);

export const fetchProductBySlug = (slug) =>
  client
    .fetch(
      `*[_type in ["book","stationery","accessory"] && slug.current == $slug][0] {
      _id, _type, title, author, brand, price, salePrice, rating, reviewCount,
      ageRange, badge, badgeColor, coverImage, inStock, featured,
      category, genres, gradeLevel, subject,
      description, pageCount, publisher-> { name, "slug": slug.current }, publishedDate, isbn, language, formats,
      material, color, size, dimensions, packSize, sku, careInstructions,
      "slug": slug.current
    }`,
      { slug },
    )
    .then((item) => {
      if (item?._type === "book") return normalizeBook(item);
      if (item?._type === "stationery") return normalizeStationery(item);
      if (item?._type === "accessory") return normalizeAccessory(item);
      return null;
    });

export const fetchStationery = () =>
  client
    .fetch(
      `*[_type == "stationery"] | order(_createdAt desc) {
      _id, title, brand, price, salePrice, reviewCount,
      badge, badgeColor, coverImage, category, description, inStock,
      material, color, size, dimensions, packSize, sku, careInstructions,
      "slug": slug.current
    }`,
    )
    .then((r) => r.map(normalizeStationery));

export const fetchAccessories = () =>
  client
    .fetch(
      `*[_type == "accessory"] | order(_createdAt desc) {
      _id, title, brand, price, salePrice, reviewCount,
      badge, badgeColor, coverImage, category, description, inStock,
      material, color, size, dimensions, packSize, sku, careInstructions,
      "slug": slug.current
    }`,
    )
    .then((r) => r.map(normalizeAccessory));

export const fetchActiveOffers = () =>
  client
    .fetch(
      `*[_type == "offer" && active != false && defined(book) && (!defined(expiresAt) || expiresAt > now())] | order(expiresAt asc) {
      _id, discountPercent, originalPrice, salePrice, badgeLabel, badgeColor, expiresAt,
      book -> {
        _id, _type, title, author, brand, price, salePrice, rating, reviewCount,
        ageRange, badge, badgeColor, coverImage, category, genres, gradeLevel, subject,
        "slug": slug.current
      }
    }`,
    )
    .then((r) => r.map(normalizeOffer));

export const fetchSaleProductOffers = () =>
  client
    .fetch(
      `*[_type in ["book","stationery","accessory"] && defined(salePrice) && salePrice < price] | order(_createdAt desc) {
      _id, _type, title, author, brand, price, salePrice, rating, reviewCount,
      ageRange, badge, badgeColor, coverImage, category, genres, gradeLevel, subject,
      "slug": slug.current
    }[0...6]`,
    )
    .then((results) => results.map(saleItemToOffer).filter(Boolean));

export const fetchSaleBookOffers = fetchSaleProductOffers;

export const fetchHomePage = () =>
  client
    .fetch(
      `
    *[_type == "homePage"][0] {
      heroSlides[] {
        tag, tagBg, tagColor, title, sub, cta, href,
        book-> { ${BOOK_FIELDS} },
        "img": image.asset->url, "grad": [gradStart, gradEnd], accent
      },
      featuredBooks[]-> { ${BOOK_FIELDS} },
      featuredProducts[]-> { ${PRODUCT_REFERENCE_FIELDS} },
      featuredStationery[]-> { ${PRODUCT_REFERENCE_FIELDS} },
      featuredAccessories[]-> { ${PRODUCT_REFERENCE_FIELDS} },
      categories[] {
        "slug": slug.current, label, icon, desc, "img": image.asset->url, accent
      },
      stats[]       { value, label, icon },
      gradeLevels[] { slug, label, icon, age, count },
      subjects[]    { slug, label, icon },
      whyPillars[]  { icon, title, desc, "img": image.asset->url },
      newsletterTitle, newsletterSubtitle
    }
  `,
    )
    .then((doc) => {
      if (!doc) return null;
      // Normalize any dereferenced books inside heroSlides and featuredBooks
      if (Array.isArray(doc.heroSlides)) {
        doc.heroSlides = doc.heroSlides.map((s) => ({
          ...s,
          book: s.book ? normalizeBook(s.book) : null,
          img: s.img || (s.book ? s.book.coverImage : null),
        }));
      }
      if (Array.isArray(doc.featuredBooks)) {
        doc.featuredBooks = doc.featuredBooks.map((b) => normalizeBook(b));
      }
      if (Array.isArray(doc.featuredProducts)) {
        doc.featuredProducts = doc.featuredProducts.map(normalizeProduct);
      }
      if (Array.isArray(doc.featuredStationery)) {
        doc.featuredStationery = doc.featuredStationery.map(normalizeProduct);
      }
      if (Array.isArray(doc.featuredAccessories)) {
        doc.featuredAccessories = doc.featuredAccessories.map(normalizeProduct);
      }
      return doc;
    });

// Fetch a featured carousel document (by slug or first active) and normalize referenced items
export const fetchFeaturedCarousel = (slug) =>
  client
    .fetch(
      `*[_type == "featuredCarousel" && ${slug ? "slug.current == $slug" : "active == true"}][0] {
      eyebrow, title, subtitle, viewAllHref, themeColor, active,
      items[]-> { ${PRODUCT_REFERENCE_FIELDS} }
    }`,
      { slug },
    )
    .then((doc) => {
      if (!doc) return null;
      if (Array.isArray(doc.items)) {
        doc.items = doc.items.map(normalizeProduct);
      }
      return doc;
    });

// Fetch all product-like documents in one request and normalize them
export const fetchAllProducts = () =>
  client
    .fetch(
      `*[_type in ["book","stationery","accessory"]] | order(_createdAt desc) {
      ${PRODUCT_REFERENCE_FIELDS}
    }`,
    )
    .then((results) =>
      results.map((item) => {
        return normalizeProduct(item);
      }),
    );
