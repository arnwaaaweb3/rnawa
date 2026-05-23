'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
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

const navItems = [
  { text: "Me", url: "/me" },
  { text: "Connect", url: "/connect" },
  { text: "Services", url: "/services" },
  { text: "Projects", url: "/projects" },
  { text: "Documentation", url: "/docs" },
];

const immersiveRoutes = ['/projects', '/studio'];

export default function MainLayout({ children }: MainLayoutProps) {
  const currentSidebarWidth = useSidebarWidth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const { isSidebarOpen, setIsSidebarOpen, isProjectDetailOpen } = useTheme();

  const isImmersive = immersiveRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const isStudio = pathname?.startsWith('/studio');

  // ✅ Fix: useMemo biar ga re-calc tiap render
  const isInSanityIframe = useMemo(() =>
    typeof window !== 'undefined' && window.self !== window.top
  , []);

  const shouldHideSidebarCompletely = isStudio || isInSanityIframe;
  const shouldShowBackgroundEffect = !isImmersive;

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

  // ✅ Fix: pindah ke luar render, ga recreate tiap frame
  const panelVariants = useMemo(() => (delay: number): Variants => ({
    open: {
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }
    },
    closed: {
      x: -currentSidebarWidth,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: delay * 0.5 }
    }
  }), [currentSidebarWidth]);

  const sidebarAnimate = isProjectDetailOpen ? "closed" : (isSidebarOpen ? "open" : "closed");

  const mainMargin = !isMobile && !shouldHideSidebarCompletely && isSidebarOpen && !isProjectDetailOpen
    ? currentSidebarWidth : 0;
  const mainWidth = !isMobile && !shouldHideSidebarCompletely && isSidebarOpen && !isProjectDetailOpen
    ? `calc(100% - ${currentSidebarWidth}px)` : '100%';

  return (
    <div
      className={styles.layoutRoot}
      data-sidebar={isSidebarOpen ? 'open' : 'closed'}
      data-immersive={isProjectDetailOpen}
    >
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
            animate={sidebarAnimate}
            className={`${styles.smPanel} ${styles.bg2}`}
            style={{ width: currentSidebarWidth }}
          />
          <m.div
            variants={panelVariants(0.3)}
            initial="closed"
            animate={sidebarAnimate}
            className={`${styles.smPanel} ${styles.bg1}`}
            style={{ width: currentSidebarWidth }}
          />
          <m.div
            variants={panelVariants(0.001)}
            initial="closed"
            animate={sidebarAnimate}
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
          </m.div>
        </>
      )}

      {/* ✅ Fix: hapus layout prop, hapus will-change dari CSS */}
      <m.main
        className={`${styles.mainContent} ${isImmersive ? styles.immersiveContent : ''}`}
        style={{ marginLeft: mainMargin, width: mainWidth }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.main>
    </div>
  );
}