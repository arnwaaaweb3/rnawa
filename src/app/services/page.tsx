'use client';

import React, { useState, useEffect, useCallback } from "react";
// Import useRouter from next/navigation
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import Image from "next/image";
import DarkVeil from "../../components/DarkVeil";

const SERVICES = [
  { id: 0, title: "Visual Designer", img: "/services1.webp", cta: "Take a look! →", color: "rgba(255,133,229,0.3)" },
  { id: 1, title: "Website Designer", img: "/services2.webp", cta: "See more details", color: "rgba(82,39,255,0.3)" },
  { id: 2, title: "Press Release Writer", img: "/services3.webp", cta: "See more details", color: "rgba(0,242,255,0.3)" },
  { id: 3, title: "Crisis Management", img: "/services4.webp", cta: "See more details", color: "#5b532c" },
  { id: 4, title: "Video Editing", img: "/services5.webp", cta: "See more details", color: "#4682a9" },
];

export default function ServicesPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter(); // Initialize the router

  const paginate = useCallback((delta: number) => {
    setIndex(prev => (prev + delta + SERVICES.length) % SERVICES.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        paginate(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        paginate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);


  return (
    <div className={styles.container}>
      <div className={styles.veilLayer}>
        <DarkVeil
          hueShift={300}
          noiseIntensity={0.03}
          scanlineIntensity={0.1}
          warpAmount={0.05}
          speed={0.15}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.2, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={styles.heroImageWrapper}
        >
          <Image
            src={SERVICES[index].img}
            alt={`Service: ${SERVICES[index].title}`}
            fill
            priority
            className={styles.heroImg}
          />
          <div className={styles.overlay} />
        </motion.div>
      </AnimatePresence>

      <div className={styles.content}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          key={`text-${index}`}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.infoBox}
        >
          <span className={styles.indexLabel}>
            {String(index + 1).padStart(2, '0')} - SERVICES
          </span>
          <h1 className={styles.title}>{SERVICES[index].title}</h1>
          <button
            className={styles.primaryCta}
            style={{ backgroundColor: SERVICES[index].color }}
          >
            {SERVICES[index].cta}
          </button>
        </motion.div>

        <nav className={styles.sideNav}>
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`${styles.navDot} ${i === index ? styles.activeDot : ""}`}
              aria-label={`Go to ${s.title}`}
            >
              <span className={styles.dotLabel}>{s.title}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.backButtonWrapper}>
        <button
          className={styles.backButton}
          onClick={() => router.push("/")} // Use router instead of window.history
        >
          ← Back
        </button>
      </div>
    </div>
  );
}