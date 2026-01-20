const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function getRepoTree(repoPath: string, branch = 'main') {
  const res = await fetch(
    `https://api.github.com/repos/${repoPath}/git/trees/${branch}?recursive=1`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 }
    }
  );
  return res.json();
}

export async function getFileContent(repoPath: string, filePath: string) {
  const res = await fetch(
    `https://raw.githubusercontent.com/${repoPath}/main/${filePath}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
  );
  return res.text();
}