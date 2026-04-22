'use client';

import { useState, useEffect, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getFromLocal, saveToLocal } from '@/utils/storage';
import { TreeNodeView } from '@/utils/github/TreeNodeView';
import { buildTree, flattenTree } from '@/utils/github/treeUtils';
import { TreeNode } from '@/types/TreeNode';
import styles from '@/styles/GitHub.module.css';
import { handleCopyLogic } from '@/utils/github/handleCopy';
import { getFileIcon } from '@/utils/github/getFileIcon';
import GitHubExplorerProps from '@/types/githubExplorerProps';
import { handleFileClickLogic } from '@/types/handleFileClick';
import { 
  RepoMetadata, 
  SidebarHeader, 
  FileSearch, 
  Breadcrumbs, 
  CommitHistory, 
  CodeHeader, 
  FileViewerContent 
} from '@/components/github';

// ✅ Import types yang dipake aja
import type { RepoMetadataProps } from '@/components/github/RepoMetadata';
import type { CommitHistoryProps } from '@/components/github/CommitHistory';

/* ===================== MAIN COMPONENT ===================== */

export default function GitHubExplorer({ repoPath }: GitHubExplorerProps) {
  const { darkMode } = useTheme();
  const [nestedTree, setNestedTree] = useState<TreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeCache, setCodeCache] = useState<Record<string, string>>({});
  
  // ✅ Pake type dari RepoMetadataProps
  const [metadata, setMetadata] = useState<RepoMetadataProps['metadata']>(null);
  
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // ✅ Pake type dari CommitHistoryProps
  const [fileCommits, setFileCommits] = useState<CommitHistoryProps['fileCommits']>([]);
  
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

        // ✅ MAPPING DATA dari API ke format yang diinginkan komponen
        if (data.metadata) {
          const mappedMetadata: RepoMetadataProps['metadata'] = {
            stars: data.metadata.stargazers_count || 0,
            forks: data.metadata.forks_count || 0,
            watchers: data.metadata.watchers_count || 0,
            owner: data.metadata.owner?.login || data.metadata.owner || 'unknown',
            branch: data.metadata.default_branch || 'main',
            size: data.metadata.size || 0,
            updatedAt: data.metadata.updated_at || new Date().toISOString(),
            license: data.metadata.license?.name || 'MIT',
          };
          setMetadata(mappedMetadata);
        }

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
  }, [nestedTree, repoPath]);

  /* ===================== FILE CLICK ===================== */
  const handleFileClick = async (filePath: string) => {
    await handleFileClickLogic(filePath, {
      repoPath,
      codeCache,
      setSelectedFile,
      setCodeError,
      setFileContent,
      setLoading,
      setCodeCache,
      setCommitsLoading,
      setFileCommits,
    });
  };

  /* ===================== UTILITIES ===================== */
  const handleCopy = async () => {
    await handleCopyLogic({
      fileContent,
      setCopied,
    });
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
        <RepoMetadata metadata={metadata} />

        {/* ===== SIDEBAR HEADER ===== */}
        <SidebarHeader
          repoName={repoName}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          setSearchQuery={setSearchQuery}
        />

        {/* ===== SEARCH SECTION ===== */}
        <FileSearch
          isSearchOpen={isSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

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
            <m.div
              key={selectedFile}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={styles.motionWrapper}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Breadcrumbs breadcrumbs={breadcrumbs} />

              {/* ===== RECENT ACTIVITY (COLLAPSIBLE) ===== */}
              <CommitHistory
                isCommitsOpen={isCommitsOpen}
                setIsCommitsOpen={setIsCommitsOpen}
                fileCommits={fileCommits}
                commitsLoading={commitsLoading}
              />

              {/* ===== CODE HEADER ===== */}
              <CodeHeader
                fileName={breadcrumbs[breadcrumbs.length - 1]}
                handleCopy={handleCopy}
                copied={copied}
              />

              {/* ===== CONTENT ===== */}
              <FileViewerContent
                loading={loading}
                codeError={codeError}
                fileContent={fileContent}
                selectedFile={selectedFile}
                metadata={metadata ? { owner: metadata.owner, branch: metadata.branch } : null}
                repoName={repoName}
                darkMode={darkMode}
              />
            </m.div>
          ) : (
            <m.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.emptyState}
            >
              <div className={styles.emptyStateContent}>
                Select a file to explore the code.
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}