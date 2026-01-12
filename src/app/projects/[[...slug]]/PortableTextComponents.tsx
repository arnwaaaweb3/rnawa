import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '@/app/projects/[[...slug]]/styles/PortableTextComponents.module.css';
import { SanityCodeValue } from './types';

export const portableTextComponents = {
  types: {
    codeBlock: ({ value }: { value: SanityCodeValue }) => {
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
            language={value.language || 'solidity'}
            style={vscDarkPlus}
            showLineNumbers wrapLines
            lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
          >
            {value.code}
          </SyntaxHighlighter>
        </div>
      );
    },
  },
};