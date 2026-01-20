import { PortableTextBlock } from '@portabletext/types';

export interface Category {
  title: string;
  slug: string;
  parent?: string;
}

export interface Project {
  _id: string;
  title: string;
  projectStatus: string;
  slug: string;
  imageUrl: string;
  categories?: Category[];
  description?: PortableTextBlock[];
  gallery?: string[];
  youtubeId?: string;
  githubRepo?: string;
  enableExplorer?: boolean;
  displayType: 'video' | 'poster' | 'pdf';
  imageOrientation?: 'landscape' | 'portrait' | 'square'; 
  pdfFile?: {
    asset: {
      url: string;
    };
  };
  posterImage?: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
          aspectRatio: number;
        };
      };
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