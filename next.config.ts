// next.config.ts

import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        // ✅ AFTER: Set quality default lebih tinggi (misalnya 90, defaultnya 75)
        imageSizes: [640, 828, 1200, 1600], // Menambahkan ukuran 1600px
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '**',
            },
            // Tambahkan host lain jika kamu menggunakan Sanity Image CDN atau host eksternal lainnya
            // Contoh: Sanity CDN (jika perlu)
            // {
            //     protocol: 'https',
            //     hostname: 'cdn.sanity.io',
            //     port: '',
            //     pathname: '/**',
            // },
        ],
    },
};

export default nextConfig;