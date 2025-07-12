const API_BASE_URL = 'http://localhost:3001';

// REST API endpoints
export const PALETTES_API = `${API_BASE_URL}/api/palettes`;

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
export async function savePalette(name: string, config: PaletteConfig, colors: Color[]): Promise<{ success: boolean; id: string; message: string }> {
  try {
    const response = await fetch(`${PALETTES_API}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
export async function getPalette(id: string): Promise<GeneratedPalette> {
  try {
    const response = await fetch(`${PALETTES_API}/${id}`);

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

// Convert palette colors array to ColorPalette object
export function convertColorsToPalette(colors: Color[]): any {
  const palette: any = {};
  
  colors.forEach(color => {
    // Keep the original color name with hyphens to match CSS custom properties
    palette[color.name] = color.value;
  });
  
  return palette;
} 