'use client';

import Image from 'next/image';
import { m, AnimatePresence } from 'framer-motion';
import { GoClock } from 'react-icons/go';
import { VscFolderOpened } from 'react-icons/vsc';
import styles from '@/styles/GitHub.module.css';

interface Commit {
  avatar: string;
  author: string;
  message: string;
  date: string;
}

export interface CommitHistoryProps {
  isCommitsOpen: boolean;
  setIsCommitsOpen: (open: boolean) => void;
  fileCommits: Commit[];
  commitsLoading: boolean;
}

export default function CommitHistory({
  isCommitsOpen,
  setIsCommitsOpen,
  fileCommits,
  commitsLoading,
}: CommitHistoryProps) {
  return (
    <div className={styles.commitHistoryWrapper}>
      <button
        className={styles.commitHeaderButton}
        onClick={() => setIsCommitsOpen(!isCommitsOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GoClock style={{ color: isCommitsOpen ? '#ff85e5' : 'inherit' }} />
          <span>Recent Activity</span>
          {fileCommits.length > 0 && (
            <span className={styles.commitBadge}>{fileCommits.length}</span>
          )}
        </div>
        <m.span
          animate={{ rotate: isCommitsOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <VscFolderOpened />
        </m.span>
      </button>

      <AnimatePresence>
        {isCommitsOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.commitContent}
          >
            {commitsLoading ? (
              <div className={styles.loaderSmall}>Stalking commits...</div>
            ) : fileCommits.length > 0 ? (
              <div className={styles.commitList}>
                {fileCommits.map((c, i) => (
                  <div key={i} className={styles.commitItem}>
                    <Image src={c.avatar} alt={c.author} className={styles.avatarMini} width={32} height={32} />
                    <div className={styles.commitInfo}>
                      <p className={styles.commitMessage}>{c.message}</p>
                      <span className={styles.commitMeta}>
                        {c.author} • {new Date(c.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyCommits}>No recent commits found for this file.</p>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}