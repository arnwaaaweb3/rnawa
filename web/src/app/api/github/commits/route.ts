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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath');
  const filePath = searchParams.get('filePath');

  if (!repoPath || !filePath) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
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