import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'portfolioItem',
  title: 'Portofolio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name:',
      type: 'string',
      description: 'This is the name of your project.',
      validation: (Rule) => Rule.required(),
      }),
    defineField({
      name: 'slug',
      title: 'Slug:',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'This is your unique URL identifier for your project.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Type:',
      type: 'string',
      description: 'This is the type of your project.',
      options: {
        list: [
          { title: 'Public Relations', value: 'pubrelations' },
          { title: 'Web App', value: 'webapp' },
          { title: 'Digital Marketing', value: 'digimarketing' },
          { title: 'Blockchain', value: 'blockchain' },
          { title: 'Social Media Content', value: 'smcontent' },
          { title: 'Banner', value: 'banner' },
          { title: 'Company Profile', value: 'comprofile' },
          { title: 'Business Model Canvas', value: 'bmcanvas' },
          { title: 'Feeds', value: 'feeds' },
          { title: 'Icon / Logo', value: 'iconlogo' },
          { title: 'Poster', value: 'poster' },
          { title: 'M.I.C.E', value: 'mice' },
          { title: 'News Media Report', value: 'newsreport' },
          { title: 'Press Release', value: 'pressrelease' },
          { title: 'Content Storyline', value: 'cstoryline' },
          { title: 'Video', value: 'video' },
          { title: 'Copywriting', value: 'copywriting' },
        ],
      },
    }),
    defineField({
      name: 'projectUrl',
      title: 'URL:',
      type: 'url',
      description: 'This is the URL address of your project.',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    defineField({
      name: 'description',
      title: 'Description:',
      type: 'text',
      description: 'This is the description of your project.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover',
      type: 'image',
      description: 'This is the cover image of your project.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
})