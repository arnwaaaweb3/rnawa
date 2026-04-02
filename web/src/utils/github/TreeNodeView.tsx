import { useState } from 'react';
import styles from '@/styles/GitHub.module.css';
import { getFileIcon } from '@/utils/github/getFileIcon';
import { TreeNode } from '@/types/TreeNode';

interface TreeNodeViewProps {
  node: TreeNode;
  onFileClick: (path: string) => void;
  selectedFile: string | null;
}

export function TreeNodeView({
  node,
  onFileClick,
  selectedFile,
}: TreeNodeViewProps) {
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
