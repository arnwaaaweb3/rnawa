// src/app/api/github/content/route.ts

import { getFileContent } from '@/utils/github';
import { NextRequest, NextResponse } from 'next/server';

type GitHubError = {
  code?: string;
  status?: number;
  message?: string;
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
  // 1. 🛡️ PROTEKSI LAYER 1: Verifikasi Server-to-Server Origin (Header Guard)
  const headerOrigin = req.headers.get('origin');
  const headerReferer = req.headers.get('referer');
  const host = req.headers.get('host') || '';
  
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  
  // Jika ditembak langsung dari luar browser tanpa context referer, langsung tendang!
  if (!headerReferer && !headerOrigin && !isLocalhost) {
    return NextResponse.json({ error: 'Unauthorized API access pattern' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath');
  const filePath = searchParams.get('filePath');

  if (!repoPath || !filePath) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  // 2. 🛡️ PROTECTION LAYER 2: Validasi Whitelist Repo Path (Mencegah maling repo privat)
  const isAllowedRepo = ALLOWED_REPOSITORIES.some(
    (allowed) => allowed.toLowerCase() === repoPath.toLowerCase()
  );

  if (!isAllowedRepo) {
    return NextResponse.json({ error: 'Access to this repository is restricted' }, { status: 403 });
  }

  // 3. 🛡️ PROTECTION LAYER 3: Validasi Blacklist File Path (Mencegah intip file sensitif)
  const fileName = filePath.split('/').pop()?.toLowerCase() || '';
  const isSensitiveFile = SENSITIVE_FILES_BLACKLIST.some(
    (blacklistedItem) => 
      fileName === blacklistedItem || 
      fileName.endsWith(blacklistedItem) ||
      filePath.toLowerCase().includes(`/${blacklistedItem}/`)
  );

  if (isSensitiveFile) {
    return NextResponse.json({ error: 'Reading this file is strictly prohibited for security reasons' }, { status: 403 });
  }

  try {
    const content = await getFileContent(repoPath, filePath);
    return NextResponse.json({ content });
  } catch (err: unknown) {
    const error = err as GitHubError;
    const status = error.status || 500;
    const code = error.code || 'UNKNOWN_ERROR';
    
    let message = 'An unexpected error occurred';
    if (code === 'FILE_TOO_LARGE') message = 'File is too large (>200KB)';
    if (code === 'IS_DIRECTORY') message = 'Cannot open a directory';
    if (status === 404) message = 'File not found on GitHub';

    return NextResponse.json({ error: message, code }, { status });
  }
}