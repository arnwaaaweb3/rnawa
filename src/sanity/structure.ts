import type {StructureResolver} from 'sanity/structure'
import { 
  BookIcon, 
  EditIcon, 
  DocumentIcon, 
  CaseIcon, 
  UsersIcon, 
  TagsIcon 
} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Webrnawa Studio')
    .items([
      // 1. Journaling - The Personal Space
      S.listItem()
        .title('Personal Journal')
        .icon(EditIcon)
        .child(
          S.documentTypeList('journal')
            .title('Journal Entries')
        ),

      S.divider(),

      // 2. Documentation - The Learning Hub
      S.listItem()
        .title('Learning Docs')
        .icon(BookIcon)
        .child(
          S.documentTypeList('documentation')
            .title('Notes & Learning Materials')
        ),

      S.divider(),

      // 3. Views & Opinions - The Public Voice
      S.listItem()
        .title('Articles & Opinions')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Content Management')
            .items([
              S.documentTypeListItem('post').title('Published Posts').icon(DocumentIcon),
              S.documentTypeListItem('category').title('Categories').icon(TagsIcon),
              S.documentTypeListItem('author').title('Authors/Profile').icon(UsersIcon),
            ])
        ),

      S.divider(),

      // 4. Portfolio - The Proof of Work
      S.listItem()
        .title('Project Portfolio')
        .icon(CaseIcon)
        .child(
          S.documentTypeList('portfolioItem')
            .title('My Projects')
        ),

      S.divider(),

      // Filter otomatis buat tipe dokumen yang mungkin lo tambah di masa depan tapi lupa lo susun
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author', 'journal', 'documentation', 'portfolioItem'].includes(item.getId()!),
      ),
    ])