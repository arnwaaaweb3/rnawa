'use client'

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../styles/GitHub.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import {
  SiPython, SiTypescript, SiJavascript, SiReact,
  SiMarkdown, SiJson, SiCss3, SiHtml5, SiSolidity
} from 'react-icons/si';
import {
  FaStar, FaCodeBranch, FaEye,
  FaUser, FaBalanceScale, FaBoxOpen
} from 'react-icons/fa';
import { GoClock } from 'react-icons/go';
import { VscFile, VscFolder, VscFolderOpened } from 'react-icons/vsc';

// 1. Interface Definition according to Neo standard
interface TreeNode {
  name: string;
  path: string;
  type: 'tree' | 'blob';
  children?: TreeNode[];
}

interface GitHubExplorerProps {
  repoPath: string;
}

const getFileIcon = (filename: string, isOpen?: boolean, isFolder?: boolean) => {
  if (isFolder) {
    return isOpen ? <VscFolderOpened style={{ color: '#ff85e5' }} /> : <VscFolder style={{ color: '#ff85e5' }} />;
  }

  const ext = filename.split('.').pop()?.toLowerCase() || '';

  switch (ext) {
    case 'tsx':
    case 'jsx': return <SiReact style={{ color: '#61dafb' }} />;
    case 'py': return <SiPython style={{ color: '#3776ab' }} />;
    case 'ts': return <SiTypescript style={{ color: '#3178c6' }} />;
    case 'js': return <SiJavascript style={{ color: '#f7df1e' }} />;
    case 'md': return <SiMarkdown style={{ color: '#ffffff' }} />;
    case 'json': return <SiJson style={{ color: '#fdd835' }} />;
    case 'css': return <SiCss3 style={{ color: '#1572b6' }} />;
    case 'html': return <SiHtml5 style={{ color: '#e34f26' }} />;
    case 'sol': return <SiSolidity style={{ color: '#363636' }} />;
    default: return <VscFile style={{ color: '#858585' }} />;
  }
};

// 2. Magic Function: buildTree (Convert FLAT data into NESTED structure)
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

// 3. Recursive Sub-Component: TreeNodeView
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
        <span className={styles.icon}>{getFileIcon(node.name)}</span>
        <span className={styles.fileNameText}>{node.name}</span>
      </div>
    );
  }

  return (
    <div className={styles.folderWrapper}>
      <div className={styles.folderHeader} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.icon}>{getFileIcon(node.name, isOpen, true)}</span>
        <span className={styles.folderNameText}>{node.name}</span>
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

// 4. Main Component
export default function GitHubExplorer({ repoPath }: GitHubExplorerProps) {
  const [nestedTree, setNestedTree] = useState<TreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false); // This is your loading variable
  const [codeError, setCodeError] = useState<string | null>(null); // Added this!
  const repoName = repoPath.split('/').pop();
  const [codeCache, setCodeCache] = useState<Record<string, string>>({});
  const [metadata, setMetadata] = useState<any>(null);

  console.log("DEBUG: repoPath received by component:", repoPath);

  useEffect(() => {
    async function loadTree() {
      // 1. SANITIZE THE STRING (Remove non-ASCII/ghost characters)
      const sanitizedPath = repoPath
        ? repoPath.replace(/[^\x20-\x7E]/g, '').trim()
        : '';

      console.log("DEBUG: Sanitized path:", sanitizedPath);

      if (!sanitizedPath) {
        console.error("DEBUG: Path is empty after sanitization!");
        return;
      }

      try {
        // 2. HIT THE API USING THE CLEAN PATH
        const res = await fetch(`/api/github/tree?repoPath=${sanitizedPath}`);
        const data = await res.json();
        setMetadata(data.metadata);
        setNestedTree(buildTree(data.tree || []));

        console.log("DEBUG: Raw data from API:", data);

        const nested = buildTree(data.tree || []);
        console.log("DEBUG: buildTree result:", nested);

        setNestedTree(nested);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    if (repoPath) loadTree();
  }, [repoPath]);

  const handleFileClick = async (filePath: string) => {
    // Cek Ekstensi File
    const binaryExtensions = ['pyc', 'png', 'jpg', 'jpeg', 'gif', 'pdf', 'exe', 'bin'];
    const ext = filePath.split('.').pop()?.toLowerCase() || '';

    if (binaryExtensions.includes(ext)) {
      setSelectedFile(filePath);
      setFileContent(""); // Kosongin content
      setCodeError(`Preview not available for binary files (.${ext}). Please download it from GitHub.`);
      return;
    }

    setSelectedFile(filePath);
    setCodeError(null);

    // 1. CHECK CACHE: If the code already exists, use it immediately!
    if (codeCache[filePath]) {
      console.log(`DEBUG: Retrieving "${filePath}" from cache. Saving API calls!`);
      setFileContent(codeCache[filePath]);
      return; // Stop here, no need to fetch again.
    }

    // 2. If not in cache, fetch as usual
    setLoading(true);
    setFileContent('');

    const sanitizedRepo = repoPath.replace(/[^\x20-\x7E]/g, '').trim();

    try {
      const res = await fetch(`/api/github/content?repoPath=${sanitizedRepo}&filePath=${filePath}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch code');
      }

      const data = await res.json();

      // 3. SAVE TO CACHE: So the next click won’t trigger loading again
      setCodeCache(prev => ({
        ...prev,
        [filePath]: data.content
      }));

      setFileContent(data.content);
    } catch (err: any) {
      console.error('Fetch code error:', err);
      setCodeError(err.message);
    } finally {
      setLoading(false);
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
        {metadata && (
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
        )}
        <h4 className={styles.sidebarTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaGithub /> {repoName}
        </h4>
        <div className={styles.fileList}>
          <p style={{ color: 'white', fontSize: '10px', marginLeft: '10px' }}>Node Count: {nestedTree.length}</p>

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
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key={selectedFile}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={styles.motionWrapper} // Pastikan ini flex: 1 di CSS kalau perlu
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div className={styles.codeHeader}>📍 {selectedFile}</div>

              {loading ? (
                <div className={styles.loader}>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Fetching code from server...
                  </motion.span>
                </div>
              ) : codeError ? (
                <div className={styles.emptyState} style={{ color: '#ff4d4d' }}>
                  ❌ Error: {codeError}
                </div>
              ) : (
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <SyntaxHighlighter
                    language={getLanguage(selectedFile)}
                    style={vscDarkPlus}
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
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.emptyState}
            >
              <div className={styles.emptyStateContent}>
                Select a file to explore the code.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}