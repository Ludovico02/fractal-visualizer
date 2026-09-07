import type { FractalPreset, FractalId } from '../types';

export const FRACTAL_PRESETS: Record<FractalId, FractalPreset> = {
  mandelbrot: {
    id: 'mandelbrot',
    name: 'Mandelbrot Set',
    equation: 'z_{n+1} = z_n^2 + c',
    glslCore: `
      vec2 z_new = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
      z = z_new;
    `,
    defaultCenter: { x: -0.5, y: 0.0 },
    defaultZoom: 1.0,
  },
  julia: {
    id: 'julia',
    name: 'Julia Set',
    equation: 'z_{n+1} = z_n^2 + k',
    glslCore: `
      vec2 z_new = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + u_julia_c;
      z = z_new;
    `,
    defaultCenter: { x: 0.0, y: 0.0 },
    defaultZoom: 1.2,
  },
  burning_ship: {
    id: 'burning_ship',
    name: 'Burning Ship',
    equation: 'z_{n+1} = (|Re(z_n)| + i|Im(z_n)|)^2 + c',
    glslCore: `
      z = vec2(abs(z.x), abs(z.y));
      vec2 z_new = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
      z = z_new;
    `,
    defaultCenter: { x: -1.75, y: -0.04 },
    defaultZoom: 2.5,
  }
};