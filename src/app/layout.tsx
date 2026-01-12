// src/app/layout.tsx (Versi Perbaikan: Local-First)

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import MainLayout from '../components/layout/MainLayout';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const lexend = localFont({
  src: "../../public/fonts/Lexend.woff2",
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nawa | Web3 Portfolio Hub',
  description: 'Personal knowledge, views, and professional portfolio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}