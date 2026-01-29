// schemas/categoryType.ts
import { TagIcon, FolderIcon, DocumentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Taxonomy',
  type: 'document',
  icon: TagIcon,

  fields: [

    // ======================
    // BASIC IDENTITY
    // ======================
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),

    // ======================
    // TAXONOMY TYPE
    // ======================
    defineField({
      name: 'type',
      title: 'Taxonomy Type',
      type: 'string',
      options: {
        list: [
          { title: 'Main Category (Domain)', value: 'domain' },
          { title: 'Sub Category (Output)', value: 'output' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
      description: 'Domain = knowledge/work field | Output = project deliverable type',
    }),

    // ======================
    // DOMAIN CONTEXT (OPTIONAL)
    // ======================
    defineField({
      name: 'domainContext',
      title: 'Domain Context (Optional)',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Optional domain relation for output context (not structural)',
      hidden: ({ document }) => document?.type !== 'output',
      options: {
        filter: 'type == "domain"',
      },
    }),

    // ======================
    // DESCRIPTION
    // ======================
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),

  ],

  preview: {
    select: {
      title: 'title',
      type: 'type',
      domain: 'domainContext.title',
    },
    prepare({ title, type, domain }) {
      return {
        title,
        subtitle:
          type === 'domain'
            ? '🏢 Domain (Main Category)'
            : domain
              ? `📦 Output → ${domain}`
              : '📦 Output (Global)',
        media: type === 'domain' ? FolderIcon : DocumentIcon,
      }
    },
  },
})
