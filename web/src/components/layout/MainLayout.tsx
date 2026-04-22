'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { m, type Variants } from 'framer-motion';
import styles from './MainLayout.module.css';
import { useTheme } from '@/context/ThemeContext';
import RealTimeClock from "../RealTimeClock";
import NawaLogo from '../../../public/nawa.webp';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const currentSidebarWidth = useSidebarWidth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const { isSidebarOpen, setIsSidebarOpen, isProjectDetailOpen } = useTheme();

  const immersiveRoutes = ['/projects', '/studio'];
  const isImmersive = immersiveRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const isStudio = pathname?.startsWith('/studio');
  const isInSanityIframe = typeof window !== 'undefined' && window.self !== window.top;
  const shouldHideSidebarCompletely = isStudio || isInSanityIframe;

  const shouldShowBackgroundEffect = !isImmersive;

  const navItems = [
    { text: "Me", url: "/me" },
    { text: "Connect", url: "/connect" },
    { text: "Services", url: "/services" },
    { text: "Projects", url: "/projects" },
    { text: "Documentation", url: "/docs" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mql = window.matchMedia('(max-width: 1023px)');
      setIsMobile(mql.matches);
      if (mql.matches) {
        setIsSidebarOpen(false);
      } else if (!isImmersive) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isImmersive, setIsSidebarOpen]);

  const panelVariants = (delay: number): Variants => ({
    open: {
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }
    },
    closed: {
      x: -currentSidebarWidth,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: delay * 0.5 }
    }
  });

  return (
    <div
      className={styles.layoutRoot}
      data-sidebar={isSidebarOpen ? 'open' : 'closed'}
      data-immersive={isProjectDetailOpen}
    >
      {/* BACKGROUND STRATEGY: Ganti DarkVeil dengan CSS Mesh Gradient & Noise */}
      {shouldShowBackgroundEffect && (
        <div className={styles.backgroundVeil}>
           <div className={styles.meshGradient} />
           <div className={styles.noiseOverlay} />
        </div>
      )}

      {!shouldHideSidebarCompletely && (
        <>
          <m.div
            variants={panelVariants(0.6)}
            initial="closed"
            animate={isProjectDetailOpen ? "closed" : (isSidebarOpen ? "open" : "closed")}
            className={`${styles.smPanel} ${styles.bg2}`}
            style={{ width: currentSidebarWidth }}
          />

          <m.div
            variants={panelVariants(0.3)}
            initial="closed"
            animate={isProjectDetailOpen ? "closed" : (isSidebarOpen ? "open" : "closed")}
            className={`${styles.smPanel} ${styles.bg1}`}
            style={{ width: currentSidebarWidth }}
          />

          <m.div
            variants={panelVariants(0.001)}
            initial="closed"
            animate={isProjectDetailOpen ? "closed" : (isSidebarOpen ? "open" : "closed")}
            className={`${styles.smPanel} ${styles.mainPanel}`}
            style={{ width: currentSidebarWidth }}
          >
            <button
              onClick={() => !isProjectDetailOpen && setIsSidebarOpen(!isSidebarOpen)}
              className={styles.magnetToggle}
              style={{
                cursor: isProjectDetailOpen ? 'not-allowed' : 'pointer',
                opacity: isProjectDetailOpen ? 0.5 : 1
              }}
            >
              {isSidebarOpen ? '«' : '»'}
            </button>

            <div className={styles.logoWrapper}>
              <Image src={NawaLogo} alt="Nawa Logo" className={styles.logo} width={80} height={80} priority />
            </div>

            <p className={styles.navHeader}>Menu</p>

            <ul className={styles.sidebarList}>
              {navItems.map((item, i) => (
                <li key={i} className={styles.sidebarItem}>
                  <Link href={item.url}>{item.text}</Link>
                </li>
              ))}
            </ul>

            <div className={styles.clockWrapper}><RealTimeClock /></div>

            <div className={styles.tributeFooter}>
              <p className={styles.tributeText}>In Assistance of</p>
              <div className={styles.logoStack}>
                <Image src="/gemini.webp" alt="Gemini AI Logo" height={42} width={120} priority />
                <Image src="/openai-logo.webp" alt="OpenAI Logo" height={32} width={120} priority />
              </div>
            </div>
          </m.div>
        </>
      )}

      <m.main
        layout
        className={`${styles.mainContent} ${isImmersive ? styles.immersiveContent : ''}`}
        style={{
          marginLeft: !isMobile && !shouldHideSidebarCompletely && isSidebarOpen && !isProjectDetailOpen ? currentSidebarWidth : 0,
          width: !isMobile && !shouldHideSidebarCompletely && isSidebarOpen && !isProjectDetailOpen ? `calc(100% - ${currentSidebarWidth}px)` : '100%'
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.main>
    </div>
  );
}