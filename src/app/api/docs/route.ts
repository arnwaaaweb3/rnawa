import { NextResponse } from 'next/server'
import { createClient, groq } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-03',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

export async function GET() {
  const query = groq`
    *[_type == "documentation"]{
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
  const data = await client.fetch(query)
  return NextResponse.json(data)
}
