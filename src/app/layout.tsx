// src/app/layout.tsx (Versi Perbaikan: Local-First)

import type { Metadata } from 'next';
import localFont from 'next/font/local'; // ✅ Ganti ke localFont
import MainLayout from '../components/layout/MainLayout';
import './globals.css';

// 1. Definisikan Local Font Lexend
// Pastikan file .ttf kamu sudah ditaruh di /public/fonts/
const lexend = localFont({
  src: "../../public/fonts/Lexend.woff2",
  variable: '--font-lexend', // Tetapkan sebagai CSS Variable
  display: 'swap',
  // Tips: Variable font lokal secara otomatis mendukung range weight file aslinya
});

export const metadata: Metadata = {
  title: 'Nawa | Web3 Portfolio Hub',
  description: 'Personal knowledge, views, and professional portfolio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={lexend.variable} suppressHydrationWarning> 
      <body className="antialiased"> 
        <MainLayout> 
          {children}
        </MainLayout>
      </body>
    </html>
  );
}