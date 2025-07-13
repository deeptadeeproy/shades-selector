import { API_BASE_URL } from './environment';

// REST API endpoints
export const PALETTES_API = `${API_BASE_URL}/api/palettes`;
export const AUTH_API = `${API_BASE_URL}/api/auth`;

// Type definitions
export interface PaletteConfig {
  hue: number;
  chroma: number;
  isLight: boolean;
}

export interface Color {
  name: string;
  value: string;
}

export interface GeneratedPalette {
  success: boolean;
  config: PaletteConfig;
  colors: Color[];
}

export interface ApiColorPalette {
  [key: string]: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  token: string;
}

// Project-related interfaces
export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  palettes: string[];
}

export interface ProjectResponse {
  success: boolean;
  projects?: Project[];
  project?: Project;
  message?: string;
}

export interface SavePaletteToProjectResponse {
  success: boolean;
  message: string;
  project?: Project;
}

// Generate palette using REST API
export async function generatePalette(hue: number, chroma: number, isLight: boolean): Promise<GeneratedPalette> {
  try {
    console.log('Sending REST request:', { hue, chroma, isLight });
    
    const response = await fetch(`${PALETTES_API}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hue,
        chroma,
        isLight
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('REST response:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to generate palette');
    }

    return result;
  } catch (error) {
    console.error('Error generating palette:', error);
    throw error;
  }
}

// Save palette
export async function savePalette(
  name: string, 
  config: PaletteConfig, 
  colors: Color[], 
  token: string
): Promise<{ success: boolean; id: string; message: string }> {
  try {
    const response = await fetch(`${PALETTES_API}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        config,
        colors
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving palette:', error);
    throw error;
  }
}

// Get palette by ID
export async function getPalette(id: string, token: string): Promise<GeneratedPalette> {
  try {
    const response = await fetch(`${PALETTES_API}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting palette:', error);
    throw error;
  }
}

// Delete palette
export async function deletePalette(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${PALETTES_API}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting palette:', error);
    throw error;
  }
}

// Update palette by ID
export async function updatePalette(id: string, colors: Color[], config: PaletteConfig, token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${PALETTES_API}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ colors, config })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating palette:', error);
    throw error;
  }
}

// Convert palette colors array to ColorPalette object
export function convertColorsToPalette(colors: Color[]): any {
  const palette: any = {};
  
  colors.forEach(color => {
    // Keep the original color name with hyphens to match CSS custom properties
    palette[color.name] = color.value;
  });
  
  return palette;
}

// Authentication API functions
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Login failed');
    }

    return result;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${AUTH_API}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

export async function updateUserName(newName: string, token: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_API}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: newName })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user name:', error);
    throw error;
  }
}

export async function deleteUser(token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${AUTH_API}/user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Project API functions
export async function getUserProjects(token: string): Promise<ProjectResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }
}

export async function createProject(name: string, description: string, token: string): Promise<ProjectResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        description
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProject(projectId: string, updates: { name?: string; description?: string }, token: string): Promise<ProjectResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(projectId: string, token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function savePaletteToProject(
  projectId: string, 
  paletteId: string, 
  token: string
): Promise<SavePaletteToProjectResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/palettes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        paletteId
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving palette to project:', error);
    throw error;
  }
} 