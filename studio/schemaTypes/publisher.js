export default {
  name: 'publisher',
  title: 'Publisher',
  type: 'document',
  icon: () => '🏢',

  fields: [
    {
      name: 'name',
      title: 'Publisher Name',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Auto-generated from name. Used for URLs and filtering.',
      options: {source: 'name', maxLength: 96},
      validation: (R) => R.required(),
    },
  ],

  preview: {
    select: {title: 'name'},
  },
}
