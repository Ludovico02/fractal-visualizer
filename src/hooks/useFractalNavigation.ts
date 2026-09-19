import { useRef, useCallback, useEffect } from "react";
import { type ViewportState } from "@/types";

interface Point2D {
  x: number;
  y: number;
}

export function useFractalNavigation(
  initialCenter: Point2D,
  initialZoom: number,
) {
  const viewportRef = useRef<ViewportState>({
    center: { ...initialCenter },
    zoom: initialZoom,
  });

  const isDragging = useRef(false);
  const lastMousePos = useRef<Point2D>({ x: 0, y: 0 });

  // Mobile
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<Point2D | null>(null);

  useEffect(() => {
    const preventCanvasScroll = (e: Event) => {
      // Only block scrolling if hovering over WebGL canvas
      if ((e.target as HTMLElement).tagName === "CANVAS") {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventCanvasScroll, { passive: false });
    window.addEventListener("touchmove", preventCanvasScroll, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", preventCanvasScroll);
      window.removeEventListener("touchmove", preventCanvasScroll);
    };
  }, []);

  useEffect(() => {
    const handleReCenter = () => {
      viewportRef.current.center = { x: initialCenter.x, y: initialCenter.y };
      viewportRef.current.zoom = initialZoom;
    };

    window.addEventListener("fractal-re-center", handleReCenter);
    return () =>
      window.removeEventListener("fractal-re-center", handleReCenter);
  }, [initialCenter, initialZoom]);

  // Mouse
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

    // TEST
    // viewportRef.current.zoom = newZoom;
    // console.log("Current Zoom:", newZoom.toExponential(2));

    // Determine zoom direction
    if (e.deltaY < 0) {
      newZoom *= zoomFactor; // Scroll up -> Zoom in
    } else {
      newZoom /= zoomFactor; // Scroll down -> Zoom out
    }

    // Adjust the center to lock the mathematical point under the cursor
    viewportRef.current.center.x += uvX * (1.0 / oldZoom - 1.0 / newZoom);
    viewportRef.current.center.y += uvY * (1.0 / oldZoom - 1.0 / newZoom);

    // Apply the new zoom
    viewportRef.current.zoom = newZoom;
  }, []);

  // Touch
  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastMousePos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

      lastTouchDistance.current = dist;
      lastTouchCenter.current = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const scale = 1.0 / (canvas.clientHeight * viewportRef.current.zoom);

    if (e.touches.length === 1 && isDragging.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - lastMousePos.current.x;
      const dy = touch.clientY - lastMousePos.current.y;

      lastMousePos.current = { x: touch.clientX, y: touch.clientY };

      viewportRef.current.center.x -= dx * scale;
      viewportRef.current.center.y += dy * scale;
    } else if (
      e.touches.length === 2 &&
      lastTouchDistance.current !== null &&
      lastTouchCenter.current !== null
    ) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];

      const newDist = Math.hypot(
        t1.clientX - t2.clientX,
        t1.clientY - t2.clientY,
      );
      const newCenter = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };

      const distRatio = newDist / lastTouchDistance.current;
      const oldZoom = viewportRef.current.zoom;
      const newZoom = oldZoom * distRatio;

      const dx = newCenter.x - lastTouchCenter.current.x;
      const dy = newCenter.y - lastTouchCenter.current.y;

      const rect = canvas.getBoundingClientRect();
      const uvX = (newCenter.x - rect.left - 0.5 * rect.width) / rect.height;
      const uvY = (0.5 * rect.height - (newCenter.y - rect.top)) / rect.height;

      viewportRef.current.center.x -= dx * scale;
      viewportRef.current.center.y += dy * scale;

      viewportRef.current.center.x += uvX * (1.0 / oldZoom - 1.0 / newZoom);
      viewportRef.current.center.y += uvY * (1.0 / oldZoom - 1.0 / newZoom);

      viewportRef.current.zoom = newZoom;
      lastTouchDistance.current = newDist;
      lastTouchCenter.current = newCenter;
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) {
      isDragging.current = false;
      lastTouchDistance.current = null;
      lastTouchCenter.current = null;
    } else if (e.touches.length === 1) {
      isDragging.current = true;
      lastMousePos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      lastTouchDistance.current = null;
      lastTouchCenter.current = null;
    }
  }, []);

  return {
    viewportRef,
    events: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      onWheel,
      onTouchStart,
      onTouchMove,
      onTouchEnd
    },
  };
}
