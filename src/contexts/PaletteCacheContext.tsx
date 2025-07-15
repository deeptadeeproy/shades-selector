import React, { createContext, useContext, useState, useCallback } from 'react';
import { getPalette } from '../config/api';
import type { GeneratedPalette } from '../config/api';
import { getAuthToken } from '../utils/authUtils';

interface PaletteCacheContextType {
  paletteCache: Record<string, GeneratedPalette>;
  getPaletteById: (id: string) => Promise<GeneratedPalette | undefined>;
  setPaletteInCache: (id: string, palette: GeneratedPalette) => void;
  removePaletteFromCache: (id: string) => void;
  clearPaletteCache: () => void;
}

const PaletteCacheContext = createContext<PaletteCacheContextType | undefined>(undefined);

export const usePaletteCache = () => {
  const ctx = useContext(PaletteCacheContext);
  if (!ctx) throw new Error('usePaletteCache must be used within PaletteCacheProvider');
  return ctx;
};

export const PaletteCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paletteCache, setPaletteCache] = useState<Record<string, GeneratedPalette>>({});

  const getPaletteById = useCallback(async (id: string) => {
    if (paletteCache[id]) return paletteCache[id];
    const token = getAuthToken();
    if (!token) return undefined;
    const palette = await getPalette(id, token);
    setPaletteCache(prev => ({ ...prev, [id]: palette }));
    return palette;
  }, [paletteCache]);

  const setPaletteInCache = useCallback((id: string, palette: GeneratedPalette) => {
    setPaletteCache(prev => ({ ...prev, [id]: palette }));
  }, []);

  const removePaletteFromCache = useCallback((id: string) => {
    setPaletteCache(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearPaletteCache = useCallback(() => {
    setPaletteCache({});
  }, []);

  return (
    <PaletteCacheContext.Provider value={{ paletteCache, getPaletteById, setPaletteInCache, removePaletteFromCache, clearPaletteCache }}>
      {children}
    </PaletteCacheContext.Provider>
  );
}; 