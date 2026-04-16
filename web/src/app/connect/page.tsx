'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { preload } from 'react-dom';
import AnimatedTabs from '@/app/connect/components/AnimatedTabs/index';
import SignatureNawaCard from '../../components/SignatureNawaCard';

const ConnectPage: React.FC = () => {
  const router = useRouter();

  // --- STRATEGI FERRARI: Preload Banner Utama ---
  // Kita preload aset yang paling mungkin dilihat pertama kali (Instagram/LinkedIn)
  preload('/assets/linkedin-dark.webp', { as: 'image' });
  preload('/assets/linkedin-light.webp', { as: 'image' });
  preload('/assets/discord-dark.webp', { as: 'image' });
  preload('/assets/instagram-logo.webp', { as: 'image' }); // Jika ada logo statis IG

  // Initialize sidebar state safely for SSR
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true; 
    const layoutRoot = document.querySelector('[class*="layoutRoot"]');
    return layoutRoot?.getAttribute("data-sidebar") === 'open' || false;
  });

  useEffect(() => {
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
            Don&apos;t hesitate to say Hi and leave me a message on:
          </p>
        </header>

        <div className={styles.contentGrid} data-sidebar={isSidebarOpen ? "open" : "closed"}>
          <section className={styles.tabsSection}>
            {/* AnimatedTabs sekarang sudah modular dan enteng */}
            <AnimatedTabs />
          </section>

          <aside className={styles.cardSection}>
            <SignatureNawaCard
              name="Nawa"
              role="Developer"
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