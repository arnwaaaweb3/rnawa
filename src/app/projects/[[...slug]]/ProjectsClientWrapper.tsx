// src/app/projects/[[...slug]]/ProjectsClientWrapper.tsx
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
import { StatusFilter } from '@/components/StatusFilter';
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(initialSelected);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMediaTooltip, setShowMediaTooltip] = useState(false);

  // Filter Hook: status (completed/ongoing/concept) & media type (video/pdf/github/etc)
  const {
    filter,
    setFilter,
    mediaFilter,
    setMediaFilter,
    filteredProjects,
  } = useProjectFilters(projects);

  const isDark = theme === 'dark';
  const containerClass = `${styles.mainBackground} ${mounted && isDark ? styles.darkModeActive : ''}`;

  // =========================
  // Actions
  // =========================

  const handleExplore = async (projectSlug: string) => {
    setIsDetailLoading(true);
    try {
      const data = await fetchSingleProject(projectSlug);
      setSelectedProject(data);
      // Update URL tanpa reload full page
      window.history.pushState(null, '', `/projects/${projectSlug}`);
    } catch (err) {
      console.error("Morta says: Gagal ambil data project! Cek koneksi atau GROQ-mu.", err);
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

  if (!mounted) return <div className={styles.mainBackground} />;

  return (
    <>
      <main className={containerClass}>
        {/* Header Section */}
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

        {/* Status Filter Tabs - Clean & Modular */}
        <StatusFilter 
          currentFilter={filter} 
          onFilterChange={setFilter} 
        />

        {/* Media Type Filter (Drawer) */}
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

        {/* Project Grid */}
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

        {/* Project Detail Overlay */}
        <ProjectDetailPanel
          project={selectedProject}
          onClose={closePanel}
          onMediaTypeClick={(mediaType) => {
            setMediaFilter(mediaType);
            closePanel();
          }}
        />
      </main>

      {/* Portal for Floating Back Button */}
      {mounted &&
        createPortal(
          <motion.div
            className={styles.backButtonWrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button
              className={`${styles.backButton} ${isDark ? styles.darkModeButton : ''}`}
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