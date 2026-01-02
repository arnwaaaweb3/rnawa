'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
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

  // Ref untuk animasi GSAP
  const panelMain = useRef<HTMLDivElement>(null);
  const panelBg1 = useRef<HTMLDivElement>(null);
  const panelBg2 = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const immersiveRoutes = ['/portfolio'];
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
    const mql = window.matchMedia('(max-width: 1023px)'); // Mobile/Tablet threshold
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      setIsOpen(!e.matches); // Your existing sidebar logic
    };

    onChange(mql);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // ✅ SISTEM ANIMASI GSAP (CSS VARIABLE DRIVEN)
  useLayoutEffect(() => {
    if (!panelMain.current || currentSidebarWidth === 0) return;

    const ctx = gsap.context(() => {
      const sidebarWidthPx = currentSidebarWidth;
      // We target the mainContent specifically
      const mainContent = document.querySelector(`.${styles.mainContent}`);
      // Force a starting state so GSAP doesn't guess
      gsap.set(mainContent, { marginLeft: isOpen ? 0 : sidebarWidthPx });

      if (isOpen) {
        // SIDEBAR OPENS
        gsap.to([panelBg2.current, panelBg1.current, panelMain.current], {
          x: 0,
          stagger: 0.05,
          ease: "power3.out",
          duration: 0.6
        });

        gsap.to(mainContent, {
          marginLeft: `${sidebarWidthPx}px`, // Physically push the content
          width: `calc(100% - ${sidebarWidthPx}px)`,
          ease: "power3.out",
          duration: 0.6
        });
      } else {
        // SIDEBAR CLOSES - The "Pull" Effect
        gsap.to([panelMain.current, panelBg1.current, panelBg2.current], {
          x: -sidebarWidthPx,
          stagger: 0.03, // Tighter stagger for a snappier exit
          ease: "expo.inOut",
          duration: 0.7
        });

        gsap.to(mainContent, {
          marginLeft: "0px",
          width: "100%", // This expands the content as it pulls back
          ease: "expo.inOut",
          duration: 0.7,
          clearProps: "all" // Cleans up inline styles so CSS can take over again
        });
      }
    });

    return () => ctx.revert();
  }, [isOpen, currentSidebarWidth]);

  return (
    // ✅ ROOT LAYOUT — single source of truth untuk offset sidebar
    <div
      className={styles.layoutRoot}
      data-sidebar={isOpen ? 'open' : 'closed'}
      style={{
        '--sidebar-offset': isOpen
          ? `${currentSidebarWidth}px`
          : '0px',
      } as React.CSSProperties}
    >
      {/* ✅ Route-aware Veil */}
      {shouldShowVeil && (
        <div className={styles.backgroundVeil}>
          {isMobile ? (
            <div className={styles.mobileBackground} />
          ) : (
            <DarkVeil
              hueShift={300}
              noiseIntensity={0.03}
              scanlineIntensity={0.1}
              warpAmount={0.05}
            />
          )}
        </div>
      )}

      {/* ✅ GSAP TRIPLE PANEL */}
      <div
        ref={panelBg2}
        className={`${styles.smPanel} ${styles.bg2}`}
        style={{ width: currentSidebarWidth }}
      />

      <div
        ref={panelBg1}
        className={`${styles.smPanel} ${styles.bg1}`}
        style={{ width: currentSidebarWidth }}
      />

      <div
        ref={panelMain}
        className={`${styles.smPanel} ${styles.mainPanel}`}
        style={{ width: currentSidebarWidth }}
      >
        {/* ✅ MAGNET TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.magnetToggle}
          aria-label={isOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
        >
          {isOpen ? '«' : '»'}
        </button>

        {/* ✅ LOGO */}
        <div className={styles.logoWrapper}>
          <Image
            src={NawaLogo}
            alt="Nawa Logo"
            className={styles.logo}
            width={80}
            height={80}
            priority
          />
        </div>

        <p className={styles.navHeader}>Menu</p>

        {/* ✅ NAV ITEMS */}
        <ul className={styles.sidebarList}>
          {navItems.map((item, i) => (
            <li
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={styles.sidebarItem}
            >
              <Link href={item.url}>{item.text}</Link>
            </li>
          ))}
        </ul>

        {/* ✅ CLOCK */}
        <div className={styles.clockWrapper}>
          <RealTimeClock />
        </div>

        {/* ✅ FOOTER */}
        <div ref={footerRef} className={styles.tributeFooter}>
          <p className={styles.tributeText}>In Assistance of</p>
          <div className={styles.logoStack}>
            <Image
              src="/gemini.png"
              alt="Gemini AI Logo"
              height={42}
              width={120}
              priority
            />
            <Image
              src="/openai-logo.png"
              alt="OpenAI Logo"
              height={32}
              width={120}
              priority
            />
          </div>
        </div>
      </div>

      {/* ✅ MAIN CONTENT — patuh ke CSS variable */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}