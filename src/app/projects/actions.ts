// src/app/projects/actions.ts
import { client } from '@/sanity/lib/client';
import { PROJECTS_QUERY, PROJECT_DETAIL_QUERY } from '@/sanity/lib/queries';
import { Project } from './[[...slug]]/types';

export const fetchAllProjects = async (): Promise<Project[]> => {
  return await client.fetch(PROJECTS_QUERY);
};

export const fetchSingleProject = async (slug: string): Promise<Project | null> => {
  return await client.fetch(PROJECT_DETAIL_QUERY, { slug });
};