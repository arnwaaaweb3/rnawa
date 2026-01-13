import { defineField, defineType } from 'sanity'
import { CaseIcon } from '@sanity/icons'

export default defineType({
  name: 'portfolioItem',
  title: 'Project Portfolio',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Project Name',
      type: 'string',
      description: 'What is your project name?',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: () => true,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'projectStatus',
      title: 'Project Status',
      type: 'string',
      description: 'How is it going with this project?',
      options: {
        list: [
          { title: '🚀 Ongoing', value: 'ongoing' },
          { title: '✅ Completed', value: 'completed' },
          { title: '💡 Idea/Concept', value: 'concept' },
        ],
        layout: 'radio',
      },
      initialValue: 'completed',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Place this project under a relevant category!',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tech Stack / Skill (Tags)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Add  skill or tech stack that you use in this project. (e.g: React, Next.js, Marketing, etc.)',
    }),

    defineField({
      name: 'projectUrl',
      title: 'Link / URL Address',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),

    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'Paste your unique YouTube video ID here. (Example: sCssw_-MTZI)',
    }),

    defineField({
      name: 'coverImage',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        }
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Problem & Solution',
      type: 'blockContent',
      description: 'Describe your problem and the solution within this project.',
    }),
    
    defineField({
      name: 'relatedDocs',
      title: 'Notes & Documentation',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'documentation' }] }],
      description: 'Is there any notes or documentation related to this project?',
    }),

    defineField({
      name: 'relatedJournal',
      title: 'Journal',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'journal' }] }],
      description: 'Is there any journal entry related to this project?',
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      media: 'coverImage',
    },
    prepare({ title, category, media }) {
      return {
        title: title,
        subtitle: category ? `📁 ${category}` : 'No Category',
        media: media,
      }
    },
  },
})