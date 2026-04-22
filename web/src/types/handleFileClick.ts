// src/types/handleFileClick.ts

import { initDB, saveToLocal, getFromLocal } from "@/utils/storage";

// Tipe commit yang sesuai dengan interface Commit di CommitHistory
type CommitType = {
  avatar: string;
  author: string;
  message: string;
  date: string;
};

type HandleFileClickDeps = {
  repoPath: string;
  codeCache: Record<string, string>;
  setSelectedFile: (v: string) => void;
  setCodeError: (v: string | null) => void;
  setFileContent: (v: string) => void;
  setLoading: (v: boolean) => void;
  setCodeCache: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCommitsLoading: (v: boolean) => void;
  setFileCommits: (v: CommitType[]) => void;
};

export const handleFileClickLogic = async (
  filePath: string,
  deps: HandleFileClickDeps
) => {
  const {
    repoPath,
    codeCache,
    setSelectedFile,
    setCodeError,
    setFileContent,
    setLoading,
    setCodeCache,
    setCommitsLoading,
    setFileCommits,
  } = deps;

  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
  const binaryExtensions = ['pyc', 'pdf', 'exe', 'bin', 'zip', 'rar'];

  setSelectedFile(filePath);
  setCodeError(null);

  if (imageExtensions.includes(ext)) {
    setFileContent('__IMAGE_PREVIEW__');
    return;
  }

  if (binaryExtensions.includes(ext)) {
    setFileContent('');
    setCodeError(`Preview not available for binary files (.${ext}). Please download it from GitHub.`);
    return;
  }

  if (codeCache[filePath]) {
    console.log(`[Cache] Loading "${filePath}" from state.`);
    setFileContent(codeCache[filePath]);
    return;
  }

  setLoading(true);
  setFileContent('');

  try {
    await initDB();
    const localContent = await getFromLocal(filePath);

    if (localContent) {
      console.log(`[IndexedDB] Loading "${filePath}" from local storage`);
      setFileContent(localContent);
      setCodeCache((prev) => ({ ...prev, [filePath]: localContent }));
      setLoading(false);
      return;
    }

    const sanitizedRepo = repoPath.replace(/[^\x20-\x7E]/g, '').trim();
    const res = await fetch(
      `/api/github/content?repoPath=${sanitizedRepo}&filePath=${filePath}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch code');
    }

    const data = await res.json();

    setFileContent(data.content);
    setCodeCache((prev) => ({ ...prev, [filePath]: data.content }));

    saveToLocal(filePath, data.content).catch((e) =>
      console.error('Gagal simpan ke DB:', e)
    );

    const fetchCommits = async (path: string) => {
      setCommitsLoading(true);
      try {
        const sanitizedRepo = repoPath.replace(/[^\x20-\x7E]/g, '').trim();
        const res = await fetch(
          `/api/github/commits?repoPath=${sanitizedRepo}&filePath=${path}`
        );
        const data = await res.json();
        setFileCommits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal stalking commit:", err);
      } finally {
        setCommitsLoading(false);
      }
    };

    fetchCommits(filePath);

  } catch (err: unknown) { 
    console.error('File access error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    setCodeError(errorMessage);
  } finally {
    setLoading(false);
  }
};