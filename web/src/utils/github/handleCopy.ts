type HandleCopyDeps = {
  fileContent: string;
  setCopied: (v: boolean) => void;
};

export const handleCopyLogic = async (
  deps: HandleCopyDeps
) => {
  const { fileContent, setCopied } = deps;

  if (!fileContent) return;

  try {
    await navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy the code:', err);
  }
};
