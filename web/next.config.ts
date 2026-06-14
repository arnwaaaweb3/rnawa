import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // 🛡️ SECURITY LAYER 3: HTTP Headers Hardening (Anti-Clickjacking & Anti-MIME Sniffing)
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY', // 🚫 Total Blokir: Mencegah web lu di-embed di iframe situs luar manapun
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff', // 🚫 Memaksa browser mengikuti MIME type asli dari server (Anti-Script Injection)
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin', // Menjaga privasi data URL referer pas pindah halaman
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block', // Mengaktifkan filter XSS bawaan pada browser-browser modern
                    },
                ],
            },
        ];
    },

    images: {
        formats: ['image/avif', 'image/webp'], 
        imageSizes: [640, 828, 1200, 1600], 
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                pathname: '/images/**',
            },
        ],
    },
    compiler: {
        styledComponents: true,
    },
};

export default nextConfig;