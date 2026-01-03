'use client';

import React, { useState } from 'react';
import { Header } from '../../components/layout/Header';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function PortfolioPage() {
  // State utama kita pindahkan ke sini
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    // Kita tambahkan class darkMode ke mainBackground jika state true
    <main className={`${styles.mainBackground} ${darkMode ? styles.darkModeActive : ''}`}>
      {/* Kita kirim state dan fungsi toggle ke Header sebagai props */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className={styles.content}>
        <h2 style={{ color: darkMode ? '#fff' : '#000' }}>
        </h2>
        {/* Konten portfolio lainnya */}
      </div>
      <div className={styles.backButtonWrapper}>
        <button
          className={styles.backButton}
          onClick={() => router.push("/")} // Use router instead of window.history
        >
          ← Back
        </button>
      </div>
    </main>
  );
}