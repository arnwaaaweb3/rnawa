// src/app/projects/hooks/useProjectFilters.ts
import { useMemo, useState } from 'react';
import { Category, Project } from '../[[...slug]]/types';

export function useProjectFilters(projects: Project[]) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing' | 'concept'>('all');
  const [mediaFilter, setMediaFilter] = useState<
    'all' | 'video' | 'poster' | 'pdf' | 'github' | 'feeds'
  >('all');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const statusMatch = filter === 'all' || p.projectStatus === filter;
      const mediaMatch =
        mediaFilter === 'all' || p.displayType === mediaFilter;

      return statusMatch && mediaMatch;
    });
  }, [projects, filter, mediaFilter]);

  return {
    filter,
    setFilter,
    mediaFilter,
    setMediaFilter,
    filteredProjects,
  };
}
