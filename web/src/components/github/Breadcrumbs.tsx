'use client';

import React from 'react';
import styles from '@/styles/GitHub.module.css';

interface BreadcrumbsProps {
  breadcrumbs: string[];
}

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  if (breadcrumbs.length === 0) return null;

  return (
    <div className={styles.breadcrumbContainer}>
      {breadcrumbs.map((part, index) => (
        <React.Fragment key={index}>
          <span
            className={
              index === breadcrumbs.length - 1
                ? styles.breadcrumbActive
                : styles.breadcrumbItem
            }
          >
            {part}
          </span>
          {index < breadcrumbs.length - 1 && (
            <span className={styles.breadcrumbSeparator}>/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}