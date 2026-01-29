import { PortableTextBlock } from '@portabletext/types';

export interface Category {
  title: string;
  slug: string;
  type: 'domain' | 'output'; // Biar sinkron sama taxonomy kamu
}

export interface Project {
  _id: string;
  title: string;
  projectStatus: 'completed' | 'ongoing' | 'concept'; // Biar nggak asal string
  slug: string;
  coverImage: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt: string; // Kamu kasih validation: Rule.required() kan? Jadi wajib ada.
  };
  
  // Update ini! Sesuaikan dengan schema portfolioItemType.ts
  mainCategory?: Category; 
  outputCategory?: Category;
  categories?: Category[]; // Jaga-jaga kalau query GROQ kamu nge-map ke sini
  
  description?: PortableTextBlock[];
  youtubeId?: string;
  githubRepo?: string;
  enableExplorer?: boolean;
  
  // DOSA 1: Tambahin github dan feeds di sini!
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