'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../../../components/layout/HeaderProjects';
import styles from '../[[...slug]]/page.module.css';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryDrawer } from '../../../components/ui/CategoryDrawer';
import { Category, Project } from '@/app/projects/[[...slug]]/types';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailPanel } from './ProjectDetailPanel';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

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
        projects.flatMap((p: Project) => p.categories?.map((c: Category) => c.title) || [])
      ),
    ];
  }, [projects]);

  const closePanel = () => {
    setSelectedProject(null);
    window.history.pushState(null, '', '/projects');
  };

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

      <CategoryDrawer
        categories={availableCategories}
        activeCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        darkMode={darkMode}
      />

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
              {filteredProjects.map((p, i) => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  index={i}
                  darkMode={darkMode}
                  isDetailLoading={isDetailLoading}
                  isSelected={selectedProject?.slug === p.slug}
                  onExplore={handleExplore}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ProjectDetailPanel 
        project={selectedProject} 
        onClose={closePanel} 
        onCategoryClick={(cat) => { 
          setCategoryFilter(cat); 
          closePanel(); }} 
      />

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
