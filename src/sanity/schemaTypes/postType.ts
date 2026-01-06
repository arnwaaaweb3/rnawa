import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Articles & Opinions',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      description: 'Bikin judul yang clickbait tapi berbobot.',
      validation: (Rule) => Rule.required().min(10).max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        isUnique: () => true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Summary / Teaser',
      type: 'text',
      rows: 3,
      description: 'Deskripsi singkat buat muncul di card artikel atau Meta Description SEO.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (Rule) => Rule.required(),
        }
      ]
    }),
    defineField({
      name: 'categories',
      title: 'Topics',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      initialValue: () => (new Date()).toISOString(),
    }),
    defineField({
      name: 'estimatedReadingTime',
      title: 'Reading Time (Minutes)',
      type: 'number',
      description: 'Biar pembaca tau mereka butuh berapa lama buat dapet pencerahan dari lo.',
    }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Ceklis kalo lo mau postingan ini nangkring di highlight utama.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      isFeatured: 'isFeatured',
    },
    prepare(selection) {
      const {author, isFeatured} = selection
      return {
        ...selection, 
        subtitle: `${isFeatured ? '⭐ ' : ''}by ${author || 'Unknown'}`
      }
    },
  },
})