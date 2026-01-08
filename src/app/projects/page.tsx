'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/HeaderProjects';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import { motion } from 'framer-motion'; // Tambahin ini buat animasi card

interface Project {
  _id: string;
  title: string;
  projectStatus: string;
  slug: string;
  imageUrl: string;
}

export default function ProjectsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = `*[_type == "portfolioItem"] | order(publishedAt desc) {
          _id,
          title,
          projectStatus,
          "slug": slug.current,
          "imageUrl": coverImage.asset->url
        }`;
        const data = await client.fetch(query);
        setProjects(data);
      } catch (error) {
        console.error("Gagal ambil data proyek:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <main className={`${styles.mainBackground} ${darkMode ? styles.darkModeActive : ''}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className={styles.filterContainer}>
        {['all', 'completed', 'ongoing'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`${styles.filterTab} ${filter === status ? styles.activeTab : ''}`}
          >
            {status.toUpperCase()}
            {filter === status && (
              <motion.div
                layoutId="underline"
                className={styles.activeUnderline}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loader}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className={styles.spinner}
            />
            <p className={styles.loadingState}>Loading Nawa&apos;s Projects...</p>
          </div>

        ) : (
          <div className={styles.projectGrid}>
            {projects
              .filter(p => filter === 'all' || p.projectStatus === filter)
              .map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${styles.projectCard} ${darkMode ? styles.cardDark : ''}`}
                >
                  {/* Efek visual yang sama kayak di Header lo */}
                  <motion.div
                    className={styles.visualEffect}
                    animate={{
                      backgroundColor: darkMode ? '#190b61' : '#ff85e5',
                      scale: darkMode ? 1.5 : 1,
                      x: darkMode ? '20%' : '-20%',
                    }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                  />

                  {project.imageUrl && (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className={styles.cardImage}
                      />
                    </div>
                  )}

                  <div className={styles.cardInfo}>
                    <div className={styles.cardHeader}>
                      <span className={styles.statusBadge}>{project.projectStatus}</span>
                      <h3 className={styles.cardTitle}>{project.title}</h3>
                    </div>
                    <button className={styles.detailButton}>
                      Explore Project <span>→</span>
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      <div className={styles.backButtonWrapper}>
        <button
          className={`${styles.backButton} ${darkMode ? styles.darkModeButton : ''}`}
          onClick={() => router.push("/")}
        >
          ← Back
        </button>
      </div>
    </main>
  );
}