// studio/schemaTypes/offer.js

export default {
  name: 'offer',
  title: 'Special Offer',
  type: 'document',
  icon: () => '🔥',

  groups: [
    { name: 'book', title: 'Item', default: true },
    { name: 'pricing', title: 'Pricing' },
    { name: 'display', title: 'Badge & Display' },
    { name: 'status', title: 'Status' },
  ],

  initialValue: () => ({
    active: true,
    badgeLabel: 'Weekly Deal',
    badgeColor: '#E53935',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
  }),

  fields: [
    {
      name: 'book',
      title: 'Choose Item on Offer',
      type: 'reference',
      group: 'book',
      to: [{ type: 'book' }, { type: 'stationery' }, { type: 'accessory' }],
      description: 'Pick any existing item you sell: book, stationery, or accessory. Create one Special Offer document per discounted item.',
      options: {
        disableNew: true,
        filter: 'defined(slug.current)',
      },
      validation: R => R.required(),
    },
    {
      name: 'originalPrice',
      title: 'Original Price (KES)',
      type: 'number',
      group: 'pricing',
      description: 'The normal item price before discount.',
      validation: R => R.required().positive(),
    },
    {
      name: 'salePrice',
      title: 'Offer Price (KES)',
      type: 'number',
      group: 'pricing',
      description: 'The discounted price customers will see on the website.',
      validation: R => R.required().positive().custom((salePrice, context) => {
        const originalPrice = context.document?.originalPrice
        if (!salePrice || !originalPrice) return true
        return salePrice < originalPrice || 'Offer price must be lower than the original price'
      }),
    },
    {
      name: 'discountPercent',
      title: 'Discount (%)',
      type: 'number',
      group: 'pricing',
      description: 'Shown on the offer card, for example 20 means “-20%”.',
      validation: R => R.required().min(1).max(99),
    },
    {
      name: 'badgeLabel',
      title: 'Badge Label',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Flash Sale', value: 'Flash Sale' },
          { title: 'Weekly Deal', value: 'Weekly Deal' },
          { title: 'Book Club Pick', value: 'Book Club Pick' },
          { title: 'Author Spotlight', value: 'Author Spotlight' },
          { title: 'Back to School', value: 'Back to School' },
          { title: 'Clearance', value: 'Clearance' },
        ],
        layout: 'dropdown',
      },
      validation: R => R.required(),
    },
    {
      name: 'badgeColor',
      title: 'Badge Color',
      type: 'string',
      group: 'display',
      initialValue: '#E53935',
      options: {
        list: [
          { title: 'Red', value: '#E53935' },
          { title: 'Orange', value: '#FF6B35' },
          { title: 'Purple', value: '#9C27B0' },
          { title: 'Green', value: '#43A047' },
          { title: 'Pink', value: '#E91E63' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'expiresAt',
      title: 'Offer Expires At',
      type: 'datetime',
      group: 'status',
      description: 'Leave the default if unsure. The website hides expired offers.',
      validation: R => R.custom(value => {
        if (!value) return true
        return new Date(value) > new Date() || 'Expiry date must be in the future'
      }),
    },
    {
      name: 'active',
      title: 'Active?',
      type: 'boolean',
      group: 'status',
      description: 'Turn this off to hide the offer without deleting it.',
      initialValue: true,
    },
  ],

  preview: {
    select: {
      title: 'book.title',
      type: 'book._type',
      subtitle: 'badgeLabel',
      media: 'book.coverImage',
      discountPercent: 'discountPercent',
      salePrice: 'salePrice',
    },
    prepare({ title, type, subtitle, media, discountPercent, salePrice }) {
      const typeLabel = type === 'stationery' ? 'Stationery' : type === 'accessory' ? 'Accessory' : 'Book'
      return {
        title: title ?? 'Unnamed offer item',
        subtitle: `${typeLabel} · ${subtitle ?? 'Special Offer'} · ${discountPercent ?? 0}% off · KES ${salePrice ?? '-'}`,
        media,
      }
    },
  },
}
