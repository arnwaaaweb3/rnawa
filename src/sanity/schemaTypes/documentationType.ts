import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'documentation',
  title: 'Document and Notes',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Catatan',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Isi Catatan (Markdown/Rich Text)',
      type: 'blockContent',
    }),
  ],
})
