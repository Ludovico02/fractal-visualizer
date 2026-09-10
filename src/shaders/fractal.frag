precision highp float;

uniform vec2 u_resolution;
uniform float u_zoom;
uniform float u_time;

uniform vec2 u_center;
uniform int u_ref_valid_iters;

uniform vec2 u_ref_orbit[200];

// OLD COLOR PALETTE FOR INITIAL TESTING
// vec3 palette(float t) {
//   vec3 a = vec3(0.5, 0.5, 0.5);
//   vec3 b = vec3(0.5, 0.5, 0.5);
//   vec3 c = vec3(1.0, 1.0, 1.0);
//   vec3 d = vec3(0.0, 0.33, 0.67);
//   return a + b * cos(6.28318 * (c * t + d));
// }

uniform vec3 u_palette_a;
uniform vec3 u_palette_b;
uniform vec3 u_palette_c;
uniform vec3 u_palette_d;

vec3 palette(float t) {
  return u_palette_a + u_palette_b * cos(6.28318 * (u_palette_c * t + u_palette_d));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  
  vec2 dc = uv / u_zoom;
  vec2 dz = vec2(0.0); 

  vec2 Z_abs = vec2(0.0);
  
  float iter = 0.0;
  const float max_iter = 200.0;

  for(int i = 0; i < 200; i++) {
    vec2 Z = u_ref_orbit[i];

    // __FRACTAL_CORE_PLACEHOLDER__

    if(dot(Z_abs, Z_abs) > 4.0) break;
    iter++;
  }

  if(iter == max_iter) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    float smooth_iter = iter - log2(log2(dot(Z_abs, Z_abs))) + 4.0;
    float color_index = smooth_iter / max_iter + u_time * 0.1;
    gl_FragColor = vec4(palette(color_index), 1.0);
  }
}