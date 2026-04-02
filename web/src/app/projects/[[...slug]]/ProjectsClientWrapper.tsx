'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../../../components/layout/HeaderProjects';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailPanel } from './ProjectDetailPanel';
import { useProjectFilters } from '../hooks/useProjectFilters';
import { useTheme } from '@/context/ThemeContext';
import { fetchSingleProject } from '../actions';
import { Project } from './types';
import CategoryBar from '@/components/ui/CategoryBar';
import { type MediaType } from '@/components/ui/MediaTypeDrawer';
import { createPortal } from 'react-dom';
import { BiSortAlt2 } from 'react-icons/bi';
import { type ProjectStatus } from '@/components/ui/StatusDrawer';
import styles from '../[[...slug]]/styles/ProjectsClientWrapper.module.css';

interface WrapperProps {
  initialProjects: Project[];
  initialSelected: Project | null;
  slug: string | null;
}

export default function ProjectsClientWrapper({
  initialProjects,
  initialSelected,
  slug
}: WrapperProps) {
  const router = useRouter();
  const { theme, mounted, setIsSidebarOpen, setIsProjectDetailOpen } = useTheme();

  // --- STATE BARU CUMA INI ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [projects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(initialSelected);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showThemeTooltip, setShowThemeTooltip] = useState(false);
  const [showFilterTooltip, setShowFilterTooltip] = useState(false);
  const {
    mediaFilter,
    setMediaFilter,
    statusFilter,
    setStatusFilter,
    filteredProjects
  } = useProjectFilters(projects);
  const isDark = theme === 'dark';
  const containerClass = `${styles.mainBackground} ${mounted && isDark ? styles.darkModeActive : ''}`;

  // =========================
  // Actions
  // =========================
  // Ganti handleExplore lo yang kuno itu jadi begini:
  const handleExplore = async (projectSlug: string) => {
    setIsDetailLoading(true);
    try {
      const data = await fetchSingleProject(projectSlug);
      setSelectedProject(data);

      // Pakai router Next.js, jangan manual pushState kayak amatiran
      router.push(`/projects/${projectSlug}`, { scroll: false });
    } catch (err) {
      console.error("Morta: Otakmu atau GROQ yang error?", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Ganti closePanel juga:
  const closePanel = () => {
    setSelectedProject(null);
    router.push('/projects', { scroll: false });
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
        {/* Header Section - Tetap sesuai kode lama lo */}
        <div style={{ position: 'relative' }}>
          <Header onToggleHover={setShowThemeTooltip} />
          <AnimatePresence>
            {showThemeTooltip && (
              <motion.div className={styles.floatingTooltip}>
                {isDark ? 'Light Mode?' : 'Dark Mode?'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- PENYELAMAT: Tombol Toggle & Bar Kontainer --- */}
        <div className={styles.filterSection}>
          <div
            className={styles.filterToggleWrapper}
            onMouseEnter={() => setShowFilterTooltip(true)}
            onMouseLeave={() => setShowFilterTooltip(false)}
          >
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`${styles.filterToggleBtn} ${isFilterOpen ? styles.isOpen : ''}`}
            >
              {isFilterOpen ? (
                <>✕ Close</>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BiSortAlt2 size={16} />
                  <span>Filter & Sort</span>
                </div>
              )}
            </button>

            <AnimatePresence>
              {!isFilterOpen && showFilterTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className={styles.filterTooltip}
                >
                  Filter by format & status
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <CategoryBar
            isOpen={isFilterOpen}
            activeCategory={mediaFilter as MediaType}
            onSelectCategory={setMediaFilter}
            activeStatus={statusFilter as ProjectStatus} // TAMBAHKAN INI
            onSelectStatus={setStatusFilter}             // TAMBAHKAN INI
            className={isFilterOpen ? styles.barContainerAttached : undefined}
          />
        </div>

        {/* Project Grid - Tetap sesuai kode lama lo */}
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

        <ProjectDetailPanel
          project={selectedProject}
          onClose={closePanel}
          onMediaTypeClick={(mediaType) => {
            setMediaFilter(mediaType);
            closePanel();
          }}
        />
      </main>

      {/* Portal Back Button - Tetap sesuai kode lama lo */}
      {mounted && createPortal(
        <motion.div className={styles.backButtonWrapper}>
          <button className={`${styles.backButton} ${isDark ? styles.darkModeButton : ''}`} onClick={() => router.push('/')}>
            ← Back
          </button>
        </motion.div>,
        document.body
      )}
    </>
  );
}