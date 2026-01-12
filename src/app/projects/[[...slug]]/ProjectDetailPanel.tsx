// src/app/projects/[[...slug]]/ProjectDetailPanel.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { Project } from './types';
import { portableTextComponents } from './PortableTextComponents';
import styles from '@/app/projects/[[...slug]]/styles/ProjectDetailPanel.module.css';
import { useTheme } from '@/context/ThemeContext';

interface PanelProps {
  project: Project | null;
  onClose: () => void;
  onCategoryClick: (cat: string) => void;
}

export const ProjectDetailPanel = ({ project, onClose, onCategoryClick }: PanelProps) => {
  const { mounted } = useTheme();

  // Nek durung mounted, ojo render AnimatePresence/motion dhisik biar gak mismatch atribut
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className={styles.overlayBackdrop} 
          onClick={onClose}
        >
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
              {project.description ? (
                <PortableText value={project.description} components={portableTextComponents} />
              ) : (
                <p className={styles.noDescription}>No description available.</p>
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