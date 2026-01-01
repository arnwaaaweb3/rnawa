'use client';

import React, { useState } from 'react';
import { Header } from '../../components/layout/Header';
import styles from './page.module.css';

export default function PortfolioPage() {
  // State utama kita pindahkan ke sini
  const [darkMode, setDarkMode] = useState(false);

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
          className={`${styles.backButton} ${darkMode ? styles.darkModeButton : ''}`}
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
      </div>
    </main>
  );
}