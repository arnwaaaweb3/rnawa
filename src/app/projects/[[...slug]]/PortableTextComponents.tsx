// src/app/projects/[[...slug]]/PortableTextComponents.tsx
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Tambah vs nggo light mode
import styles from '@/app/projects/[[...slug]]/styles/PortableTextComponents.module.css';
import { SanityCodeValue } from './types';
import { useTheme } from '@/context/ThemeContext'; // Import theme

const CodeBlock = ({ value }: { value: SanityCodeValue }) => {
  const { darkMode, mounted } = useTheme();

  // Pilih style berdasarkan tema, default ke dark nek durung mounted
  const codeStyle = mounted && !darkMode ? vs : vscDarkPlus;

  if (value.language === 'markdown') {
    return (
      <div className={styles.codeBlockWrapper}>
        <div className={styles.codeFilename}>{value.filename || 'NOTES.md'}</div>
        <div className={`${styles.preBlock} ${styles.markdownContent}`} style={{ padding: '1.5rem' }}>
          <ReactMarkdown>{value.code}</ReactMarkdown>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.codeBlockWrapper}>
      {value.filename && <div className={styles.codeFilename}>{value.filename}</div>}
      <SyntaxHighlighter
        language={value.language || 'typescript'} // Fallback ke TS luwih umum
        style={codeStyle}
        showLineNumbers
        wrapLines
        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
      >
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
};

export const portableTextComponents = {
  types: {
    codeBlock: CodeBlock,
  },
};