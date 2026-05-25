
export default {
  name:  'stationery',
  title: 'Stationery',
  type:  'document',
  icon:  () => '✏️',
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'details', title: 'Product Details' },
    { name: 'shop', title: 'Shop Settings' },
  ],
  fields: [
    {
      name: 'title', title: 'Product Name', type: 'string', group: 'basic',
      validation: R => R.required(),
    },
    {
      name: 'slug', title: 'Slug', type: 'slug', group: 'basic',
      options: { source: 'title', maxLength: 96 },
      validation: R => R.required(),
    },
    {
      name: 'brand', title: 'Brand / Manufacturer', type: 'string', group: 'basic',
      validation: R => R.required(),
    },
    {
      name: 'price', title: 'Price (KES)', type: 'number', group: 'basic',
      validation: R => R.required().positive(),
    },
    {
      name: 'salePrice',
      title: 'Sale Price (KES) — leave blank if not on sale',
      type: 'number',
      group: 'basic',
    },
    {
      name: 'coverImage', title: 'Product Image', type: 'image', group: 'basic',
      options: { hotspot: true },
      validation: R => R.required(),
    },
    {
      // Value must match one of the STATIONERY_TYPES slugs in CollectionPage:
      // notebooks | pens | pencils | art-supplies | planning | writing
      name: 'category',
      title: 'Category (Filter)',
      description: 'This value powers the Type filter in the Stationery tab.',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Notebooks & Journals', value: 'notebooks'    },
          { title: 'Pens & Markers',       value: 'pens'         },
          { title: 'Pencils',              value: 'pencils'      },
          { title: 'Art Supplies',         value: 'art-supplies' },
          { title: 'Planning',             value: 'planning'     },
          { title: 'Writing',              value: 'writing'      },
        ],
        layout: 'radio',
      },
      validation: R => R.required(),
    },
    {
      name: 'badge',
      title: 'Badge Label',
      description: 'e.g. "New", "Sale", "#1 Bestseller"',
      type: 'string',
      group: 'shop',
    },
    {
      name: 'badgeColor', title: 'Badge Color (hex)', type: 'string', group: 'shop',
      initialValue: '#2d7a4f',
      description: '#2d7a4f green · #b03030 red · #8a6030 amber',
    },
    {
      name: 'reviewCount', title: 'Review Count', type: 'number', initialValue: 0, group: 'shop',
    },
    {
      name: 'description', title: 'Description', type: 'text', group: 'basic',
      rows: 4,
    },
    {
      name: 'material', title: 'Material', type: 'string', group: 'details',
      description: 'e.g. Paper, plastic, wood, metal.',
    },
    {
      name: 'color', title: 'Color', type: 'string', group: 'details',
    },
    {
      name: 'size', title: 'Size', type: 'string', group: 'details',
      description: 'e.g. A4, A5, 0.5mm, Medium.',
    },
    {
      name: 'dimensions', title: 'Dimensions', type: 'string', group: 'details',
      description: 'e.g. 21 x 29.7 cm.',
    },
    {
      name: 'packSize', title: 'Pack Size', type: 'string', group: 'details',
      description: 'e.g. Pack of 12, 200 pages, 1 piece.',
    },
    {
      name: 'sku', title: 'SKU / Product Code', type: 'string', group: 'details',
    },
    {
      name: 'careInstructions', title: 'Care / Usage Notes', type: 'text', rows: 3, group: 'details',
    },
    {
      name: 'inStock', title: 'In Stock?', type: 'boolean', initialValue: true, group: 'shop',
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'brand', media: 'coverImage' },
  },
}
