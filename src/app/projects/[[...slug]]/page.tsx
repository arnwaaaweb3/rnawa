'use client';

// =========== Import
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../../../components/layout/HeaderProjects';
import styles from '../[[...slug]]/page.module.css';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryDrawer } from '../../../components/ui/CategoryDrawer';
import { Category, Project } from '@/app/projects/[[...slug]]/types';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailPanel } from './ProjectDetailPanel';
import { useTheme } from '@/context/ThemeContext';

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
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing' | 'concept'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { setIsSidebarOpen, setIsProjectDetailOpen } = useTheme();
  const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);

  const availableCategories = useMemo(() => {
    return [
      'all',
      ...new Set(
        projects.flatMap((p) => p.categories?.map((c: Category) => c.title) || [])
      ),
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchStatus = filter === 'all' || project.projectStatus === filter;
      const matchCategory =
        categoryFilter === 'all' ||
        project.categories?.some(
          (c) => c.title === categoryFilter || c.parent === categoryFilter
        );
      return matchStatus && matchCategory;
    });
  }, [projects, filter, categoryFilter]);

  const closePanel = () => {
    setSelectedProject(null);
    window.history.pushState(null, '', '/projects');
  };

  // 2. AFTER: handleExplore sekarang cuma panggil query via variabel
  const handleExplore = async (projectSlug: string) => {
    setIsDetailLoading(true);
    try {
      // Panggil fungsi dari actions.ts
      const data = await fetchSingleProject(projectSlug);
      setSelectedProject(data);
      window.history.pushState(null, '', `/projects/${projectSlug}`);
    } catch (err) {
      console.error("Gagal explore, otak lo konslet!", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // =========== Effect
  useEffect(() => {
    if (slug) {
      handleExplore(slug);
    } else {
      setSelectedProject(null);
    }
  }, [slug]);

  // 3. AFTER: fetchProjects sekarang panggil PROJECTS_QUERY (Bersih!)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Panggil fungsi dari actions.ts
        const data = await fetchAllProjects();
        setProjects(data);
      } catch (err) {
        console.error("Gagal fetch project list!", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (slug) {
      setIsSidebarOpen(false);
      setIsProjectDetailOpen(true);
    } else {
      setIsProjectDetailOpen(false);
    }
  }, [slug, setIsSidebarOpen, setIsProjectDetailOpen]);

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
          <div className={styles.loader}>Loading…</div>
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