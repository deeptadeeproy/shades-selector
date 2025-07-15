import { useEffect, useRef } from 'react';
import { useCache } from '../contexts/CacheContext';
import { getAuthToken } from '../utils/authUtils';

export const useBackgroundLoader = (isLoggedIn: boolean) => {
  const { refreshProjects, isLoading } = useCache();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) {
      hasLoadedRef.current = false;
      return;
    }

    const token = getAuthToken();
    if (!token) {
      return;
    }

    // Load projects in background if not already loaded
    if (!hasLoadedRef.current && !isLoading) {
      hasLoadedRef.current = true;
      refreshProjects().catch(error => {
        console.error('Background projects load failed:', error);
        hasLoadedRef.current = false; // Reset flag to allow retry
      });
    }
  }, [isLoggedIn, refreshProjects, isLoading]);

  return {
    isBackgroundLoading: hasLoadedRef.current && isLoading
  };
}; 