import type { FractalPreset, FractalId } from "../types";

export const FRACTAL_PRESETS: Record<FractalId, FractalPreset> = {
  mandelbrot: {
    // Perturbation
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
  burning_ship: {
    id: "burning_ship",
    name: "Burning Ship",
    equation: "dz_{n+1} = (|Z_n + dz_n|)^2 - (|Z_n|)^2 + dc",
    glslCore: `
      if (i < u_ref_valid_iters) {
        Z_abs = Z + dz;
        
        float sZx = Z.x < 0.0 ? -1.0 : 1.0;
        float szx = Z_abs.x < 0.0 ? -1.0 : 1.0;
        float dw_x = (sZx == szx) ? (dz.x * sZx) : -(dz.x + 2.0 * Z.x) * sZx;
        
        float sZy = Z.y < 0.0 ? -1.0 : 1.0;
        float szy = Z_abs.y < 0.0 ? -1.0 : 1.0;
        float dw_y = (sZy == szy) ? (dz.y * sZy) : -(dz.y + 2.0 * Z.y) * sZy;
        
        vec2 dw = vec2(dw_x, dw_y);
        vec2 W = abs(Z);
        
        vec2 term1 = vec2(W.x * dw.x - W.y * dw.y, W.x * dw.y + W.y * dw.x) * 2.0;
        vec2 term2 = vec2(dw.x * dw.x - dw.y * dw.y, 2.0 * dw.x * dw.y);
        
        dz = vec2(term1.x + term2.x + dc.x, -(term1.y + term2.y) + dc.y);
      } else {
        vec2 c_abs = u_center + dc;
        Z_abs = vec2(Z_abs.x * Z_abs.x - Z_abs.y * Z_abs.y, -2.0 * abs(Z_abs.x * Z_abs.y)) + c_abs;
      }
    `,
    defaultCenter: { x: -1.75, y: 0.04 },
    defaultZoom: 2.5,
  },
};
