import type { RenderConfig } from '@/types';
import { useWebGL } from '@/hooks/useWebGL';
import { useFractalNavigation } from '@/hooks/useFractalNavigation';
import { FRACTAL_PRESETS } from '@/constants/fractals';

interface FractalCanvasProps {
  config: RenderConfig;
  engine: any;
}

export function FractalCanvas({ config, engine }: FractalCanvasProps) {
  const fractal = FRACTAL_PRESETS[config.fractalId as keyof typeof FRACTAL_PRESETS];
  const { viewportRef, events } = useFractalNavigation(fractal.defaultCenter, fractal.defaultZoom);
  
  // Pass the ref to the WebGL engine
  const canvasRef = useWebGL(config, viewportRef, engine);

  return (
    <canvas
      ref={canvasRef}
      {...events} // Attach all mouse handlers
      className="absolute inset-0 block h-full w-full bg-background cursor-grab active:cursor-grabbing"
    />
  );
}