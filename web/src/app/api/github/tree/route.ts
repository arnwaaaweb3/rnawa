//src/app/api/github/tree/route.ts
import { getRepoTree } from '@/utils/github';
import { NextRequest, NextResponse } from 'next/server';

type TreeItem = {
  path: string;
  type: 'tree' | 'blob';
};

type GitHubTreeResponse = {
  tree: TreeItem[];
};

type GitHubErrorResponse = {
  message?: string;
  documentation_url?: string;
};

type RepoMetadataResponse = {
  stargazers_count?: number;
  forks_count?: number;
  subscribers_count?: number;
  owner?: { login?: string };
  updated_at?: string;
  size?: number;
  license?: { name?: string } | null;
  default_branch?: string;
};

// 🛡️ SECURITY BLACKLIST: Daftar file dan folder rahasia yang HARAM dikirim ke browser client
const SENSITIVE_FILES_BLACKLIST = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  'config.json',
  'credentials',
  'serviceaccount',
  '.git',
  'node_modules',
  'package-lock.json',
  'bun.lockb',
  'yarn.lock'
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath');

  if (!repoPath) {
    return NextResponse.json({ error: 'Repo path required' }, { status: 400 });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = { Authorization: `token ${token}` };

    // Jalankan fetch secara paralel kencang standar isu 3 kemarin
    const [metaRes, treeDataRaw] = await Promise.all([
      fetch(`https://api.github.com/repos/${repoPath}`, { 
        headers,
        next: { revalidate: 600 } 
      }),
      getRepoTree(repoPath)
    ]);

    const metaData = (await metaRes.json()) as RepoMetadataResponse;
    const data = treeDataRaw as GitHubTreeResponse | GitHubErrorResponse;

    // Validasi jika GitHub memberikan error (misal repo tidak ketemu)
    if ('message' in data && data.message === 'Not Found') {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    // 🛡️ PROSES BANTAIAN KEBOCORAN DATA (.env Filter Logic)
    let safeTree: TreeItem[] = [];
    if ('tree' in data && Array.isArray(data.tree)) {
      safeTree = data.tree.filter((item) => {
        // Ambil nama file paling ujung dari path (misal: "src/core/.env" -> ".env")
        const fileName = item.path.split('/').pop()?.toLowerCase() || '';
        
        // Cek apakah nama file atau jalurnya mengandung salah satu item dari blacklist
        const isSensitive = SENSITIVE_FILES_BLACKLIST.some(
          (blacklistedItem) => fileName === blacklistedItem || item.path.includes(`/${blacklistedItem}/`)
        );

        // Hanya loloskan file yang BENAR-BENAR AMAN
        return !isSensitive;
      });
    }

    return NextResponse.json({
      metadata: {
        stars: metaData.stargazers_count ?? 0,
        forks: metaData.forks_count ?? 0,
        watchers: metaData.subscribers_count ?? 0,
        owner: metaData.owner?.login ?? 'unknown',
        updatedAt: metaData.updated_at ?? new Date().toISOString(),
        size: metaData.size ?? 0,
        license: metaData.license?.name ?? 'No License',
        branch: metaData.default_branch ?? 'main'
      },
      tree: safeTree // <-- Kirim daftar folder yang sudah disensor total
    });
  } catch (err: unknown) { 
    console.error('GitHub Tree Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub tree';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}