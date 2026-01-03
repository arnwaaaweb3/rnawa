// src/app/connect/page.tsx
'use client';

import React from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import AnimatedTabs from '../../components/AnimatedTabs';

const ConnectPage: React.FC = () => {
  const HEADING_TEXT = "Let's Connect!";
  const router = useRouter();
  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        <h1 className={styles.heading}>
          {HEADING_TEXT}
        </h1>
        <p className={styles.description}>
          Don&apos;t hesitate to say Hi and leave me message on:
        </p>
        <div className={styles.contentRow}>
          <div className={styles.tabsContainer}>
            <AnimatedTabs />
          </div>
        </div>
      </div>
      <div className={styles.backButtonWrapper}>
        <button
          className={styles.backButton}
          onClick={() => router.push("/")} // Use router instead of window.history
        >
          ← Back
        </button>
      </div>
    </div>
  );
};
export default ConnectPage;