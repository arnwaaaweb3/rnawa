// src/app/studio/[[...tool]]/page.tsx

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { notFound } from 'next/navigation'

// 🛡️ Kita ubah jadi force-dynamic karena kita butuh nge-cek URL params secara real-time di server
export const dynamic = 'force-dynamic'

export { metadata, viewport } from 'next-sanity/studio'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function StudioPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const accessKey = resolvedParams.access
  
  // Ambil kunci rahasia dari environment variable di server
  const SECRET_STUDIO_KEY = process.env.SANITY_STUDIO_ACCESS_KEY

  // 🛡️ SECURITY PATTERN: Kalau kunci rahasia gak di-set di server, matikan akses studio demi keamanan
  if (!SECRET_STUDIO_KEY) {
    console.error('⚠️ Warning: SANITY_STUDIO_ACCESS_KEY belum dikonfigurasi di file .env!')
    return notFound()
  }

  // Jika user mencoba masuk tanpa query parameter rahasia yang cocok, lempar langsung ke 404 Not Found
  if (accessKey !== SECRET_STUDIO_KEY) {
    return notFound()
  }

  // Hanya jika kuncinya valid, tampilkan halaman Sanity Studio
  return <NextStudio config={config} />
}