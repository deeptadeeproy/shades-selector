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
    return {
      // Background colors
      'bg-dark': generateOklchColor(0.1, chromaBg, hue),
      bg: generateOklchColor(0.15, chromaBg, hue),
      'bg-light': generateOklchColor(0.2, chromaBg, hue),

      // Text colors
      text: generateOklchColor(0.96, chromaText, hue),
      'text-muted': generateOklchColor(0.76, chromaText, hue),

      // Border colors
      highlight: generateOklchColor(0.5, chroma, hue),
      border: generateOklchColor(0.4, chroma, hue),
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
    return {
      // Background colors
      'bg-dark': generateOklchColor(0.92, chromaBg, hue),
      bg: generateOklchColor(0.96, chromaBg, hue),
      'bg-light': generateOklchColor(1, chromaBg, hue),

      // Text colors
      text: generateOklchColor(0.15, chroma, hue),
      'text-muted': generateOklchColor(0.4, Math.min(chroma, 0.08), hue),

      // Border colors
      highlight: generateOklchColor(1, chroma, hue),
      border: generateOklchColor(0.6, chroma, hue),
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

// --- Palette Name Generator ---

// Simple color name mapping for common colors
const COLOR_NAMES: { [key: string]: string } = {
  red: 'Red',
  orange: 'Orange',
  yellow: 'Yellow',
  green: 'Green',
  blue: 'Blue',
  purple: 'Purple',
  pink: 'Pink',
  brown: 'Brown',
  gray: 'Gray',
  black: 'Black',
  white: 'White',
  cyan: 'Cyan',
  teal: 'Teal',
  magenta: 'Magenta',
  lime: 'Lime',
  indigo: 'Indigo',
  violet: 'Violet',
  gold: 'Gold',
  silver: 'Silver',
};

const ADJECTIVES = [
  'Vivid', 'Soft', 'Dreamy', 'Bold', 'Gentle', 'Electric', 'Muted', 'Pastel', 'Deep', 'Bright', 'Dusky', 'Lively', 'Serene', 'Radiant', 'Frosty', 'Sunny', 'Twilight', 'Mystic', 'Retro', 'Modern', 'Classic', 'Fresh', 'Warm', 'Cool', 'Neon', 'Elegant', 'Chill', 'Royal', 'Cosmic', 'Vintage', 'Crystal', 'Velvet', 'Blissful', 'Enchanted', 'Lush', 'Opal', 'Aurora', 'Sunset', 'Ocean', 'Forest', 'Desert', 'Berry', 'Rose', 'Citrus', 'Mint', 'Sky', 'Shadow', 'Cloud', 'Dawn', 'Dusk', 'Zen', 'Bloom', 'Coral', 'Amber', 'Sapphire', 'Emerald', 'Ruby', 'Topaz', 'Jade', 'Onyx', 'Pearl', 'Ivory', 'Slate', 'Sand', 'Mocha', 'Cocoa', 'Charcoal', 'Platinum', 'Copper', 'Bronze', 'Turquoise', 'Lavender', 'Lilac', 'Peach', 'Apricot', 'Cherry', 'Moss', 'Pine', 'Maple', 'Willow', 'Lagoon', 'Flame', 'Fawn', 'Indigo', 'Azure', 'Cobalt', 'Blush', 'Honey', 'Mauve', 'Orchid', 'Poppy', 'Sable', 'Sage', 'Spruce', 'Tangerine', 'Wisteria', 'Zest',
];

const NOUNS = [
  'Dream', 'Glow', 'Mist', 'Breeze', 'Wave', 'Bliss', 'Twilight', 'Mirage', 'Aura', 'Echo', 'Whisper', 'Pulse', 'Vibe', 'Rush', 'Spark', 'Dawn', 'Dusk', 'Haze', 'Frost', 'Flare', 'Gleam', 'Shine', 'Shade', 'Shadow', 'Beam', 'Ray', 'Drift', 'Chill', 'Storm', 'Bloom', 'Blossom', 'Petal', 'Leaf', 'Forest', 'Lagoon', 'Oasis', 'Desert', 'Canyon', 'Valley', 'Peak', 'Summit', 'Field', 'Garden', 'Orchard', 'Grove', 'Vine', 'Berry', 'Rose', 'Lily', 'Tulip', 'Daisy', 'Sun', 'Moon', 'Star', 'Comet', 'Nova', 'Galaxy', 'Nebula', 'Cosmos', 'Aurora', 'Opal', 'Velvet', 'Crystal', 'Gem', 'Jewel', 'Stone', 'Marble', 'Pearl', 'Ivory', 'Slate', 'Sand', 'Mocha', 'Cocoa', 'Charcoal', 'Platinum', 'Copper', 'Bronze', 'Turquoise', 'Lavender', 'Lilac', 'Peach', 'Apricot', 'Cherry', 'Moss', 'Pine', 'Maple', 'Willow', 'Lagoon', 'Flame', 'Fawn', 'Indigo', 'Azure', 'Cobalt', 'Blush', 'Honey', 'Mauve', 'Orchid', 'Poppy', 'Sable', 'Sage', 'Spruce', 'Tangerine', 'Wisteria', 'Zest',
];

// Helper: Convert a hex color to a simple color name (approximate)
function hexToSimpleColorName(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Simple thresholds for main colors
  if (r > 200 && g < 100 && b < 100) return 'Red';
  if (r > 200 && g > 150 && b < 100) return 'Orange';
  if (r > 200 && g > 200 && b < 100) return 'Yellow';
  if (r < 100 && g > 180 && b < 100) return 'Green';
  if (r < 100 && g > 200 && b > 200) return 'Cyan';
  if (r < 100 && g < 100 && b > 200) return 'Blue';
  if (r > 150 && g < 100 && b > 150) return 'Magenta';
  if (r > 200 && g < 100 && b > 200) return 'Pink';
  if (r > 200 && g > 200 && b > 200) return 'White';
  if (r < 50 && g < 50 && b < 50) return 'Black';
  if (r > 180 && g > 180 && b > 180) return 'Gray';
  if (r > 150 && g > 100 && b < 100) return 'Brown';
  if (r < 100 && g < 100 && b > 100) return 'Indigo';
  if (r > 100 && g < 100 && b > 100) return 'Violet';
  if (r < 100 && g > 100 && b < 100) return 'Lime';
  if (r < 100 && g > 100 && b > 100) return 'Teal';
  return 'Color';
}

// Main function: Generate a creative palette name based on main colors
export function generatePaletteName(palette: Record<string, string>): string {
  // Pick the most visually important colors (primary, secondary, bg, etc.)
  const mainKeys = ['primary', 'secondary', 'bg', 'highlight', 'danger', 'success', 'info', 'warning'];
  const pickedColors = mainKeys.map(key => palette[key]).filter(Boolean);
  // Convert to color names
  const colorNames = pickedColors.map(hexToSimpleColorName).filter((v, i, arr) => v && arr.indexOf(v) === i);
  // Pick up to 2 color names for the name
  const mainColor = colorNames[0] || 'Color';
  const accentColor = colorNames[1] || '';
  // Pick a random adjective and noun
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  // Compose the name
  if (accentColor && accentColor !== mainColor) {
    return `${adj} ${mainColor} & ${accentColor} ${noun}`;
  } else {
    return `${adj} ${mainColor} ${noun}`;
  }
} 