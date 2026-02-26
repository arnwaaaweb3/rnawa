import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export default defineType({
  name: 'documentation',
  title: 'Learning Docs',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'What is this note about?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }], // Re-use category schema lo
      description: 'Place this note into a relevant category!',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'complexity',
      title: 'Complexity',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced/Expert', value: 'advanced' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => (new Date()).toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'This is the summary of the notes.',
    }),
    defineField({
      name: 'body',
      title: 'Notes & Materials',
      type: 'blockContent', 
      description: 'Write anything about this topic here.',
    }),
    defineField({
      name: 'relatedLinks',
      title: 'External Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Source Name (e.g. Github, Docs)' },
            { name: 'url', type: 'url', title: 'URL' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      level: 'complexity',
    },
    prepare({ title, category, level }) {
      const l = level ? `[${level.toUpperCase()}]` : '';
      return {
        title: title,
        subtitle: `${category || 'Uncategorized'} ${l}`,
      };
    },
  },
})