import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Navigation } from '../components/Navigation';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { getUserProjects, createProject, deleteProject } from '../config/api';
import type { Project } from '../config/api';
import { getAuthToken } from '../utils/authUtils';
import { fuzzySearchWithScore } from '../utils/fuzzySearch';
import { useNavigate } from 'react-router-dom';

interface ProjectsProps {
  onNavigateBack: () => void;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onLogout: () => void;
  onNavigateToProjects: () => void;
  userName?: string;
}

export const Projects: React.FC<ProjectsProps> = ({ 
  onNavigateBack,
  onNavigateToLogin,
  onNavigateToSignup,
  onLogout,
  onNavigateToProjects,
  userName
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteProjectName, setDeleteProjectName] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Apply sorting when sort options change
  useEffect(() => {
    if (projects.length > 0) {
      // Apply search filter first, then sort
      if (!searchQuery.trim()) {
        setFilteredProjects(sortProjects(projects));
      } else {
        const projectNames = projects.map(p => p.name);
        const searchResults = fuzzySearchWithScore(searchQuery, projectNames);
        const matchedProjectNames = searchResults.map(result => result.item);
        
        const filtered = projects.filter(project => 
          matchedProjectNames.includes(project.name)
        );
        
        setFilteredProjects(sortProjects(filtered));
      }
    }
  }, [sortBy, sortOrder, projects, searchQuery]);

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
        setFilteredProjects(sortProjects(response.projects));
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
        setProjectName('');
        setShowCreateForm(false);
        // Fetch all projects again to get the updated list with proper sorting
        await fetchProjects();
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

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteProjectName(project.name);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await deleteProject(projectToDelete.id, token);
      if (response.success) {
        // Remove the project from the list
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      } else {
        throw new Error(response.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete project');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      setDeleteProjectName(null);
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

  const sortProjects = (projectsToSort: Project[]) => {
    return [...projectsToSort].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === 'desc' 
          ? nameB.localeCompare(nameA) 
          : nameA.localeCompare(nameB);
      }
    });
  };

  const groupProjectsByDate = (projectsToGroup: Project[]) => {
    const groups: { [key: string]: Project[] } = {};
    
    projectsToGroup.forEach(project => {
      const date = new Date(project.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
        groupKey = 'This Week';
      } else if (date.getTime() > today.getTime() - 30 * 24 * 60 * 60 * 1000) {
        groupKey = 'This Month';
      } else {
        groupKey = 'Older';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(project);
    });
    
    return groups;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredProjects(sortProjects(projects));
      return;
    }
    
    const projectNames = projects.map(p => p.name);
    const searchResults = fuzzySearchWithScore(query, projectNames);
    const matchedProjectNames = searchResults.map(result => result.item);
    
    const filtered = projects.filter(project => 
      matchedProjectNames.includes(project.name)
    );
    
    setFilteredProjects(sortProjects(filtered));
  };

  const handleSortChange = (newSortBy: 'date' | 'name') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProjects(sortProjects(projects));
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
          userName={userName}
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
          userName={userName}
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
          userName={userName}
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
          userName={userName}
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
    <div className="min-h-screen h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <Navigation 
        isLoggedIn={true}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToSignup={onNavigateToSignup}
        onLogout={onLogout}
        onNavigateToProjects={onNavigateToProjects}
        showProjectsButton={false}
        userName={userName}
        onNavigateToManageAccount={() => navigate('/account')}
      />
      <div className="pt-24 px-6">
        <div className="max-w-6xl mx-auto w-full">
          {/* Sticky header */}
          <div className="flex items-center justify-between mb-8 sticky top-0 z-10" style={{ background: 'var(--bg)' }}>
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary"
                onClick={onNavigateBack}
                className="flex items-center gap-2"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', backgroundColor: 'transparent' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </Button>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Projects</h1>
            </div>
            <div className="w-[25.5rem]">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pr-10"
                  style={{ backgroundColor: 'var(--bg-light)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Sticky action bar */}
          <div className="flex items-center justify-end gap-4 mb-8 sticky top-20 z-10" style={{ background: 'var(--bg)' }}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSortChange('date')}
                className={`px-3 py-1 rounded text-sm transition-colors ${sortBy === 'date' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                style={{ color: sortBy === 'date' ? 'var(--primary)' : 'var(--text-muted)', backgroundColor: sortBy === 'date' ? 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)' : 'transparent' }}
              >
                Date
                {sortBy === 'date' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 inline">
                    {sortOrder === 'desc' ? (
                      <path d="M7 14l5-5 5 5"/>
                    ) : (
                      <path d="M7 10l5 5 5-5"/>
                    )}
                  </svg>
                )}
              </button>
              <button
                onClick={() => handleSortChange('name')}
                className={`px-3 py-1 rounded text-sm transition-colors ${sortBy === 'name' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                style={{ color: sortBy === 'name' ? 'var(--primary)' : 'var(--text-muted)', backgroundColor: sortBy === 'name' ? 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)' : 'transparent' }}
              >
                Name
                {sortBy === 'name' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 inline">
                    {sortOrder === 'desc' ? (
                      <path d="M7 14l5-5 5 5"/>
                    ) : (
                      <path d="M7 10l5 5 5-5"/>
                    )}
                  </svg>
                )}
              </button>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Showing {filteredProjects.length} of {projects.length}
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              New Project
            </Button>
          </div>
        </div>
      </div>
      {/* Scrollable card grid area - only this is flex-1 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ paddingBottom: '2rem' }}>
        <div className="pt-0 px-6">
          <div className="max-w-6xl mx-auto w-full">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>
                  No projects found
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {searchQuery ? `No projects match "${searchQuery}"` : 'Create your first project to get started'}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupProjectsByDate(filteredProjects)).map(([groupName, groupProjects]) => (
                  <div key={groupName}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
                      {groupName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupProjects.map((project) => (
                        <Card 
                          key={project.id} 
                          className="relative group hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => navigate('/project', { state: { projectId: project.id } })}
                        >
                          <CardContent className="p-6">
                            {/* Project content */}
                            <div className="pb-8">
                              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                                {project.name.length > 20 ? `${project.name.substring(0, 20)}...` : project.name}
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
                              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
          setDeleteProjectName(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteProjectName && deleteProjectName.length > 20 ? `${deleteProjectName.substring(0, 20)}...` : deleteProjectName}"? This action cannot be undone.`}
        confirmText="Delete Project"
        isLoading={isDeleting}
      />
    </div>
  );
};