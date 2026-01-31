// src/app/projects/hooks/useProjectFilters.ts
import { useMemo, useState } from 'react';
import { Project } from '../[[...slug]]/types';
import { MediaType } from '@/components/ui/MediaTypeDrawer';

// src/app/projects/hooks/useProjectFilters.ts
export function useProjectFilters(projects: Project[]) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing' | 'concept'>('all');
  const [mediaFilter, setMediaFilter] = useState<MediaType>('all');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // 1. Status Match (Handle undefined/null dengan 'all')
      const pStatus = (p.projectStatus || 'concept').toLowerCase();
      const statusMatch = filter === 'all' || pStatus === filter;
      
      // 2. Media Match (Gunakan displayType yang ditarik dari GROQ tadi)
      const pMedia = (p.displayType || '').toLowerCase();
      const mediaMatch = mediaFilter === 'all' || pMedia === mediaFilter;
      
      return statusMatch && mediaMatch;
    });
  }, [projects, filter, mediaFilter]);

  return { filter, setFilter, mediaFilter, setMediaFilter, filteredProjects };
}