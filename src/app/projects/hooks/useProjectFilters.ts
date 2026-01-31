// src/app/projects/hooks/useProjectFilters.ts
import { useMemo, useState } from 'react';
import { Project } from '../[[...slug]]/types';

export function useProjectFilters(projects: Project[]) {
  const [mediaFilter, setMediaFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {

      const pMedia = (p.displayType || '').toLowerCase().trim();

      const targetMedia = mediaFilter.toLowerCase().trim();

      const mediaMatch = targetMedia === 'all' || pMedia === targetMedia;

      return  mediaMatch;
    });
  }, [projects, mediaFilter]);

  return {
    mediaFilter,
    setMediaFilter,
    filteredProjects,
  };
}