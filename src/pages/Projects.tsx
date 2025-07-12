import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Navigation } from '../components/Navigation';

interface ProjectsProps {
  onNavigateBack: () => void;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onLogout: () => void;
  onNavigateToProjects: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({ 
  onNavigateBack,
  onNavigateToLogin,
  onNavigateToSignup,
  onLogout,
  onNavigateToProjects
}) => {
  const [projects, setProjects] = useState<any[]>([]); // Empty for now
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

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
      // TODO: Add API call to create project
      console.log('Creating project:', trimmedName);
      
      // For now, just add to local state
      const newProject = {
        id: Date.now(),
        name: trimmedName,
        createdAt: new Date().toISOString()
      };
      
      setProjects(prev => [...prev, newProject]);
      setProjectName('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setProjectName('');
    setShowCreateForm(false);
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

  // Show create form if no projects exist
  if (projects.length === 0 && !showCreateForm) {
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {/* Navigation Bar */}
        <Navigation 
          palette={null}
          isLoggedIn={true}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToSignup={onNavigateToSignup}
          onLogout={onLogout}
          onNavigateToProjects={onNavigateToProjects}
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
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
          palette={null}
          isLoggedIn={true}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToSignup={onNavigateToSignup}
          onLogout={onLogout}
          onNavigateToProjects={onNavigateToProjects}
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

  // Show projects list (for future use)
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <Navigation 
        palette={null}
        isLoggedIn={true}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToSignup={onNavigateToSignup}
        onLogout={onLogout}
        onNavigateToProjects={onNavigateToProjects}
      />
      <div className="p-6 pt-24 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Projects</h1>
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
            <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                  {project.name}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}; 