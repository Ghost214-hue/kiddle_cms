
export default {
  name:  'book',
  title: 'Book',
  type:  'document',
  icon:  () => '📚',

  groups: [
    { name: 'basic',  title: 'Basic Info',        default: true },
    { name: 'tags',   title: 'Filters & Tags'                   },
    { name: 'cbc',    title: 'CBC Curriculum'                   },
    { name: 'detail', title: 'Book Details'                     },
    { name: 'shop',   title: 'Shop Settings'                    },
  ],

  fields: [

    // ── BASIC ───────────────────────────────────────────────────────────
    {
      name: 'title', title: 'Title', type: 'string', group: 'basic',
      validation: R => R.required(),
    },
    {
      name: 'slug', title: 'Slug', type: 'slug', group: 'basic',
      options: { source: 'title', maxLength: 96 },
      validation: R => R.required(),
    },
    {
      name: 'author', title: 'Author', type: 'string', group: 'basic',
      validation: R => R.required(),
    },
    {
      name: 'coverImage', title: 'Cover Image', type: 'image', group: 'basic',
      options: { hotspot: true },
      validation: R => R.required(),
    },
    {
      name: 'description', title: 'Description', type: 'text', group: 'basic',
      rows: 5,
    },
    {
      name: 'price', title: 'Price (KES)', type: 'number', group: 'basic',
      validation: R => R.required().positive(),
    },
    {
      name: 'salePrice',
      title: 'Sale Price (KES) — leave blank if not on sale',
      type: 'number', group: 'basic',
    },

    // ── FILTERS & TAGS ──────────────────────────────────────────────────
    {
      name: 'ageRange',
      title: 'Age Range',
      type: 'string',
      group: 'tags',
      options: {
        list: [
          { title: '0-3 Years',   value: '0-3 Years'   },
          { title: '4-8 Years',   value: '4-8 Years'   },
          { title: '9-12 Years',  value: '9-12 Years'  },
          { title: 'Young Adult', value: 'Young Adult' },
          { title: 'Adult',       value: 'Adult'       },
        ],
        layout: 'radio',
      },
      validation: R => R.required(),
    },
    {
      // The primary tab this book appears under in CollectionPage
      name: 'category',
      title: 'Main Category (Tab)',
      description: 'Determines which tab this book appears under: Books or CBC Textbooks.',
      type: 'string',
      group: 'tags',
      options: {
        list: [
          { title: 'Fiction',           value: 'fiction'         },
          { title: 'Non-Fiction',       value: 'non-fiction'     },
          { title: 'Storybooks',        value: 'storybooks'      },
          { title: 'African Literature',value: 'african-writers' },
          { title: 'Young Adults',      value: 'young-adults'    },
          { title: 'Science & Nature',  value: 'science-nature'  },
          { title: 'CBC Textbooks',     value: 'cbc-textbooks'   },
        ],
        layout: 'radio',
      },
      validation: R => R.required(),
    },
    {
      // KEY FIELD: powers the sidebar Genre/Filter checkboxes in the shop
      name: 'genres',
      title: 'Genre / Filter Tags',
      description:
        'Tick every sidebar filter this book should appear under. ' +
        'You can pick multiple — a book can be Fiction AND a Bestseller AND African Writers at the same time.',
      type: 'array',
      group: 'tags',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Fiction',         value: 'fiction'         },
          { title: 'Non-Fiction',     value: 'non-fiction'     },
          { title: 'Storybooks',      value: 'storybooks'      },
          { title: 'African Writers', value: 'african-writers' },
          { title: 'Bestsellers',     value: 'bestsellers'     },
          { title: 'New Arrivals',    value: 'new-arrivals'    },
          { title: 'Young Adults',    value: 'young-adults'    },
          { title: 'Science & Nature',value: 'science-nature'  },
          { title: 'CBC Textbooks',   value: 'cbc-textbooks'   },
        ],
        layout: 'grid',
      },
    },

    // ── CBC CURRICULUM ──────────────────────────────────────────────────
    {
      name: 'gradeLevel',
      title: 'CBC Grade Level',
      description:
        'Set for CBC textbooks only. ' +
        'This is what powers the "Grade Level" filter in the CBC Textbooks tab.',
      type: 'string',
      group: 'cbc',
      options: {
        list: [
          { title: 'N/A — not a CBC book', value: 'na'               },
          { title: 'PP1-PP2',              value: 'pp1-pp2'          },
          { title: 'Grade 1-3',            value: 'lower-primary'    },
          { title: 'Grade 4-6',            value: 'upper-primary'    },
          { title: 'Grade 7-9',            value: 'junior-secondary' },
          { title: 'Grade 10-12',          value: 'senior-school'    },
        ],
        layout: 'radio',
      },
      initialValue: 'na',
    },
    {
      name: 'subject',
      title: 'CBC Subject',
      description:
        'The curriculum subject. Powers the "Subject" filter in the CBC Textbooks tab.',
      type: 'string',
      group: 'cbc',
      options: {
        list: [
          { title: 'Mathematics',   value: 'mathematics'   },
          { title: 'English',       value: 'english'       },
          { title: 'Kiswahili',     value: 'kiswahili'     },
          { title: 'Science',       value: 'science'       },
          { title: 'Social Studies',value: 'social-studies'},
          { title: 'CRE / IRE',     value: 'cre'           },
          { title: 'Creative Arts', value: 'creative-arts' },
          { title: 'PE & Health',   value: 'phe'           },
        ],
        layout: 'radio',
      },
    },

    // ── BOOK DETAILS ────────────────────────────────────────────────────
    {
      name: 'pageCount',     title: 'Page Count',     type: 'number', group: 'detail',
    },
    {
      name: 'publisher',     title: 'Publisher',      type: 'string', group: 'detail',
    },
    {
      name: 'publishedDate', title: 'Published Date', type: 'string', group: 'detail',
      description: 'e.g. "August 13, 2020" or "January 2023"',
    },
    {
      name: 'isbn',     title: 'ISBN',     type: 'string', group: 'detail',
    },
    {
      name: 'language', title: 'Language', type: 'string', group: 'detail',
      initialValue: 'English',
    },
    {
      name: 'formats',
      title: 'Available Formats',
      type: 'array',
      group: 'detail',
      of: [{ type: 'string' }],
      options: {
        list: ['Hardcover', 'Paperback', 'E-book', 'Audiobook'],
        layout: 'grid',
      },
    },

    // ── SHOP SETTINGS ───────────────────────────────────────────────────
    {
      name: 'rating',      title: 'Rating (0-5)', type: 'number', group: 'shop',
      validation: R => R.min(0).max(5), initialValue: 4.0,
    },
    {
      name: 'reviewCount', title: 'Review Count', type: 'number', group: 'shop',
      initialValue: 0,
    },
    {
      name: 'badge',
      title: 'Badge Label',
      description: 'e.g. "New", "#1 Bestseller", "Sale", "CBC Approved"',
      type: 'string', group: 'shop',
    },
    {
      name: 'badgeColor',
      title: 'Badge Color (hex)',
      type: 'string', group: 'shop',
      description: '#D97706 amber · #2d7a4f green · #b03030 red · #8a6030 brown',
      initialValue: '#2d7a4f',
    },
    {
      name: 'featured',
      title: 'Show in Featured Carousel?',
      type: 'boolean', group: 'shop', initialValue: false,
    },
    {
      name: 'inStock',
      title: 'In Stock?',
      type: 'boolean', group: 'shop', initialValue: true,
    },
  ],

  preview: {
    select: { title: 'title', subtitle: 'author', media: 'coverImage' },
  },
}