'use client';

import React from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import AnimatedTabs from '../../components/AnimatedTabs';
import SignatureNawaCard from '../../components/SignatureNawaCard'; // Added missing component

const ConnectPage: React.FC = () => {
  const HEADING_TEXT = "Let's Connect!";
  const router = useRouter();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        <header className={styles.headerSection}>
          <h1 className={styles.heading}>{HEADING_TEXT}</h1>
          <p className={styles.description}>
            Don&apos;t hesitate to say Hi and leave me a message on:
          </p>
        </header>

        <div className={styles.contentGrid}>
          <section className={styles.tabsSection}>
            <AnimatedTabs />
          </section>

          <aside className={styles.cardSection}>
            <SignatureNawaCard
              name="Nawa"
              role="Public Relations Officer"
              image="/profil-nawa.jpg"
            />
          </aside>
        </div>
      </div>

      <div className={styles.backButtonWrapper}>
        <button
          className={styles.backButton}
          onClick={() => router.push("/")}
          aria-label="Back to home"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default ConnectPage;