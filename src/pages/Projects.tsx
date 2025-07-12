import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Navigation } from '../components/Navigation';
import { getUserProjects, createProject, deleteProject } from '../config/api';
import type { Project } from '../config/api';
import { getAuthToken } from '../utils/authUtils';

interface ProjectsProps {
  onNavigateBack: () => void;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onLogout: () => void;
  onNavigateToProjects: () => void;
  onNavigateToProjectDetails: (projectId: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ 
  onNavigateBack,
  onNavigateToLogin,
  onNavigateToSignup,
  onLogout,
  onNavigateToProjects,
  onNavigateToProjectDetails
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
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
        setProjects(response.projects);
      } else {
        throw new Error(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    // Validate project name
    const trimmedName = projectName.trim();
    if (trimmedName.length > 100) {
      alert('Project name cannot exceed 100 characters');
      return;
    }

    // Check for invalid characters (only allow letters, numbers, spaces, dots, hyphens, and underscores)
    const validNameRegex = /^[a-zA-Z0-9\s.\-_]+$/;
    if (!validNameRegex.test(trimmedName)) {
      alert('Project name can only contain letters, numbers, spaces, dots (.), hyphens (-), and underscores (_)');
      return;
    }

    setIsCreating(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await createProject(trimmedName, '', token);
      if (response.success && response.project) {
        // Add the new project to the beginning of the list (most recent)
        setProjects(prev => [response.project!, ...prev]);
        setProjectName('');
        setShowCreateForm(false);
      } else {
        throw new Error(response.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      alert(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setProjectName('');
    setShowCreateForm(false);
  };

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await deleteProject(project.id, token);
      if (response.success) {
        // Remove the project from the list
        setProjects(prev => prev.filter(p => p.id !== project.id));
      } else {
        throw new Error(response.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Limit to 100 characters
    if (value.length > 100) {
      return;
    }
    
    // Only allow valid characters
    const validNameRegex = /^[a-zA-Z0-9\s.\-_]*$/;
    if (validNameRegex.test(value)) {
      setProjectName(value);
    }
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
            <p style={{ color: 'var(--text)' }}>Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
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
                <CardTitle style={{ color: 'var(--text)' }}>Error Loading Projects</CardTitle>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {error}
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={fetchProjects}
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

  // Show create form if no projects exist
  if (projects.length === 0 && !showCreateForm) {
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {/* Navigation Bar */}
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
                <CardTitle style={{ color: 'var(--text)' }}>No Projects Yet</CardTitle>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Create your first project to get started
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="w-full"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5v14"/>
                  </svg>
                  Create Project
                </Button>
                <button
                  onClick={onNavigateBack}
                  className="mt-4 text-sm transition-colors duration-150"
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

  // Show create project form
  if (showCreateForm) {
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
                <CardTitle style={{ color: 'var(--text)' }}>Create New Project</CardTitle>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Give your project a name to get started
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName" style={{ color: 'var(--text)' }}>Project Name</Label>
                    <Input
                      id="projectName"
                      type="text"
                      value={projectName}
                      onChange={handleProjectNameChange}
                      placeholder="Enter project name"
                      required
                      autoFocus
                      maxLength={100}
                      style={{
                        backgroundColor: 'var(--bg-light)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)'
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Only spaces, dots (.), hyphens (-), and underscores (_) are allowed as special characters.
                      </p>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {projectName.length}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      variant="secondary"
                      onClick={handleCancelCreate}
                      className="flex-1"
                      style={{
                        color: 'var(--text-muted)',
                        borderColor: 'var(--border)',
                        backgroundColor: 'transparent'
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isCreating || !projectName.trim()}
                    >
                      {isCreating ? 'Creating...' : 'Create Project'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show projects list
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
          {/* Header with back button and title */}
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
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Projects</h1>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              New Project
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="relative hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigateToProjectDetails(project.id)}
              >
                <CardContent className="p-6">
                  {/* Project content */}
                  <div className="pb-8">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                        {project.description}
                      </p>
                    )}
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {project.palettes.length} palette{project.palettes.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Delete icon button in the bottom right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project);
                    }}
                    className="absolute bottom-3 right-3"
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', padding: 0, cursor: 'pointer', transition: 'color 0.2s' }}
                    aria-label="Delete project"
                    disabled={isDeleting}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--danger)')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 