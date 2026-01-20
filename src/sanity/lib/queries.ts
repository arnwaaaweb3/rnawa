// src/sanity/lib/queries.ts

// 1. Ambil semua list project buat grid utama (Tetap sama, coverImage penting buat visual awal)
export const PROJECTS_QUERY = `*[_type == "portfolioItem"] | order(publishedAt desc) {
  _id,
  title,
  projectStatus,
  "slug": slug.current,
  "imageUrl": coverImage.asset->url,
  "projectUrl": projectUrl,
  "categories": categories[]->{
    title,
    "slug": slug.current,
    "parent": parent->title
  }
}`;

// 2. Ambil detail satu project buat panel (Update bagian GitHub Explorer)
export const PROJECT_DETAIL_QUERY = `*[_type == "portfolioItem" && slug.current == $slug][0] {
  ...,
  youtubeId,
  displayType,
  githubRepo,      // <--- Tarik path reponya
  enableExplorer,  // <--- Tarik status filternya
  "imageUrl": coverImage.asset->url,
  "pdfFile": {
    "asset": { "url": pdfFile.asset->url }
  },
  "gallery": gallery[].asset->url,
  "categories": categories[]->{ title, "slug": slug.current },
  "posterImage": {
    "asset": posterImage.asset-> {
      _id, url, 
      metadata { dimensions { width, height, aspectRatio } }
    },
    "alt": posterImage.alt
  }
}`;

// 3. Query buat Docs (Tetap sama)
export const DOCS_QUERY = `*[_type == "documentation"]{
  _id,
  title,
  "slug": slug.current,
  description,
  displayType,
  "pdfFile": pdfFile.asset->url,
  "imageUrl": mainImage.asset->url,
  "categoryTitle": category->title,
  "categorySlug": category->slug.current,
  "color": category->color
}`;