// src/app/api/github/content/route.ts

import { getFileContent } from '@/utils/github';
import { NextRequest, NextResponse } from 'next/server';

type GitHubError = {
  code?: string;
  status?: number;
  message?: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath');
  const filePath = searchParams.get('filePath');

  if (!repoPath || !filePath) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
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