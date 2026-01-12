// src/context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  mounted: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isProjectDetailOpen: boolean; 
  setIsProjectDetailOpen: (open: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // 1. State 'theme' default 'light' (sinkron sama SSR)
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);

  // 2. Efek buat inisialisasi (Cuma jalan sekali pas mount)
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    
    // Biar ESLint nggak ngamuk "cascading", kita cek dulu
    // Kalau emang beda sama default ('light'), baru kita update
    if (saved && saved !== theme) {
      setThemeState(saved);
    }
    
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Cukup sekali pas lahir

  // 3. Efek buat sinkronisasi ke DOM & Storage
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        darkMode: theme === 'dark',
        toggleDarkMode: toggleTheme,
        mounted,
        isSidebarOpen,
        setIsSidebarOpen,
        isProjectDetailOpen,
        setIsProjectDetailOpen
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme kudu neng jero ThemeProvider');
  return ctx;
};