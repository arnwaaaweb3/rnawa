'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import Image from "next/image";

const SERVICES = [
  { id: 0, title: "Visual Designer", code: "VS-01", color: "#9b137d" },
  { id: 1, title: "Website Designer", code: "WD-02", color: "#5227FF" },
  { id: 2, title: "Press Writer", code: "PW-03", color: "#00F2FF" },
  { id: 3, title: "Crisis Management", code: "CM-04", color: "#FFDE59" },
  { id: 4, title: "Video Editing", code: "VE-05", color: "#FF3131" },
];

export default function ServicesPage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();

  const paginate = useCallback((delta: number) => {
    setDirection(delta);
    setIndex(prev => (prev + delta + SERVICES.length) % SERVICES.length);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 50) paginate(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [paginate]);

  const currentAccent = SERVICES[index].color;

  return (
    <div 
      className={styles.neoContainer}
      style={{ '--accent': currentAccent } as React.CSSProperties} // INI KUNCINYA
    >
      <div className={styles.hugeNumber}>
        {String(index + 1).padStart(2, '0')}
      </div>

      <main className={styles.mainGrid}>
        <section className={styles.leftCol}>
          <div className={styles.tagLine}>
             <span className={styles.blink}>●</span> SERVICES / {SERVICES[index].code}
          </div>
          
          <div className={styles.titleWrapper}>
            <div className={styles.titleFixedContainer}>
              <AnimatePresence mode="wait" custom={direction}>
              <motion.h1 
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={styles.title}
              >
                {SERVICES[index].title}
              </motion.h1>
            </AnimatePresence>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            className={styles.neoCta}
          >
            SEE MORE DETAILS ↗
          </motion.button>
        </section>

        <section className={styles.rightCol}>
          <div className={styles.imageFrame}>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.6, ease: [0.8, 0, 0.1, 1] }}
                className={styles.imgInternal}
              >
                <Image 
                  src={`/services${index + 1}.webp`} 
                  alt={SERVICES[index].title} 
                  fill 
                  className={styles.actualImg} 
                />
              </motion.div>
            </AnimatePresence>
            <div className={styles.frameDecoration} />
          </div>
        </section>
      </main>

      <nav className={styles.bottomNav}>
        {SERVICES.map((s, i) => (
          <button 
            key={s.id} 
            onClick={() => setIndex(i)}
            className={`${styles.navItem} ${i === index ? styles.activeNavItem : ""}`}
            style={i === index ? { backgroundColor: s.color } : {}}
          >
            <span className={styles.navCode}>{s.code}</span>
            <span className={styles.navTitle}>{s.title}</span>
          </button>
        ))}
      </nav>

      {/* BACK BUTTON YANG LEBIH BERANI */}
      <div className={styles.backButtonWrapper}>
        <button className={styles.backButton} onClick={() => router.push("/")}>
          ← Back
        </button>
      </div>
    </div>
  );
}