// src/app/docs/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Docs</h1>
        <div className={styles.backButtonWrapper}>
          <button 
          className={styles.backButton} 
          onClick={() => router.push('/')}
          >
            ← Back
          </button>
        </div>
      </div>
    </>
  );
}