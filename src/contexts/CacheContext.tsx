import React, { createContext, useContext, useEffect, useState } from 'react';
import { projectPaletteCache } from '../utils/cacheUtils';
import type { CachedProject, CachedPalette } from '../utils/cacheUtils';
import { getUserProjects, getPalette } from '../config/api';
import { getAuthToken } from '../utils/authUtils';

interface CacheContextType {
  projects: CachedProject[];
  getProject: (projectId: string) => CachedProject | undefined;
  getPalette: (paletteId: string) => CachedPalette | undefined;
  getProjectPalettes: (projectId: string) => CachedPalette[];
  isLoading: boolean;
  refreshProjects: () => Promise<void>;
  refreshProjectPalettes: (projectId: string) => Promise<void>;
  clearCache: () => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

interface CacheProviderProps {
  children: React.ReactNode;
}

export const CacheProvider: React.FC<CacheProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<CachedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = projectPaletteCache.subscribe(() => {
      setProjects(projectPaletteCache.getProjects());
      setIsLoading(projectPaletteCache.isLoading());
    });
    setProjects(projectPaletteCache.getProjects());
    setIsLoading(projectPaletteCache.isLoading());
    return unsubscribe;
  }, []);

  const refreshProjects = async () => {
    try {
      projectPaletteCache.setLoading(true);
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await getUserProjects(token);
      if (response.success && response.projects) {
        projectPaletteCache.updateProjects(response.projects);
      } else {
        throw new Error(response.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error refreshing projects:', error);
      throw error;
    } finally {
      projectPaletteCache.setLoading(false);
    }
  };

  const refreshProjectPalettes = async (projectId: string) => {
    try {
      const project = projectPaletteCache.getProject(projectId);
      if (!project) return;
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const palettePromises = project.palettes.map(async (paletteId) => {
        try {
          const paletteData = await getPalette(paletteId, token);
          return {
            id: paletteId,
            ...paletteData
          };
        } catch (error) {
          console.error(`Failed to fetch palette ${paletteId}:`, error);
          return null;
        }
      });
      const paletteResults = await Promise.all(palettePromises);
      const validPalettes = paletteResults.filter((palette): palette is CachedPalette => palette !== null);
      projectPaletteCache.updatePalettes(validPalettes);
    } catch (error) {
      console.error('Error refreshing project palettes:', error);
      throw error;
    }
  };

  const clearCache = () => {
    projectPaletteCache.clear();
  };

  const value: CacheContextType = {
    projects,
    getProject: (projectId: string) => projectPaletteCache.getProject(projectId),
    getPalette: (paletteId: string) => projectPaletteCache.getPalette(paletteId),
    getProjectPalettes: (projectId: string) => projectPaletteCache.getProjectPalettes(projectId),
    isLoading,
    refreshProjects,
    refreshProjectPalettes,
    clearCache
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
}; 