// src/components/ui/CategoryBar.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from './CategoryBar.module.css';
import { clsx } from 'clsx';
import { MediaTypeDrawer, type MediaType } from './MediaTypeDrawer';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';

interface CategoryBarProps {
  activeCategory: MediaType;
  onSelectCategory: (category: MediaType) => void;
  isOpen: boolean;
  className?: string; 
}

export default function CategoryBar({
  activeCategory,
  onSelectCategory,
  isOpen,
  className
}: CategoryBarProps) {
  const { theme } = useTheme();
  const [showMediaTooltip, setShowMediaTooltip] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, scaleY: 0.8 }}
          animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
          exit={{ height: 0, opacity: 0, scaleY: 0.8 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{ originY: 0, marginBottom: isOpen ? '1.5rem' : 0 }} // Kasih jarak pas kebuka
          className={clsx(
            styles.barContainer,
            theme === 'dark' && styles.darkMode,
            className
          )}
        >
          <div className={styles.contentWrapper}>
            {/* INI YANG LO HAPUS TADI - MASANG LAGI */}
            <h3 className={styles.title}>Category</h3>

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
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={styles.categoryTooltip}
                  >
                    Filter by media type
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}