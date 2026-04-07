'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SiThreads } from "react-icons/si";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "@/app/connect/styles/AnimatedTabs.module.css";


interface Thread {
  id: number;
  text: string;
  date: string;
  link: string;
  image?: string;
}

export default function ThreadsTab({ isActive }: { isActive: boolean }) {
  const threads: Thread[] = [
    {
      id: 1,
      text: "i learned something about smart contract. specifically Solidity - Ethereum!",
      date: "Nov 25, 2025: 4:13 P.M",
      link: "https://www.threads.com/@arnawa.sui/post/DReVWBGkjRk",
      image: "/assets/ethereum.webp"
    },
    {
      id: 2,
      text: "i think it would be a good idea to bring a visual representation of LLM as a companion AI...",
      date: "Nov 25, 2025: 4:26 P.M",
      link: "https://www.threads.com/@arnawa.sui/post/DReW7RWkviZ",
      image: "/assets/ai.webp"
    },
    {
      id: 3,
      text: "The Future is Never Been Crafted by Perfect Hands. It's Always Crafted by Failure Hands",
      date: "Nov 25, 2025: 5:18 P.M",
      link: "https://www.threads.com/@arnawa.sui/post/DRecxBrkpqP",
      image: "/assets/future.webp"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => setCurrentIndex((prev) => (prev === threads.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? threads.length - 1 : prev - 1));
  const activeThread = threads[currentIndex];

  return (
    <div className={styles.dummyCard}>
      <div className={styles.previewBox} style={{ position: 'relative', border: activeThread.image ? "none" : "2px dashed rgba(255,255,255,0.1)", overflow: 'hidden' }}>
        <div className={styles.navOverlay}>
          <button onClick={handlePrev} className={styles.navButton}><FaChevronLeft size={12} /></button>
          <button onClick={handleNext} className={styles.navButton}><FaChevronRight size={12} /></button>
        </div>

        <AnimatePresence mode="wait">
          {activeThread.image ? (
            <motion.a
              key={`img-${activeThread.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              href={activeThread.link}
              target="_blank"
              rel="noreferrer"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <Image
                src={activeThread.image}
                alt="Threads media"
                fill
                style={{ objectFit: "cover" }}
                priority={isActive}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.a>
          ) : (
            <motion.div key={`icon-${activeThread.id}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255, 255, 255, 0.05)" }}>
              <SiThreads size={70} style={{ opacity: 0.8 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.textGroup}>
        <div className={styles.iconLarge}><SiThreads /></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeThread.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <h2 className={styles.dummyTitle}>Threads</h2>
            <p className={styles.dummyDesc}>&ldquo;{activeThread.text}&rdquo;</p>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{activeThread.date}</span>
              <a href={activeThread.link} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", textDecoration: "none", fontWeight: "bold", marginTop: '5px', color: 'inherit' }}>
                View on Threads &rarr;
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}