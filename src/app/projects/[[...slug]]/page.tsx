'use client';

// =========== Import
import React, { useState, useEffect } from 'react';
import { Header } from '../../../components/layout/HeaderProjects';
import styles from '../[[...slug]]/page.module.css';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryDrawer } from '../../../components/ui/CategoryDrawer';
import { Project } from '@/app/projects/[[...slug]]/types';
import { ProjectCard } from './ProjectCard';
import { useProjectFilters } from '../hooks/useProjectFilters';
import { ProjectDetailPanel } from './ProjectDetailPanel';
import { useTheme } from '@/context/ThemeContext';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';

// 1. IMPORT QUERIES (Ini yang bikin bersih, su!)
import { fetchAllProjects, fetchSingleProject } from '../actions';

// =========== Interface
interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

// =========== Constant
export default function ProjectsPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug ? resolvedParams.slug[0] : null;
  const router = useRouter();
  const { theme, mounted } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const isDark = theme === 'dark';
  const containerClass = `${styles.mainBackground} ${mounted && isDark ? styles.darkModeActive : ''}`;
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { setIsSidebarOpen, setIsProjectDetailOpen } = useTheme();
  const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);

  // Gunakan Hook Filter
  const { 
    filter, setFilter, 
    categoryFilter, setCategoryFilter, 
    availableCategories, filteredProjects 
  } = useProjectFilters(projects);

  // FETCH DATA AWAL (CUKUP SATU SAJA!)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchAllProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects!", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleExplore = async (projectSlug: string) => {
    setIsDetailLoading(true);
    try {
      const data = await fetchSingleProject(projectSlug);
      setSelectedProject(data);
      window.history.pushState(null, '', `/projects/${projectSlug}`);
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    if (slug) handleExplore(slug);
    else setSelectedProject(null);
  }, [slug]);

  // Sidebar Logic
  useEffect(() => {
    if (slug) {
      setIsSidebarOpen(false);
      setIsProjectDetailOpen(true);
    } else {
      setIsProjectDetailOpen(false);
    }
  }, [slug, setIsSidebarOpen, setIsProjectDetailOpen]);

  const closePanel = () => {
    setSelectedProject(null);
    window.history.pushState(null, '', '/projects');
  };

  return (
    <main className={containerClass}>
      <div style={{ position: 'relative' }}>
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Header onToggleHover={(isHovering) => setShowTooltip(isHovering)} />
        </div>

        <AnimatePresence>
          {showTooltip && mounted && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={styles.floatingTooltip}
              style={{ pointerEvents: 'none' }}
            >
              {theme === 'dark' ? "Switch to Light Mode?" : "Switch to Dark Mode?"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.filterContainer}>
        {['all', 'completed', 'ongoing', 'concept'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as 'all' | 'ongoing' | 'completed' | 'concept')}
            className={`${styles.filterTab} ${filter === status ? styles.activeTab : ''}`}
          >
            {status.toUpperCase()}
            {filter === status && (
              <motion.div
                layoutId="underline"
                className={styles.activeUnderline}
              />
            )}
          </button>
        ))}
      </div>

      <div
        className={styles.drawerWrapper}
        onMouseEnter={() => setShowCategoryTooltip(true)}
        onMouseLeave={() => setShowCategoryTooltip(false)}
        style={{ position: 'relative', display: 'inline-flex' }}
      >
        <CategoryDrawer
          categories={availableCategories}
          activeCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        <AnimatePresence>
          {showCategoryTooltip && mounted && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={styles.categoryTooltip}
            >
              Search by category
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.projectGrid}>
            {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className={styles.projectGrid}>
            <AnimatePresence>
              {filteredProjects.map((p, i) => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  index={i}
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
          closePanel();
        }}
      />

      <div className={styles.backButtonWrapper}>
        <button
          className={`${styles.backButton} ${mounted && isDark ? styles.darkModeButton : ''}`}
          onClick={() => router.push('/')}
        >
          ← Back
        </button>
      </div>
    </main>
  );
}