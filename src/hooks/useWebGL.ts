import { useEffect, useRef, type RefObject } from "react";
import { FRACTAL_PRESETS } from "@/constants/fractals";
import type { RenderConfig, ViewportState } from "@/types";

// Import shaders as raw strings
import VERTEX_SHADER_SRC from "@/shaders/fullscreen.vert?raw";
import FRAGMENT_SHADER_TEMPLATE from "@/shaders/fractal.frag?raw";
import { COLOR_PALETTES } from "@/constants/palettes";

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error("Shader compilation failed");
  }
  return shader;
}

export function useWebGL(
  config: RenderConfig,
  viewportRef: RefObject<ViewportState>,
  engine: any,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const fractal =
      FRACTAL_PRESETS[config.fractalId as keyof typeof FRACTAL_PRESETS];
    if (!fractal) return;

    const fragmentShaderSrc = FRAGMENT_SHADER_TEMPLATE.replace(
      "// __FRACTAL_CORE_PLACEHOLDER__",
      fractal.glslCore,
    );

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragmentShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSrc,
    );

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up a full-screen quad (two triangles)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const centerLocation = gl.getUniformLocation(program, "u_center");
    const zoomLocation = gl.getUniformLocation(program, "u_zoom");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const refOrbitLocation = gl.getUniformLocation(program, "u_ref_orbit");
    const validItersLoc = gl.getUniformLocation(program, "u_ref_valid_iters");
    const juliaSeedLoc = gl.getUniformLocation(program, "u_julia_seed");
    const locA = gl.getUniformLocation(program, "u_palette_a");
    const locB = gl.getUniformLocation(program, "u_palette_b");
    const locC = gl.getUniformLocation(program, "u_palette_c");
    const locD = gl.getUniformLocation(program, "u_palette_d");

    // COLORS
    const activePalette =
      COLOR_PALETTES[config.paletteId] || COLOR_PALETTES["ocean"];

    gl.uniform3fv(locA, new Float32Array(activePalette.a));
    gl.uniform3fv(locB, new Float32Array(activePalette.b));
    gl.uniform3fv(locC, new Float32Array(activePalette.c));
    gl.uniform3fv(locD, new Float32Array(activePalette.d));

    const orbitArray32 = new Float32Array(2000);

    let lastCenterX = 0;
    let lastCenterY = 0;
    let lastZoom = 0;

    let animationFrameId: number;
    let startTime = performance.now();

    const render = () => {
      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      const currentTime = performance.now();
      const elapsedTime = config.isAnimated
        ? (currentTime - startTime) / 1000
        : 0;

      const currentCenterX = viewportRef.current.center.x;
      const currentCenterY = viewportRef.current.center.y;
      const currentZoom = viewportRef.current.zoom;

      // Pass the LIVE variables to the GPU from viewportRef
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(centerLocation, currentCenterX, currentCenterY);
      gl.uniform1f(zoomLocation, viewportRef.current.zoom);
      gl.uniform1f(timeLocation, elapsedTime);

      const fractalId = config.fractalId;

      // Temporarily hard coded
      const juliaSeedX = -0.8;
      const juliaSeedY = 0.156;

      if (fractalId === "julia") {
        gl.uniform2f(juliaSeedLoc, juliaSeedX, juliaSeedY);
      }

      if (
        currentCenterX !== lastCenterX ||
        currentCenterY !== lastCenterY ||
        currentZoom !== lastZoom
      ) {
        const maxIter = 200;

        let startZx = 0.0;
        let startZy = 0.0;
        let constCx = currentCenterX;
        let constCy = currentCenterY;

        if (fractalId === "julia") {
          startZx = currentCenterX;
          startZy = currentCenterY;
          constCx = juliaSeedX;
          constCy = juliaSeedY;
        }

        const pointer = engine.ccall(
          "calculateReferenceOrbit",
          "number",
          ["number", "number", "number", "number", "number", "string"],
          [startZx, startZy, constCx, constCy, maxIter, fractalId],
        );

        const orbitArray64 = new Float64Array(
          engine.HEAPF64.buffer,
          pointer,
          maxIter * 2,
        );

        let validIters = maxIter;
        for (let i = 1; i < maxIter; i++) {
          if (orbitArray64[i * 2] === 0 && orbitArray64[i * 2 + 1] === 0) {
            validIters = i;
            break;
          }
        }

        // Avoid Garbage Collection lag by reusing the array
        orbitArray32.set(orbitArray64);

        gl.uniform2fv(refOrbitLocation, orbitArray32);
        gl.uniform1i(validItersLoc, validIters);

        lastCenterX = currentCenterX;
        lastCenterY = currentCenterY;
        lastZoom = currentZoom;
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [config]);

  return canvasRef;
}
