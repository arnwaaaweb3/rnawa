import { createClient, groq, type SanityClient } from 'next-sanity'
// Panggil dari env.ts pusat, jangan manja ngetik ulang!
import { apiVersion, dataset, projectId } from '../env'

export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, 
  stega: {
    enabled: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_VIEW_MODE === 'preview',
    // Pake env var atau fallback ke path default studio lu
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio',
  },
})

// Interface & Fetcher tetep sama, udah bener itu.
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