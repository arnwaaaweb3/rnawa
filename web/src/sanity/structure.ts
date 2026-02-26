// src/sanity/structure.ts
import type { StructureResolver } from 'sanity/structure'
import {
  BookIcon,
  EditIcon,
  DocumentIcon,
  CaseIcon,
  UsersIcon,
  TagsIcon,
  ArchiveIcon,
  FolderIcon,
} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Webrnawa Studio')
    .items([

      /* ===============================
         1. JOURNALING
         =============================== */
      S.listItem()
        .title('Personal Journal')
        .icon(EditIcon)
        .child(
          S.documentTypeList('journal')
            .title('Journal Entries')
        ),

      S.divider(),

      /* ===============================
         2. LEARNING DOCS
         =============================== */
      S.listItem()
        .title('Learning Docs')
        .icon(BookIcon)
        .child(
          S.documentTypeList('documentation')
            .title('Notes & Learning Materials')
        ),

      S.divider(),

      /* ===============================
         3. ARTICLES
         =============================== */
      S.listItem()
        .title('Articles & Opinions')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Content Management')
            .items([
              S.documentTypeListItem('post')
                .title('Published Posts')
                .icon(DocumentIcon),

              S.documentTypeListItem('author')
                .title('Authors / Profile')
                .icon(UsersIcon),
            ])
        ),

      S.divider(),

      /* ===============================
         4. PORTFOLIO SYSTEM
         =============================== */
      S.listItem()
        .title('Project Portfolio')
        .icon(CaseIcon)
        .child(
          S.list()
            .title('Portfolio Engine')
            .items([

              /* ---------- All Projects ---------- */
              S.listItem()
                .title('All Projects')
                .icon(ArchiveIcon)
                .child(
                  S.documentTypeList('portfolioItem')
                    .title('All Projects')
                ),

              S.divider(),

              /* ---------- By Main Category (Domain) ---------- */
              S.listItem()
                .title('By Main Category (Domain)')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('category')
                    .title('Main Categories (Domain)')
                    .filter('_type == "category" && type == "domain"')
                    .child(domainId =>
                      S.documentTypeList('portfolioItem')
                        .title('Projects')
                        .filter('_type == "portfolioItem" && mainCategory._ref == $domainId')
                        .params({ domainId })
                    )
                ),

              S.divider(),

              /* ---------- By Output Category (Sub / Output) ---------- */
              S.listItem()
                .title('By Output Category')
                .icon(TagsIcon)
                .child(
                  S.documentTypeList('category')
                    .title('Output Categories')
                    .filter('_type == "category" && type == "output"')
                    .child(outputId =>
                      S.documentTypeList('portfolioItem')
                        .title('Projects')
                        .filter('_type == "portfolioItem" && outputCategory._ref == $outputId')
                        .params({ outputId })
                    )
                ),

              S.divider(),

              /* ---------- By Media Type ---------- */
              S.listItem()
                .title('By Media Type')
                .icon(DocumentIcon)
                .child(
                  S.list()
                    .title('Media Filters')
                    .items([

                      S.listItem()
                        .title('Video')
                        .child(
                          S.documentTypeList('portfolioItem')
                            .title('Video Projects')
                            .filter('_type == "portfolioItem" && displayType == "video"')
                        ),

                      S.listItem()
                        .title('PDF Documents')
                        .child(
                          S.documentTypeList('portfolioItem')
                            .title('PDF Projects')
                            .filter('_type == "portfolioItem" && displayType == "pdf"')
                        ),

                      S.listItem()
                        .title('GitHub Repositories')
                        .child(
                          S.documentTypeList('portfolioItem')
                            .title('GitHub Projects')
                            .filter('_type == "portfolioItem" && displayType == "github"')
                        ),

                      S.listItem()
                        .title('Poster / Images')
                        .child(
                          S.documentTypeList('portfolioItem')
                            .title('Poster Projects')
                            .filter('_type == "portfolioItem" && displayType == "poster"')
                        ),
                    ])
                ),

            ])
        ),

      S.divider(),

      /* ===============================
         5. TAXONOMY MANAGEMENT
         =============================== */
      S.listItem()
        .title('Taxonomy System')
        .icon(TagsIcon)
        .child(
          S.list()
            .title('System Categories')
            .items([

              S.listItem()
                .title('Main Categories (Domain)')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('category')
                    .title('Main Categories (Domain)')
                    .filter('_type == "category" && type == "domain"')
                ),

              S.listItem()
                .title('Output Categories')
                .icon(TagsIcon)
                .child(
                  S.documentTypeList('category')
                    .title('Output Categories')
                    .filter('_type == "category" && type == "output"')
                ),
            ])
        ),
    ])
