// src/components/ui/CategoryBar.tsx
'use client';

import { m, AnimatePresence } from 'framer-motion';
import styles from './CategoryBar.module.css';
import { clsx } from 'clsx';
import { MediaTypeDrawer, type MediaType } from './MediaTypeDrawer';
import { StatusDrawer, type ProjectStatus } from './StatusDrawer'; // Import ini!
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';

interface CategoryBarProps {
  activeCategory: MediaType;
  onSelectCategory: (category: MediaType) => void;
  activeStatus: ProjectStatus; // Tambahin ini di interface
  onSelectStatus: (status: ProjectStatus) => void; // Dan ini
  isOpen: boolean;
  className?: string;
}

export default function CategoryBar({
  activeCategory,
  onSelectCategory,
  activeStatus,
  onSelectStatus,
  isOpen,
  className
}: CategoryBarProps) {
  const { theme } = useTheme();
  const [showMediaTooltip, setShowMediaTooltip] = useState(false);
  const [showStatusTooltip, setShowStatusTooltip] = useState(false); // Tooltip baru buat status

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ height: 0, opacity: 0, scaleY: 0.8 }}
          animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
          exit={{ height: 0, opacity: 0, scaleY: 0.8 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{ originY: 0, marginBottom: isOpen ? '1.5rem' : 0 }}
          className={clsx(
            styles.barContainer,
            theme === 'dark' && styles.darkMode,
            className
          )}
        >
          <div className={styles.contentWrapper}>
            {/* SECTION 2 MEDIA TYPE */}
            <div className={styles.section}>
              <h3 className={styles.title}>Category :</h3>
              {/* SECTION 1 PROJECT STATUS */}
              <div className={styles.section}>
                <div
                  className={styles.drawerWrapper}
                  onMouseEnter={() => setShowStatusTooltip(true)}
                  onMouseLeave={() => setShowStatusTooltip(false)}
                >
                  <StatusDrawer
                    activeStatus={activeStatus}
                    onStatusChange={onSelectStatus}
                  />

                  <AnimatePresence>
                    {showStatusTooltip && (
                      <m.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={styles.categoryTooltip}
                      >
                        Filter by project status
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div
                className={styles.drawerWrapper}
                onMouseEnter={() => setShowMediaTooltip(true)}
                onMouseLeave={() => setShowMediaTooltip(false)}
              >
                <MediaTypeDrawer
                  activeMediaType={activeCategory}
                  onMediaTypeChange={onSelectCategory}
                />

                <AnimatePresence>
                  {showMediaTooltip && (
                    <m.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={styles.categoryTooltip}
                    >
                      Filter by media type
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}