// studio/schemaTypes/offer.js

export default {
  name: 'offer',
  title: 'Special Offer',
  type: 'document',
  icon: () => '🔥',
  fields: [
    {
      name: 'book',
      title: 'Book',
      type: 'reference',
      to: [{ type: 'book' }],
      validation: R => R.required(),
    },
    {
      name: 'discountPercent',
      title: 'Discount (%)',
      type: 'number',
      validation: R => R.required().min(1).max(99),
    },
    {
      name: 'originalPrice',
      title: 'Original Price (KES)',
      type: 'number',
      validation: R => R.required().positive(),
    },
    {
      name: 'salePrice',
      title: 'Sale Price (KES)',
      type: 'number',
      validation: R => R.required().positive(),
    },
    {
      name: 'badgeLabel',
      title: 'Badge Label',
      type: 'string',
      options: {
        list: [
          'Flash Sale', 'Summer Deal', 'Weekly Deal',
          'Book Club Pick', 'Author Spotlight', 'Clearance',
        ],
      },
      validation: R => R.required(),
    },
    {
      name: 'badgeColor',
      title: 'Badge Color (hex)',
      type: 'string',
      initialValue: '#E53935',
      description: '#FF6B35 orange · #E53935 red · #9C27B0 purple · #43A047 green · #E91E63 pink',
    },
    {
      name: 'expiresAt',
      title: 'Offer Expires At',
      type: 'datetime',
      validation: R => R.required(),
    },
    {
      name: 'active',
      title: 'Active?',
      type: 'boolean',
      initialValue: true,
    },
  ],

  preview: {
    select: {
      title: 'book.title',
      subtitle: 'badgeLabel',
      media: 'book.coverImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? 'Unnamed offer',
        subtitle: `${subtitle} — check discount %`,
        media,
      }
    },
  },
}