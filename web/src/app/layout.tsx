// src/app/layout.tsx

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import MainLayout from '../components/layout/MainLayout';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { SanityLive } from '@/sanity/lib/live';
import { draftMode } from 'next/headers';
import { DisableDraftMode } from '@/components/DisableDraftMode';
import VisualEditingComponent from '@/components/VisualEditing';
import { preload } from 'react-dom';
import LazyMotionWrapper from '@/components/LazyMotionWrapper';

// Font Optimization
const lexend = localFont({
  src: "../../public/fonts/Lexend.woff2",
  variable: '--font-lexend',
  display: 'swap',
});

// Metadata SEO
export const metadata: Metadata = {
  title: {
    default: 'Nawa | Web3 Portfolio Hub',
    template: '%s | Nawa'
  },
  description: 'Personal knowledge, views, and professional portfolio of Nawa.',
  metadataBase: new URL('https://rnawa.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nawa | Web3 Portfolio Hub',
    description: 'Personal knowledge, views, and professional portfolio.',
    url: 'https://rnawa.vercel.app',
    siteName: 'Nawa Portfolio',
    images: [
      {
        url: '/nawa.webp',
        width: 1200,
        height: 630,
        alt: 'Nawa Portfolio Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nawa | Web3 Portfolio Hub',
    description: 'Web3 & AI Enthusiast Portfolio',
    creator: '@rnawaaaaa',
    images: ['/profil-nawa.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ 
  children,
 }: Readonly<{ 
  children: React.ReactNode 
 }>) {
  const { isEnabled: isDraftMode } = await draftMode();

  // Preload aset gambar utama agar LCP lebih cepat
  preload('/services.webp', { as: 'image' });
  preload('/connect.webp', { as: 'image' });
  preload('/docs.webp', { as: 'image' });
  preload('/projects.webp', { as: 'image' });

  return (
    <html lang="en" className={lexend.variable} suppressHydrationWarning> 
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased"> 
        <ThemeProvider>
          <LazyMotionWrapper>
            <MainLayout>
              {children}
              {isDraftMode && (
                <>
                  <VisualEditingComponent />
                  <DisableDraftMode />
                </>
              )}
              <SanityLive />
            </MainLayout>
          </LazyMotionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}