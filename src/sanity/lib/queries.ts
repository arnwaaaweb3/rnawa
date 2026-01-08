// src/sanity/lib/queries.ts

export const projectsQuery = `*[_type == "portfolioItem"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  projectStatus,
  "category": category->title,
  tags,
  "coverImage": coverImage.asset->url
}`;