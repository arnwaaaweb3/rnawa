import { revalidateTag } from 'next/cache';

// Kita pake _req (pake underscore) buat ngasih tau TS kalau ini sengaja nggak dipake
export async function POST(_req: Request) {
  // Logic buat validasi secret dari GitHub (biar nggak sembarang orang nembak)
  // ...
  
  // Di Next.js 16, revalidateTag butuh argumen kedua (profile)
  // Kita kasih 'default' atau biarkan kosong sesuai error message-nya
  revalidateTag('sanity-data', 'default'); 
  
  return new Response('OK');
}