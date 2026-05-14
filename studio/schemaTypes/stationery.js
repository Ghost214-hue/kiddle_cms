// studio/schemaTypes/stationery.js

export default {
  name: 'stationery',
  title: 'Stationery',
  type: 'document',
  icon: () => '✏️',
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
      title: 'Brand / Manufacturer',
      type: 'string',
      validation: R => R.required(),
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
          { title: 'Notebooks & Journals', value: 'notebooks' },
          { title: 'Pens & Markers', value: 'pens' },
          { title: 'Pencils', value: 'pencils' },
          { title: 'Art Supplies', value: 'art-supplies' },
          { title: 'Planning', value: 'planning' },
          { title: 'Writing', value: 'writing' },
        ],
      },
      validation: R => R.required(),
    },
    {
      name: 'badge',
      title: 'Badge Label (e.g. "New", "Sale", "#1 Bestseller")',
      type: 'string',
    },
    {
      name: 'badgeColor',
      title: 'Badge Color (hex)',
      type: 'string',
      initialValue: '#2d7a4f',
      description: '#2d7a4f green · #b03030 red · #8a6030 amber',
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
      subtitle: 'brand',
      media: 'coverImage',
    },
  },
}