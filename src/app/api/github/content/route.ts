import { getFileContent } from '@/utils/github';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoPath = searchParams.get('repoPath');
  const filePath = searchParams.get('filePath');

  if (!repoPath || !filePath) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  try {
    const content = await getFileContent(repoPath, filePath);
    return NextResponse.json({ content });
  } catch (err: any) {
    // Tangkap error object yang udah kita buat di util tadi
    const status = err.status || 500;
    const code = err.code || 'UNKNOWN_ERROR';
    
    let message = 'An unexpected error occurred';
    if (code === 'FILE_TOO_LARGE') message = 'File is too large (>200KB)';
    if (code === 'IS_DIRECTORY') message = 'Cannot open a directory';
    if (status === 404) message = 'File not found on GitHub';

    return NextResponse.json({ error: message, code }, { status });
  }
}