import React from 'react';
import styles from './HeaderProjects.module.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Tambah AnimatePresence biar keren
import { useTheme } from '@/context/ThemeContext';

export const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`${styles.headerContainer} ${darkMode ? styles.darkMode : ''}`}>
      <motion.div 
        className={styles.visualEffect}
        animate={{
          backgroundColor: darkMode ? '#190b61' : '#ff85e5',
          scale: darkMode ? 1.8 : 1,
          x: darkMode ? '30%' : '-10%',
        }}
        transition={{ duration: 0.8, ease: "circOut" }}
      />

      <h1 className={styles.headerTitle}>Projects</h1>
      
      {/* Kasih className biar style-nya jalan! */}
      <button onClick={toggleDarkMode} className={styles.darkModeToggle}>
        <AnimatePresence mode="wait">
          <motion.div
            key={darkMode ? "sun" : "moon"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </motion.div>
        </AnimatePresence>
      </button>
    </header>
  );
};