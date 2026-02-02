// src/app/projects/hooks/useProjectFilters.ts
import { useMemo, useState } from 'react';
import { Project } from '../[[...slug]]/types';
import { ProjectStatus } from '@/components/ui/StatusDrawer'; // Import tipenya!

export function useProjectFilters(projects: Project[]) {
  const [mediaFilter, setMediaFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus>('all'); // Tambah ini!

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Logic Media
      const pMedia = (p.displayType || '').toLowerCase().trim();
      const targetMedia = mediaFilter.toLowerCase().trim();
      const mediaMatch = targetMedia === 'all' || pMedia === targetMedia;

      // Logic Status (Gunakan field projectStatus yang kita fetch tadi)
      const pStatus = (p.projectStatus || '').toLowerCase().trim();
      const targetStatus = statusFilter.toLowerCase().trim();
      const statusMatch = targetStatus === 'all' || pStatus === targetStatus;

      // Harus memenuhi kedua kriteria!
      return mediaMatch && statusMatch;
    });
  }, [projects, mediaFilter, statusFilter]); // Update dependency array!

  return {
    mediaFilter,
    setMediaFilter,
    statusFilter, // Export ini
    setStatusFilter, // Export ini juga
    filteredProjects,
  };
}