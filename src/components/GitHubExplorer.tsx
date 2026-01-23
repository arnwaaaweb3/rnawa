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
  const [loading, setLoading] = useState(false); // Ini variabel loading lu
  const [codeError, setCodeError] = useState<string | null>(null); // Tambahin ini!
  const repoName = repoPath.split('/').pop();

  console.log("DEBUG: repoPath yang masuk ke komponen:", repoPath);

  useEffect(() => {
    async function loadTree() {
      // 1. MANDIIN STRING-NYA (Buang karakter non-ASCII/hantu)
      const sanitizedPath = repoPath
        ? repoPath.replace(/[^\x20-\x7E]/g, '').trim()
        : '';

      console.log("DEBUG: Path yang sudah dimandiin:", sanitizedPath);

      if (!sanitizedPath) {
        console.error("DEBUG: Path kosong setelah dibersihin!");
        return;
      }

      try {
        // 2. TEMBAK API PAKE PATH YANG BERSIH
        const res = await fetch(`/api/github/tree?repoPath=${sanitizedPath}`);
        const data = await res.json();

        console.log("DEBUG: Data mentah dari API:", data);

        const nested = buildTree(data.tree || []);
        console.log("DEBUG: Hasil buildTree:", nested);

        setNestedTree(nested);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    if (repoPath) loadTree();
  }, [repoPath]);

  const handleFileClick = async (filePath: string) => {
    setSelectedFile(filePath);
    setLoading(true); // Pake setLoading, bukan setLoadingCode!
    setCodeError(null);
    setFileContent(''); // Kosongin dulu biar nggak nampilin kode lama

    // BERSIHIN SAMPAHNYA LAGI (Double guard!)
    const sanitizedRepo = repoPath.replace(/[^\x20-\x7E]/g, '').trim();

    try {
      const res = await fetch(`/api/github/content?repoPath=${sanitizedRepo}&filePath=${filePath}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal ambil kode');
      }

      const data = await res.json();
      setFileContent(data.content);
    } catch (err: any) {
      console.error('Fetch code error:', err);
      setCodeError(err.message);
    } finally {
      setLoading(false); // Sinkronin lagi di sini
    }
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
          {/* TULISAN TESTING INI MUNCUL GAK? */}
          <p style={{ color: 'white', fontSize: '10px' }}>Jumlah Node: {nestedTree.length}</p>

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
            ) : codeError ? (
              <div className={styles.emptyState} style={{ color: '#ff4d4d' }}>❌ Error: {codeError}</div>
            ) : (
              <SyntaxHighlighter
                language={getLanguage(selectedFile)}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{ margin: 0, height: '100%', background: 'transparent', fontSize: '0.85rem' }}
              >
                {fileContent || "// No content available"}
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