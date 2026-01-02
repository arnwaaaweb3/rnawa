'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import styles from './MainLayout.module.css';
import DarkVeil from '../DarkVeil';
import RealTimeClock from "../RealTimeClock";
import NawaLogo from '../../../public/nawa.png';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  const currentSidebarWidth = useSidebarWidth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  const immersiveRoutes = ['/portfolio', '/studio'];
  const shouldShowVeil = !immersiveRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const navItems = [
    { text: "Portfolio", url: "/portfolio" },
    { text: "Me", url: "/me" },
    { text: "Project", url: "/projects" },
    { text: "Documentation", url: "/docs" },
    { text: "Connect", url: "/connect" },
  ];

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      setIsOpen(!e.matches);
    };
    onChange(mql);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Framer Motion Variants
  const panelVariants = (delay: number): Variants => ({
    open: { 
      x: 0, 
      transition: { 
        duration: 0.6, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ease: [0.22, 1, 0.36, 1] as any, 
        delay 
      } 
    },
    closed: { 
      x: -currentSidebarWidth, 
      transition: { 
        duration: 0.5, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ease: [0.22, 1, 0.36, 1] as any, 
        delay: delay * 0.5 
      } 
    }
  });

  return (
    <div
      className={styles.layoutRoot}
      data-sidebar={isOpen ? 'open' : 'closed'}
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

      <motion.div
        variants={panelVariants(0.001)}
        animate={isOpen ? "open" : "closed"}
        className={`${styles.smPanel} ${styles.mainPanel}`}
        style={{ width: currentSidebarWidth }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
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

      <motion.main 
        layout 
        className={styles.mainContent}
        style={{ 
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