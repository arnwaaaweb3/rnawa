// src/app/projects/[[...slug]]/ProjectCardSkeleton.tsx
import styles from './styles/ProjectCardSkeleton.module.css';

export const ProjectCardSkeleton = () => (
  <div className={`${styles.card} ${styles.skeletonCard}`}>
    <div className={styles.skeletonImage} />
    <div className={styles.skeletonInfo}>
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonCategory} />
    </div>
  </div>
);