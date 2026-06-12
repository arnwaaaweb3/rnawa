// src/app/api/github/commits/route.ts
import { NextResponse } from 'next/server';

type GitHubCommitItem = {
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
  author: {
    avatar_url: string;
  } | null;
};

type CommitOutput = {
  message: string;
  author: string;
  date: string;
  url: string;
  avatar: string | null;
};

// 🛡️ SECURITY WHITELIST: Hanya izinkan repo-repo ini yang boleh diakses lewat API publik
const ALLOWED_REPOSITORIES = [
  'arnwaaaweb3/oceanblu',
  'arnwaaaweb3/learningMATERIAL',
  'arnwaaaweb3/Veritas-ChromeAI',
  'arnwaaaweb3/aletta-bot',
];

// 🛡️ SECURITY BLACKLIST: Daftar file rahasia yang HARAM dikirim atau dicek history-nya
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

export async function GET(req: Request) {
  // 1. 🛡️ PROTEKSI LAYER 1: Verifikasi Server-to-Server Origin (Header Guard)
  const headerOrigin = req.headers.get('origin');
  const headerReferer = req.headers.get('referer');
  const host = req.headers.get('host') || '';
  
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  
  // Jika ditembak langsung di luar browser web lu (Postman, script bot), langsung cut!
  if (!headerReferer && !headerOrigin && !isLocalhost) {
    return NextResponse.json({ error: 'Unauthorized API access pattern' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath');
  const filePath = searchParams.get('filePath');

  if (!repoPath || !filePath) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // 2. 🛡️ PROTECTION LAYER 2: Validasi Whitelist Repo Path
  const isAllowedRepo = ALLOWED_REPOSITORIES.some(
    (allowed) => allowed.toLowerCase() === repoPath.toLowerCase()
  );

  if (!isAllowedRepo) {
    return NextResponse.json({ error: 'Access to this repository is restricted' }, { status: 403 });
  }

  // 3. 🛡️ PROTECTION LAYER 3: Validasi Blacklist File Path (Mencegah intip commit log file rahasia)
  const fileName = filePath.split('/').pop()?.toLowerCase() || '';
  const isSensitiveFile = SENSITIVE_FILES_BLACKLIST.some(
    (blacklistedItem) => 
      fileName === blacklistedItem || 
      fileName.endsWith(blacklistedItem) ||
      filePath.toLowerCase().includes(`/${blacklistedItem}/`)
  );

  if (isSensitiveFile) {
    return NextResponse.json({ error: 'Accessing commit history for this file is strictly prohibited' }, { status: 403 });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoPath}/commits?path=${filePath}&per_page=5`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PAT}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch commits');

    const data = (await response.json()) as GitHubCommitItem[];

    const commits: CommitOutput[] = data.map((item) => ({
      message: item.commit.message,
      author: item.commit.author.name,
      date: item.commit.author.date,
      url: item.html_url,
      avatar: item.author?.avatar_url ?? null,
    }));

    return NextResponse.json(commits);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}