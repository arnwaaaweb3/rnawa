import React from 'react';
import styles from './Header.module.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Definisi tipe data props (TypeScript)
interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
  return (
    <header className={`${styles.headerContainer} ${darkMode ? styles.darkMode : ''}`}>
      <motion.div 
        className={styles.visualEffect}
        animate={{
          backgroundColor: darkMode ? '#190b61' : '#ff85e5',
          scale: darkMode ? 1.5 : 1,
          x: darkMode ? '20%' : '-20%',
        }}
        transition={{ duration: 0.8, ease: "circOut" }}
      />

      <h1 className={styles.headerTitle}>Portfolio</h1>
      
      <button onClick={toggleDarkMode} className={styles.darkModeToggle}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={darkMode ? "sun" : "moon"}
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </motion.div>
        </AnimatePresence>
      </button>
    </header>
  );
};