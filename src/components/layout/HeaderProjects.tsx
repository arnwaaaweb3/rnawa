import React, { useState } from 'react';
import styles from './HeaderProjects.module.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Tambah AnimatePresence biar keren
import { useTheme } from '@/context/ThemeContext';

export const Header = () => {
  const { darkMode, toggleDarkMode, mounted } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <header className={`${styles.headerContainer} ${mounted && darkMode ? styles.darkMode : ''}`}>
      {/* Visual effect mung metu nek wis mounted biar transition-e gak kacau */}
      <AnimatePresence>
        {mounted && (
          <motion.div
            className={styles.visualEffect}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              backgroundColor: darkMode ? '#190b61' : '#ff85e5',
              scale: darkMode ? 1.8 : 1,
              x: darkMode ? '30%' : '-10%',
            }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        )}
      </AnimatePresence>

      <h1 className={styles.headerTitle}>Projects</h1>

      <button
        onClick={toggleDarkMode}
        className={styles.darkModeToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ position: 'relative' }} // Tambahkan ini untuk memastikan posisi relatif
      >
        <AnimatePresence mode="wait">
          {/* ICON MUNG DI-RENDER NEK WIS MOUNTED */}
          {mounted ? (
            <motion.div
              key={darkMode ? "sun" : "moon"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </motion.div>
          ) : (
            <div style={{ width: 20, height: 20 }} /> // Placeholder kosong biar server tenang
          )}
        </AnimatePresence>
        {/* --- TOOLTIP ANIMATION --- */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className={styles.tooltip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {darkMode ? "Switch to Light Mode?" : "Switch to Dark Mode?"}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </header>
  );
};