// src/context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  // NEW (recommended)
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // LEGACY (backward compatible)
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ===== Utils =====
 */
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
};

const syncThemeToDOM = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

/**
 * ===== Provider =====
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ Single source of truth (NO setState in effect)
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // ✅ Effect ONLY syncs external system (DOM)
  useEffect(() => {
    localStorage.setItem('theme', theme);
    syncThemeToDOM(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        // new API
        theme,
        setTheme,
        toggleTheme,

        // legacy API
        darkMode: theme === 'dark',
        toggleDarkMode: toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * ===== Hook =====
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme harus dipakai di dalam ThemeProvider');
  }
  return ctx;
};
