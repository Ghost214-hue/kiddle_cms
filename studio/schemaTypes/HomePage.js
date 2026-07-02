// studio/schemaTypes/homePage.js
// Singleton document — only ONE homePage document will exist

export default {
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: () => '🏠',
  // Prevent creating more than one
  __experimental_actions: ['update', 'publish'],

  fields: [
    // ── HERO SLIDES ─────────────────────────────
    {
      name: 'heroSlides',
      title: 'Hero Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroSlide',
          fields: [
            { name: 'tag', title: 'Tag (e.g. 🔥 LIMITED OFFER)', type: 'string', validation: R => R.required() },
            { name: 'tagBg', title: 'Tag Background Color', type: 'string', initialValue: '#FEF3C7' },
            { name: 'tagColor', title: 'Tag Text Color', type: 'string', initialValue: '#B45309' },
            { name: 'title', title: 'Slide Title', type: 'string', validation: R => R.required() },
            { name: 'sub', title: 'Slide Subtitle', type: 'text' },
            { name: 'cta', title: 'Button Text', type: 'string', initialValue: 'Shop Now' },
            { name: 'href', title: 'Button Link', type: 'string', initialValue: '/books' },
            { name: 'book', title: 'Link to Book (optional)', type: 'reference', to: [{ type: 'book' }] },
            { name: 'image', title: 'Slide Image', type: 'image', options: { hotspot: true } },
            { name: 'gradStart', title: 'Gradient Start Color', type: 'string', initialValue: '#FEF9EC' },
            { name: 'gradEnd', title: 'Gradient End Color', type: 'string', initialValue: '#FEF3C7' },
            { name: 'accent', title: 'Accent Color', type: 'string', initialValue: '#D97706' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'tag', media: 'image' },
          },
        },
      ],
      validation: R => R.min(1).max(6),
    },

    // ── FEATURED ITEMS (references) ─────────────────
    {
      name: 'featuredBooks',
      title: 'Featured Books (ordered)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'book' }] }],
      description: 'Pick specific books to show in the featured section/carousel. Order matters.'
    },
    {
      name: 'featuredProducts',
      title: 'Featured Products (stationery & accessories)',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'stationery' }, { type: 'accessory' }] }
      ],
    },

    // ── CATEGORIES (3 feature cards) ────────────
    {
      name: 'categories',
      title: 'Feature Categories (3 cards on Hero)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'label' } },
            { name: 'label', title: 'Label', type: 'string', validation: R => R.required() },
            { name: 'icon', title: 'Emoji Icon', type: 'string', initialValue: '📚' },
            { name: 'desc', title: 'Short Description', type: 'string' },
            { name: 'image', title: 'Category Image', type: 'image', options: { hotspot: true } },
            { name: 'accent', title: 'Accent Color', type: 'string', initialValue: '#D97706' },
          ],
          preview: { select: { title: 'label', subtitle: 'desc', media: 'image' } },
        },
      ],
      validation: R => R.max(3),
    },

    // ── STATS ────────────────────────────────────
    {
      name: 'stats',
      title: 'Stats Section',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value (e.g. 50K+)', type: 'string', validation: R => R.required() },
            { name: 'label', title: 'Label (e.g. Happy Customers)', type: 'string', validation: R => R.required() },
            { name: 'icon', title: 'Emoji Icon', type: 'string', initialValue: '⭐' },
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    },

    // ── GRADE LEVELS ─────────────────────────────
    {
      name: 'gradeLevels',
      title: 'CBC Grade Levels',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'slug', title: 'Slug', type: 'string', validation: R => R.required() },
            { name: 'label', title: 'Label (e.g. Grade 1–3)', type: 'string' },
            { name: 'icon', title: 'Emoji', type: 'string' },
            { name: 'age', title: 'Age Range (e.g. 6–9 yrs)', type: 'string' },
            { name: 'count', title: 'Book Count', type: 'number', initialValue: 0 },
          ],
          preview: { select: { title: 'label', subtitle: 'age' } },
        },
      ],
    },

    // ── SUBJECTS ─────────────────────────────────
    {
      name: 'subjects',
      title: 'CBC Subjects',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'slug', title: 'Slug', type: 'string', validation: R => R.required() },
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'icon', title: 'Emoji', type: 'string' },
          ],
          preview: { select: { title: 'label' } },
        },
      ],
    },

    // ── WHY KIDDLE PILLARS ───────────────────────
    {
      name: 'whyPillars',
      title: 'Why Kiddle — Pillars',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Emoji Icon', type: 'string' },
            { name: 'title', title: 'Title', type: 'string', validation: R => R.required() },
            { name: 'desc', title: 'Description', type: 'text' },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          ],
          preview: { select: { title: 'title', subtitle: 'desc', media: 'image' } },
        },
      ],
      validation: R => R.max(4),
    },

    // ── NEWSLETTER ───────────────────────────────
    {
      name: 'newsletterTitle',
      title: 'Newsletter Section Title',
      type: 'string',
      initialValue: 'Get Book Recommendations',
    },
    {
      name: 'newsletterSubtitle',
      title: 'Newsletter Subtitle',
      type: 'text',
    },
  ],

  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
}