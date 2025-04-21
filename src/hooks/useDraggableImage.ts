
import { useRef, useState } from "react";

export interface DragOffset {
  x: number;
  y: number;
}

export function useDraggableImage(isDraggable: boolean) {
  const [offset, setOffset] = useState<DragOffset>({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement | HTMLImageElement>) => {
    if (!isDraggable) return;
    dragging.current = true;
    // For both mouse and touch
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement | HTMLImageElement>) => {
    if (!isDraggable || !dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement | HTMLImageElement>) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const resetOffset = () => setOffset({ x: 0, y: 0 });

  return {
    offset,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    resetOffset
  }
}
