// src/app/api/github/tree/route.ts
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

// 🛡️ SECURITY WHITELIST: Hanya izinkan repo-repo ini yang boleh diakses lewat API publik
const ALLOWED_REPOSITORIES = [
  'arnwaaaweb3/oceanblu',
  'arnwaaaweb3/learningMATERIAL',
  'arnwaaaweb3/Veritas-ChromeAI',
  'arnwaaaweb3/aletta-bot',
];

// 🛡️ SECURITY BLACKLIST: Daftar file rahasia yang HARAM dikirim ke browser client
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
  'bun.lock',
  'bun.lockb',
  'yarn.lock'
];

export async function GET(req: NextRequest) {
  // 1. 🛡️ PROTEKSI LAYER 1: Verifikasi Server-to-Server Origin (CORS/Header Guard)
  const headerOrigin = req.headers.get('origin');
  const headerReferer = req.headers.get('referer');
  const host = req.headers.get('host') || '';
  
  // Ambil domain utama website lu secara dinamis dari host request
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  
  // Jika ditembak langsung dari luar browser (Postman, curl, bot scraping), tendang!
  if (!headerReferer && !headerOrigin && !isLocalhost) {
    return NextResponse.json({ error: 'Unauthorized API access pattern' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath');

  if (!repoPath) {
    return NextResponse.json({ error: 'Repo path required' }, { status: 400 });
  }

  // 2. 🛡️ PROTECTION LAYER 2: Validasi Whitelist Repo Path (Mencegah intip repo privat lain)
  const isAllowedRepo = ALLOWED_REPOSITORIES.some(
    (allowed) => allowed.toLowerCase() === repoPath.toLowerCase()
  );

  if (!isAllowedRepo) {
    return NextResponse.json({ error: 'Access to this repository is restricted' }, { status: 403 });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'GitHub token not configured on server' }, { status: 500 });
    }

    const headers = { Authorization: `token ${token}` };

    // Jalankan fetch secara paralel
    const [metaRes, treeDataRaw] = await Promise.all([
      fetch(`https://api.github.com/repos/${repoPath}`, { 
        headers,
        next: { revalidate: 600 } // Cache metadata 10 menit aman
      }),
      getRepoTree(repoPath)
    ]);

    const metaData = (await metaRes.json()) as RepoMetadataResponse;
    const data = treeDataRaw as GitHubTreeResponse | GitHubErrorResponse;

    if ('message' in data && data.message === 'Not Found') {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    // 🛡️ PROCESS BLOCKING KEBOCORAN DATA (.env Filter Logic)
    let safeTree: TreeItem[] = [];
    if ('tree' in data && Array.isArray(data.tree)) {
      safeTree = data.tree.filter((item) => {
        const fileName = item.path.split('/').pop()?.toLowerCase() || '';
        
        const isSensitive = SENSITIVE_FILES_BLACKLIST.some(
          (blacklistedItem) => 
            fileName === blacklistedItem || 
            fileName.endsWith(blacklistedItem) ||
            item.path.includes(`/${blacklistedItem}/`)
        );

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
      tree: safeTree
    });
  } catch (err: unknown) { 
    console.error('GitHub Tree Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub tree';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}