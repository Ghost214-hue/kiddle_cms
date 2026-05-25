export default {
  name: 'featuredCarousel',
  title: 'Featured Carousel',
  type: 'document',
  icon: () => '🎡',

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'items', title: 'Items' },
    { name: 'style', title: 'Style' },
    { name: 'status', title: 'Status' },
  ],

  initialValue: {
    eyebrow: 'Featured Shelf',
    title: 'Bestsellers This Month',
    subtitle: 'Handpicked favorites, new discoveries, and books readers keep coming back for.',
    viewAllHref: '/books',
    themeColor: '#D97706',
    active: true,
  },

  fields: [
    {
      name: 'eyebrow',
      title: 'Small Label',
      type: 'string',
      group: 'content',
      description: 'Short text above the heading, for example “Featured Shelf”.',
      validation: R => R.max(40),
    },
    {
      name: 'title',
      title: 'Heading',
      type: 'string',
      group: 'content',
      validation: R => R.required().max(80),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: R => R.max(180),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 80 },
      description: 'Optional. Use this only if you want a specific carousel by slug.',
    },
    {
      name: 'items',
      title: 'Featured Items',
      type: 'array',
      group: 'items',
      description: 'Pick the books or products to show. The order here is the order on the website.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'book' }, { type: 'stationery' }, { type: 'accessory' }],
          options: { disableNew: true },
        },
      ],
      validation: R => R.required().min(1).max(12),
    },
    {
      name: 'viewAllHref',
      title: 'View All Link',
      type: 'string',
      group: 'content',
      description: 'Examples: /books, /category/cbc-education, /category/stationery',
      validation: R => R.required(),
    },
    {
      name: 'themeColor',
      title: 'Accent Color',
      type: 'string',
      group: 'style',
      options: {
        list: [
          { title: 'Amber', value: '#D97706' },
          { title: 'Cocoa', value: '#A0693A' },
          { title: 'Green', value: '#2D7A4F' },
          { title: 'Purple', value: '#7C3AED' },
          { title: 'Rose', value: '#BE3A5B' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'active',
      title: 'Active?',
      type: 'boolean',
      group: 'status',
      description: 'The website uses the first active carousel when no slug is provided.',
      initialValue: true,
    },
  ],

  preview: {
    select: {
      title: 'title',
      eyebrow: 'eyebrow',
      active: 'active',
      items: 'items',
    },
    prepare({ title, eyebrow, active, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'Featured Carousel',
        subtitle: `${active ? 'Active' : 'Hidden'} · ${count} item${count === 1 ? '' : 's'} · ${eyebrow || 'No label'}`,
      }
    },
  },
}
