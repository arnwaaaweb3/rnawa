// src/app/projects/hooks/useProjectFilters.ts
import { useMemo, useState } from 'react';
import { Category, Project } from '../[[...slug]]/types';

export const useProjectFilters = (projects: Project[]) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing' | 'concept'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const availableCategories = useMemo(() => {
      return [
        'all',
        ...new Set(
          projects.flatMap((p) => p.categories?.map((c: Category) => c.title) || [])
        ),
      ];
    }, [projects]);
  
    const filteredProjects = useMemo(() => {
      return projects.filter((project) => {
        const matchStatus = filter === 'all' || project.projectStatus === filter;
        const matchCategory =
          categoryFilter === 'all' ||
          project.categories?.some(
            (c) => c.title === categoryFilter || c.parent === categoryFilter
          );
        return matchStatus && matchCategory;
      });
    }, [projects, filter, categoryFilter]);

  return {
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    availableCategories,
    filteredProjects
  };
};