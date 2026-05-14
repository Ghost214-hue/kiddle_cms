
import { client, urlFor } from './sanity'


export const fetchFeaturedBooks = () =>
    client.fetch(`
    *[_type == "book" && featured == true] | order(_createdAt desc) {
      _id, title, author, price, rating, reviewCount,
      ageRange, badge, badgeColor, coverImage, inStock,
      "slug": slug.current
    }
  `)

export const fetchActiveOffers = () =>
    client.fetch(`
    *[_type == "offer" && active == true && expiresAt > now()] | order(expiresAt asc) {
      _id, discountPercent, originalPrice, salePrice, badgeLabel, badgeColor, expiresAt,
      book -> {
        title, author, rating, reviewCount, ageRange, coverImage,
        "slug": slug.current
      }
    }
  `)

export const fetchHomePage = () =>
    client.fetch(`
    *[_type == "homePage"][0] {
      heroSlides[] {
        tag, tagBg, tagColor, title, sub, cta, href,
        "img": image.asset->url,
        "grad": [gradStart, gradEnd],
        accent
      },
      categories[] {
        "slug": slug.current, label, icon, desc,
        "img": image.asset->url,
        accent
      },
      stats[] { value, label, icon },
      gradeLevels[] { slug, label, icon, age, count },
      subjects[] { slug, label, icon },
      whyPillars[] {
        icon, title, desc,
        "img": image.asset->url
      },
      newsletterTitle, newsletterSubtitle
    }
  `)

export const fetchBookBySlug = (slug) =>
    client.fetch(
        `*[_type == "book" && slug.current == $slug][0]`,
        { slug }
    )

export const fetchBooksByCategory = (category) =>
    client.fetch(
        `*[_type == "book" && category == $category] | order(_createdAt desc) {
      _id, title, author, price, rating, reviewCount,
      ageRange, badge, badgeColor, coverImage, inStock,
      "slug": slug.current
    }`,
        { category }
    )

export const fetchBooksByGrade = (gradeLevel) =>
    client.fetch(
        `*[_type == "book" && gradeLevel == $gradeLevel] | order(_createdAt desc) {
      _id, title, author, price, rating, reviewCount,
      ageRange, badge, badgeColor, coverImage, inStock,
      "slug": slug.current
    }`,
        { gradeLevel }
    )

export function normalizeBook(book) {
    if (!book) return null
    return {
        ...book,

        coverImage: book.coverImage?.asset
            ? urlFor(book.coverImage).width(400).url()
            : book.coverImage,
        slug: book.slug?.current ?? book.slug,
    }
}

export function normalizeOffer(offer) {
    if (!offer) return null
    return {
        ...offer,
        book: offer.book
            ? {
                ...offer.book,
                coverImage: offer.book.coverImage?.asset
                    ? urlFor(offer.book.coverImage).width(400).url()
                    : offer.book.coverImage,
                slug: offer.book.slug?.current ?? offer.book.slug,
            }
            : null,
    }
}