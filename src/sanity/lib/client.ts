import { createClient, groq, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, 
  // Iki tambahané ben iso Visual Editing
  stega: {
    enabled: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_VIEW_MODE === 'preview',
    studioUrl: '/studio',
  },
})

// Fungsi fetcher-mu tetep podo, tapi client-e wis pinter saiki
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