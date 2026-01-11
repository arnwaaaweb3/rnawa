import { motion } from 'framer-motion';
import Image from 'next/image';
import { Project } from './types';
import styles from './page.module.css';

interface ProjectCardProps {
  project: Project;
  index: number;
  darkMode: boolean;
  isDetailLoading: boolean;
  isSelected: boolean;
  onExplore: (slug: string) => void;
}

export const ProjectCard = ({ project, index, darkMode, isDetailLoading, isSelected, onExplore }: ProjectCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className={`${styles.projectCard} ${darkMode ? styles.cardDark : ''}`}
  >
    <motion.div
      className={styles.visualEffect}
      animate={{
        backgroundColor: darkMode ? '#190b61' : '#ff85e5',
        scale: darkMode ? 1.5 : 1,
        x: darkMode ? '120' : '-60',
      }}
      transition={{ duration: 0.8 }}
    />
    {project.imageUrl && (
      <div className={styles.imageWrapper}>
        <Image src={project.imageUrl} alt={project.title} fill className={styles.cardImage} />
      </div>
    )}
    <div className={styles.cardInfo}>
      <div className={styles.cardHeader}>
        <span className={styles.statusBadge}>{project.projectStatus}</span>
        <div className={styles.cardCategoryList}>
          {project.categories?.map((cat) => (
            <span key={cat.slug} className={styles.miniTag}>#{cat.title}</span>
          ))}
        </div>
        <h3 className={styles.cardTitle}>{project.title}</h3>
      </div>
      <button className={styles.detailButton} onClick={() => onExplore(project.slug)}>
        {isDetailLoading && isSelected ? 'Opening...' : 'See more details'} <span>→</span>
      </button>
    </div>
  </motion.div>
);