'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Background from './components/Background';
import Header from './components/Header';

const ServicesPage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Background />
      <Header />

      <main className={styles.container}>
        <h2 className={styles.sellpoint}>
          Looking for What You Need?
        </h2>
      </main>

      <div className={styles.backButtonWrapper}>
        <button 
          className={styles.backButton} 
          onClick={() => router.push('/')}
        >
          ← Back
        </button>
      </div>
    </>
  );
};

export default ServicesPage;