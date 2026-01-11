import { motion, AnimatePresence } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { Project } from './types';
import { portableTextComponents } from './PortableTextComponents';
import styles from './page.module.css';

interface PanelProps {
  project: Project | null;
  onClose: () => void;
  onCategoryClick: (cat: string) => void;
}

export const ProjectDetailPanel = ({ project, onClose, onCategoryClick }: PanelProps) => (
  <AnimatePresence>
    {project && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.overlayBackdrop} onClick={onClose}>
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className={styles.detailPanel} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closePanel} onClick={onClose}>✕ Close</button>
          <h2 className={styles.panelTitle}>{project.title}</h2>
          {project.projectUrl && (
            <motion.a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaDetailLinkButton}>
              Visit Live Project <span>↗</span>
            </motion.a>
          )}
          <div className={styles.projectBody}>
            {project.description ? (
              <PortableText value={project.description} components={portableTextComponents} />
            ) : <p>No description available.</p>}
          </div>
          <div className={styles.panelCategoryWrapper}>
            <p className={styles.panelLabel}>Classified Under:</p>
            <div className={styles.panelCategoryList}>
              {project.categories?.map((cat) => (
                <button key={cat.slug} className={styles.panelCategoryTag} onClick={() => onCategoryClick(cat.title)}>
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