// src/app/api/github/commits/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath'); // Format: owner/repo
  const filePath = searchParams.get('filePath');

  if (!repoPath || !filePath) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Kita ambil 5 commit terakhir aja biar nggak menuhin layar
    const response = await fetch(
      `https://api.github.com/repos/${repoPath}/commits?path=${filePath}&per_page=5`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PAT}`, // Pake token lo biar nggak kena rate limit
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch commits');

    const data = await response.json();
    
    const commits = data.map((item: any) => ({
      message: item.commit.message,
      author: item.commit.author.name,
      date: item.commit.author.date,
      url: item.html_url,
      avatar: item.author?.avatar_url,
    }));

    return NextResponse.json(commits);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}