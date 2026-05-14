// studio/schemaTypes/book.js

export default {
  name: 'book',
  title: 'Book',
  type: 'document',
  icon: () => '📚',
  fields: [
    {
      name: 'title',
      title: 'Title',
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
      name: 'author',
      title: 'Author',
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
      name: 'originalPrice',
      title: 'Original Price (KES) — leave empty if not on sale',
      type: 'number',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: R => R.required(),
    },
    {
      name: 'ageRange',
      title: 'Age Range',
      type: 'string',
      options: {
        list: [
          { title: '4–8 Years', value: '4-8 Years' },
          { title: '9–12 Years', value: '9-12 Years' },
          { title: 'Young Adult', value: 'Young Adult' },
          { title: 'Adult', value: 'Adult' },
        ],
        layout: 'radio',
      },
      validation: R => R.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'Fiction', 'Non-Fiction', 'Children',
          'Educational', 'Comics', 'CBC Textbooks',
          'African Literature', 'Stationery',
        ],
      },
      validation: R => R.required(),
    },
    {
      name: 'gradeLevel',
      title: 'Grade Level (CBC)',
      type: 'string',
      options: {
        list: [
          { title: 'PP1–PP2', value: 'pp1-pp2' },
          { title: 'Grade 1–3', value: 'lower-primary' },
          { title: 'Grade 4–6', value: 'upper-primary' },
          { title: 'Grade 7–9', value: 'junior-secondary' },
          { title: 'Grade 10–12', value: 'senior-school' },
          { title: 'N/A', value: 'na' },
        ],
      },
    },
    {
      name: 'subject',
      title: 'Subject (CBC)',
      type: 'string',
      options: {
        list: [
          'Mathematics', 'English', 'Kiswahili',
          'Science & Tech', 'Social Studies',
          'CRE / IRE', 'Creative Arts', 'PE & Health',
        ],
      },
    },
    {
      name: 'rating',
      title: 'Rating (0–5)',
      type: 'number',
      validation: R => R.min(0).max(5),
      initialValue: 4.0,
    },
    {
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'badge',
      title: 'Badge Label (e.g. "New", "#1 Bestseller", "Sale")',
      type: 'string',
    },
    {
      name: 'badgeColor',
      title: 'Badge Color (hex)',
      type: 'string',
      description: 'e.g. #D97706 for amber, #E53935 for red, #43A047 for green',
      initialValue: '#43A047',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'featured',
      title: 'Show in Featured Carousel?',
      type: 'boolean',
      initialValue: false,
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
      subtitle: 'author',
      media: 'coverImage',
    },
  },
}