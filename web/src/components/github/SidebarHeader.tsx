'use client';

import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { VscSearch } from 'react-icons/vsc';
import styles from '@/styles/GitHub.module.css';

interface SidebarHeaderProps {
  repoName: string | undefined;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
}

export default function SidebarHeader({
  repoName,
  isSearchOpen,
  setIsSearchOpen,
  setSearchQuery,
}: SidebarHeaderProps) {
  return (
    <div className={styles.sidebarHeader}>
      <div className={styles.sidebarHeaderRow}>
        <h4
          className={styles.sidebarTitle}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', margin: 0 }}
        >
          <FaGithub /> {repoName}
        </h4>

        <button
          className={styles.searchToggleButton}
          onClick={() => {
            setIsSearchOpen(!isSearchOpen);
            if (isSearchOpen) setSearchQuery('');
          }}
        >
          <VscSearch />
        </button>
      </div>
    </div>
  );
}