'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import AnimatedTabs from '../../components/AnimatedTabs';
import SignatureNawaCard from '../../components/SignatureNawaCard';

const ConnectPage: React.FC = () => {
  const router = useRouter();

  // Initialize sidebar state safely for SSR
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true; // SSR fallback
    const layoutRoot = document.querySelector('[class*="layoutRoot"]');
    return layoutRoot?.getAttribute("data-sidebar") === 'open' || false;
  });

  useEffect(() => {
    // Safety check for SSR
    if (typeof window === 'undefined') return;

    const layoutRoot = document.querySelector('[class*="layoutRoot"]');
    if (!layoutRoot) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-sidebar") {
          const status = (mutation.target as HTMLElement).getAttribute("data-sidebar");
          setIsSidebarOpen(status === 'open');
        }
      });
    });

    observer.observe(layoutRoot, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        <header className={styles.headerSection}>
          <h1 className={styles.heading}>Let&apos;s Connect!</h1>
          <p className={styles.description}>
            Don&apos;t be hesitate to say Hi and leave me a message on:
          </p>
        </header>

        <div className={styles.contentGrid} data-sidebar={isSidebarOpen ? "open" : "closed"}>
          <section className={styles.tabsSection}>
            <AnimatedTabs />
          </section>

          {/* Always render for wide screens, but the CSS will handle the visibility */}
          <aside className={styles.cardSection}>
            <SignatureNawaCard
              name="Nawa"
              role="Fullstack Developer"
              image="/profil-nawa.jpg"
            />
          </aside>
        </div>
      </div>

      <div className={styles.backButtonWrapper}>
        <button className={styles.backButton} onClick={() => router.push("/")}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default ConnectPage;