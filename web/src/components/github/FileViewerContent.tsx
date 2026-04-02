'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguage } from '@/utils/github/getLanguage';
import styles from '@/styles/GitHub.module.css';

interface FileViewerContentProps {
  loading: boolean;
  codeError: string | null;
  fileContent: string;
  selectedFile: string | null;
  metadata: { owner: string; branch: string } | null;
  repoName: string | undefined;
  darkMode: boolean;
}

export default function FileViewerContent({
  loading,
  codeError,
  fileContent,
  selectedFile,
  metadata,
  repoName,
  darkMode,
}: FileViewerContentProps) {
  if (loading) {
    return (
      <div className={styles.loader}>
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Fetching code from server...
        </motion.span>
      </div>
    );
  }

  if (codeError) {
    return <div className={styles.errorState}>❌ Error: {codeError}</div>;
  }

  if (fileContent === "__IMAGE_PREVIEW__") {
    return (
      <div className={styles.imagePreviewContainer}>
        <Image
          src={`https://raw.githubusercontent.com/${metadata?.owner}/${repoName}/${metadata?.branch}/${selectedFile}`}
          alt={selectedFile || 'Preview'}
          className={styles.imageContent}
          width={800}
          height={600}
          unoptimized
        />
        <p className={styles.imagePathText}>{selectedFile}</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <SyntaxHighlighter
        language={getLanguage(selectedFile || '')}
        style={darkMode ? vscDarkPlus : oneLight}
        showLineNumbers
        customStyle={{
          margin: 0,
          minHeight: '100%',
          background: 'transparent',
          fontSize: '0.85rem',
          padding: '20px'
        }}
      >
        {fileContent || "// No content available"}
      </SyntaxHighlighter>
    </div>
  );
}