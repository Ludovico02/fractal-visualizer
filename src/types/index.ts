export type PresetFractalId =
  | "mandelbrot"
  | "julia"
  | "burning-ship"
  | "tricorn"
  | "multibrot"
  | "newton"
  | "lyapunov"
  | "sierpinski"
  | "dragon"
  | "cantor-set";

export type FractalId = PresetFractalId | string;

export interface FractalPreset {
  id: FractalId;
  name: string;
  equation: string;
  glslCore: string;
  defaultCenter: { x: number; y: number };
  defaultZoom: number;
}

export interface ViewportState {
  center: { x: number; y: number };
  zoom: number;
}

export interface RenderConfig {
  fractalId: FractalId;
  isAnimated: boolean;
  paletteId: string;
}

export type AppView = 'MENU' | 'VISUALIZER' | 'SETTINGS';
