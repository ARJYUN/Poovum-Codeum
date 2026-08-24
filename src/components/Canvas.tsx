import { useRef, useEffect, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import type { PookalamElement } from '../types';

const FLOWER_MAP: Record<string, string> = {
  ...Object.fromEntries(
    Array.from({ length: 23 }, (_, i) => [`Flower ${i + 1}`, `/flowers/${i + 1}.png`])
  )
};

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    elements, 
    canvasSize, 
    selectedTool, 
    selectedFlower, 
    selectedElementId,
    selectElement, 
    updateElement, 
    removeElement,
    showGrid
  } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  
  const [isDrawingCircle, setIsDrawingCircle] = useState(false);
  const [previewRadius, setPreviewRadius] = useState(0);

  const [isDrawingPath, setIsDrawingPath] = useState(false);
  const [pathPoints, setPathPoints] = useState<{x: number, y: number}[]>([]);

  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [lineStart, setLineStart] = useState<{x: number, y: number} | null>(null);
  const [lineEnd, setLineEnd] = useState<{x: number, y: number} | null>(null);

  const [isBrushing, setIsBrushing] = useState(false);
  const [brushElements, setBrushElements] = useState<Omit<PookalamElement, 'id'>[]>([]);
  const [lastBrushPoint, setLastBrushPoint] = useState<{x: number, y: number} | null>(null);

  const [isErasing, setIsErasing] = useState(false);
  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);

  const getCanvasPxSize = () => {
    switch (canvasSize) {
      case 'Small': return 400;
      case 'Large': return 700;
      case 'Medium':
      default: return 600;
    }
  };

  const sizePx = getCanvasPxSize();

  const handleCanvasPointerDown = (e: ReactPointerEvent) => {
    // Also prevent default touch actions (like scrolling) when drawing on the canvas
    if (e.target instanceof Element && e.target.id === 'pookalam-canvas') {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (selectedTool === 'Eraser') {
      setIsErasing(true);
    } else if ((selectedTool === 'Circle' || selectedTool === 'Polygon') && selectedFlower) {
      setIsDrawingCircle(true);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const radius = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        setPreviewRadius(radius);
      }
    } else if (selectedTool === 'SmallCircle' && selectedFlower) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      
      const ringId = Math.random().toString(36).substring(2, 9);
      const flowerCount = 6;
      const radius = 25;
      
      const newElements: any[] = [];
      const angleStep = (Math.PI * 2) / flowerCount;
      
      for (let i = 0; i < flowerCount; i++) {
        const angle = i * angleStep;
        newElements.push({
          id: Math.random().toString(36).substring(2, 9),
          type: 'flower' as const,
          name: selectedFlower,
          x: x + Math.cos(angle) * radius,
          y: y + Math.sin(angle) * radius,
          rotation: angle * (180 / Math.PI) + 90,
          scale: 0.8,
          ringId
        });
      }
      useStore.getState().addElements(newElements);
    } else if (selectedTool === 'Pen' && selectedFlower) {
      setIsDrawingPath(true);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        setPathPoints([{ x, y }]);
      }
    } else if (selectedTool === 'Line' && selectedFlower) {
      setIsDrawingLine(true);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        setLineStart({ x, y });
        setLineEnd({ x, y });
      }
    } else if ((selectedTool === 'Brush' || selectedTool === 'Mandala') && selectedFlower) {
      if (containerRef.current) {
        setIsBrushing(true);
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        
        const type = selectedFlower.includes('Leaf') ? 'leaf' as const : 'flower' as const;
        const newElements: any[] = [];
        
        if (selectedTool === 'Mandala') {
          const symmetries = 8;
          for (let i = 0; i < symmetries; i++) {
            const angle = (Math.PI * 2 / symmetries) * i;
            const rx = x * Math.cos(angle) - y * Math.sin(angle);
            const ry = x * Math.sin(angle) + y * Math.cos(angle);
            newElements.push({ type, name: selectedFlower, x: rx, y: ry, rotation: Math.random() * 360, scale: 1 });
          }
        } else {
          newElements.push({ type, name: selectedFlower, x, y, rotation: Math.random() * 360, scale: 1 });
        }
        
        setBrushElements(newElements);
        setLastBrushPoint({ x, y });
      }
    }
  };

  const handleCanvasClick = () => {
    if (selectedTool === 'Select' && !hoveredElementId) {
       selectElement(null);
    }
  };

  const handleElementClick = (e: ReactPointerEvent, id: string) => {
    e.stopPropagation();
    if (selectedTool === 'Eraser') {
      removeElement(id);
    } else if (selectedTool === 'Select') {
      selectElement(id);
    }
  };

  const handleElementPointerDown = (e: ReactPointerEvent, id: string) => {
    if (selectedTool === 'Select') {
      e.stopPropagation();
      selectElement(id);
      setIsDragging(true);
      
      const el = elements.find(el => el.id === id);
      if (el && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const currentMouseX = e.clientX - rect.left - centerX;
        const currentMouseY = e.clientY - rect.top - centerY;
        
        setDragOffset({
          x: currentMouseX - el.x,
          y: currentMouseY - el.y
        });
      }
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: globalThis.PointerEvent) => {
      if (isDragging && selectedElementId && selectedTool === 'Select' && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const x = e.clientX - rect.left - centerX - dragOffset.x;
        const y = e.clientY - rect.top - centerY - dragOffset.y;
        
        updateElement(selectedElementId, { x, y });
      }
      
      if (isDrawingCircle && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const radius = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        setPreviewRadius(radius);
      }

      if (isDrawingPath && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        
        setPathPoints(prev => {
          const last = prev[prev.length - 1];
          if (!last) return [{x, y}];
          const dist = Math.sqrt(Math.pow(x - last.x, 2) + Math.pow(y - last.y, 2));
          if (dist > 8) {
            return [...prev, { x, y }];
          }
          return prev;
        });
      }

      if (isDrawingLine && containerRef.current && lineStart) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        setLineEnd({ x, y });
      }

      if (isBrushing && containerRef.current && lastBrushPoint && selectedFlower) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        
        const dx = x - lastBrushPoint.x;
        const dy = y - lastBrushPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist >= 30) {
          const type = selectedFlower.includes('Leaf') ? 'leaf' as const : 'flower' as const;
          const newElements: any[] = [];
          
          if (selectedTool === 'Mandala') {
            const symmetries = 8;
            for (let i = 0; i < symmetries; i++) {
              const angle = (Math.PI * 2 / symmetries) * i;
              const rx = x * Math.cos(angle) - y * Math.sin(angle);
              const ry = x * Math.sin(angle) + y * Math.cos(angle);
              newElements.push({ type, name: selectedFlower, x: rx, y: ry, rotation: Math.random() * 360, scale: 1 });
            }
          } else {
            newElements.push({ type, name: selectedFlower, x, y, rotation: Math.random() * 360, scale: 1 });
          }
          
          setBrushElements(prev => [...prev, ...newElements]);
          setLastBrushPoint({ x, y });
        }
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setIsErasing(false);
      
      if (isDrawingCircle) {
        setIsDrawingCircle(false);
        if (previewRadius > 10 && selectedFlower) {
          if (selectedTool === 'Circle') {
            const circumference = 2 * Math.PI * previewRadius;
            const flowerSizeEstimate = 32;
            const count = Math.max(4, Math.floor(circumference / flowerSizeEstimate));
            
            useStore.getState().addRing({
              size: previewRadius,
              flowerName: selectedFlower,
              flowerCount: count,
              flowerSize: 1,
              rotation: 0
            });
          } else if (selectedTool === 'Polygon') {
            const sides = 6; // Hexagon
            const newElements: Omit<PookalamElement, 'id'>[] = [];
            const flowerSizeEstimate = 30;
            const sideLength = 2 * previewRadius * Math.sin(Math.PI / sides);
            const flowersPerSide = Math.max(1, Math.floor(sideLength / flowerSizeEstimate));
            
            for (let s = 0; s < sides; s++) {
              const startAngle = (s * Math.PI * 2) / sides;
              const endAngle = ((s + 1) * Math.PI * 2) / sides;
              const startX = Math.cos(startAngle) * previewRadius;
              const startY = Math.sin(startAngle) * previewRadius;
              const endX = Math.cos(endAngle) * previewRadius;
              const endY = Math.sin(endAngle) * previewRadius;
              
              for (let i = 0; i < flowersPerSide; i++) {
                const t = i / flowersPerSide;
                const x = startX + (endX - startX) * t;
                const y = startY + (endY - startY) * t;
                const angle = Math.atan2(endY - startY, endX - startX);
                newElements.push({
                  type: selectedFlower.includes('Leaf') ? 'leaf' as const : 'flower' as const,
                  name: selectedFlower,
                  x,
                  y,
                  rotation: angle * (180 / Math.PI) + 90,
                  scale: 1
                });
              }
            }
            useStore.getState().addElements(newElements);
          }
        }
        setPreviewRadius(0);
      }

      if (isDrawingPath) {
        setIsDrawingPath(false);
        
        if (pathPoints.length > 1 && selectedFlower) {
          let totalLength = 0;
          const segments = [];
          
          for (let i = 1; i < pathPoints.length; i++) {
            const p1 = pathPoints[i - 1];
            const p2 = pathPoints[i];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            segments.push({ p1, p2, len, startDist: totalLength });
            totalLength += len;
          }
          
          const FLOWER_SPACING = 30; // space between flowers
          const numFlowers = Math.floor(totalLength / FLOWER_SPACING);
          const newElements: any[] = [];
          
          for (let i = 0; i <= numFlowers; i++) {
            const targetDist = i * FLOWER_SPACING;
            const segment = segments.find(s => targetDist >= s.startDist && targetDist <= s.startDist + s.len);
            if (!segment) continue;
            
            const segmentRatio = segment.len === 0 ? 0 : (targetDist - segment.startDist) / segment.len;
            const x = segment.p1.x + (segment.p2.x - segment.p1.x) * segmentRatio;
            const y = segment.p1.y + (segment.p2.y - segment.p1.y) * segmentRatio;
            
            const angle = Math.atan2(segment.p2.y - segment.p1.y, segment.p2.x - segment.p1.x);
            const rotation = angle * (180 / Math.PI) + 90;
            
            newElements.push({
              type: selectedFlower.includes('Leaf') ? 'leaf' as const : 'flower' as const,
              name: selectedFlower,
              x,
              y,
              rotation,
              scale: 1
            });
          }
          
          if (newElements.length > 0) {
            useStore.getState().addElements(newElements);
          }
        }
        setPathPoints([]);
      }

      if (isDrawingLine && lineStart && lineEnd && selectedFlower) {
        setIsDrawingLine(false);
        const dx = lineEnd.x - lineStart.x;
        const dy = lineEnd.y - lineStart.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        
        if (len > 10) {
          const FLOWER_SPACING = 30; // space between flowers
          const numFlowers = Math.floor(len / FLOWER_SPACING);
          const newElements: any[] = [];
          
          for (let i = 0; i <= numFlowers; i++) {
            const ratio = numFlowers === 0 ? 0 : i / numFlowers;
            const x = lineStart.x + dx * ratio;
            const y = lineStart.y + dy * ratio;
            
            const angle = Math.atan2(dy, dx);
            const rotation = angle * (180 / Math.PI) + 90;
            
            newElements.push({
              type: selectedFlower.includes('Leaf') ? 'leaf' as const : 'flower' as const,
              name: selectedFlower,
              x,
              y,
              rotation,
              scale: 1
            });
          }
          
          if (newElements.length > 0) {
            useStore.getState().addElements(newElements);
          }
        }
        setLineStart(null);
        setLineEnd(null);
      }

      if (isBrushing) {
        setIsBrushing(false);
        if (brushElements.length > 0) {
          useStore.getState().addElements(brushElements);
        }
        setBrushElements([]);
        setLastBrushPoint(null);
      }
    };

    if (isDragging || isDrawingCircle || isDrawingPath || isDrawingLine || isBrushing || isErasing) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, isDrawingCircle, isDrawingPath, isDrawingLine, isBrushing, isErasing, previewRadius, pathPoints, lineStart, lineEnd, brushElements, lastBrushPoint, selectedElementId, selectedTool, dragOffset, updateElement, selectedFlower]);

  const handleRotate = (e: ReactPointerEvent, id: string, amount: number) => {
    e.stopPropagation();
    const el = elements.find(el => el.id === id);
    if (el) {
      updateElement(id, { rotation: el.rotation + amount });
    }
  };

  const handleCanvasPointerMove = (e: ReactPointerEvent) => {
    if (containerRef.current && (selectedTool === 'Brush' || selectedTool === 'Line' || selectedTool === 'Pen' || selectedTool === 'Circle' || selectedTool === 'SmallCircle')) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      setMousePos({ x, y });
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center w-full h-full p-4 overflow-hidden"
      onClick={handleCanvasClick}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handleCanvasPointerMove}
      onPointerLeave={() => setMousePos(null)}
    >
      <div 
        id="pookalam-canvas"
        ref={containerRef}
        style={{ 
          width: sizePx, 
          height: sizePx,
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: '1/1',
          touchAction: 'none'
        }}
        className={cn(
          "rounded-full relative shadow-soft bg-white/10 backdrop-blur-sm border border-primary-green/20 transition-all duration-300",
          (selectedTool === 'Circle' || selectedTool === 'Polygon' || selectedTool === 'SmallCircle' || selectedTool === 'Line' || selectedTool === 'Pen' || selectedTool === 'Brush' || selectedTool === 'Mandala') && "cursor-crosshair-black"
        )}
      >
        {/* Grid Overlay */}
        {showGrid && (
          <>
            <div className="absolute inset-0 pointer-events-none rounded-full canvas-grid opacity-30 mix-blend-multiply z-10" />
            <div className="absolute inset-0 pointer-events-none rounded-full flex items-center justify-center z-10 opacity-20">
              <div className="absolute w-full h-px bg-primary-dark" />
              <div className="absolute h-full w-px bg-primary-dark" />
            </div>
          </>
        )}

        {/* Preview Circle */}
        {isDrawingCircle && previewRadius > 0 && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary-green/50 pointer-events-none"
            style={{
              width: previewRadius * 2,
              height: previewRadius * 2,
            }}
          />
        )}

        {/* Preview Line */}
        {isDrawingLine && lineStart && lineEnd && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 100 }}>
            <line
              x1={lineStart.x + sizePx/2}
              y1={lineStart.y + sizePx/2}
              x2={lineEnd.x + sizePx/2}
              y2={lineEnd.y + sizePx/2}
              stroke="rgba(42, 75, 38, 0.5)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        )}

        {/* Preview Pen Path */}
        {isDrawingPath && pathPoints.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 100 }}>
            <path
              d={`M ${pathPoints[0].x + sizePx/2} ${pathPoints[0].y + sizePx/2} ` + 
                 pathPoints.slice(1).map(p => `L ${p.x + sizePx/2} ${p.y + sizePx/2}`).join(' ')}
              fill="none"
              stroke="rgba(42, 75, 38, 0.5)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        )}

        {/* Live Brush Elements preview */}
        {brushElements.map((el, index) => (
          <div
            key={`brush-${index}`}
            className="absolute pointer-events-none drop-shadow-md opacity-80 flex items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${el.x}px), calc(-50% + ${el.y}px)) rotate(${el.rotation}deg) scale(${el.scale})`,
              zIndex: 50
            }}
          >
            <img src={FLOWER_MAP[el.name]} alt={el.name} className="w-12 h-12 object-contain" />
          </div>
        ))}

        {/* Hover preview */}
        {!isDragging && !isBrushing && !isDrawingLine && !isDrawingPath && !isDrawingCircle && mousePos && selectedFlower && (selectedTool === 'Brush' || selectedTool === 'Mandala') && (
          <div
            className="absolute pointer-events-none opacity-40 flex items-center justify-center transition-all duration-75"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px)) scale(1)`,
              zIndex: 100
            }}
          >
            <img src={FLOWER_MAP[selectedFlower]} alt="preview" className="w-12 h-12 object-contain" />
          </div>
        )}

        {elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-accent-brown/40 pointer-events-none">
            <p className="font-display font-bold">Your Pookalam starts here</p>
            <p className="text-xs">Choose a flower and click to place</p>
          </div>
        )}

        {/* Elements */}
        {elements.map((el) => {
          const isSelected = selectedElementId === el.id;
          
          return (
            <div
              key={el.id}
              onClick={(e) => handleElementClick(e as unknown as ReactPointerEvent, el.id)}
              onPointerDown={(e) => handleElementPointerDown(e, el.id)}
              onPointerEnter={() => {
                setHoveredElementId(el.id);
                if (selectedTool === 'Eraser' && isErasing) {
                  removeElement(el.id);
                }
              }}
              onPointerLeave={() => setHoveredElementId(null)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${el.x}px), calc(-50% + ${el.y}px)) rotate(${el.rotation}deg) scale(${el.scale})`,
                fontSize: '2rem',
                lineHeight: 1,
                cursor: selectedTool === 'Select' ? (isDragging ? 'grabbing' : 'grab') : 
                        selectedTool === 'Eraser' ? 'pointer' : 'default',
                zIndex: isSelected ? 50 : 10,
                userSelect: 'none'
              }}
              className={cn(
                "transition-all duration-75 outline-none drop-shadow-md flex items-center justify-center",
                isSelected && "drop-shadow-[0_0_8px_rgba(49,92,43,0.8)] scale-110 z-50",
                selectedTool === 'Eraser' && hoveredElementId === el.id && "opacity-50 scale-90"
              )}
            >
              {FLOWER_MAP[el.name]?.startsWith('/') ? (
                <img src={FLOWER_MAP[el.name]} alt={el.name} className="w-12 h-12 object-contain pointer-events-none" />
              ) : (
                FLOWER_MAP[el.name] || '🌼'
              )}
              
              {isSelected && selectedTool === 'Select' && !isDragging && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-md shadow-md p-1 border border-primary-green/20 z-50" onClick={e => e.stopPropagation()}>
                  <button className="w-6 h-6 flex items-center justify-center text-xs hover:bg-primary-green/10 rounded" onPointerDown={(e) => handleRotate(e, el.id, -15)}>↺</button>
                  <button className="w-6 h-6 flex items-center justify-center text-xs hover:bg-primary-green/10 rounded" onPointerDown={(e) => handleRotate(e, el.id, 15)}>↻</button>
                  <div className="w-px h-4 bg-accent-brown/20" />
                  <button className="w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-red-50 rounded" onPointerDown={(e) => { e.stopPropagation(); removeElement(el.id); }}>×</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
