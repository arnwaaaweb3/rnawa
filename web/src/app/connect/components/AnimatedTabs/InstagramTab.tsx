'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaInstagram, FaImage, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "@/app/connect/styles/AnimatedTabs.module.css";

interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  permalink: string;
}

export default function InstagramTab({ isDarkMode, isActive }: { isDarkMode: boolean; isActive: boolean }) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = process.env.NEXT_PUBLIC_IG_TOKEN;

  const truncate = (str: string, n: number) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

  useEffect(() => {
    if (!token || !isActive || posts.length > 0) return;
    const fetchInstagramPosts = async () => {
      setIsLoading(true);
      try {
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=5`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.data) setPosts(data.data);
      } catch (error) {
        console.error("Gagal ambil data IG:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstagramPosts();
  }, [token, isActive, posts.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  const activePost = posts[currentIndex];

  return (
    <div className={styles.dummyCard}>
      <div className={styles.previewBox} style={{ overflow: "hidden", padding: 0, position: 'relative' }}>
        {isLoading ? (
          <div className={styles.skeletonPulse} style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)' }} />
        ) : activePost ? (
          <>
            <div className={styles.navOverlay}>
              <button onClick={handlePrev} className={styles.navButton}><FaChevronLeft size={12} /></button>
              <button onClick={handleNext} className={styles.navButton}><FaChevronRight size={12} /></button>
            </div>
            <AnimatePresence mode="wait">
              <motion.a
                key={activePost.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                href={activePost.permalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "100%", height: "100%", display: "block" }}
              >
                <Image
                  src={activePost.media_type === "VIDEO" ? activePost.thumbnail_url : activePost.media_url}
                  alt={activePost.caption || "Instagram Post"}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </motion.a>
            </AnimatePresence>
          </>
        ) : (
          <div style={{ textAlign: "center", opacity: 0.5 }}>
            <FaImage size={40} style={{ marginBottom: 10 }} />
            <p style={{ fontSize: "0.8rem", margin: 0 }}>No Data Found</p>
          </div>
        )}
      </div>

      <div className={styles.textGroup}>
        <div className={styles.iconLarge}><FaInstagram /></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePost ? activePost.id : "empty"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <h2 className={styles.dummyTitle}>{activePost ? "Latest Updates" : "Instagram"}</h2>
            <p className={styles.dummyDesc}>
              {activePost ? (
                <span>
                  &ldquo;{truncate(activePost.caption, 80)}&rdquo; <br />
                  <a href={activePost.permalink} target="_blank" rel="noreferrer" style={{ color: isDarkMode ? "#2196F3" : "black", fontSize: "0.8rem", textDecoration: "none", fontWeight: "bold" }}>
                    View Post &rarr;
                  </a>
                </span>
              ) : "Check out my posts on Instagram!"}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}