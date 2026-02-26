// src/app/projects/hooks/useProjectFilters.ts
import { useMemo, useState } from 'react';
import { Project } from '../[[...slug]]/types';
import { ProjectStatus } from '@/components/ui/StatusDrawer';

export function useProjectFilters(projects: Project[]) {
  const [mediaFilter, setMediaFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus>('all');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Bersihkan Media Filter (Gunakan Regex buat buang karakter non-alphanumeric kalau perlu)
      const pMedia = (p.displayType || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetMedia = mediaFilter.toLowerCase().replace(/[^a-z0-9]/g, '');
      const mediaMatch = targetMedia === 'all' || pMedia === targetMedia;

      // 2. Bersihkan Status Filter secara Brutal
      // Kita pakai .includes() atau regex supaya kalau ada karakter gaib di belakangnya tetep tembus
      const pStatus = 
      (p.projectStatus || '')
      .toLowerCase()
      .replace(/[^\x20-\x7E]/g, '')
      .trim();

      const targetStatus = statusFilter.toLowerCase().trim();
    
      // Gunakan includes supaya aman dari karakter tersembunyi
      const statusMatch = targetStatus === 'all' || pStatus === targetStatus;

      return mediaMatch && statusMatch;
    });
  }, [projects, mediaFilter, statusFilter]);

  return {
    mediaFilter,
    setMediaFilter,
    statusFilter,
    setStatusFilter,
    filteredProjects,
  };
}