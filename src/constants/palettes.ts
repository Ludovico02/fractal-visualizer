export interface ColorPalette {
  id: string;
  name: string;
  a: [number, number, number];
  b: [number, number, number];
  c: [number, number, number];
  d: [number, number, number];
}

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  ocean: {
    id: 'ocean',
    name: 'Deep Ocean',
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 1.0],
    d: [0.0, 0.33, 0.67],
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Neon',
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [2.0, 1.0, 0.0],
    d: [0.5, 0.20, 0.25], 
  },
  minimalist: {
    id: 'minimalist',
    name: 'Monochrome',
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 1.0],
    d: [0.0, 0.0, 0.0],
  },
  forest: {
    id: 'forest',
    name: 'Alpine Forest',
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 0.5],
    d: [0.8, 0.9, 0.3], 
  }
};