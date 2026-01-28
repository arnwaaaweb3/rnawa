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
        slugify: (input) => input
          .toLowerCase()
          .replace(/\b(for|the|a|with|and|in|on|at|to|of|by|di|ke|dari|dan|untuk|yang|pada|dengan|buat)\b/g, '') // Bantai stop words English & Indo
          .trim()
          .replace(/[^\w\s-]/g, '') // Hapus karakter aneh biar gak error
          .replace(/\s+/g, '-')     // Spasi jadi dash
          .replace(/-+/g, '-')      // Bersihin kalau ada double dash (--) gara-gara kata yang dihapus
          .slice(0, 96)
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
      description: 'Pilih jenis media utama yang mau ditampilin di detail project.',
      type: 'string',
      options: {
        list: [
          { title: '📺 YouTube Video', value: 'video' },
          { title: '🖼️ Poster / Image', value: 'poster' },
          { title: '📄 PDF Document', value: 'pdf' },
          { title: '💻 GitHub Repo', value: 'github' },
        ],
        layout: 'radio',
      },
      initialValue: 'video',
    }),

    defineField({
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      description: 'Upload your project PDF documentation here.',
      options: {
        accept: '.pdf', // Biar gak ada yang upload file aneh-aneh
      },
      hidden: ({ document }) => document?.displayType !== 'pdf',
    }),

    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      description: 'Add your project poster image. (Poster)',
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
      name: 'imageOrientation',
      title: 'Poster Orientation',
      type: 'string',
      description: 'Select the orientation for your poster.',
      options: {
        list: [
          { title: 'Landscape (Horizontal)', value: 'landscape' },
          { title: 'Portrait (Vertical)', value: 'portrait' },
          { title: 'Square (1:1)', value: 'square' }, // Tambahin ini
        ],
        layout: 'radio',
      },
      initialValue: 'portrait',
      hidden: ({ document }) => document?.displayType !== 'poster', // Sama kayak posterImage
    }),

    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'Paste your unique YouTube video ID here. (Example: sCssw_-MTZI)',
      hidden: ({ document }) => document?.displayType !== 'video',
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

    defineField({
      name: 'githubRepo',
      title: 'GitHub Repository Path',
      description: 'If this a GitHub repository, paste the path here. (Example: rnawa/my-web3-project)',
      type: 'string',
      hidden: ({ document }) => document?.displayType !== 'github',
    }),

    defineField({
      name: 'enableExplorer',
      title: 'Enable File Explorer',
      type: 'boolean',
      description: 'If this project has a GitHub repository, enable the file explorer.',
      initialValue: true,
      hidden: ({ document }) => document?.displayType !== 'github',
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