'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import styles from './MainLayout.module.css';
import DarkVeil from '../DarkVeil';
import { useTheme } from '@/context/ThemeContext';
import RealTimeClock from "../RealTimeClock";
import NawaLogo from '../../../public/nawa.png';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const currentSidebarWidth = useSidebarWidth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  const { isSidebarOpen, setIsSidebarOpen, isProjectDetailOpen } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const immersiveRoutes = ['/projects', '/studio'];
  const isImmersive = immersiveRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`));

  const isStudio = pathname?.startsWith('/studio');
  const isInSanityIframe = typeof window !== 'undefined' && window.self !== window.top;

  // RULE: Bunuh sidebar secara total kalau di studio atau iframe preview
  const shouldHideSidebarCompletely = isStudio || isInSanityIframe;

  const shouldShowVeil = !immersiveRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const navItems = [
    { text: "Me", url: "/me" },
    { text: "Connect", url: "/connect" },
    { text: "Services", url: "/services" },
    { text: "Projects", url: "/projects" },
    { text: "Documentation", url: "/docs" },
  ];

  useEffect(() => {
    setIsOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  useEffect(() => {
    const isInIframe = window.self !== window.top;

    if (isInIframe) {
      setIsSidebarOpen(false);
      return;
    }

    const mql = window.matchMedia('(max-width: 1023px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) {
        setIsSidebarOpen(false);
      } else {
        const immersive = ['/projects', '/studio'].some(route => 
          window.location.pathname.startsWith(route)
        );
        if (!immersive) setIsSidebarOpen(true);
      }
    };
    
    onChange(mql);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [setIsSidebarOpen]);

  const panelVariants = (delay: number): Variants => ({
    open: {
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay }
    },
    closed: {
      x: -currentSidebarWidth,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: delay * 0.5 }
    }
  });

  return (
    <div
      className={styles.layoutRoot}
      data-sidebar={isSidebarOpen ? 'open' : 'closed'}
      data-immersive={isProjectDetailOpen}
    >
      {shouldShowVeil && (
        <div className={styles.backgroundVeil}>
          {isMobile ? (
            <div className={styles.mobileBackground} />
          ) : (
            <DarkVeil hueShift={300} noiseIntensity={0.03} scanlineIntensity={0.1} warpAmount={0.05} />
          )}
        </div>
      )}

      {!shouldHideSidebarCompletely && (
        <>
          <motion.div
            variants={panelVariants(0.6)}
            animate={isProjectDetailOpen ? "closed" : (isOpen ? "open" : "closed")}
            className={`${styles.smPanel} ${styles.bg2}`}
            style={{ width: currentSidebarWidth }}
          />

          <motion.div
            variants={panelVariants(0.3)}
            animate={isProjectDetailOpen ? "closed" : (isOpen ? "open" : "closed")}
            className={`${styles.smPanel} ${styles.bg1}`}
            style={{ width: currentSidebarWidth }}
          />

          <motion.div
            variants={panelVariants(0.001)}
            animate={isProjectDetailOpen ? "closed" : (isOpen ? "open" : "closed")}
            className={`${styles.smPanel} ${styles.mainPanel}`}
            style={{ width: currentSidebarWidth }}
          >
            <button
              onClick={() => {
                if (isProjectDetailOpen) return;
                setIsSidebarOpen(!isOpen);
              }}
              className={styles.magnetToggle}
              style={{
                cursor: isProjectDetailOpen ? 'not-allowed' : 'pointer',
                opacity: isProjectDetailOpen ? 0.5 : 1
              }}
            >
              {isOpen ? '«' : '»'}
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
                <Image src="/gemini.png" alt="Gemini AI Logo" height={42} width={120} priority />
                <Image src="/openai-logo.png" alt="OpenAI Logo" height={32} width={120} priority />
              </div>
            </div>
          </motion.div>
        </>
      )}

      <motion.main
        layout
        className={`${styles.mainContent} ${isImmersive ? styles.immersiveContent : ''}`}
        style={{
          marginLeft: !isMobile && !shouldHideSidebarCompletely && isSidebarOpen && !isProjectDetailOpen ? currentSidebarWidth : 0,
          width: !isMobile && !shouldHideSidebarCompletely && isSidebarOpen && !isProjectDetailOpen ? `calc(100% - ${currentSidebarWidth}px)` : '100%'
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
    </div>
  );
}