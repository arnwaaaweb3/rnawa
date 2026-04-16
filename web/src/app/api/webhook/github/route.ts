import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  const payload = await req.text();
  const headerList = await headers(); // Ambil header dulu
  const signature = headerList.get('x-hub-signature-256');
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  if (signature !== digest) {
    return new Response('Invalid signature', { status: 401 });
  }

  await Promise.resolve(revalidateTag('sanity-data', {})); 
  
  return new Response('OK', { status: 200 });
}