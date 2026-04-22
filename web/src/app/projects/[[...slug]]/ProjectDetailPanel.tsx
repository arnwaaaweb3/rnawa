// src/app/projects/[[...slug]]/ProjectDetailPanel.tsx
'use client';

import { m, AnimatePresence } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from './PortableTextComponents';
import styles from '@/app/projects/[[...slug]]/styles/ProjectDetailPanel.module.css';
import { useTheme } from '@/context/ThemeContext';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';
import GitHubExplorer from '@/components/github/GitHubExplorer';
import { Project, MediaFilterType } from './types';

interface PanelProps {
  project: Project | null;
  onClose: () => void;
  onMediaTypeClick: (mediaType: MediaFilterType) => void;
}

export const ProjectDetailPanel = ({ project, onClose, onMediaTypeClick }: PanelProps) => {
  const { mounted, theme } = useTheme();
  const [showCloseTooltip, setShowCloseTooltip] = useState(false);

  const darkMode = theme === 'dark';

  // Guard clause buat nunggu hydration & mastiin project ada
  if (!mounted || !project) return null;

  // Logic buat nentuin source PDF
  const pdfUrl = typeof project.pdfFile === 'string'
    ? project.pdfFile
    : project.pdfFile?.asset?.url;

  // Flag buat mode FULL VIEW GITHUB (KIRI)
  const isGithubFullView = !!(project.enableExplorer && project.githubRepo && project.displayType === 'github');

  return (
    <AnimatePresence mode="wait">
      <m.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`${styles.overlayBackdrop} ${darkMode ? styles.darkModeActive : ''}`}
        onClick={onClose}
      >
        {/* 1. CONTAINER MEDIA / GITHUB EXPLORER (KIRI) */}
        {(project.youtubeId || project.posterImage || pdfUrl || isGithubFullView || project.displayType === 'feeds') && (
          <m.div
            key={isGithubFullView ? "github-view" : "media-view"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className={styles.floatingVideoWrapper}
            onClick={(e) => e.stopPropagation()}
          >
            {isGithubFullView ? (
              <div className={styles.fullExplorerContainer}>
                <GitHubExplorer repoPath={project.githubRepo!} />
              </div>
            ) : (
              <>
                {/* VIDEO HANDLER */}
                {project.displayType === 'video' && project.youtubeId && (
                  <iframe
                    src={`https://www.youtube.com/embed/${project.youtubeId}`}
                    title="Project Video"
                    allowFullScreen
                    className={styles.videoFrame}
                  />
                )}

                {/* POSTER & FEEDS HANDLER (IMAGE BASED) */}
                {(project.displayType === 'poster' || project.displayType === 'feeds') && project.posterImage && (
                  <div className={clsx(styles.posterContainer, {
                    [styles.portraitMode]: project.imageOrientation === 'portrait',
                    [styles.landscapeMode]: project.imageOrientation === 'landscape',
                    [styles.squareMode]: project.imageOrientation === 'square' || project.displayType === 'feeds',
                  })}>
                    <Image
                      src={urlFor(project.posterImage).format('webp').quality(80).url()}
                      alt={project.posterImage.alt || 'Project Media'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.posterImageContent}
                      priority
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                )}

                {/* PDF HANDLER */}
                {project.displayType === 'pdf' && pdfUrl && (
                  <div className={styles.pdfContainer}>
                    <iframe src={`${pdfUrl}#toolbar=0`} className={styles.pdfFrame} title="Project PDF" />
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadPdfBtn}>
                      Open PDF in New Tab ↗
                    </a>
                  </div>
                )}
              </>
            )}
          </m.div>
        )}

        {/* 2. DETAIL PANEL (KANAN) */}
        <m.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={styles.detailPanel}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={styles.closePanelWrapper}
            onMouseEnter={() => setShowCloseTooltip(true)}
            onMouseLeave={() => setShowCloseTooltip(false)}
          >
            <button className={styles.closePanel} onClick={onClose}>
              <span className={styles.closeIcon}>✕</span>
              <span className={styles.closeText}>Close</span>
            </button>

            <AnimatePresence>
              {showCloseTooltip && (
                <m.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className={styles.closePanelTooltip}
                >
                  Close this panel
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <h2 className={styles.panelTitle}>{project.title}</h2>

          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaDetailLinkButton}
            >
              Visit Live Project <span>↗</span>
            </a>
          )}

          <div className={styles.projectBody}>
            {project.description && (
              <PortableText value={project.description} components={portableTextComponents} />
            )}

            {!isGithubFullView && project.enableExplorer && project.githubRepo && (
              <div className={styles.githubExplorerWrapper}>
                <h3 className={styles.sectionTitle}>Source Code Explorer</h3>
                <GitHubExplorer repoPath={project.githubRepo} />
              </div>
            )}
          </div>

          <div className={styles.panelCategoryWrapper}>
            <p className={styles.panelLabel}>Classified Under Media:</p>
            <div className={styles.panelCategoryList}>
              <button
                className={styles.panelCategoryTag}
                onClick={() => onMediaTypeClick(project.displayType)}
              >
                # {project.displayType?.toUpperCase() || 'GENERAL'}
              </button>
            </div>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
};