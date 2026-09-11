import type { FractalPreset, FractalId } from "../types";

export const FRACTAL_PRESETS: Record<FractalId, FractalPreset> = {
  mandelbrot: { // Perturbation
    id: "mandelbrot",
    name: "Mandelbrot",
    equation: "dz_{n+1} = 2Z_n dz_n + dz_n^2 + dc",
    glslCore: `
      if (i < u_ref_valid_iters) {
        Z_abs = Z + dz;
        
        vec2 term1 = vec2(Z.x * dz.x - Z.y * dz.y, Z.x * dz.y + Z.y * dz.x) * 2.0;
        vec2 term2 = vec2(dz.x * dz.x - dz.y * dz.y, 2.0 * dz.x * dz.y);
        dz = term1 + term2 + dc;
      } else {
        // Reference orbit died: Fallback to standard 32-bit math for remaining steps
        vec2 c_abs = u_center + dc;
        Z_abs = vec2(Z_abs.x * Z_abs.x - Z_abs.y * Z_abs.y, 2.0 * Z_abs.x * Z_abs.y) + c_abs;
      }
    `,
    defaultCenter: { x: -0.5, y: 0.0 },
    defaultZoom: 1.0,
  },
};
