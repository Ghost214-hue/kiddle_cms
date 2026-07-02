export default {
  name:  'accessory',
  title: 'Accessory',
  type:  'document',
  icon:  () => '🎒',
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
      name: 'brand', title: 'Brand', type: 'string', initialValue: 'Kiddle', group: 'basic',
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
      name: 'category',
      title: 'Category (Filter)',
      description: 'This value powers the Type filter in the Accessories tab.',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Bookmarks',      value: 'bookmarks'    },
          { title: 'Book Stands',    value: 'book-stands'  },
          { title: 'Bags & Sleeves', value: 'bags'         },
          { title: 'Reading Aids',   value: 'reading-aids' },
          { title: 'Gifts',          value: 'gifts'        },
          { title: 'Home & Decor',   value: 'home'         },
        ],
        layout: 'radio',
      },
      validation: R => R.required(),
    },
    {
      name: 'badge', title: 'Badge Label', type: 'string', group: 'shop',
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
      name: 'description', title: 'Description', type: 'text', rows: 4, group: 'basic',
    },
    {
      name: 'material', title: 'Material', type: 'string', group: 'details',
      description: 'e.g. Leather, cotton, bamboo, metal.',
    },
    {
      name: 'color', title: 'Color', type: 'string', group: 'details',
    },
    {
      name: 'size', title: 'Size', type: 'string', group: 'details',
      description: 'e.g. Small, Medium, 13 inch.',
    },
    {
      name: 'dimensions', title: 'Dimensions', type: 'string', group: 'details',
      description: 'e.g. 20 x 14 cm.',
    },
    {
      name: 'packSize', title: 'Pack Size', type: 'string', group: 'details',
      description: 'e.g. Set of 3, 1 piece.',
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
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
  },
}
