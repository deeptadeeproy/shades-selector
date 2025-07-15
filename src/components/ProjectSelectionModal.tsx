import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './ui/modal';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { createProject, savePaletteToProject, savePalette, type Project } from '../config/api';
import { fuzzySearchWithScore } from '../utils/fuzzySearch';
import { generatePaletteName } from '../utils/colorUtils';
import type { ColorPalette } from '../utils/colorUtils';
import { useProjectCache } from '../contexts/ProjectCacheContext';

interface ProjectSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectId: string, projectName: string, suppressToast?: boolean) => void;
  palette: ColorPalette;
  userToken: string;
  paletteConfig?: {
    hue: number;
    chroma: number;
    isLight: boolean;
  };
}

export const ProjectSelectionModal: React.FC<ProjectSelectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  palette,
  userToken,
  paletteConfig
}) => {
  const { projects, isLoading, refreshProjects, setProjects } = useProjectCache();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isSavingPalette, setIsSavingPalette] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Add a new state for the create+save step
  const [createSaveStep, setCreateSaveStep] = useState<'idle' | 'creating' | 'saving'>('idle');

  // Default projects to an empty array for type safety
  const safeProjects = projects ?? [];

  // Filter projects based on search query and update displayed projects
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(safeProjects);
      // Show only the 5 most recent projects when no search query
      const recentProjects = safeProjects.slice(0, 5);
      setDisplayedProjects(recentProjects);
      setShowAllProjects(safeProjects.length > 5);
    } else {
      const projectNames = safeProjects.map(p => p.name);
      const searchResults = fuzzySearchWithScore(searchQuery, projectNames);
      const matchedProjectNames = searchResults.map(result => result.item);
      
      const filtered = safeProjects.filter(project => 
        matchedProjectNames.includes(project.name)
      );
      
      setFilteredProjects(filtered);
      setDisplayedProjects(filtered);
      setShowAllProjects(false); // When searching, show all results
    }
  }, [searchQuery, projects]);

  // Show success message and close modal after 2 seconds
  useEffect(() => {
    if (successMessage && selectedProjectId && safeProjects.length > 0) {
      const project = safeProjects.find(p => p.id === selectedProjectId);
      const timeout = setTimeout(() => {
        if (project) {
          onSave(project.id, project.name, true); // Pass suppressToast=true
        }
        onClose();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, selectedProjectId, safeProjects, onSave, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSuccessMessage(null);
      setError(null);
    }
  }, [isOpen]);

  // Reset createSaveStep when modal closes
  useEffect(() => {
    if (!isOpen) setCreateSaveStep('idle');
  }, [isOpen]);

  const handleCreateProject = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError('Project name is required');
      return;
    }

    setIsCreatingProject(true);
    setError(null);
    setCreateSaveStep('creating');

    try {
      // 1. Create the project
      const response = await createProject(searchQuery.trim(), '', userToken);
      if (response.success && response.project) {
        // Update the global cache
        await refreshProjects();
        setNewProjectName('');
        setIsCreatingProject(false);
        setSelectedProjectId(response.project.id);
        setCreateSaveStep('saving');
        // 2. Save the palette to the new project
        const colors = Object.entries(palette).map(([name, value]) => ({ name, value }));
        const config = paletteConfig || {
          hue: 265, // Default values if not provided
          chroma: 0.0,
          isLight: false
        };
        const paletteName = generatePaletteName(palette as unknown as Record<string, string>); // <-- Use unknown cast
        const paletteResponse = await savePalette(paletteName, config, colors, userToken);
        if (!paletteResponse.success) {
          throw new Error(paletteResponse.message || 'Failed to save palette');
        }
        const saveResponse = await savePaletteToProject(response.project.id, paletteResponse.id, userToken);
        if (!saveResponse.success) {
          throw new Error(saveResponse.message || 'Failed to save palette to project');
        }
        if (response.project) {
          setSuccessMessage(`Project ${response.project.name.length > 20 ? `${response.project.name.substring(0, 20)}...` : response.project.name} created and palette saved!`);
        }
      } else {
        throw new Error(response.message || 'Failed to create project');
      }
    } catch (err) {
      console.error('Error creating project or saving palette:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project or save palette');
      setCreateSaveStep('idle');
    } finally {
      setIsCreatingProject(false);
      setIsSavingPalette(false);
    }
  }, [searchQuery, userToken, palette, paletteConfig, refreshProjects]);

  const handleSaveToProject = useCallback(async () => {
    if (!selectedProjectId) {
      setError('Please select a project');
      return;
    }

    setIsSavingPalette(true);
    setError(null);
    setCreateSaveStep('saving');

    try {
      // First save the palette to get a palette ID
      const colors = Object.entries(palette).map(([name, value]) => ({ name, value }));
      const config = paletteConfig || {
        hue: 265, // Default values if not provided
        chroma: 0.0,
        isLight: false
      };
      
      const paletteName = generatePaletteName(palette as unknown as Record<string, string>); // <-- Use unknown cast
      const paletteResponse = await savePalette(paletteName, config, colors, userToken);
      
      if (!paletteResponse.success) {
        throw new Error(paletteResponse.message || 'Failed to save palette');
      }

      // Then add the palette to the selected project
      const response = await savePaletteToProject(selectedProjectId, paletteResponse.id, userToken);
      if (response.success) {
        // Update the project's palettes in the global cache
        setProjects(prev => prev ? prev.map(p => p.id === selectedProjectId ? { ...p, palettes: [...(p.palettes || []), paletteResponse.id] } : p) : null);
        const selectedProject = safeProjects.find(p => p.id === selectedProjectId);
        setSuccessMessage(`Palette saved to project ${selectedProject?.name && selectedProject.name.length > 20 ? `${selectedProject.name.substring(0, 20)}...` : selectedProject?.name || 'Unknown Project'}!`);
        setSelectedProjectId(selectedProjectId);
        // The useEffect will handle calling onSave and onClose after 2 seconds
      } else {
        throw new Error(response.message || 'Failed to save palette to project');
      }
    } catch (err) {
      console.error('Error saving palette to project:', err);
      setError(err instanceof Error ? err.message : 'Failed to save palette to project');
      setCreateSaveStep('idle');
    } finally {
      setIsSavingPalette(false);
      setCreateSaveStep('idle');
    }
  }, [selectedProjectId, projects, userToken, onSave, onClose, palette]);

  const handleClose = useCallback(() => {
    setSearchQuery('');
    setNewProjectName('');
    setSelectedProjectId(null);
    setError(null);
    setShowAllProjects(false);
    setSuccessMessage(null);
    onClose();
  }, [onClose]);

  const handleShowAllProjects = useCallback(() => {
    setDisplayedProjects(filteredProjects);
    setShowAllProjects(false);
  }, [filteredProjects]);

  const showCreateNewOption = searchQuery.trim() && 
    displayedProjects.length === 0;

  // Auto-fill new project name with search query when create option appears
  useEffect(() => {
    if (showCreateNewOption && !newProjectName) {
      setNewProjectName(searchQuery);
    }
  }, [showCreateNewOption, searchQuery, newProjectName]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow up to 100 characters
    if (value.length > 100) return;
    // Only allow letters, numbers, spaces, dots, hyphens, and underscores
    const validNameRegex = /^[a-zA-Z0-9\s.\-_]*$/;
    if (validNameRegex.test(value)) {
      setSearchQuery(value);
      setError(null);
    } else {
      setError('Only dots (.), hyphens (-), and underscores (_) are allowed as special characters.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} palette={palette}>
      <div className="p-6">
        {successMessage ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div className="text-lg font-semibold mb-2 text-muted" style={{ color: 'var(--text-muted)' }}>{successMessage}</div>
          </div>
        ) : createSaveStep === 'creating' || createSaveStep === 'saving' ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="p-3 rounded-lg border border-dashed flex items-center justify-center w-full transition-colors text-base font-light min-h-[56px] mx-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)', maxWidth: 400 }}>
              <div className="flex items-center gap-2 mx-auto">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
                <span>{createSaveStep === 'creating' ? 'Creating Project...' : 'Saving palette...'}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Normal modal content here (input, project list, buttons) */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Save Palette to Project
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Select an existing project or create a new one to save your palette.
              </p>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ 
                backgroundColor: 'rgba(var(--danger-rgb, 239, 68, 68), 0.1)',
                color: 'var(--danger)',
                border: '1px solid rgba(var(--danger-rgb, 239, 68, 68), 0.2)'
              }}>
                {error}
              </div>
            )}

            {/* Projects List */}
            <div className="mb-4 max-h-64 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
                  <span className="ml-2 text-sm" style={{ color: 'var(--text-muted)' }}>Loading projects...</span>
                </div>
              ) : displayedProjects.length === 0 && !searchQuery ? (
                <div className="text-center py-8">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    No projects found. Create your first project to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {displayedProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedProjectId === project.id 
                          ? 'border-transparent' 
                          : 'border-transparent'
                      }`}
                      style={{
                        backgroundColor: selectedProjectId === project.id 
                          ? 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)' 
                          : 'var(--bg-light)',
                        borderColor: selectedProjectId === project.id ? 'transparent' : undefined,
                      }}
                      onMouseEnter={e => {
                        if (selectedProjectId !== project.id) {
                          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (selectedProjectId !== project.id) {
                          (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                        }
                      }}
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium" style={{ color: 'var(--text)' }}>
                            {project.name.length > 20 ? `${project.name.substring(0, 20)}...` : project.name}
                          </h3>
                          {project.description && (
                            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                              {project.description}
                            </p>
                          )}
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            {project.palettes.length} palette{project.palettes.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {selectedProjectId === project.id && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Create New Project Option */}
                  {showCreateNewOption && (
                    createSaveStep !== 'idle' ? null : (
                      <button
                        className="p-3 rounded-lg border border-dashed flex items-center justify-center w-full transition-colors text-base font-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}
                        onClick={() => {
                          setNewProjectName(searchQuery);
                          handleCreateProject();
                        }}
                        disabled={isCreatingProject || isSavingPalette}
                      >
                        <span className="font-light">Create Project </span>
                        <span className="font-medium text-lg mx-1">{searchQuery.length > 20 ? `${searchQuery.substring(0, 20)}...` : searchQuery}</span>
                        <span className="font-light"> and save palette</span>
                      </button>
                    )
                  )}

                  {/* Show More Projects Option */}
                  {showAllProjects && !searchQuery && (
                    <div className="p-3 rounded-lg border border-dashed cursor-pointer hover:bg-opacity-50 transition-colors" 
                         style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(var(--border-rgb, 0, 0, 0), 0.05)' }}
                         onClick={handleShowAllProjects}>
                      <div className="flex items-center justify-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                          Search more ({filteredProjects.length - 5} more projects)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading || isSavingPalette || isCreatingProject}
              >
                Cancel
              </Button>
              {/* Only show Save to Project if not in create mode and not saving */}
              {!showCreateNewOption && createSaveStep === 'idle' && (
                <Button
                  onClick={handleSaveToProject}
                  disabled={isSavingPalette || !selectedProjectId}
                >
                  Save to Project
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}; 