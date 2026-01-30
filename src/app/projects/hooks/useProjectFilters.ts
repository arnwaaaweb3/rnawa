// src/app/projects/hooks/useProjectFilters.ts
import { useMemo, useState } from 'react';
import { Project } from '../[[...slug]]/types';
import { MediaType } from '@/components/ui/MediaTypeDrawer';

export function useProjectFilters(projects: Project[]) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing' | 'concept'>('all');
  const [mediaFilter, setMediaFilter] = useState<MediaType>('all');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Kondisi 1: Status Match
      const statusMatch = filter === 'all' || p.projectStatus === filter;
      
      // Kondisi 2: Media Type Match
      // Pastikan p.displayType ada nilainya
      const mediaMatch = mediaFilter === 'all' || p.displayType === mediaFilter;
      
      // Keduanya harus TRUE (Intersection)
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