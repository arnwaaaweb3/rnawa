import { initDB, saveToLocal, getFromLocal } from "@/utils/storage";

type HandleFileClickDeps = {
  repoPath: string;
  codeCache: Record<string, string>;
  setSelectedFile: (v: string) => void;
  setCodeError: (v: string | null) => void;
  setFileContent: (v: string) => void;
  setLoading: (v: boolean) => void;
  setCodeCache: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCommitsLoading: (v: boolean) => void;
  setFileCommits: (v: any[]) => void;
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
      setLoading(false);
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

  } catch (err: any) {
    console.error('File access error:', err);
    setCodeError(err.message);
  } finally {
    // 8. Pastikan loading mati di kondisi apapun (error/success)
    setLoading(false);
  }
};
