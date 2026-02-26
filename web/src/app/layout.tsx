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
const lexend = localFont({
  src: "../../public/fonts/Lexend.woff2",
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nawa | Web3 Portfolio Hub',
  description: 'Personal knowledge, views, and professional portfolio.',
};

export default async function RootLayout({ 
  children,
 }: Readonly <{ 
  children: React.ReactNode 
 }> ) {
  const { isEnabled: isDraftMode } = await draftMode();

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