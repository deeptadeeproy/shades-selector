import type { Project, GeneratedPalette } from '../config/api';

export interface CachedPalette extends GeneratedPalette {
  id: string;
}

export interface CachedProject {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  palettes: string[]; // palette IDs
}

export interface CacheState {
  projects: CachedProject[];
  palettes: Map<string, CachedPalette>;
  lastUpdated: number;
  isLoading: boolean;
}

class ProjectPaletteCache {
  private cache: CacheState = {
    projects: [],
    palettes: new Map(),
    lastUpdated: 0,
    isLoading: false
  };

  private listeners: Set<() => void> = new Set();

  getProjects(): CachedProject[] {
    return this.cache.projects;
  }

  getProject(projectId: string): CachedProject | undefined {
    return this.cache.projects.find(p => p.id === projectId);
  }

  getPalette(paletteId: string): CachedPalette | undefined {
    return this.cache.palettes.get(paletteId);
  }

  getProjectPalettes(projectId: string): CachedPalette[] {
    const project = this.getProject(projectId);
    if (!project) return [];
    return project.palettes
      .map(pid => this.cache.palettes.get(pid))
      .filter((p): p is CachedPalette => !!p);
  }

  isStale(): boolean {
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - this.cache.lastUpdated > fiveMinutes;
  }

  isEmpty(): boolean {
    return this.cache.projects.length === 0;
  }

  isLoading(): boolean {
    return this.cache.isLoading;
  }

  setLoading(loading: boolean): void {
    this.cache.isLoading = loading;
    this.notifyListeners();
  }

  updateProjects(projects: Project[]): void {
    this.cache.projects = projects.map(project => ({ ...project }));
    this.cache.lastUpdated = Date.now();
    this.notifyListeners();
  }

  updatePalette(paletteId: string, palette: GeneratedPalette): void {
    this.cache.palettes.set(paletteId, { ...palette, id: paletteId });
    this.cache.lastUpdated = Date.now();
    this.notifyListeners();
  }

  updatePalettes(palettes: CachedPalette[]): void {
    palettes.forEach(palette => {
      this.cache.palettes.set(palette.id, palette);
    });
    this.cache.lastUpdated = Date.now();
    this.notifyListeners();
  }

  addProject(project: Project): void {
    this.cache.projects.push({ ...project });
    this.cache.lastUpdated = Date.now();
    this.notifyListeners();
  }

  updateProject(projectId: string, updates: Partial<Project>): void {
    const index = this.cache.projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      this.cache.projects[index] = {
        ...this.cache.projects[index],
        ...updates,
        palettes: updates.palettes || this.cache.projects[index].palettes
      };
      this.cache.lastUpdated = Date.now();
      this.notifyListeners();
    }
  }

  removeProject(projectId: string): void {
    this.cache.projects = this.cache.projects.filter(p => p.id !== projectId);
    this.cache.lastUpdated = Date.now();
    this.notifyListeners();
  }

  removePalette(paletteId: string): void {
    this.cache.palettes.delete(paletteId);
    this.cache.projects = this.cache.projects.map(project => ({
      ...project,
      palettes: project.palettes.filter(pid => pid !== paletteId)
    }));
    this.cache.lastUpdated = Date.now();
    this.notifyListeners();
  }

  clear(): void {
    this.cache = {
      projects: [],
      palettes: new Map(),
      lastUpdated: 0,
      isLoading: false
    };
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const projectPaletteCache = new ProjectPaletteCache(); 