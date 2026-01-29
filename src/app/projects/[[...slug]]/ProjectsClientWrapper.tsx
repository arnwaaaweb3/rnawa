'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../../../components/layout/HeaderProjects';
import { MediaTypeDrawer } from '../../../components/ui/MediaTypeDrawer';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailPanel } from './ProjectDetailPanel';
import { useProjectFilters } from '../hooks/useProjectFilters';
import { useTheme } from '@/context/ThemeContext';
import { fetchSingleProject } from '../actions';
import { Project } from './types';
import { createPortal } from 'react-dom';
import styles from '../[[...slug]]/styles/ProjectsClientWrapper.module.css';

interface WrapperProps {
  initialProjects: Project[];
  initialSelected: Project | null;
  slug: string | null;
}

export default function ProjectsClientWrapper({
  initialProjects,
  initialSelected,
  slug,
}: WrapperProps) {
  const router = useRouter();
  const { theme, mounted, setIsSidebarOpen, setIsProjectDetailOpen } = useTheme();

  const [projects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    initialSelected
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMediaTooltip, setShowMediaTooltip] = useState(false);

  /**
   * Filters Hook
   * filter        = project status (completed / ongoing / concept / all)
   * mediaFilter   = displayType (video / poster / pdf / github / feeds)
   */
  const {
    filter,
    setFilter,
    mediaFilter,
    setMediaFilter,
    filteredProjects,
  } = useProjectFilters(projects);

  const isDark = theme === 'dark';
  const containerClass = `${styles.mainBackground} ${
    mounted && isDark ? styles.darkModeActive : ''
  }`;

  // =========================
  // Actions
  // =========================

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

  const closePanel = () => {
    setSelectedProject(null);
    window.history.pushState(null, '', '/projects');
  };

  // =========================
  // Side Effects
  // =========================

  useEffect(() => {
    if (slug) {
      setIsSidebarOpen(false);
      setIsProjectDetailOpen(true);
    } else {
      setIsProjectDetailOpen(false);
      setSelectedProject(null);
    }
  }, [slug, setIsSidebarOpen, setIsProjectDetailOpen]);

  if (!mounted) {
    return <div className={styles.mainBackground} />;
  }

  return (
    <>
      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className={containerClass}>
        {/* Header */}
        <div style={{ position: 'relative' }}>
          <Header onToggleHover={setShowTooltip} />
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={styles.floatingTooltip}
              >
                {isDark ? 'Light Mode?' : 'Dark Mode?'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Filter */}
        <div className={styles.filterContainer}>
          {['all', 'completed', 'ongoing', 'concept'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`${styles.filterTab} ${
                filter === status ? styles.activeTab : ''
              }`}
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

        {/* Media Type Drawer */}
        <div
          className={styles.drawerWrapper}
          onMouseEnter={() => setShowMediaTooltip(true)}
          onMouseLeave={() => setShowMediaTooltip(false)}
        >
          <MediaTypeDrawer
            activeMediaType={mediaFilter}
            onMediaTypeChange={setMediaFilter}
          />

          <AnimatePresence>
            {showMediaTooltip && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={styles.categoryTooltip}
              >
                Filter by media type
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.projectGrid}>
            <AnimatePresence mode="popLayout">
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
        </div>

        {/* Detail Panel */}
        <ProjectDetailPanel
          project={selectedProject}
          onClose={closePanel}
          onMediaTypeClick={(mediaType) => {
            setMediaFilter(mediaType);
            closePanel();
          }}
        />
      </main>

      {/* =========================
          FIXED BACK BUTTON
      ========================= */}
      {mounted &&
        createPortal(
          <motion.div
            className={styles.backButtonWrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button
              className={`${styles.backButton} ${
                isDark ? styles.darkModeButton : ''
              }`}
              onClick={() => router.push('/')}
            >
              ← Back
            </button>
          </motion.div>,
          document.body
        )}
    </>
  );
}
