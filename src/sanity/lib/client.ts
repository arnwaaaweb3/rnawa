import { createClient, groq, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // ✅ cukup untuk data publik, aman di frontend
})

// Interface tipe data
export interface DocsCategory {
    _id: string
    title: string
    slug: string
    description: string
    imageUrl: string
    categoryTitle: string
    categorySlug: string
    color: string
}

// Fetcher function
export async function getDocsCategories(client: SanityClient): Promise<DocsCategory[]> {
    const query = groq`
        *[_type == "documentation"] {
            _id,
            title,
            "slug": slug.current,
            description,
            "imageUrl": mainImage.asset->url,
            "categoryTitle": category->title,
            "categorySlug": category->slug.current,
            "color": category->color
        }
    `
    return client.fetch(query)
}
