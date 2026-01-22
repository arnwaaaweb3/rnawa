'use client'

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../styles/GitHub.module.css';

// 1. Definisi Interface sesuai standar Neo
interface TreeNode {
  name: string;
  path: string;
  type: 'tree' | 'blob';
  children?: TreeNode[];
}

interface GitHubExplorerProps {
  repoPath: string;
}

// 2. Fungsi Sakti: buildTree (Ubah FLAT data jadi NESTED)
function buildTree(items: any[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const item of items) {
    const parts = item.path.split('/');
    let currentLevel = root;

    parts.forEach((part: string, index: number) => {
      let existingNode = currentLevel.find(n => n.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: index === parts.length - 1 ? item.type : 'tree',
          children: []
        };
        currentLevel.push(existingNode);
      }

      if (existingNode.children) {
        currentLevel = existingNode.children;
      }
    });
  }
  return root;
}

// 3. Sub-Komponen Recursive: TreeNodeView
function TreeNodeView({ 
  node, 
  onFileClick, 
  selectedFile 
}: { 
  node: TreeNode; 
  onFileClick: (path: string) => void;
  selectedFile: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (node.type === 'blob') {
    return (
      <div 
        className={`${styles.fileItem} ${selectedFile === node.path ? styles.active : ''}`}
        onClick={() => onFileClick(node.path)}
      >
        <span className={styles.icon}>📄</span> {node.name}
      </div>
    );
  }

  return (
    <div className={styles.folderWrapper}>
      <div className={styles.folderHeader} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.icon}>{isOpen ? '📂' : '📁'}</span> {node.name}
      </div>
      {isOpen && (
        <div className={styles.folderChildren}>
          {node.children?.map((child) => (
            <TreeNodeView 
              key={child.path} 
              node={child} 
              onFileClick={onFileClick}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 4. Komponen Utama
export default function GitHubExplorer({ repoPath }: GitHubExplorerProps) {
  const [nestedTree, setNestedTree] = useState<TreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const repoName = repoPath.split('/').pop();

  useEffect(() => {
    async function loadTree() {
      try {
        const res = await fetch(`/api/github/tree?repoPath=${repoPath}`);
        if (!res.ok) throw new Error('Failed to fetch tree');
        const data = await res.json();
        
        // TRANSFORMASI DATA DI SINI
        const nested = buildTree(data.tree || []);
        setNestedTree(nested);
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
      const res = await fetch(`/api/github/content?repoPath=${repoPath}&filePath=${path}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFileContent(data.content);
    } catch (err: any) {
      setFileContent(`Error: ${err.message || 'Gagal load file'}`);
    }
    setLoading(false);
  };

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const map: Record<string, string> = {
      ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
      sol: 'solidity', md: 'markdown', json: 'json', css: 'css', html: 'html'
    };
    return map[ext] || 'javascript';
  };

  return (
    <div className={styles.explorerContainer}>
      <div className={styles.sidebar}>
        <h4 className={styles.sidebarTitle}>📦 {repoName}</h4>
        <div className={styles.fileList}>
          {nestedTree.map((node) => (
            <TreeNodeView 
              key={node.path} 
              node={node} 
              onFileClick={handleFileClick}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      </div>

      <div className={styles.codeViewer}>
        {selectedFile ? (
          <>
            <div className={styles.codeHeader}>📍 {selectedFile}</div>
            {loading ? (
              <div className={styles.loader}>Fetching code from server...</div>
            ) : (
              <SyntaxHighlighter 
                language={getLanguage(selectedFile)} 
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{ margin: 0, height: '100%', background: 'transparent', fontSize: '0.85rem' }}
              >
                {fileContent}
              </SyntaxHighlighter>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>Select a file to explore the code.</div>
        )}
      </div>
    </div>
  );
}