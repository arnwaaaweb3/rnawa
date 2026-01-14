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
      description: 'What is your project name? (Title)',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Slug will be used for SEO and URL address for this project. (Slug)',
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
      description: 'How is it going with this project? (Progress)',
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
      title: 'Category (Parent)',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Place this project under a relevant category! (PubRel, Marketing, Dev, etc)',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tech Stack / Skill (Tags)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Add  skill or tech stack that you use in this project. (React, Next.js, Digital Marketing, etc.)',
    }),

    defineField({
      name: 'projectUrl',
      title: 'Link / URL Address',
      description: 'Add a link address for this project. (URL)',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),

    defineField({
      name: 'displayType',
      title: 'Media Display Type',
      description: 'What is the media type for this project? (Video, Poster, etc).',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube Video', value: 'video' },
          { title: 'Poster / Image', value: 'poster' },
        ],
        layout: 'radio',
      },
      initialValue: 'video',
    }),

    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      description: 'Add your project poster image. (Poster)',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ document }) => document?.displayType !== 'poster',
      fields: [
        {
          name: 'alt',
          type: 'string',
          description: 'Alt text for your poster image. (Alt Text)',
          title: 'Alt Text',
        }
      ],
    }),

    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      hidden: ({ document }) => document?.displayType !== 'video',
      description: 'Paste your unique YouTube video ID here. (Example: sCssw_-MTZI)',
    }),

    defineField({
      name: 'coverImage',
      title: 'Image',
      type: 'image',
      description: 'Add a cover for this project card. (Cover).',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Alt text for your cover image. (Alt Text).',
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
      title: 'Categories (Sub)',
      description: 'What is this project output? (Poster, Video, etc - Sub).',
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