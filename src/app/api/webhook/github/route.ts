import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  // Logic buat validasi secret dari GitHub (biar nggak sembarang orang nembak)
  // ...
  
  // Kalau ada push, kita paksa Next.js buat update cache data Sanity/GitHub
  revalidateTag('sanity-data'); 
  return new Response('OK');
}