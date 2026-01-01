// src/app/connect/page.tsx
'use client';

import React from 'react';
import styles from './page.module.css';
import AnimatedTabs from '../../components/AnimatedTabs';

// Konstanta HUE dari kode lama kamu, bisa dipakai di CSS Variable jika dibutuhkan.
const CONNECT_HUE = 60; 

const ConnectPage: React.FC = () => {
  const HEADING_TEXT = "Let's Connect!";
  
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
                onClick={() => {
                  window.history.back();
                }}
              >
                ← Back
              </button>
        </div>
    </div>
  );
};
export default ConnectPage;