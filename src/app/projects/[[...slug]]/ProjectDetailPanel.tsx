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

  // Nek durung mounted, ojo render AnimatePresence/motion dhisik biar gak mismatch atribut
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${styles.overlayBackdrop} ${darkMode ? styles.darkModeActive : ''}`}
          onClick={onClose}
        >
          {/* 1. CONTAINER MEDIA (VIDEO ATAU POSTER) */}
          {(project.youtubeId || project.posterImage || project.pdfFile) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={styles.floatingVideoWrapper}
              onClick={(e) => e.stopPropagation()}
            >

              {/* Kondisi Video: Muncul cuma kalau displayType 'video' DAN ada ID-nya */}
              {project.displayType === 'video' && project.youtubeId && (
                <iframe
                  src={`https://www.youtube.com/embed/${project.youtubeId}`}
                  title="Project Video"
                  allowFullScreen
                  className={styles.videoFrame}
                />
              )}

              {/* Kondisi Poster - Pake Dimensi Asli */}
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
                    priority
                  />
                </div>
              )}

              {/* 3. Kondisi PDF - Tambahin Optional Chaining di sini! */}
              {project.displayType === 'pdf' && project.pdfFile?.asset?.url && (
                <div className={styles.pdfContainer}>
                  <iframe
                    src={`${project.pdfFile.asset.url}#toolbar=0`}
                    className={styles.pdfFrame}
                    title="Project PDF"
                  />
                  <a
                    href={project.pdfFile.asset.url}
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
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} // Tambah transition ben luwih 'smooth'
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
      )}
    </AnimatePresence>
  );
};