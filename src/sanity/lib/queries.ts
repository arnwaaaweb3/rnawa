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

export const PROJECTS_BY_CATEGORY_QUERY = `*[_type == "portfolioItem" && ($category == "all" || category->title == $category)] {
  _id,
  title,
  "slug": slug.current,
  "category": category->title,
  mainImage,
  description
}`;