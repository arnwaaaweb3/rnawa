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
      name: 'keyTakeaway',
      title: '💡 Key Takeaway / Lesson Learned',
      type: 'text',
      description: 'What is the ONE main thing you learned today?',
      rows: 2, 
    }),

    defineField({
      name: 'body',
      title: 'Story',
      type: 'blockContent',
      description: 'Write anything you like to describe your feeling today',
    }),

    defineField({
      name: 'weather',
      title: '🌤️ Weather',
      type: 'string',
      description: 'How is the weather outside?',
      options: {
        list: [
          { title: '☀️ Sunny', value: 'sunny' },
          { title: '☁️ Cloudy', value: 'cloudy' },
          { title: '🌧️ Rainy', value: 'rainy' },
          { title: '⛈️ Stormy', value: 'stormy' },
          { title: '❄️ Snowy', value: 'snowy' },
          { title: '🌫️ Foggy', value: 'foggy' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'location',
      title: '📍 Location',
      type: 'string',
      description: 'Where are you writing this? (City, Cafe, Home)',
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

    defineField({
      name: 'songOfTheDay',
      title: '🎵 Song of the Day',
      type: 'object',
      description: 'What are you listening to while writing this?',
      fields: [

        defineField({
          name: 'title',
          title: 'Song Title',
          type: 'string',
        }),

        defineField({
          name: 'artist',
          title: 'Artist',
          type: 'string',
        }),

        defineField({
          name: 'spotifyUrl',
          title: 'Spotify/Apple Music Link',
          type: 'url',
          description: 'Paste the link here so people can listen to it.',
        }),

        defineField({
          name: 'gallery',
          title: '📸 Gallery / Attachments',
          type: 'array',
          of: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                  description: 'Describe this image briefly.',
                }
              ],
            })
          ],
          options: {
            layout: 'grid',
          }
        }),
      ],

      preview: {
        select: {
          title: 'title',
          artist: 'artist',
        },
        prepare({ title, artist }) {
          return {
            title: title || 'Untitled Song',
            subtitle: artist || 'Unknown Artist',
          }
        },
      }
    }),
  ],
  

  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      visibility: 'visibility',
      mood: 'mood',
      weather: 'weather', // Select weather
      location: 'location', // Select location
    },
    prepare({ title, date, visibility, mood, weather, location }) {
      const d = date ? new Date(date).toLocaleDateString('en-GB') : 'No date';
      const v = visibility === 'public' ? '🌐' : '🔒';
      const m = mood ? mood.split(' ')[0] : '📝'; // Ambil emojinya aja
      // Mapping icon weather
      const wIcons = {
        sunny: '☀️', cloudy: '☁️', rainy: '🌧️', stormy: '⛈️', snowy: '❄️', foggy: '🌫️'
      };
      const wIcon = weather ? (wIcons[weather as keyof typeof wIcons] || '🌤️') : '';

      return {
        title: `${m} ${title}`,
        subtitle: `${d} | ${v} ${wIcon} ${location ? '| ' + location : ''}`, 
      };
    },
  },
});