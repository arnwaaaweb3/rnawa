import { getRepoTree } from '@/utils/github';
import { NextRequest, NextResponse } from 'next/server';

type GitHubTreeResponse = {
  tree?: any[];
  truncated?: boolean;
};

type GitHubErrorResponse = {
  message?: string;
  documentation_url?: string;
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
    const metaData = await metaRes.json();

    // 2. Fetch Tree (existing logic via util)
    const data = await getRepoTree(repoPath) as GitHubTreeResponse | GitHubErrorResponse;

    // Validasi jika GitHub memberikan error (misal repo tidak ketemu)
    if ('message' in data && data.message === 'Not Found') {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    return NextResponse.json({
      metadata: {
        stars: metaData.stargazers_count,
        forks: metaData.forks_count,
        watchers: metaData.subscribers_count,
        owner: metaData.owner.login,
        updatedAt: metaData.updated_at,
        size: metaData.size,
        license: metaData.license?.name || 'No License',
        branch: metaData.default_branch
      },
      ...data
    });
  } catch (err) {
    console.error('GitHub Tree Error:', err);
    return NextResponse.json({ error: 'Failed to fetch GitHub tree' }, { status: 500 });
  }
}
