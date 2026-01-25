export const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    const map: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      sol: 'solidity',
      md: 'markdown',
      json: 'json',
      css: 'css',
      html: 'html',
    };

    return map[ext] || 'javascript';
  };