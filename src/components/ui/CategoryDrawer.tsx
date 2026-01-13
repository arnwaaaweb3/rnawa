// src/components/ui/CategoryDrawer.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdFolder, MdClose } from 'react-icons/md';
import styles from './CategoryDrawer.module.css';
import { useTheme } from '@/context/ThemeContext';

interface CategoryDrawerProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryDrawer = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryDrawerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { darkMode, mounted } = useTheme(); // Tambah mounted

  // Gabungne class wrapper
  const drawerClass = `${styles.drawerWrapper} ${
    mounted && darkMode ? styles.darkModeActive : ''
  }`;

  return (
    <div className={drawerClass}>
      {/* Trigger Button */}
      <motion.button
        className={`${styles.drawerTrigger} ${
          isDrawerOpen ? styles.triggerActive : ''
        }`}
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        whileHover={{ scale: 1}}
        whileTap={{ scale: 0.95 }}
      >
        {isDrawerOpen ? <MdClose size={20} /> : <MdFolder size={20} />}
        <span className={styles.drawerLabel}>
          {isDrawerOpen ? 'CLOSE' : 'CATEGORIES'}
        </span>
      </motion.button>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: -20 }}
            animate={{ width: 'auto', opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -20 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className={styles.horizontalDrawer}
          >
            <div className={styles.drawerContent}>
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`${styles.categoryTab} ${
                    activeCategory === cat ? styles.activeCategory : ''
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.categoryTabText}>
                    {cat.toUpperCase()}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};