// src/components/layout/MainLayout.tsx
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
  
  // Ambil state isSidebarOpen global dari Context
  const { isSidebarOpen, setIsSidebarOpen } = useTheme();
  
  // Pakai state lokal buat kontrol animasi, tapi di-sync sama Context
  const [isOpen, setIsOpen] = useState(true);

  const immersiveRoutes = ['/projects', '/studio'];
  const isImmersive = immersiveRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`));
  
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

  // 1. Sync state lokal dengan state Global Context
  useEffect(() => {
    setIsOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      // Kalau mobile, paksa tutup
      if (e.matches) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    onChange(mql);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [setIsSidebarOpen]);

  // Framer Motion Variants
  const panelVariants = (delay: number): Variants => ({
    open: {
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay
      }
    },
    closed: {
      x: -currentSidebarWidth,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: delay * 0.5
      }
    }
  });

  return (
    <div
      className={styles.layoutRoot}
      data-sidebar={isOpen ? 'open' : 'closed'}
      data-immersive={!isSidebarOpen}
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

      {/* Background Panels */}
      <motion.div
        variants={panelVariants(0.6)}
        animate={isOpen ? "open" : "closed"}
        className={`${styles.smPanel} ${styles.bg2}`}
        style={{ width: currentSidebarWidth }}
      />

      <motion.div
        variants={panelVariants(0.3)}
        animate={isOpen ? "open" : "closed"}
        className={`${styles.smPanel} ${styles.bg1}`}
        style={{ width: currentSidebarWidth }}
      />

      {/* Main Sidebar Panel */}
      <motion.div
        variants={panelVariants(0.001)}
        animate={isOpen ? "open" : "closed"}
        className={`${styles.smPanel} ${styles.mainPanel}`}
        style={{ width: currentSidebarWidth }}
      >
        <button
          onClick={() => setIsSidebarOpen(!isOpen)}
          className={styles.magnetToggle}
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

      {/* Viewport Content */}
      <motion.main
        layout
        className={`${styles.mainContent} ${isImmersive ? styles.immersiveContent : ''}`}
        style={{
          // Logika Viewport Lebar: Kalau sidebar closed, marginLeft 0 & Width 100%
          marginLeft: !isMobile && isOpen ? currentSidebarWidth : 0,
          width: !isMobile && isOpen ? `calc(100% - ${currentSidebarWidth}px)` : '100%'
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
    </div>
  );
}