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
  tertiary: string;
  
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

import { oklchToRgba } from './oklchConversions';

// Cache for expensive calculations
const colorCache = new Map<string, string>();
const gradientCache = new Map<string, string>();

// Cache key generator
const getCacheKey = (l: number, c: number, h: number): string => `${l.toFixed(3)}_${c.toFixed(3)}_${h.toFixed(1)}`;
const getGradientCacheKey = (type: string, param1: number, param2: number): string => `${type}_${param1.toFixed(3)}_${param2.toFixed(3)}`;

// Convert OKLCH to RGB values
function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  const rgba = oklchToRgba({ l, c, h, a: 1 });
  return { r: rgba.r, g: rgba.g, b: rgba.b };
}

// Generate OKLCH color with caching
function generateOklchColor(l: number, c: number, h: number): string {
  const cacheKey = getCacheKey(l, c, h);
  
  if (colorCache.has(cacheKey)) {
    const cached = colorCache.get(cacheKey);
    if (cached) return cached;
  }
  
  const color = `oklch(${l * 100}% ${c} ${h})`;
  colorCache.set(cacheKey, color);
  
  // Limit cache size to prevent memory leaks
  if (colorCache.size > 1000) {
    const firstKey = colorCache.keys().next().value;
    if (firstKey) colorCache.delete(firstKey);
  }
  
  return color;
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
  // Triad method: colors are 120° apart on the color wheel
  const hueSecondary = (hue + 120) % 360;
  const hueTertiary = (hue + 240) % 360;
  
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
      tertiary: generateOklchColor(0.76, chromaAction, hueTertiary),
      
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
      'text-muted': generateOklchColor(0.4, Math.min(chroma, 0.08), hue),
      
      // Border colors
      highlight: generateOklchColor(1, chroma, hue),
      border: border.oklch,
      'border-muted': generateOklchColor(0.7, chroma, hue),
      
      // Action colors
      primary: generateOklchColor(0.4, chromaAction, hue),
      secondary: generateOklchColor(0.4, chromaAction, hueSecondary),
      tertiary: generateOklchColor(0.4, chromaAction, hueTertiary),
      
      // Alert colors - fixed semantic hues with adaptive chroma
      danger: generateOklchColor(0.5, chromaAlert, dangerHue),
      warning: generateOklchColor(0.5, chromaAlert, warningHue),
      success: generateOklchColor(0.5, chromaAlert, successHue),
      info: generateOklchColor(0.5, chromaAlert, infoHue),
    };
  }
}

// Create gradient for hue slider with caching
export function createHueGradient(chroma: number = 0.1, lightness: number = 0.5): string {
  const cacheKey = getGradientCacheKey('hue', chroma, lightness);
  
  if (gradientCache.has(cacheKey)) {
    const cached = gradientCache.get(cacheKey);
    if (cached) return cached;
  }
  
  const steps = 32;
  const colors = [];
  
  for (let i = 0; i <= steps; i++) {
    const hue = (i / steps) * 360;
    const color = generateOklchColor(lightness, chroma, hue);
    colors.push(color);
  }
  
  const gradient = `linear-gradient(to right, ${colors.join(', ')})`;
  gradientCache.set(cacheKey, gradient);
  
  // Limit cache size to prevent memory leaks
  if (gradientCache.size > 100) {
    const firstKey = gradientCache.keys().next().value;
    if (firstKey) gradientCache.delete(firstKey);
  }
  
  return gradient;
}

// Create gradient for chroma slider with caching
export function createChromaGradient(hue: number = 200, lightness: number = 0.5): string {
  const cacheKey = getGradientCacheKey('chroma', hue, lightness);
  
  if (gradientCache.has(cacheKey)) {
    const cached = gradientCache.get(cacheKey);
    if (cached) return cached;
  }
  
  const steps = 20;
  const colors = [];
  
  for (let i = 0; i <= steps; i++) {
    const chroma = (i / steps) * 0.4;
    const color = generateOklchColor(lightness, chroma, hue);
    colors.push(color);
  }
  
  const gradient = `linear-gradient(to right, ${colors.join(', ')})`;
  gradientCache.set(cacheKey, gradient);
  
  // Limit cache size to prevent memory leaks
  if (gradientCache.size > 100) {
    const firstKey = gradientCache.keys().next().value;
    if (firstKey) gradientCache.delete(firstKey);
  }
  
  return gradient;
} 