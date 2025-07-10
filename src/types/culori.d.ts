declare module 'culori' {
  export interface Color {
    mode: string;
    r?: number;
    g?: number;
    b?: number;
    l?: number;
    c?: number;
    h?: number;
    s?: number;
    alpha?: number;
  }

  export function oklch(color: string | { l: number; c: number; h: number; alpha?: number }): Color | null;
  export function formatHex(color: Color): string;
  export function formatRgb(color: Color): string;
  export function formatHsl(color: Color): string;
} 