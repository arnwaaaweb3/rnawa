import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        isUnique: () => true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }
      ]
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        }),
      ],
    }),
    // Tambahin Social Media buat koneksi
    defineField({
      name: 'socials',
      title: 'Social Media',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', type: 'string', title: 'Platform (e.g. X, LinkedIn)'},
            {name: 'url', type: 'url', title: 'URL Address'},
          ]
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})