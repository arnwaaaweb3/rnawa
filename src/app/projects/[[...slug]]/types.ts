// src/app/projects/[[...slug]]/types.ts
import { PortableTextBlock } from '@portabletext/types';

export interface Category {
  title: string;
  slug: string;
  type: 'domain' | 'output';
}

export interface Project {
  _id: string;
  title: string;
  slug: string;

  
  // Struktur yang bener buat nampung dereferenced asset dari GROQ
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
  displayType: 'video' | 'poster' | 'pdf' | 'github' | 'feeds';
  
  imageOrientation?: 'landscape' | 'portrait' | 'square'; 
  pdfFile?: any; 
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