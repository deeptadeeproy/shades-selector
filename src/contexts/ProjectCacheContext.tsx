import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getUserProjects } from '../config/api';
import type { Project } from '../config/api';
import { getAuthToken } from '../utils/authUtils';

interface ProjectCacheContextType {
  projects: Project[] | null;
  isLoading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  setProjects: React.Dispatch<React.SetStateAction<Project[] | null>>;
}

const ProjectCacheContext = createContext<ProjectCacheContextType | undefined>(undefined);

export const useProjectCache = () => {
  const ctx = useContext(ProjectCacheContext);
  if (!ctx) throw new Error('useProjectCache must be used within ProjectCacheProvider');
  return ctx;
};

export const ProjectCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await getUserProjects(token);
      if (response.success && response.projects) {
        setProjects(response.projects);
      } else {
        throw new Error(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Background load on mount if cache is empty
  useEffect(() => {
    if (projects === null) {
      refreshProjects();
    }
  }, [projects, refreshProjects]);

  return (
    <ProjectCacheContext.Provider value={{ projects, isLoading, error, refreshProjects, setProjects }}>
      {children}
    </ProjectCacheContext.Provider>
  );
}; 