import { defineType, defineField } from 'sanity';
import { EditIcon } from '@sanity/icons'; 

export const journalType = defineType({
  name: 'journal',
  title: 'Personal Journal',
  type: 'document',
  icon: EditIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Headline of the Day',
      type: 'string',
      description: 'Is there something happened today?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Timeline',
      type: 'datetime',
      description: 'When did this happen ?',
      initialValue: () => (new Date()).toISOString(),
    }),
    defineField({
      name: 'visibility',
      title: 'Visibility Status',
      type: 'string',
      description: 'Do you wish to share this writing?',
      options: {
        list: [
          { title: '🔒 Private', value: 'private' },
          { title: '🌐 Public', value: 'public' },
        ],
        layout: 'radio',
      },
      initialValue: 'private',
    }),
    defineField({
      name: 'mood',
      title: 'Current Mood',
      type: 'string',
      description: 'What does describe your feeling today?',
      options: {
        list: [
          '🔥 On Fire', '🧘 Calm', '🤯 Frustrated', '😴 Exhausted', 
          '🤔 Curious', '😇 Grateful', '😎 Happy', '😢 Sad', 
          '😡 Angry', '😰 Anxious', '🙁 Bored'
        ],
      }
    }),
    defineField({
        name: 'energyLevel',
        title: 'Energy Level',
        type: 'number',
        description: 'How much energy do you have? (1: Low) - (10: High)',
        validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: 'body',
      title: 'Story',
      type: 'blockContent',
      description: 'Write anything you like to describe your feeling today',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Add some tags to describe your writing.',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'relatedProject',
      title: 'Linked Project',
      type: 'reference',
      description: 'Is this writing related to any of your projects?',
      to: [{ type: 'portfolioItem' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      visibility: 'visibility',
      mood: 'mood',
    },
    prepare({ title, date, visibility, mood }) {
      const d = date ? new Date(date).toLocaleDateString('en-GB') : 'No date';
      const v = visibility === 'public' ? '🌐' : '🔒';
      const m = mood ? mood.split(' ')[0] : '📝'; // Ambil emojinya aja buat icon
      return {
        title: `${m} ${title}`,
        subtitle: `${d} | ${v}`,
      };
    },
  },
});