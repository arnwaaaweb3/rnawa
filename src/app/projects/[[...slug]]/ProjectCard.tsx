// src/app/projects/[[...slug]]/ProjectCard.tsx
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Project } from './types';
import styles from '@/app/projects/[[...slug]]/styles/ProjectCard.module.css';
import { useTheme } from '@/context/ThemeContext';

interface ProjectCardProps {
  project: Project;
  index: number;
  isDetailLoading: boolean;
  isSelected: boolean;
  onExplore: (slug: string) => void;
}

export const ProjectCard = ({
  project,
  index,
  isDetailLoading,
  isSelected,
  onExplore,
}: ProjectCardProps) => {
  const { theme, mounted } = useTheme(); 
  const isDark = theme === 'dark';

  return (
    <motion.div
      layout 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05, 
        ease: "easeOut" 
      }}
      className={styles.projectCard}
    >
      <motion.div
        className={styles.visualEffect}
        animate={mounted ? {
          backgroundColor: isDark ? '#190b61' : '#ff85e5',
          scale: isDark ? 0.85 : 1,
          x: isDark ? 120 : -60,
        } : {}} 
        transition={{ duration: 0.8 }}
      />

      {/* Sekarang TS bakal senyum liat ini karena coverImage.asset.url udah divalidasi di types.ts */}
      {project.coverImage?.asset?.url && (
        <div className={styles.imageWrapper}>
          <Image
            src={project.coverImage.asset.url} 
            alt={project.coverImage.alt || project.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.cardImage}
          />
        </div>
      )}

      <div className={styles.cardInfo}>
        <div className={styles.cardHeader}>
          <span className={styles.statusBadge}>
          </span>

          <div className={styles.cardCategoryList}>
            {project.mainCategory && (
              <span className={styles.miniTag}>
                #{project.mainCategory.title}
              </span>
            )}
            
            {project.categories?.map((cat) => (
              <span key={cat.slug} className={styles.miniTag}>
                #{cat.title}
              </span>
            ))}
          </div>

          <h3 className={styles.cardTitle}>{project.title}</h3>
        </div>

        <button
          className={styles.detailButton}
          onClick={() => onExplore(project.slug)}
          disabled={isDetailLoading && isSelected}
        >
          {isDetailLoading && isSelected
            ? 'Opening...'
            : 'See more details'}{' '}
          <span>→</span>
        </button>
      </div>
    </motion.div>
  );
};