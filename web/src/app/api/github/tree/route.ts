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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath');

  if (!repoPath) {
    return NextResponse.json({ error: 'Repo path required' }, { status: 400 });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = { Authorization: `token ${token}` };

    // 1. Fetch Repo Metadata
    const metaRes = await fetch(`https://api.github.com/repos/${repoPath}`, { headers });
    const metaData = (await metaRes.json()) as RepoMetadataResponse;

    // 2. Fetch Tree (existing logic via util)
    const data = (await getRepoTree(repoPath)) as GitHubTreeResponse | GitHubErrorResponse;

    // Validasi jika GitHub memberikan error (misal repo tidak ketemu)
    if ('message' in data && data.message === 'Not Found') {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
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
      ...data
    });
  } catch (err: unknown) { 
    console.error('GitHub Tree Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub tree';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}