// src/sanity/lib/client.ts
import { createClient, groq, type SanityClient } from 'next-sanity' // ✅ Tambahkan groq & SanityClient

import { apiVersion, dataset, projectId } from '../env'

// ✅ Interface untuk data yang akan di-fetch
export interface DocsCategory {
    _id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string; 
    categoryTitle: string; 
    categorySlug: string; 
    color: string; 
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, 
})

// ✅ Fungsi Fetcher dengan Type yang benar
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
    `;
    return client.fetch(query);
}