import { oklch, formatHex, formatRgb, formatHsl } from 'culori';

/**
 * Converts an Oklch color object to an RGBA color object.
 *
 * @param oklch - The Oklch color object.
 * @returns The RGBA color object.
 */
export function oklchToRgba(oklchColor: { l: number; c: number; h: number; a: number }): { r: number; g: number; b: number; a: number } {
  const color = oklch({
    l: oklchColor.l,
    c: oklchColor.c,
    h: oklchColor.h,
    alpha: oklchColor.a
  });
  
  if (!color) {
    return { r: 0, g: 0, b: 0, a: oklchColor.a };
  }
  
  return {
    r: Math.round((color.r ?? 0) * 255),
    g: Math.round((color.g ?? 0) * 255),
    b: Math.round((color.b ?? 0) * 255),
    a: color.alpha ?? oklchColor.a,
  };
}

/**
 * Converts an Oklch color object to a HEX color string.
 *
 * @param oklch - The Oklch color object.
 * @returns The HEX color string.
 */
export function oklchToHex(oklchColor: { l: number; c: number; h: number; a: number }): string {
  const color = oklch({
    l: oklchColor.l,
    c: oklchColor.c,
    h: oklchColor.h,
    alpha: oklchColor.a
  });
  
  if (!color) {
    return '#000000';
  }
  
  return formatHex(color);
}

/**
 * Converts an Oklch color object to an HSL color object.
 *
 * @param oklch - The Oklch color object.
 * @returns The HSL color object.
 */
export function oklchToHsl(oklchColor: { l: number; c: number; h: number; a: number }): { h: number; s: number; l: number; a: number } {
  const color = oklch({
    l: oklchColor.l,
    c: oklchColor.c,
    h: oklchColor.h,
    alpha: oklchColor.a
  });
  
  if (!color) {
    return { h: 0, s: 0, l: 0, a: oklchColor.a };
  }
  
  return {
    h: Math.round(color.h ?? 0),
    s: Math.round((color.s ?? 0) * 100),
    l: Math.round((color.l ?? 0) * 100),
    a: color.alpha ?? oklchColor.a,
  };
}

/**
 * Converts an Oklch string to an Oklch object.
 *
 * @param oklchString - The Oklch string (e.g., "oklch(75% 0.15 260)")
 * @returns The Oklch object or null if parsing fails.
 */
export function parseOklchString(oklchString: string): { l: number; c: number; h: number; a: number } | null {
  try {
    const color = oklch(oklchString);
    if (!color) return null;
    
    return {
      l: color.l ?? 0,
      c: color.c ?? 0,
      h: color.h ?? 0,
      a: color.alpha ?? 1,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Converts an Oklch string to a HEX color string.
 *
 * @param oklchString - The Oklch string.
 * @returns The HEX color string or the original string if parsing fails.
 */
export function oklchStringToHex(oklchString: string): string {
  try {
    const color = oklch(oklchString);
    if (!color) return oklchString;
    return formatHex(color);
  } catch (error) {
    return oklchString;
  }
}

/**
 * Converts an Oklch string to an RGBA color string.
 *
 * @param oklchString - The Oklch string.
 * @returns The RGBA color string or the original string if parsing fails.
 */
export function oklchStringToRgba(oklchString: string): string {
  try {
    const color = oklch(oklchString);
    if (!color) return oklchString;
    return formatRgb(color);
  } catch (error) {
    return oklchString;
  }
}

/**
 * Converts an Oklch string to an HSL color string.
 *
 * @param oklchString - The Oklch string.
 * @returns The HSL color string or the original string if parsing fails.
 */
export function oklchStringToHsl(oklchString: string): string {
  try {
    const color = oklch(oklchString);
    if (!color) return oklchString;
    return formatHsl(color);
  } catch (error) {
    return oklchString;
  }
} 