// src/app/layout.tsx (Versi Perbaikan: Local-First)

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

const lexend = localFont({
  src: "../../public/fonts/Lexend.woff2",
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Nawa | Web3 Portfolio Hub',
    template: '%s | Nawa'
  },
  description: 'Personal knowledge, views, and professional portfolio of Nawa.',
  metadataBase: new URL('https://rnawa.vercel.app'), // PENTING: Ganti sesuai domain lo nanti
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
        url: '/nawa.webp', // Pastikan file ini ada di folder /public
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
 }: Readonly <{ 
  children: React.ReactNode 
 }> ) {
  const { isEnabled: isDraftMode } = await draftMode();
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
          <MainLayout>
            {children}
            {isDraftMode && (
              <>
                <VisualEditingComponent /> {/* Ini manggil src/components/VisualEditing.tsx */}
                <DisableDraftMode />
              </>
            )}
            <SanityLive />
            </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}