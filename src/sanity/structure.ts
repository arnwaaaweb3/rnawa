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
    S.list()
      .title('Portfolio Management')
      .items([
        // Tampilkan semua project tanpa filter
        S.listItem()
          .title('All Projects')
          .icon(CaseIcon)
          .child(S.documentTypeList('portfolioItem').title('All Projects')),

        S.divider(),

        // 1. Filter berdasarkan Category (Parent)
        S.listItem()
          .title('Projects by Main Category')
          .child(
            S.documentTypeList('category')
              .title('Main Categories')
              .child(categoryId =>
                S.documentTypeList('portfolioItem')
                  .title('Projects')
                  .filter('_type == "portfolioItem" && category._ref == $categoryId')
                  .params({ categoryId })
              )
          ),

        // 2. Filter berdasarkan Categories (Sub/Array)
        S.listItem()
          .title('Projects by Output (Sub)')
          .child(
            S.documentTypeList('category')
              .title('Output Types')
              .child(categoryId =>
                S.documentTypeList('portfolioItem')
                  .title('Projects')
                  .filter('_type == "portfolioItem" && $categoryId in categories[]._ref')
                  .params({ categoryId })
              )
          ),
        ])
      ),
    ])