import { getRepoTree } from '@/utils/github';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath');

  if (!repoPath) {
    return NextResponse.json({ error: 'Repo path required' }, { status: 400 });
  }

  try {
    const data = await getRepoTree(repoPath);
    
    // Validasi jika GitHub memberikan error (misal repo tidak ketemu)
    if (data.message && data.message === 'Not Found') {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('GitHub Tree Error:', err);
    return NextResponse.json({ error: 'Failed to fetch GitHub tree' }, { status: 500 });
  }
}