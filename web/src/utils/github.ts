// src/utils/github.ts

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Cache sederhana untuk menyimpan default branch per repoPath (Fix Point #3 Neo)
const branchCache = new Map<string, string>();

async function getDefaultBranch(repoPath: string): Promise<string> {
  if (branchCache.has(repoPath)) return branchCache.get(repoPath)!;

  const res = await fetch(`https://api.github.com/repos/${repoPath}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
    next: { revalidate: 3600 } // Cache info repo 1 jam (Next.js Data Cache)
  });
  
  const data = await res.json();
  const branch = data.default_branch || 'main';
  branchCache.set(repoPath, branch);
  return branch;
}

export async function getRepoTree(repoPath: string) {
  const cleanPath = repoPath
    .replace('https://github.com/', '')
    .replace('http://github.com/', '')
    .replace(/\/$/, '');
  
  const branch = await getDefaultBranch(cleanPath);

  const res = await fetch(
    `https://api.github.com/repos/${cleanPath}/git/trees/${branch}?recursive=1`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 }
    }
  );
  
  const data = await res.json();

  // Guard Clause: Kalau GitHub balikin error (message), langsung lempar error
  if (data.message && data.message === 'Not Found') {
    throw { code: 'NOT_FOUND', status: 404 };
  }

  if (!data.tree) {
    return { tree: [] };
  }

  // Filtering
  const filteredTree = data.tree.filter((item: any) => {
    const parts = item.path.split('/');
    return !(
      parts.includes('node_modules') || 
      parts.includes('.git') ||
      item.path.endsWith('.lock') ||
      item.path.endsWith('-lock.json')
    );
  });

  return {
    tree: filteredTree.map((item: any) => ({
      path: item.path,
      type: item.type === 'tree' ? 'tree' : 'blob' // Normalisasi type
    })),
  };
}

export async function getFileContent(repoPath: string, filePath: string) {
  // 1. Ambil data langsung dari API Contents (Fix Point #1 & #2 Neo)
  // Ini otomatis dapet metadata (size) dan konten sekaligus dalam 1 request!
  const res = await fetch(`https://api.github.com/repos/${repoPath}/contents/${filePath}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw { code: 'FETCH_FAILED', status: res.status }; // Fix Point #4 Neo
  }

  const data = await res.json();

  if (Array.isArray(data)) {
    throw { code: 'IS_DIRECTORY', status: 400 }
  }

  // 2. Validasi Size (Fix Point #4 Neo)
  if (data.size > 200000) {
    throw { code: 'FILE_TOO_LARGE', status: 413 };
  }

  // 3. Decode Base64 (Jauh lebih cepet daripada nembak raw.github lagi!)
  if (data.encoding === 'base64' && data.content) {
    // Hilangkan karakter newline yang kadang muncul di base64 GitHub
    const cleanContent = data.content.replace(/\n/g, '');
    return Buffer.from(cleanContent, 'base64').toString('utf-8');
  }

  return 'No content available.';
}