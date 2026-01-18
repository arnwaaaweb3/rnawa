// src/app/projects/[[...slug]]/ProjectDetailPanel.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { Project } from './types';
import { portableTextComponents } from './PortableTextComponents';
import styles from '@/app/projects/[[...slug]]/styles/ProjectDetailPanel.module.css';
import { useTheme } from '@/context/ThemeContext';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import clsx from 'clsx';

interface PanelProps {
  project: Project | null;
  onClose: () => void;
  onCategoryClick: (cat: string) => void;
}

export const ProjectDetailPanel = ({ project, onClose, onCategoryClick }: PanelProps) => {
  const { mounted, darkMode } = useTheme();

  // Guard clause buat nunggu hydration selesai
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {project && (() => {
        /**
         * LOGIC GUARD: 
         * Kita proses pdfUrl di sini karena di scope ini 'project' sudah pasti bukan null.
         * Kita handle tipe data string (dari API route) atau object (dari fetch langsung).
         */
        const pdfUrl = typeof project.pdfFile === 'string'
          ? project.pdfFile
          : project.pdfFile?.asset?.url;

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${styles.overlayBackdrop} ${darkMode ? styles.darkModeActive : ''}`}
            onClick={onClose}
          >
            {/* 1. CONTAINER MEDIA (VIDEO, POSTER, ATAU PDF) */}
            {(project.youtubeId || project.posterImage || pdfUrl) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={styles.floatingVideoWrapper}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Kondisi Video */}
                {project.displayType === 'video' && project.youtubeId && (
                  <iframe
                    src={`https://www.youtube.com/embed/${project.youtubeId}`}
                    title="Project Video"
                    allowFullScreen
                    className={styles.videoFrame}
                  />
                )}

                {/* Kondisi Poster */}
                {project.displayType === 'poster' && project.posterImage && (
                  <div
                    className={clsx(styles.posterContainer, {
                      [styles.portraitMode]: project.imageOrientation === 'portrait',
                      [styles.landscapeMode]: project.imageOrientation === 'landscape',
                      [styles.squareMode]: project.imageOrientation === 'square',
                    })}
                  >
                    <Image
                      src={urlFor(project.posterImage).format('webp').quality(80).url()}
                      alt={project.posterImage.alt || 'Project Poster'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.posterImageContent}
                      priority // Ngilangin warning LCP di console lu
                      style={{ objectFit: 'contain' }} // Biar gambar gak penyet
                    />
                  </div>
                )}

                {/* Kondisi PDF */}
                {project.displayType === 'pdf' && pdfUrl && (
                  <div className={styles.pdfContainer}>
                    <iframe
                      src={`${pdfUrl}#toolbar=0`}
                      className={styles.pdfFrame}
                      title="Project PDF"
                    />
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadPdfBtn}
                    >
                      Open PDF in New Tab ↗
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. DETAIL PANEL (TEXT CONTENT) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={styles.detailPanel}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closePanel} onClick={onClose}>✕ Close</button>
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
              </div>

              <div className={styles.panelCategoryWrapper}>
                <p className={styles.panelLabel}>Classified Under:</p>
                <div className={styles.panelCategoryList}>
                  {project.categories?.map((cat) => (
                    <button
                      key={cat.slug}
                      className={styles.panelCategoryTag}
                      onClick={() => onCategoryClick(cat.title)}
                    >
                      # {cat.title.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
};