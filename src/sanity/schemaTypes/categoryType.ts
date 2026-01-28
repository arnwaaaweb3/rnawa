import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category & Output',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'classification',
      title: 'Classification',
      type: 'string',
      description: 'Bedain mana yang Kategori Utama (Dev, Marketing) mana yang Output (Video, Poster).',
      options: {
        list: [
          { title: 'Main Category (Parent)', value: 'parent' },
          { title: 'Project Output (Sub)', value: 'sub' },
        ],
        layout: 'radio',
      },
      initialValue: 'parent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'classification',
    },
    prepare({ title, type }) {
      return {
        title: title,
        subtitle: type === 'parent' ? '🏢 Main Category' : '📦 Project Output',
      }
    },
  },
})