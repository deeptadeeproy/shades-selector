export interface ColorPalette {
  // Background colors
  'bg-dark': string;
  bg: string;
  'bg-light': string;
  
  // Text colors
  text: string;
  'text-muted': string;
  
  // Border colors
  highlight: string;
  border: string;
  'border-muted': string;
  
  // Action colors
  primary: string;
  secondary: string;
  
  // Alert colors
  danger: string;
  warning: string;
  success: string;
  info: string;
}

export interface ColorConfig {
  hue: number; // 0 to 360
  chroma: number; // 0 to 0.4
  isLight: boolean; // theme mode
}

// Convert OKLCH to hex
function oklchToHex(l: number, c: number, h: number): string {
  // Simple OKLCH to RGB conversion (for demo purposes)
  // In a real implementation, you'd use a proper color conversion library
  const hueRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hueRad);
  const b = c * Math.sin(hueRad);
  
  // Convert to RGB (simplified)
  const r = Math.round(255 * Math.max(0, Math.min(1, l + 1.13983 * a + 0.39465 * b)));
  const g = Math.round(255 * Math.max(0, Math.min(1, l - 0.58060 * a + 0.80511 * b)));
  const b_val = Math.round(255 * Math.max(0, Math.min(1, l - 0.80511 * a - 0.80511 * b)));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b_val.toString(16).padStart(2, '0')}`;
}

// Convert OKLCH to RGB values
function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  const hueRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hueRad);
  const b = c * Math.sin(hueRad);
  
  const r = Math.round(255 * Math.max(0, Math.min(1, l + 1.13983 * a + 0.39465 * b)));
  const g = Math.round(255 * Math.max(0, Math.min(1, l - 0.58060 * a + 0.80511 * b)));
  const b_val = Math.round(255 * Math.max(0, Math.min(1, l - 0.80511 * a - 0.80511 * b)));
  
  return { r, g, b: b_val };
}

// Generate OKLCH color
function generateOklchColor(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`;
}

// Generate OKLCH color with RGB fallback
function generateOklchColorWithRgb(l: number, c: number, h: number): { oklch: string; rgb: string } {
  const oklch = generateOklchColor(l, c, h);
  const rgb = oklchToRgb(l, c, h);
  return {
    oklch,
    rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`
  };
}

// Generate the complete color palette using OKLCH
export function generateColorPalette(config: ColorConfig): ColorPalette {
  const { hue, chroma, isLight } = config;
  const hueSecondary = (hue + 180) % 360;
  
  // Calculate chroma values for different purposes
  const chromaBg = +(chroma * 0.5).toFixed(3);
  const chromaText = +Math.min(chroma, 0.1).toFixed(3);
  const chromaAction = +Math.max(chroma, 0.1).toFixed(3);
  const chromaAlert = +Math.max(chroma, 0.05).toFixed(3);

  // Fixed alert color hues - always semantic colors
  const dangerHue = 30; // Red
  const warningHue = 100; // Yellow/Orange
  const successHue = 160; // Green
  const infoHue = 260; // Blue

  if (!isLight) {
    // Dark mode
    const bgLight = generateOklchColorWithRgb(0.2, chromaBg, hue);
    const border = generateOklchColorWithRgb(0.4, chroma, hue);
    
    return {
      // Background colors
      'bg-dark': generateOklchColor(0.1, chromaBg, hue),
      bg: generateOklchColor(0.15, chromaBg, hue),
      'bg-light': bgLight.oklch,
      
      // Text colors
      text: generateOklchColor(0.96, chromaText, hue),
      'text-muted': generateOklchColor(0.76, chromaText, hue),
      
      // Border colors
      highlight: generateOklchColor(0.5, chroma, hue),
      border: border.oklch,
      'border-muted': generateOklchColor(0.3, chroma, hue),
      
      // Action colors
      primary: generateOklchColor(0.76, chromaAction, hue),
      secondary: generateOklchColor(0.76, chromaAction, hueSecondary),
      
      // Alert colors - fixed semantic hues with adaptive chroma
      danger: generateOklchColor(0.7, chromaAlert, dangerHue),
      warning: generateOklchColor(0.7, chromaAlert, warningHue),
      success: generateOklchColor(0.7, chromaAlert, successHue),
      info: generateOklchColor(0.7, chromaAlert, infoHue),
    };
  } else {
    // Light mode
    const bgLight = generateOklchColorWithRgb(1, chromaBg, hue);
    const border = generateOklchColorWithRgb(0.6, chroma, hue);
    
    return {
      // Background colors
      'bg-dark': generateOklchColor(0.92, chromaBg, hue),
      bg: generateOklchColor(0.96, chromaBg, hue),
      'bg-light': bgLight.oklch,
      
      // Text colors
      text: generateOklchColor(0.15, chroma, hue),
      'text-muted': generateOklchColor(0.4, chroma, hue),
      
      // Border colors
      highlight: generateOklchColor(1, chroma, hue),
      border: border.oklch,
      'border-muted': generateOklchColor(0.7, chroma, hue),
      
      // Action colors
      primary: generateOklchColor(0.4, chromaAction, hue),
      secondary: generateOklchColor(0.4, chromaAction, hueSecondary),
      
      // Alert colors - fixed semantic hues with adaptive chroma
      danger: generateOklchColor(0.5, chromaAlert, dangerHue),
      warning: generateOklchColor(0.5, chromaAlert, warningHue),
      success: generateOklchColor(0.5, chromaAlert, successHue),
      info: generateOklchColor(0.5, chromaAlert, infoHue),
    };
  }
}

// Create gradient for hue slider
export function createHueGradient(chroma: number = 0.1, lightness: number = 0.5): string {
  const steps = 32;
  const colors = [];
  
  for (let i = 0; i <= steps; i++) {
    const hue = (i / steps) * 360;
    const color = generateOklchColor(lightness, chroma, hue);
    colors.push(color);
  }
  
  return `linear-gradient(to right, ${colors.join(', ')})`;
}

// Create gradient for chroma slider
export function createChromaGradient(hue: number = 200, lightness: number = 0.5): string {
  const steps = 20;
  const colors = [];
  
  for (let i = 0; i <= steps; i++) {
    const chroma = (i / steps) * 0.4;
    const color = generateOklchColor(lightness, chroma, hue);
    colors.push(color);
  }
  
  return `linear-gradient(to right, ${colors.join(', ')})`;
} 