import { VscFile, VscFolder, VscFolderOpened } from 'react-icons/vsc';
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiMarkdown,
  SiJson,
  SiCss3,
  SiHtml5,
  SiSolidity,
} from 'react-icons/si';

export const getFileIcon = (
  filename: string,
  isOpen?: boolean,
  isFolder?: boolean
) => {
  if (isFolder) {
    return isOpen ? (
      <VscFolderOpened style={{ color: '#ff85e5' }} />
    ) : (
      <VscFolder style={{ color: '#ff85e5' }} />
    );
  }

  const ext = filename.split('.').pop()?.toLowerCase() || '';

  switch (ext) {
    case 'tsx':
    case 'jsx':
      return <SiReact style={{ color: '#61dafb' }} />;
    case 'py':
      return <SiPython style={{ color: '#3776ab' }} />;
    case 'ts':
      return <SiTypescript style={{ color: '#3178c6' }} />;
    case 'js':
      return <SiJavascript style={{ color: '#f7df1e' }} />;
    case 'md':
      return <SiMarkdown style={{ color: '#ffffff' }} />;
    case 'json':
      return <SiJson style={{ color: '#fdd835' }} />;
    case 'css':
      return <SiCss3 style={{ color: '#1572b6' }} />;
    case 'html':
      return <SiHtml5 style={{ color: '#e34f26' }} />;
    case 'sol':
      return <SiSolidity style={{ color: '#363636' }} />;
    default:
      return <VscFile style={{ color: '#858585' }} />;
  }
};
