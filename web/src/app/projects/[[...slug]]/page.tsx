// src/app/projects/[[...slug]]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { fetchAllProjects, fetchSingleProject } from '../actions';
import ProjectsClientWrapper from './ProjectsClientWrapper';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? resolvedParams.slug[0] : null;

  if (slug) {
    const project = await fetchSingleProject(slug);
    if (project) {
      const seoDescription = typeof project.description === 'string' 
        ? project.description 
        : `Explore details about ${project.title} on Nawa Portfolio.`;

      return {
        title: `${project.title} | Nawa Projects`,
        description: seoDescription,
        openGraph: {
          title: `${project.title} | Nawa Projects`,
          description: seoDescription,
          images: project.imageUrl ? [project.imageUrl] : [],
        },
      };
    }
  }

  return {
    title: "Projects | Nawa Portfolio",
    description: "A collection of projects and ideas from Nawa Studio.",
  };
}

export default async function ProjectsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? resolvedParams.slug[0] : null;

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