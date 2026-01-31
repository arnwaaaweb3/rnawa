// src/sanity/lib/queries.ts

// 1. PROJECTS_QUERY - Tarik displayType dan rapikan struktur image
export const PROJECTS_QUERY = `*[_type == "portfolioItem"] | order(publishedAt desc) {
  _id,
  title,
  displayType,
  "slug": slug.current,
  "projectUrl": projectUrl,
  "coverImage": {
    "asset": coverImage.asset->{ _id, url },
    "alt": coverImage.alt
  },
  "mainCategory": mainCategory->{
    title,
    "slug": slug.current
  },
  "categories": categories[]->{
    title,
    "slug": slug.current
  }
}`;

// 2. PROJECT_DETAIL_QUERY - Sesuaikan dengan types.ts
export const PROJECT_DETAIL_QUERY = `*[_type == "portfolioItem" && slug.current == $slug][0] {
  ...,
  "slug": slug.current,
  "coverImage": {
    "asset": coverImage.asset->{ _id, url },
    "alt": coverImage.alt
  },
  "pdfFile": pdfFile.asset->url, 
  "posterImage": {
    "asset": posterImage.asset-> {
      _id, url, 
      metadata { dimensions { width, height, aspectRatio } }
    },
    "alt": posterImage.alt
  },
  "mainCategory": mainCategory->{ title, "slug": slug.current },
  "outputCategory": outputCategory->{ title, "slug": slug.current }
}`;

// 3. DOCS_QUERY (Tetap tarik displayType kalau ada di skema docs nanti)
export const DOCS_QUERY = `*[_type == "documentation"]{
  _id,
  title,
  "slug": slug.current,
  description,
  "imageUrl": mainImage.asset->url,
  "categoryTitle": category->title,
  "categorySlug": category->slug.current
  "color": category->color
}`;