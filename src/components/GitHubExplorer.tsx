'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getFromLocal, saveToLocal, initDB } from '@/utils/storage';

import styles from '../styles/GitHub.module.css';

import { FaGithub } from 'react-icons/fa';
import {
  FaStar,
  FaCodeBranch,
  FaEye,
  FaUser,
  FaBalanceScale,
  FaBoxOpen,
} from 'react-icons/fa';
import { GoClock, GoFileCode } from 'react-icons/go';
import {
  VscFile,
  VscFolder,
  VscFolderOpened,
  VscSearch,
} from 'react-icons/vsc';
import { FiCopy, FiCheck } from 'react-icons/fi';

import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiMarkdown,
  SiJson,
  SiCss3,
  SiHtml5,
  SiSolidity,
} from 'react-icons/si';

/* ===================== INTERFACES ===================== */

interface TreeNode {
  name: string;
  path: string;
  type: 'tree' | 'blob';
  children?: TreeNode[];
}

interface GitHubExplorerProps {
  repoPath: string;
}

/* ===================== ICON RESOLVER ===================== */

const getFileIcon = (
  filename: string,
  isOpen?: boolean,
  isFolder?: boolean
) => {
  if (isFolder) {
    return isOpen ? (
      <VscFolderOpened style={{ color: '#ff85e5' }} />
    ) : (
      <VscFolder style={{ color: '#ff85e5' }} />
    );
  }

  const ext = filename.split('.').pop()?.toLowerCase() || '';

  switch (ext) {
    case 'tsx':
    case 'jsx':
      return <SiReact style={{ color: '#61dafb' }} />;
    case 'py':
      return <SiPython style={{ color: '#3776ab' }} />;
    case 'ts':
      return <SiTypescript style={{ color: '#3178c6' }} />;
    case 'js':
      return <SiJavascript style={{ color: '#f7df1e' }} />;
    case 'md':
      return <SiMarkdown style={{ color: '#ffffff' }} />;
    case 'json':
      return <SiJson style={{ color: '#fdd835' }} />;
    case 'css':
      return <SiCss3 style={{ color: '#1572b6' }} />;
    case 'html':
      return <SiHtml5 style={{ color: '#e34f26' }} />;
    case 'sol':
      return <SiSolidity style={{ color: '#363636' }} />;
    default:
      return <VscFile style={{ color: '#858585' }} />;
  }
};

/* ===================== TREE BUILDERS ===================== */

function buildTree(items: any[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const item of items) {
    const parts = item.path.split('/');
    let currentLevel = root;

    parts.forEach((part: string, index: number) => {
      let existingNode = currentLevel.find((n) => n.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: index === parts.length - 1 ? item.type : 'tree',
          children: [],
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

function flattenTree(nodes: TreeNode[]): TreeNode[] {
  let flat: TreeNode[] = [];

  nodes.forEach((node) => {
    if (node.type === 'blob') {
      flat.push(node);
    }

    if (node.children && node.children.length > 0) {
      flat = [...flat, ...flattenTree(node.children)];
    }
  });

  return flat;
}

/* ===================== TREE VIEW COMPONENT ===================== */

function TreeNodeView({
  node,
  onFileClick,
  selectedFile,
}: {
  node: TreeNode;
  onFileClick: (path: string) => void;
  selectedFile: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (node.type === 'blob') {
    return (
      <div
        className={`${styles.fileItem} ${selectedFile === node.path ? styles.active : ''
          }`}
        onClick={() => onFileClick(node.path)}
      >
        <span className={styles.icon}>{getFileIcon(node.name)}</span>
        <span className={styles.fileNameText}>{node.name}</span>
      </div>
    );
  }

  return (
    <div className={styles.folderWrapper}>
      <div
        className={styles.folderHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.icon}>
          {getFileIcon(node.name, isOpen, true)}
        </span>
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

/* ===================== MAIN COMPONENT ===================== */

export default function GitHubExplorer({ repoPath }: GitHubExplorerProps) {
  const { darkMode } = useTheme();

  const [nestedTree, setNestedTree] = useState<TreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeCache, setCodeCache] = useState<Record<string, string>>({});
  const [metadata, setMetadata] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [fileCommits, setFileCommits] = useState<any[]>([]);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [isCommitsOpen, setIsCommitsOpen] = useState(false);

  const repoName = repoPath.split('/').pop();

  console.log('DEBUG: repoPath received by component:', repoPath);

  /* ===================== LOAD TREE ===================== */

  useEffect(() => {
    async function loadTree() {
      const sanitizedPath = repoPath
        ? repoPath.replace(/[^\x20-\x7E]/g, '').trim()
        : '';

      console.log('DEBUG: Sanitized path:', sanitizedPath);

      if (!sanitizedPath) {
        console.error('DEBUG: Path is empty after sanitization!');
        return;
      }

      try {
        const res = await fetch(`/api/github/tree?repoPath=${sanitizedPath}`);
        const data = await res.json();

        setMetadata(data.metadata);

        console.log('DEBUG: Raw data from API:', data);

        const nested = buildTree(data.tree || []);
        console.log('DEBUG: buildTree result:', nested);

        setNestedTree(nested);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    if (repoPath) loadTree();
  }, [repoPath]);

  /* ===================== PREFETCH ===================== */

  useEffect(() => {
    if (nestedTree.length > 0) {
      const filesToPrefetch = nestedTree
        .filter((node) => node.type === 'blob')
        .slice(0, 5);

      filesToPrefetch.forEach(async (file) => {
        const exists = await getFromLocal(file.path);

        if (!exists) {
          console.log(`[Prefetch] Ambil data buat: ${file.name}`);

          fetch(
            `/api/github/content?repoPath=${repoPath}&filePath=${file.path}`
          )
            .then((res) => res.json())
            .then((data) => saveToLocal(file.path, data.content));
        }
      });
    }
  }, [nestedTree]);

  /* ===================== FILE CLICK ===================== */
  const handleFileClick = async (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
    const binaryExtensions = ['pyc', 'pdf', 'exe', 'bin', 'zip', 'rar'];

    // 1. Reset State & UI awal
    setSelectedFile(filePath);
    setCodeError(null);

    // 2. Handle Image Preview
    if (imageExtensions.includes(ext)) {
      setFileContent('__IMAGE_PREVIEW__');
      return;
    }

    // 3. Handle Binary Files
    if (binaryExtensions.includes(ext)) {
      setFileContent('');
      setCodeError(`Preview not available for binary files (.${ext}). Please download it from GitHub.`);
      return;
    }

    // 4. Cek State Cache (RAM) - Paling cepet
    if (codeCache[filePath]) {
      console.log(`[Cache] Loading "${filePath}" from state.`);
      setFileContent(codeCache[filePath]);
      return;
    }

    // 5. Mulai proses "berat", aktifin Loading
    setLoading(true);
    setFileContent('');

    try {
      // 6. Cek IndexedDB (Local Storage)
      await initDB();
      const localContent = await getFromLocal(filePath);

      if (localContent) {
        console.log(`[IndexedDB] Loading "${filePath}" from local storage`);
        setFileContent(localContent);
        setCodeCache((prev) => ({ ...prev, [filePath]: localContent }));
        setLoading(false); // Langsung kelar kalau ketemu
        return;
      }

      // 7. Kalau ga ada di Local, baru Fetch ke API
      const sanitizedRepo = repoPath.replace(/[^\x20-\x7E]/g, '').trim();
      const res = await fetch(
        `/api/github/content?repoPath=${sanitizedRepo}&filePath=${filePath}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch code');
      }

      const data = await res.json();

      // Update State & Simpan ke IndexedDB buat kunjungan berikutnya
      setFileContent(data.content);
      setCodeCache((prev) => ({ ...prev, [filePath]: data.content }));

      // Simpan di background, ga perlu diawait biar ga ngeblock UI
      saveToLocal(filePath, data.content).catch((e) =>
        console.error('Gagal simpan ke DB:', e)
      );

      const fetchCommits = async (path: string) => {
        setCommitsLoading(true);
        try {
          const sanitizedRepo = repoPath.replace(/[^\x20-\x7E]/g, '').trim();
          const res = await fetch(`/api/github/commits?repoPath=${sanitizedRepo}&filePath=${path}`);
          const data = await res.json();
          setFileCommits(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Gagal stalking commit:", err);
        } finally {
          setCommitsLoading(false);
        }
      };

      // Panggil di dalem handleFileClick sebelum atau sesudah fetch content
      fetchCommits(filePath);

    } catch (err: any) {
      console.error('File access error:', err);
      setCodeError(err.message);
    } finally {
      // 8. Pastikan loading mati di kondisi apapun (error/success)
      setLoading(false);
    }
  };

  /* ===================== UTILITIES ===================== */

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    const map: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      sol: 'solidity',
      md: 'markdown',
      json: 'json',
      css: 'css',
      html: 'html',
    };

    return map[ext] || 'javascript';
  };

  const handleCopy = async () => {
    if (!fileContent) return;

    try {
      await navigator.clipboard.writeText(fileContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy the code:', err);
    }
  };

  const allFiles = useMemo(() => flattenTree(nestedTree), [nestedTree]);

  const filteredNodes = allFiles.filter((node) =>
    node.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbs = selectedFile ? selectedFile.split('/') : [];

  return (
    <div className={`${styles.explorerContainer} ${darkMode ? 'darkModeActive' : ''}`}>

      {/* ===================== SIDEBAR ===================== */}
      <div className={styles.sidebar}>

        {/* ===== METADATA ===== */}
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

        {/* ===== SIDEBAR HEADER ===== */}
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarHeaderRow}>
            <h4
              className={styles.sidebarTitle}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', margin: 0 }}
            >
              <FaGithub /> {repoName}
            </h4>

            <button
              className={styles.searchToggleButton}
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) setSearchQuery('');
              }}
            >
              <VscSearch />
            </button>
          </div>
        </div>

        {/* ===== SEARCH SECTION ===== */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={styles.searchSection}
            >
              <input
                type="text"
                placeholder="Type to search files..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== FILE LIST ===== */}
        <div className={styles.fileList}>
          {searchQuery ? (
            <div className={styles.searchResults}>
              <p className={styles.nodeCount}>Found {filteredNodes.length} files</p>

              {filteredNodes.length > 0 ? (
                filteredNodes.map((node) => (
                  <div
                    key={node.path}
                    className={`${styles.fileItem} ${selectedFile === node.path ? styles.active : ''}`}
                    onClick={() => handleFileClick(node.path)}
                  >
                    <span className={styles.icon}>{getFileIcon(node.name)}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span className={styles.fileNameText}>{node.name}</span>
                      {/* Info path biar user tahu file ini ada di mana */}
                      <span style={{ fontSize: '0.65rem', opacity: 0.5, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {node.path}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptySearchText}>No file were found.</p>
              )}
            </div>
          ) : (
            nestedTree.map((node) => (
              <TreeNodeView key={node.path} node={node} onFileClick={handleFileClick} selectedFile={selectedFile} />
            ))
          )}
        </div>
      </div>

      {/* ===================== CODE VIEWER ===================== */}
      <div className={styles.codeViewer}>
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key={selectedFile}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={styles.motionWrapper}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {selectedFile && (
                <div className={styles.breadcrumbContainer}>
                  {breadcrumbs.map((part, index) => (
                    <React.Fragment key={index}>
                      <span
                        className={index === breadcrumbs.length - 1 ? styles.breadcrumbActive : styles.breadcrumbItem}
                      >
                        {part}
                      </span>
                      {index < breadcrumbs.length - 1 && (
                        <span className={styles.breadcrumbSeparator}>/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* ===================== RECENT ACTIVITY (COLLAPSIBLE) ===================== */}
              <div className={styles.commitHistoryWrapper}>
                <button
                  className={styles.commitHeaderButton}
                  onClick={() => setIsCommitsOpen(!isCommitsOpen)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GoClock style={{ color: isCommitsOpen ? '#ff85e5' : 'inherit' }} />
                    <span>Recent Activity</span>
                    {fileCommits.length > 0 && <span className={styles.commitBadge}>{fileCommits.length}</span>}
                  </div>
                  <motion.span
                    animate={{ rotate: isCommitsOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VscFolderOpened /> {/* Atau pake icon arrow down bebas lo */}
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isCommitsOpen && (
                    <motion.div
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
                              <img src={c.avatar} alt={c.author} className={styles.avatarMini} />
                              <div className={styles.commitInfo}>
                                <p className={styles.commitMessage}>{c.message}</p>
                                <span className={styles.commitMeta}>{c.author} • {new Date(c.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.emptyCommits}>No recent commits found for this file.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ===== CODE HEADER ===== */}
              <div className={styles.codeHeader}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <GoFileCode />
                  {/* Ambil elemen terakhir dari array breadcrumbs (nama filenya saja) */}
                  {breadcrumbs[breadcrumbs.length - 1]}
                </span>

                <motion.button
                  className={styles.copyButton}
                  onClick={handleCopy}
                  title="Copy code"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                  {copied ? 'Copied' : 'Copy'}
                </motion.button>
              </div>

              {/* ===== CONTENT ===== */}
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
                <div className={styles.errorState}>❌ Error: {codeError}</div>
              ) : fileContent === "__IMAGE_PREVIEW__" ? (
                /* PREVIEW GAMBAR */
                <div className={styles.imagePreviewContainer}>
                  <img
                    src={`https://raw.githubusercontent.com/${metadata.owner}/${repoName}/${metadata.branch}/${selectedFile}`}
                    alt={selectedFile || 'Preview'}
                    className={styles.imageContent}
                  />
                  <p className={styles.imagePathText}>{selectedFile}</p>
                </div>
              ) : (
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <SyntaxHighlighter
                    language={getLanguage(selectedFile)}
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