'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/GitHub.module.css';

interface FileSearchProps {
  isSearchOpen: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function FileSearch({
  isSearchOpen,
  searchQuery,
  setSearchQuery,
}: FileSearchProps) {
  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={styles.searchSection}
        >
          <input
            type="text"
            placeholder="Type to search files..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}