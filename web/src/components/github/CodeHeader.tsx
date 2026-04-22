'use client';

import { m } from 'framer-motion';
import { GoFileCode } from 'react-icons/go';
import { FiCopy, FiCheck } from 'react-icons/fi';
import styles from '@/styles/GitHub.module.css';

interface CodeHeaderProps {
  fileName: string | undefined;
  handleCopy: () => Promise<void>;
  copied: boolean;
}

export default function CodeHeader({
  fileName,
  handleCopy,
  copied,
}: CodeHeaderProps) {
  return (
    <div className={styles.codeHeader}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
        <GoFileCode />
        {fileName}
      </span>

      <m.button
        className={styles.copyButton}
        onClick={handleCopy}
        title="Copy code"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        {copied ? <FiCheck /> : <FiCopy />}
        {copied ? 'Copied' : 'Copy'}
      </m.button>
    </div>
  );
}