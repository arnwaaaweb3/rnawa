// src/app/projects/[[...slug]]/types.ts
import { PortableTextBlock } from '@portabletext/types';

export interface Category {
  title: string;
  slug: string;
  type: 'domain' | 'output';
}

// Type untuk Sanity file
export interface SanityFile {
  asset: {
    _id: string;
    url: string;
    size?: number;
    mimeType?: string;
  };
}

// Tambahkan type DisplayType
export type DisplayType = 'video' | 'poster' | 'pdf' | 'github' | 'feeds';
export type MediaFilterType = 'all' | DisplayType;

export interface Project {
  _id: string;
  title: string;
  slug: string;
  projectStatus: 'ongoing' | 'completed' | 'concept';
  coverImage: {
    asset: {
      _id?: string;
      url: string;
    };
    alt: string;
  };
  imageUrl?: string;
  mainCategory?: Category; 
  outputCategory?: Category;
  categories?: Category[]; 
  
  description?: PortableTextBlock[];
  youtubeId?: string;
  githubRepo?: string;
  enableExplorer?: boolean;
  displayType: DisplayType;
  
  imageOrientation?: 'landscape' | 'portrait' | 'square'; 
  pdfFile?: string | SanityFile;
  posterImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  projectUrl?: string;
  relatedJournal?: { title: string; slug: string }[];
}

export interface SanityCodeValue {
  code: string;
  language?: string;
  filename?: string;
}