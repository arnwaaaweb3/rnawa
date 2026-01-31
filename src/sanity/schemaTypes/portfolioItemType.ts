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
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\b(for|the|with|and|of|by|dari|dan|untuk|yang|pada|dengan|buat)\b/g, '')
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'projectStatus',
      title: 'Project Status',
      type: 'string',
      options: {
        list: [
          { title: '🚀 Ongoing', value: 'ongoing' },
          { title: '✅ Completed', value: 'completed' },
          { title: '💡 Idea', value: 'concept' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'completed',
    }),

    defineField({
      name: 'mainCategory',
      title: 'Main Category (Domain)',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        filter: 'type == "domain"',
      },
      description: 'Select the main domain category (Marketing, Dev, PR, AI, etc)',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tech Stack / Skill (Tags)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Add skill or tech stack that you use in this project. (React, Next.js, Digital Marketing, etc.)',
    }),

    defineField({
      name: 'projectUrl',
      title: 'Link / URL Address',
      type: 'url',
      description: 'Add a link address for this project. (URL)',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'displayType',
      title: 'Media Display Type',
      type: 'string',
      description: 'Pilih jenis media utama yang mau ditampilin di detail project.',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Poster', value: 'poster' },
          { title: 'PDF', value: 'pdf' },
          { title: 'Repo', value: 'github' },
          { title: 'Feeds', value: 'feeds'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'video',
    }),

    // 🔹 Mirror Field (for schema logic, not UI)
    defineField({
      name: 'outputType',
      title: 'Output Type (Mirror)',
      type: 'string',
      hidden: true,
      readOnly: true,
      description: 'Mirror of output category slug for schema logic',
    }),

    defineField({
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      description: 'Upload your project PDF documentation here.',
      options: { accept: '.pdf' },
      hidden: ({ document }) => !(document?.displayType === 'pdf'),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (
            (context.document?.outputType === 'pdf' ||
              context.document?.displayType === 'pdf') &&
            !value
          ) {
            return 'PDF file is required when display type is PDF'
          }
          return true
        }),
    }),

    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      description: 'Add your project poster image. (Poster)',
      options: { hotspot: true },
      hidden: ({ document }) =>
        !(document?.displayType === 'poster' || document?.outputType === 'poster'),
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alt text for your poster image. (Alt Text)',
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (
            (context.document?.displayType === 'poster' ||
              context.document?.outputType === 'poster') &&
            !value
          ) {
            return 'Poster image is required when display type is Poster'
          }
          return true
        }),
    }),

    defineField({
      name: 'imageOrientation',
      title: 'Image Orientation', // <--- Dah tak ganti jenenge dadi Image Orientation
      type: 'string',
      description: 'Select the orientation for your media (Poster/Feeds).',
      options: {
        list: [
          { title: 'Landscape (Horizontal)', value: 'landscape' },
          { title: 'Portrait (Vertical)', value: 'portrait' },
          { title: 'Square (1:1)', value: 'square' },
        ],
        layout: 'radio',
      },
      initialValue: 'portrait',
      // Proteksi hidden harus menyertakan 'feeds' sisan!
      hidden: ({ document }) =>
        !(
          document?.displayType === 'poster' || 
          document?.outputType === 'poster' ||
          document?.displayType === 'feeds'
        ),
    }),

    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'Paste your unique YouTube video ID here. (Example: sCssw_-MTZI)',
      hidden: ({ document }) =>
        !(document?.displayType === 'video' || document?.outputType === 'video'),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (
            (context.document?.displayType === 'video' ||
              context.document?.outputType === 'video') &&
            !value
          ) {
            return 'YouTube ID is required when display type is Video'
          }
          return true
        }),
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
          title: 'Alternative Text',
          type: 'string',
          description: 'Alt text for your cover image. (Alt Text).',
          validation: (Rule) => Rule.required(),
        },
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
      name: 'outputCategory',
      title: 'Output Category',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        filter: 'type == "output"',
      },
      description: 'Select output type (Video, PDF, Repo, Website, App, etc)',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'githubRepo',
      title: 'GitHub Repository Path',
      type: 'string',
      description: 'If this a GitHub repository, paste the path here. (Example: rnawa/my-web3-project)',
      hidden: ({ document }) =>
        !(document?.displayType === 'github' || document?.outputType === 'github'),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (
            (context.document?.displayType === 'github' ||
              context.document?.outputType === 'github') &&
            !value
          ) {
            return 'GitHub repository path is required when display type is GitHub'
          }
          return true
        }),
    }),

    defineField({
      name: 'enableExplorer',
      title: 'Enable File Explorer',
      type: 'boolean',
      description: 'If this project has a GitHub repository, enable the file explorer.',
      initialValue: true,
      hidden: ({ document }) =>
        !(document?.displayType === 'github' || document?.outputType === 'github'),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      category: 'mainCategory.title',
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
