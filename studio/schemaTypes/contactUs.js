export default {
  name: 'contactUs',
  title: 'Contact Us Page',
  type: 'document',
  icon: () => '✉️',
  __experimental_actions: ['update', 'publish'],

  fields: [
    // Optional – just for Studio label
    {name: 'title', title: 'Title', type: 'string', initialValue: 'Contact Us'},

    // Used in component
    {name: 'contactEmail', title: 'Contact Email', type: 'string'},
    {name: 'contactPhone', title: 'Contact Phone', type: 'string'},
    {name: 'address', title: 'Address (rich text)', type: 'array', of: [{type: 'block'}]},
    {name: 'mapEmbed', title: 'Map Embed (iframe or URL)', type: 'text'},

    {
      name: 'contactMethods',
      title: 'Contact Methods',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Method Type',
              type: 'string',
              options: {list: ['Email', 'Phone', 'WhatsApp', 'Telegram', 'Other']},
            },
            {name: 'label', title: 'Label (e.g. Customer Care)', type: 'string'},
            {name: 'value', title: 'Value (email or number)', type: 'string'},
            {name: 'icon', title: 'Icon (emoji)', type: 'string', initialValue: '📞'},
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Untitled method',
                subtitle: subtitle || 'No value',
              }
            },
          },
        },
      ],
    },

    {
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {list: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']},
            },
            {name: 'open', title: 'Open Time (e.g. 9:00 AM)', type: 'string'},
            {name: 'close', title: 'Close Time (e.g. 8:00 PM)', type: 'string'},
            {name: 'closed', title: 'Closed?', type: 'boolean', initialValue: false},
          ],
          preview: {
            select: {
              title: 'day',
              closed: 'closed',
              open: 'open',
              close: 'close',
            },
            prepare({title, closed, open, close}) {
              return {
                title: title || 'Unknown day',
                subtitle: closed ? 'Closed' : `${open || '?'} – ${close || '?'}`,
              }
            },
          },
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'contactEmail',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Contact Us Page',
        subtitle: selection.subtitle,
      }
    },
  },
}
