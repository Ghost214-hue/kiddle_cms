// studio/schemaTypes/accessory.js

export default {
  name: 'accessory',
  title: 'Accessory',
  type: 'document',
  icon: () => '🎒',
  fields: [
    {
      name: 'title',
      title: 'Product Name',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: R => R.required(),
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'string',
      initialValue: 'Kiddle',
    },
    {
      name: 'price',
      title: 'Price (KES)',
      type: 'number',
      validation: R => R.required().positive(),
    },
    {
      name: 'salePrice',
      title: 'Sale Price (KES) — leave empty if not on sale',
      type: 'number',
    },
    {
      name: 'coverImage',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      validation: R => R.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Bookmarks', value: 'bookmarks' },
          { title: 'Book Stands', value: 'book-stands' },
          { title: 'Bags & Sleeves', value: 'bags' },
          { title: 'Reading Aids', value: 'reading-aids' },
          { title: 'Gifts', value: 'gifts' },
          { title: 'Home & Decor', value: 'home' },
        ],
      },
      validation: R => R.required(),
    },
    {
      name: 'badge',
      title: 'Badge Label',
      type: 'string',
    },
    {
      name: 'badgeColor',
      title: 'Badge Color (hex)',
      type: 'string',
      initialValue: '#2d7a4f',
    },
    {
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'inStock',
      title: 'In Stock?',
      type: 'boolean',
      initialValue: true,
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
}