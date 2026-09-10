import { useRef, useCallback, useEffect } from 'react';
import { type ViewportState } from '@/types';

interface Point2D {
  x: number;
  y: number;
}

export function useFractalNavigation(initialCenter: Point2D, initialZoom: number) {
  const viewportRef = useRef<ViewportState>({
    center: { ...initialCenter },
    zoom: initialZoom,
  });

  const isDragging = useRef(false);
  const lastMousePos = useRef<Point2D>({ x: 0, y: 0 });

  useEffect(() => {
    const preventCanvasScroll = (e: WheelEvent) => {
      // Only block scrolling if hovering over WebGL canvas
      if ((e.target as HTMLElement).tagName === 'CANVAS') {
        e.preventDefault();
      }
    };
    
    window.addEventListener('wheel', preventCanvasScroll, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', preventCanvasScroll);
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    const canvas = e.currentTarget;
    const scale = 1.0 / (canvas.clientHeight * viewportRef.current.zoom);

    viewportRef.current.center.x -= dx * scale;
    viewportRef.current.center.y += dy * scale; 
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();

    // Mouse position relative to the canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert to Shader UV space
    // WebGL Y axis is inverted compared to the browser's DOM Y axis
    const uvX = (mouseX - 0.5 * rect.width) / rect.height;
    const uvY = (0.5 * rect.height - mouseY) / rect.height;

    const zoomFactor = 1.15; // Faster zoom per scroll tick
    const oldZoom = viewportRef.current.zoom;
    let newZoom = oldZoom;

    // Determine zoom direction
    if (e.deltaY < 0) {
      newZoom *= zoomFactor; // Scroll up -> Zoom in
    } else {
      newZoom /= zoomFactor; // Scroll down -> Zoom out
    }

    // Adjust the center to lock the mathematical point under the cursor
    viewportRef.current.center.x += uvX * ((1.0 / oldZoom) - (1.0 / newZoom));
    viewportRef.current.center.y += uvY * ((1.0 / oldZoom) - (1.0 / newZoom));
    
    // Apply the new zoom
    viewportRef.current.zoom = newZoom;
  }, []);

  return {
    viewportRef,
    events: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      onWheel,
    }
  };
}