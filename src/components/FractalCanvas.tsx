import type { RenderConfig } from '@/types';
import { useWebGL } from '@/hooks/useWebGL';
import { useFractalNavigation } from '@/hooks/useFractalNavigation';
import { FRACTAL_PRESETS } from '@/constants/fractals';

interface FractalCanvasProps {
  config: RenderConfig;
}

export function FractalCanvas({ config }: FractalCanvasProps) {
  // Get the initial coordinates for the selected fractal
  const fractal = FRACTAL_PRESETS[config.fractalId as keyof typeof FRACTAL_PRESETS];
  
  // Initialize navigation state
  const { viewportRef, events } = useFractalNavigation(fractal.defaultCenter, fractal.defaultZoom);
  
  // Pass the ref to the WebGL engine
  const canvasRef = useWebGL(config, viewportRef);

  return (
    <canvas
      ref={canvasRef}
      {...events} // Attach all mouse handlers
      className="absolute inset-0 block h-full w-full bg-black cursor-grab active:cursor-grabbing"
    />
  );
}