'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import Image from "next/image";

const SERVICES = [
  { id: 0, title: "Visual Designer", code: "VS-01", desc: "Crafting compelling visual identities, brand assets, and design systems that communicate with precision and purpose." },
  { id: 1, title: "Website Designer", code: "WD-02", desc: "Building fast, modern web experiences with clean architecture and thoughtful UX at every interaction." },
  { id: 2, title: "Press Writer", code: "PW-03", desc: "Translating complex ideas into clear, compelling narratives for press releases, articles, and media kits." },
  { id: 3, title: "Crisis Management", code: "CM-04", desc: "Navigating reputational risk with strategic communication and rapid, measured response frameworks." },
  { id: 4, title: "Video Editing", code: "VE-05", desc: "Producing polished video content — color grading, pacing, and motion that lands." },
];

// ✅ Skeleton component — keliatan pas image belum load
function ImageSkeleton() {
  return <div className={styles.imgSkeleton} />;
}

export default function ServicesPage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const router = useRouter();

  const paginate = useCallback((delta: number) => {
  setDirection(delta);
  setImgLoaded(false);
  setIndex(prev => (prev + delta + SERVICES.length) % SERVICES.length);
}, []);

  useEffect(() => {
    let touchTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (touchTimeout !== null) return;
      if (Math.abs(e.deltaY) > 50) {
        paginate(e.deltaY > 0 ? 1 : -1);
        touchTimeout = setTimeout(() => { touchTimeout = null; }, 500);
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (touchTimeout !== null) clearTimeout(touchTimeout);
    };
  }, [paginate]);

  return (
    <div className={styles.neoContainer}>

      <div className={styles.topBar}>
        <div className={styles.breadcrumb}>
          Services / <span>{SERVICES[index].code}</span>
        </div>
        <button className={styles.backButton} onClick={() => router.push("/")}>
          ← Back
        </button>
      </div>

      <main className={styles.mainGrid}>
        <section className={styles.leftCol}>
          <div className={styles.serviceIndex}>
            <span className={styles.dot} />
            {String(index + 1).padStart(2, '0')} of {String(SERVICES.length).padStart(2, '0')}
          </div>

          <div className={styles.titleWrapper}>
            <AnimatePresence mode="wait" custom={direction}>
              <m.h1
                key={index}
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 24, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={styles.title}
              >
                {SERVICES[index].title}
              </m.h1>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <m.p
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className={styles.serviceDesc}
            >
              {SERVICES[index].desc}
            </m.p>
          </AnimatePresence>

          <div className={styles.ctaRow}>
            <m.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={styles.ctaBtn}
            >
              See details ↗
            </m.button>
            <button className={styles.ctaLink} onClick={() => paginate(1)}>
              Next service →
            </button>
          </div>
        </section>

        <section className={styles.rightCol}>
          <div className={styles.imageFrame}>
            <AnimatePresence mode="wait">
              <m.div
                key={index}
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.5, ease: [0.8, 0, 0.1, 1] }}
                className={styles.imgInternal}
              >
                {/* ✅ Skeleton tampil sampai image ready */}
                {!imgLoaded && <ImageSkeleton />}
                <Image
                  src={`/services${index + 1}.webp`}
                  alt={SERVICES[index].title}
                  fill
                  className={styles.actualImg}
                  style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
                  onLoad={() => setImgLoaded(true)}
                  priority={index === 0}
                />
              </m.div>
            </AnimatePresence>
            <span className={styles.frameCode}>{SERVICES[index].code}</span>
          </div>
        </section>
      </main>

      <nav className={styles.bottomNav}>
        {SERVICES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setImgLoaded(false); setIndex(i); }}
            className={`${styles.navItem} ${i === index ? styles.activeNavItem : ""}`}
          >
            <div className={`${styles.navBar} ${i === index ? styles.navBarActive : ""}`} />
            <span className={styles.navCode}>{s.code}</span>
            <span className={styles.navTitle}>{s.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}