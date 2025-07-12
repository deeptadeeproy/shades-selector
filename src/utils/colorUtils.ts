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

// Cache for expensive calculations
const gradientCache = new Map<string, string>();

// Cache key generator
const getGradientCacheKey = (type: string, param1: number, param2: number): string => `${type}_${param1.toFixed(3)}_${param2.toFixed(3)}`;

// Generate OKLCH color
function generateOklchColor(l: number, c: number, h: number): string {
  return `oklch(${l * 100}% ${c} ${h})`;
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