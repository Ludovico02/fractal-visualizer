precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_zoom;
uniform float u_time;

vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.0, 0.33, 0.67);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  
  vec2 c = uv / u_zoom + u_center;
  vec2 z = c; 
  
  float iter = 0.0;
  const float max_iter = 100.0;
  
  vec2 u_julia_c = vec2(sin(u_time * 0.3) * 0.5 - 0.2, cos(u_time * 0.2) * 0.5);

  for(float i = 0.0; i < max_iter; i++) {
    // __FRACTAL_CORE_PLACEHOLDER__
    if(dot(z, z) > 4.0) break;
    iter++;
  }

  if(iter == max_iter) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    float smooth_iter = iter - log2(log2(dot(z,z))) + 4.0;
    float color_index = smooth_iter / max_iter + u_time * 0.1;
    gl_FragColor = vec4(palette(color_index), 1.0);
  }
}