'use client';

import React from 'react';
import { 
    FaStar, 
    FaCodeBranch, 
    FaEye, 
    FaUser, 
    FaBoxOpen, 
    FaBalanceScale 
} from 'react-icons/fa';
import { GoClock } from 'react-icons/go';
import styles from '@/styles/GitHub.module.css';

interface RepoMetadataProps {
  metadata: {
    stars: number;
    forks: number;
    watchers: number;
    owner: string;
    branch: string;
    size: number;
    updatedAt: string;
    license: string;
  } | null;
}

export default function RepoMetadata({ metadata }: RepoMetadataProps) {
  if (!metadata) return null;

  return (
    <div className={styles.metaContainer}>
      <div className={styles.metaRow}>
        <span title="Stars">
          <FaStar style={{ color: '#ffb700', marginRight: '4px' }} /> {metadata.stars}
        </span>
        <span title="Forks">
          <FaCodeBranch style={{ color: '#8b949e', marginRight: '4px' }} /> {metadata.forks}
        </span>
        <span title="Watchers">
          <FaEye style={{ color: '#58a6ff', marginRight: '4px' }} /> {metadata.watchers}
        </span>
      </div>

      <div className={styles.metaDetail}>
        <p>
          <FaUser className={styles.metaIcon} /> Owner:
          <span>{metadata.owner}</span>
        </p>
        <p>
          <FaCodeBranch className={styles.metaIcon} /> Branch:
          <span>{metadata.branch}</span>
        </p>
        <p>
          <FaBoxOpen className={styles.metaIcon} /> Size:
          <span>{(metadata.size / 1024).toFixed(2)} MB</span>
        </p>
        <p>
          <GoClock className={styles.metaIcon} /> Updated:
          <span>{new Date(metadata.updatedAt).toLocaleDateString()}</span>
        </p>
        <p>
          <FaBalanceScale className={styles.metaIcon} /> License:
          <span>{metadata.license}</span>
        </p>
      </div>
    </div>
  );
}