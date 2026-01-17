// src/app/projects/[[...slug]]/page.tsx
import React from 'react';
import { fetchAllProjects, fetchSingleProject } from '../actions';
import ProjectsClientWrapper from './ProjectsClientWrapper';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function ProjectsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? resolvedParams.slug[0] : null;

  // Tarik data di server, tanpa drama skeleton loading di client
  const [initialProjects, initialSelected] = await Promise.all([
    fetchAllProjects(),
    slug ? fetchSingleProject(slug) : null,
  ]);

  return (
    <ProjectsClientWrapper 
      initialProjects={initialProjects} 
      initialSelected={initialSelected} 
      slug={slug} 
    />
  );
}