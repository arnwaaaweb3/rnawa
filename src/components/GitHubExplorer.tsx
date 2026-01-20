///src/components/GithubExplorer.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { getRepoTree, getFileContent } from '@/utils/github';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '@/styles/GitHub.module.css';

interface GitHubExplorerProps {
  repoPath: string
}

export default function GitHubExplorer({ repoPath }: GitHubExplorerProps) {
  const [tree, setTree] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Fetch struktur folder pas pertama kali render
  useEffect(() => {
    async function loadTree() {
      const data = await getRepoTree(repoPath)
      setTree(data.tree || [])
    }
    if (repoPath) loadTree()
  }, [repoPath])

  // Handle klik file buat ambil isinya
  const handleFileClick = async (path: string) => {
    setLoading(true)
    setSelectedFile(path)
    try {
      const content = await getFileContent(repoPath, path)
      setFileContent(content)
    } catch (err) {
      setFileContent('Gagal ambil isi file, Nawa! Cek koneksi lu.')
    }
    setLoading(false)
  }

  return (
    <div className={styles.explorerContainer}>
      {/* Sidebar: File Manager */}
      <div className={styles.sidebar}>
        <h4 className={styles.sidebarTitle}>Repository Structure</h4>
        <div className={styles.fileList}>
          {tree.map((item) => (
            <div 
              key={item.path} 
              className={`${styles.fileItem} ${item.type === 'tree' ? styles.folder : styles.file} ${selectedFile === item.path ? styles.active : ''}`}
              onClick={() => item.type === 'blob' && handleFileClick(item.path)}
            >
              {item.type === 'tree' ? '📁' : '📄'} {item.path}
            </div>
          ))}
        </div>
      </div>

      {/* Main: Code Viewer */}
      <div className={styles.codeViewer}>
        {selectedFile ? (
          <>
            <div className={styles.codeHeader}>{selectedFile}</div>
            {loading ? (
              <div className={styles.loader}>Lagi nyedot data dari GitHub...</div>
            ) : (
              <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ margin: 0, height: '100%' }}>
                {fileContent}
              </SyntaxHighlighter>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>Pilih file buat liat kodingan lu yang "indah" itu.</div>
        )}
      </div>
    </div>
  )
}