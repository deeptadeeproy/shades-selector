import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Navigation } from '../components/Navigation';
import { getUserProjects, updateProject, getPalette } from '../config/api';
import type { Project } from '../config/api';
import { getAuthToken } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';

interface ProjectDetailsProps {
  projectId: string;
  onNavigateBack: () => void;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onLogout: () => void;
  onNavigateToProjects: () => void;
}

interface PaletteData {
  id: string;
  colors: Array<{ name: string; value: string }>;
  config: { hue: number; chroma: number; isLight: boolean };
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ 
  projectId,
  onNavigateBack,
  onNavigateToLogin,
  onNavigateToSignup,
  onLogout,
  onNavigateToProjects
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [palettes, setPalettes] = useState<PaletteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [isLoadingPalettes, setIsLoadingPalettes] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Fetch project details on component mount
  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await getUserProjects(token);
      if (response.success && response.projects) {
        const foundProject = response.projects.find(p => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
          setEditName(foundProject.name);
          // Fetch palettes after project is loaded
          await fetchPalettes(foundProject.palettes);
        } else {
          setError('Project not found');
        }
      } else {
        throw new Error(response.message || 'Failed to fetch project');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPalettes = async (paletteIds: string[]) => {
    if (paletteIds.length === 0) {
      setPalettes([]);
      return;
    }

    setIsLoadingPalettes(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const palettePromises = paletteIds.map(async (paletteId) => {
        try {
          const paletteData = await getPalette(paletteId, token);
          return {
            id: paletteId,
            colors: paletteData.colors,
            config: paletteData.config
          };
        } catch (error) {
          console.error(`Failed to fetch palette ${paletteId}:`, error);
          // Return a placeholder palette if fetch fails
          return {
            id: paletteId,
            colors: [],
            config: { hue: 0, chroma: 0, isLight: false }
          };
        }
      });

      const paletteResults = await Promise.all(palettePromises);
      setPalettes(paletteResults);
    } catch (error) {
      console.error('Error fetching palettes:', error);
      setPalettes([]);
    } finally {
      setIsLoadingPalettes(false);
    }
  };

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (!project || !editName.trim() || editName.trim() === project.name) {
      setIsEditingName(false);
      return;
    }

    // Validate project name
    const trimmedName = editName.trim();
    if (trimmedName.length > 100) {
      alert('Project name cannot exceed 100 characters');
      return;
    }

    // Check for invalid characters
    const validNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9 .,_-]*$/;
    if (!validNameRegex.test(trimmedName)) {
      alert('Project name must start with a letter or number and can only contain letters, numbers, spaces, dots (.), commas (,), hyphens (-), and underscores (_).');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await updateProject(project.id, { name: trimmedName }, token);
      if (response.success && response.project) {
        // Preserve the existing palettes array since the API response doesn't include it
        setProject({
          ...response.project,
          palettes: project.palettes
        });
        setIsEditingName(false);
      } else {
        throw new Error(response.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      alert(error instanceof Error ? error.message : 'Failed to update project');
      setEditName(project.name); // Reset to original name on error
    }
  };

  const handleNameCancel = () => {
    setEditName(project?.name || '');
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  const handleNameBlur = () => {
    handleNameSave();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <Navigation 
          isLoggedIn={true}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToSignup={onNavigateToSignup}
          onLogout={onLogout}
          onNavigateToProjects={onNavigateToProjects}
          showProjectsButton={false}
        />
        
        <div className="flex items-center justify-center p-6 pt-24 min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p style={{ color: 'var(--text)' }}>Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !project) {
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <Navigation 
          isLoggedIn={true}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToSignup={onNavigateToSignup}
          onLogout={onLogout}
          onNavigateToProjects={onNavigateToProjects}
          showProjectsButton={false}
        />
        
        <div className="flex items-center justify-center p-6 pt-24 min-h-screen">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="text-center">
                <CardTitle style={{ color: 'var(--text)' }}>Error Loading Project</CardTitle>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {error || 'Project not found'}
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={fetchProject}
                  className="w-full mb-3"
                >
                  Try Again
                </Button>
                <button
                  onClick={onNavigateBack}
                  className="text-sm transition-colors duration-150"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  Go back
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <Navigation 
        isLoggedIn={true}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToSignup={onNavigateToSignup}
        onLogout={onLogout}
        onNavigateToProjects={onNavigateToProjects}
        showProjectsButton={false}
      />
      <div className="pt-24 px-6">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header with back button and editable project name */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="secondary"
              onClick={onNavigateBack}
              className="flex items-center gap-2"
              style={{
                color: 'var(--text-muted)',
                borderColor: 'var(--border)',
                backgroundColor: 'transparent'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </Button>
            
            <div className="flex-1">
              {isEditingName ? (
                <Input
                  ref={nameInputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Prevent leading spaces
                    if (value.startsWith(' ')) {
                      value = value.trimStart();
                    }
                    if (value.length <= 100) {
                      const validNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9 .,_-]*$/;
                      if (validNameRegex.test(value) || value === '') {
                        setEditName(value);
                      }
                    }
                  }}
                  onKeyDown={handleNameKeyDown}
                  onBlur={handleNameBlur}
                  maxLength={100}
                  className="text-3xl font-bold border-2 border-blue-500 focus:border-blue-600"
                  style={{
                    backgroundColor: 'var(--bg-light)',
                    color: 'var(--text)',
                    padding: '0.5rem 1rem'
                  }}
                />
              ) : (
                <h1 
                  className="text-3xl font-bold cursor-pointer hover:bg-opacity-10 transition-colors duration-200 rounded px-2 py-1"
                  style={{ color: 'var(--text)' }}
                  onClick={handleNameClick}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(var(--text-rgb, 0, 0, 0), 0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {project.name}
                </h1>
              )}
              {isEditingName && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Press Enter to save, Escape to cancel
                </p>
              )}
            </div>
          </div>

          {/* Project info */}
          <div className="mb-8">
            {project.description && (
              <p className="text-lg mb-2" style={{ color: 'var(--text-muted)' }}>
                {project.description}
              </p>
            )}
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Created {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Palettes section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                Palettes ({project.palettes.length})
              </h2>
              {isLoadingPalettes && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading palettes...</span>
                </div>
              )}
            </div>
            
            {project.palettes.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="mb-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)' }}>
                      <circle cx="13.5" cy="6.5" r=".5"/>
                      <circle cx="17.5" cy="10.5" r=".5"/>
                      <circle cx="8.5" cy="7.5" r=".5"/>
                      <circle cx="6.5" cy="12.5" r=".5"/>
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>
                    No palettes yet
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Create your first palette to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {palettes.map((palette, index) => (
                  <Card key={palette.id} className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => navigate(`/app?paletteId=${palette.id}`)}
                  >
                    <CardContent className="p-4">
                      {/* Color grid */}
                      <div className="aspect-square rounded-lg mb-3 overflow-hidden">
                        {palette.colors.length > 0 ? (
                          <div className="grid grid-cols-5 grid-rows-3 h-full w-full gap-0.5">
                            {palette.colors.slice(0, 15).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="relative group col-span-1 row-span-1"
                                style={{ backgroundColor: color.value }}
                                title={`${color.name}: ${color.value}`}
                              >
                                {/* Color name overlay on hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1 text-center leading-tight">
                                    {color.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {/* Fill remaining slots if less than 15 colors */}
                            {Array.from({ length: Math.max(0, 15 - palette.colors.length) }).map((_, i) => (
                              <div
                                key={`empty-${i}`}
                                className="col-span-1 row-span-1 bg-gray-200 dark:bg-gray-700"
                              />
                            ))}
                          </div>
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{ 
                              background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                              backgroundSize: '20px 20px',
                              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                            }}
                          >
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              Loading...
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Palette info */}
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm flex items-center gap-1" style={{ color: 'var(--text)' }}>
                          Palette {index + 1}
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="inline align-middle opacity-70"><path d="M7 13L13 7M13 7H7M13 7V13"/></svg>
                        </h3>
                        {palette.config && (
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Hue: {palette.config.hue}° • {palette.config.isLight ? 'Light' : 'Dark'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 