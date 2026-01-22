'use client'

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../styles/GitHub.module.css';

interface GitHubExplorerProps {
  repoPath: string
}

interface TreeItem {
  path: string
  type: 'tree' | 'blob'
}

export default function GitHubExplorer({ repoPath }: GitHubExplorerProps) {
  const [tree, setTree] = useState<TreeItem[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const EXTENSION_MAP: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    sol: 'solidity',
    css: 'css',
    md: 'markdown',
    json: 'json',
    py: 'python',
    go: 'go',
    rs: 'rust',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    yaml: 'yaml',
    yml: 'yaml',
    html: 'html',
    sh: 'bash'
  };

  const repoName = repoPath.split('/').pop();

  // Fetch struktur folder via API Route
  useEffect(() => {
    async function loadTree() {
      try {
        const res = await fetch(`/api/github/tree?repoPath=${repoPath}`);
        if (!res.ok) throw new Error('Failed to fetch GitHub tree!');
        const data = await res.json();
        setTree(data.tree || []);
      } catch (err) {
        console.error('Error loading tree:', err);
      }
    }

    if (repoPath) loadTree();
  }, [repoPath]);

  const handleFileClick = async (path: string) => {
    setLoading(true);
    setSelectedFile(path);

    try {
      const res = await fetch(
        `/api/github/content?repoPath=${repoPath}&filePath=${path}`
      );
      const data = await res.json();

      if (!res.ok) {
        setFileContent(`Error: ${data.error || 'Unknown error'}`);
      } else {
        setFileContent(data.content);
      }
    } catch (err) {
      setFileContent('Network error, check your connection.');
    }

    setLoading(false);
  }

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return EXTENSION_MAP[ext || ''] || 'text';
  };

  return (
    <div className={styles.explorerContainer}>
      <div className={styles.sidebar}>
        <h4 className={styles.sidebarTitle}>
          <span className={styles.repoIcon}>📦</span> {repoName}
        </h4>

        <div className={styles.fileList}>
          {tree.map((item) => (
            <div
              key={item.path}
              className={`${styles.fileItem} 
                ${item.type === 'tree' ? styles.folder : styles.file} 
                ${selectedFile === item.path ? styles.active : ''}`}
              onClick={() =>
                item.type === 'blob' && handleFileClick(item.path)
              }
            >
              {item.type === 'tree' ? '📁' : '📄'} {item.path}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.codeViewer}>
        {selectedFile ? (
          <>
            <div className={styles.codeHeader}>{selectedFile}</div>
            {loading ? (
              <div className={styles.loader}>
                Fetching file content from GitHub ...
              </div>
            ) : (
              <SyntaxHighlighter
                language={getLanguage(selectedFile)}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  height: '100%',
                  background: 'transparent',
                  fontSize: '0.85rem'
                }}
              >
                {fileContent}
              </SyntaxHighlighter>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            Select a file from the repository!
          </div>
        )}
      </div>
    </div>
  )
}
