import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('CMS Structure')
    .items([
      S.listItem()
        .title('Views & Opinions (Post)')
        .child(
          S.list()
            .title('Views & Opinions')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),
      S.divider(),

      S.documentTypeListItem('journal').title('Journal Entries (Docs)'), 
      S.divider(),

      // Filter dokumen bawaan Sanity agar tidak mengganggu
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author', 'journal'].includes(item.getId()!),
      ),
    ])
