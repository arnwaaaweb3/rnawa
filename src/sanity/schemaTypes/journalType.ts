// src/sanity/schemaTypes/journalType.ts

import { defineType, defineField } from 'sanity';
// Impor ikon dari Sanity (misal: buku)
import { BookIcon } from '@sanity/icons'; 

/**
 * JournalType digunakan untuk mencatat proses (Documentation) 
 * atau cerita di balik layar Nawa.
 */
export const journalType = defineType({
  name: 'journal',
  title: 'Journal',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Judul entri jurnal (contoh: Memperbaiki Hydration Error di NextJS)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'URL unik untuk entri ini (contoh: memperbaiki-hydration-error)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date of Entry',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
      initialValue: () => (new Date()).toISOString(),
      description: 'Kapan entri ini dicatat.',
    }),
    defineField({
        name: 'isPrivate',
        title: 'Private Entry',
        type: 'boolean',
        description: 'Jika dicentang, entri ini hanya untuk konsumsi pribadi (tidak tampil di publik).',
        initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'blockContent', // Menggunakan Block Content yang sudah ada
      description: 'Isi cerita, proses, atau perasaan di balik proyek.',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords / Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      description: 'Kata kunci terkait entri (misal: NextJS, Solana, Struggle, Debugging)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      isPrivate: 'isPrivate',
    },
    prepare({ title, publishedAt, isPrivate }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date';
      const visibility = isPrivate ? '🔒 Private' : '🌐 Public';
      return {
        title: title,
        subtitle: `${date} | ${visibility}`,
      };
    },
  },
});