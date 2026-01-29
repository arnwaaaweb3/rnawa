// src/app/projects/actions.ts
import { client } from '@/sanity/lib/client';
import { PROJECTS_QUERY, PROJECT_DETAIL_QUERY, DOCS_QUERY } from '@/sanity/lib/queries';
import { Project } from './[[...slug]]/types';

// --- Interfaces ---
export interface DocsCategory {
    _id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    categoryTitle: string;
    categorySlug: string;
    color: string;
}

// --- Fetchers ---

// Ambil semua project buat grid
export const fetchAllProjects = async (): Promise<Project[]> => {
  return await client.fetch(PROJECTS_QUERY);
};

// Ambil detail satu project
export const fetchSingleProject = async (slug: string): Promise<Project | null> => {
  return await client.fetch(PROJECT_DETAIL_QUERY, { slug });
};

// Ambil kategori dokumentasi (pindahan dari client.ts tadi)
export async function getDocsCategories(): Promise<DocsCategory[]> {
    return await client.fetch(DOCS_QUERY); 
}