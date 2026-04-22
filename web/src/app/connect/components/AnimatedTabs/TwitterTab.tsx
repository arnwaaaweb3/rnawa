'use client';
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaTwitter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "@/app/connect/styles/AnimatedTabs.module.css";

interface Tweet {
  id: number;
  text: string;
  date: string;
  link: string;
  image?: string;
}

export default function TwitterTab({ isDarkMode, isActive }: { isDarkMode: boolean; isActive: boolean }) {
  const tweets: Tweet[] = [
    {
      id: 1,
      text: "Buy (₿) Bitcoin. The only right way to hold your assets value",
      date: "Nov 22, 2024: 9:31 A.M",
      link: "https://x.com/rnawaaaaa/status/1859786857095233566",
      image: "/assets/bitcoin.webp"
    },
    {
      id: 2,
      text: "i'm starting to love @Algorand! i'm building a voting dApp...",
      date: "Sep 30, 2025: 3:01 A.M",
      link: "https://x.com/rnawaaaaa/status/1972753505166532652",
      image: "/assets/algorand.webp"
    },
    {
      id: 3,
      text: "Post Hackathon! Proyek MVP buat Veritas!",
      date: "Nov 1, 2025: 6:58 P.M",
      link: "https://x.com/rnawaaaaa/status/1984590992738304398",
      image: "/assets/devpost.webp"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => setCurrentIndex((prev) => (prev === tweets.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? tweets.length - 1 : prev - 1));
  const activeTweet = tweets[currentIndex];

  return (
    <div className={styles.dummyCard}>
      <div className={styles.previewBox} style={{ position: 'relative', border: activeTweet.image ? "none" : "2px dashed rgba(255,255,255,0.1)", overflow: 'hidden' }}>
        <div className={styles.navOverlay}>
          <button onClick={handlePrev} className={styles.navButton}><FaChevronLeft size={12} /></button>
          <button onClick={handleNext} className={styles.navButton}><FaChevronRight size={12} /></button>
        </div>
        <AnimatePresence mode="wait">
          {activeTweet.image ? (
            <m.a
              key={`img-${activeTweet.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              href={activeTweet.link}
              target="_blank"
              rel="noreferrer"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <Image src={activeTweet.image} alt="Tweet media" fill style={{ objectFit: "cover" }} priority={isActive} sizes="(max-width: 768px) 100vw, 50vw" />
            </m.a>
          ) : (
            <m.div key={`icon-${activeTweet.id}`} className={styles.iconPlaceholder}>
              <FaTwitter size={80} color="#1DA1F2" />
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.textGroup}>
        <div className={styles.iconLarge} style={{ color: "#1DA1F2" }}><FaTwitter /></div>
        <AnimatePresence mode="wait">
          <m.div
            key={activeTweet.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <h2 className={styles.dummyTitle} style={{ color: "#1DA1F2" }}>On The Timeline</h2>
            <p className={styles.dummyDesc}>&ldquo;{activeTweet.text}&rdquo;</p>
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{activeTweet.date}</span>
            <a href={activeTweet.link} target="_blank" rel="noreferrer" style={{ color: isDarkMode ? "#2196F3" : "black", fontSize: "0.8rem", fontWeight: "bold" }}>
              Reply on X &rarr;
            </a>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}