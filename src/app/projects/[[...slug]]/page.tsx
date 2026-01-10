'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../../../components/layout/HeaderProjects';
import styles from '../[[...slug]]/page.module.css';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import ReactMarkdown from 'react-markdown';

interface Category {
  title: string;
  slug: string;
  parent?: string;
}

interface Project {
  _id: string;
  title: string;
  projectStatus: string;
  slug: string;
  imageUrl: string;
  categories?: Category[];
  description?: PortableTextBlock[];
  gallery?: string[];
  projectUrl?: string;
  relatedJournal?: { title: string; slug: string }[];
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

// Definisikan struktur data code block Sanity
interface SanityCodeValue {
  code: string;
  language?: string;
  filename?: string;
}

const portableTextComponents = {
  types: {
    codeBlock: ({ value }: { value: SanityCodeValue }) => (
      <div className={styles.codeBlockWrapper}>
        {value.filename && <div className={styles.codeFilename}>{value.filename}</div>}
        <pre className={styles.preBlock}>
          {/* Pakai ReactMarkdown buat nerjemahin teks kodenya */}
          <div className={styles.markdownContent}>
            <ReactMarkdown>
              {value.code}
            </ReactMarkdown>
          </div>
        </pre>
      </div>
    ),
  },
};

export default function ProjectsPage({ params }: PageProps) {
  const resolvedParams = React.use(params); 
  const slug = resolvedParams.slug ? resolvedParams.slug[0] : null;

  const router = useRouter();

  useEffect(() => {
    if (slug) {
      handleExplore(slug);
    } else {
      // Kalau visitor balik ke /projects (tanpa slug)
      setSelectedProject(null);
    }
  }, [slug]);

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  /* =======================
     DERIVED STATE (CLEAN)
  ======================= */
  const availableCategories = useMemo(() => {
    return [
      'all',
      ...new Set(
        projects.flatMap((p) => p.categories?.map((c) => c.title) || [])
      ),
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchStatus =
        filter === 'all' || project.projectStatus === filter;

      const matchCategory =
        categoryFilter === 'all' ||
        project.categories?.some(
          (c) => c.title === categoryFilter || c.parent === categoryFilter
        );

      return matchStatus && matchCategory;
    });
  }, [projects, filter, categoryFilter]);

  /* =======================
     STORE OPEN GRAPH DATA
  ======================= */
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  /* =======================
     FETCH DATA
  ======================= */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = `*[_type == "portfolioItem"] | order(publishedAt desc) {
          _id,
          title,
          projectStatus,
          "slug": slug.current,
          "imageUrl": coverImage.asset->url,
          "projectUrl": projectUrl,
          "categories": categories[]->{
            title,
            "slug": slug.current,
            "parent": parent->title
          }
        }`;

        const data: Project[] = await client.fetch(query);
        setProjects(data);
      } catch (error) {
        console.error('Error fetching data from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleExplore = async (slug: string) => {
    setIsDetailLoading(true);
    try {
      const query = `*[_type == "portfolioItem" && slug.current == $slug][0] {
      ...,
      "imageUrl": coverImage.asset->url,
      "gallery": gallery[].asset->url,
      "categories": categories[]->{ title, "slug": slug.current },
      "relatedJournal": relatedJournal[]->{ title, "slug": slug.current },
      "relatedDocs": relatedDocs[]->{ title, "slug": slug.current }
    }`;

      // TypeScript sekarang tau 'data' adalah 'Project' atau 'null'
      const data: Project | null = await client.fetch(query, { slug });
      setSelectedProject(data);

      // UPDATE: Mengubah URL di browser tanpa reload halaman
      window.history.pushState(null, '', `/projects/${slug}`);
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closePanel = () => {
    setSelectedProject(null);
    window.history.pushState(null, '', '/projects'); // Balikin URL ke asal
  };

  /* =======================
     RENDER
  ======================= */

  return (
    <main
      className={`${styles.mainBackground} ${darkMode ? styles.darkModeActive : ''
        }`}
    >
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* STATUS FILTER */}
      <div className={styles.filterContainer}>
        {['all', 'completed', 'ongoing'].map((status) => (
          <button
            key={status}
            onClick={() =>
              setFilter(status as 'all' | 'completed' | 'ongoing')
            }
            className={`${styles.filterTab} ${filter === status ? styles.activeTab : ''
              }`}
          >
            {status.toUpperCase()}
            {filter === status && (
              <motion.div
                layoutId="underline"
                className={styles.activeUnderline}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* CATEGORY FILTER */}
      <div className={styles.categoryFilterContainer}>
        {availableCategories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategoryFilter(cat)}
            className={`${styles.categoryTab} ${categoryFilter === cat ? styles.activeCategory : ''
              }`}
          >
            {/* Background Pill yang gerak pas diklik */}
            {categoryFilter === cat && (
              <motion.div
                layoutId="activeCategoryPill"
                className={styles.activeCategoryBg}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <span className={styles.categoryTabText}>
              {cat === 'all' ? '📁 ALL PROJECTS' : cat.toUpperCase()}
            </span>
          </motion.button>
        ))}
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loader}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className={styles.spinner}
            />
            <p className={styles.loadingState}>
              Loading Nawa&apos;s Projects...
            </p>
          </div>
        ) : (
          <div className={styles.projectGrid}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${styles.projectCard} ${darkMode ? styles.cardDark : ''
                    }`}
                >
                  <motion.div
                    className={styles.visualEffect}
                    animate={{
                      backgroundColor: darkMode ? '#190b61' : '#ff85e5',
                      scale: darkMode ? 1.5 : 1,
                      x: darkMode ? '120' : '-60',
                    }}
                    transition={{ duration: 0.8, ease: 'circOut' }}
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
                      <span className={styles.statusBadge}>
                        {project.projectStatus}
                      </span>

                      <div className={styles.cardCategoryList}>
                        {project.categories?.map((cat) => (
                          <span key={cat.slug} className={styles.miniTag}>
                            #{cat.title}
                          </span>
                        ))}
                      </div>

                      <h3 className={styles.cardTitle}>{project.title}</h3>
                    </div>

                    <button
                      className={styles.detailButton}
                      onClick={() => handleExplore(project.slug)}
                    >
                      {isDetailLoading && selectedProject?.slug === project.slug ? 'Opening...' : 'See more details'} <span>→</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlayBackdrop}
            onClick={() => closePanel()} // Klik luar buat nutup
          >
            <motion.div
              initial={{ x: '100%' }} // Muncul dari kanan ala panel
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className={styles.detailPanel}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closePanel}
                onClick={() => closePanel()}>✕ Close</button>
              <h2 className={styles.panelTitle}>{selectedProject.title}</h2>
              {selectedProject.projectUrl && (
                <motion.a
                  href={selectedProject.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaDetailLinkButton}
                  whileHover={{ scale: 1.02, opacity: 1 }}
                  whileTap={{ scale: 0.98, opacity: 1 }}
                >
                  Visit Live Project <span>↗</span>
                </motion.a>
              )}
              <div className={styles.projectBody}>
                {selectedProject.description ? (
                  <PortableText
                    value={selectedProject.description}
                    components={portableTextComponents}
                  />
                ) : (
                  <p>No description available.</p>
                )}
              </div>
              <div className={styles.panelCategoryWrapper}>
                <p className={styles.panelLabel}>Classified Under:</p>
                <div className={styles.panelCategoryList}>
                  {selectedProject.categories?.map((cat) => (
                    <button
                      key={cat.slug}
                      className={styles.panelCategoryTag}
                      onClick={() => {
                        setCategoryFilter(cat.title); 
                        closePanel();
                      }}
                    >
                      # {cat.title.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACK BUTTON */}
      <div className={styles.backButtonWrapper}>
        <button
          className={`${styles.backButton} ${darkMode ? styles.darkModeButton : ''
            }`}
          onClick={() => router.push('/')}
        >
          ← Back
        </button>
      </div>
    </main>
  );
}
