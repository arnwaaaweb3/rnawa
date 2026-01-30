'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/StatusFilter.module.css';

interface StatusFilterProps {
  currentFilter: 'all' | 'completed' | 'ongoing' | 'concept';
  onFilterChange: (status: 'all' | 'completed' | 'ongoing' | 'concept') => void;
}

const STATUS_OPTIONS = ['all', 'completed', 'ongoing', 'concept'] as const;

export const StatusFilter = ({ currentFilter, onFilterChange }: StatusFilterProps) => {
  return (
    <div className={styles.filterContainer}>
      {STATUS_OPTIONS.map((status) => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          className={`${styles.filterTab} ${currentFilter === status ? styles.activeTab : ''}`}
        >
          {status.toUpperCase()}
          {currentFilter === status && (
            <motion.div
              layoutId="status-underline" // Pakai ID yang unik agar tidak bentrok dengan layoutId lain
              className={styles.activeUnderline}
            />
          )}
        </button>
      ))}
    </div>
  );
};