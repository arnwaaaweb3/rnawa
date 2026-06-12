// src/app/api/docs/route.ts
import { NextResponse } from 'next/server'
import { createClient, groq } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-03',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

export async function GET(req: Request) {
  // 1. 🛡️ PROTEKSI LAYER 1: Header Guard (Anti-Scraping / Bot)
  const headerOrigin = req.headers.get('origin');
  const headerReferer = req.headers.get('referer');
  const host = req.headers.get('host') || '';
  
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  
  if (!headerReferer && !headerOrigin && !isLocalhost) {
    return NextResponse.json({ error: 'Unauthorized API access pattern' }, { status: 403 });
  }

  // 2. 🛡️ PROTEKSI LAYER 2: GROQ Query Hardening (Blokir Draf)
  // Menambahkan filter !(_id in path("drafts.**")) memastikan jurnal yg masih draf GAK BAKAL KETARIK
  // Catatan: Kalau di schema Sanity lu ada field boolean kayak 'isPrivate', lu bisa tambahin di sini, 
  // contoh: *[_type == "documentation" && !(_id in path("drafts.**")) && isPrivate != true]
  const query = groq`
    *[_type == "documentation" && !(_id in path("drafts.**"))]{
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
    }
  `
  
  try {
    const data = await client.fetch(query)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Sanity Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch documentation' }, { status: 500 });
  }
}