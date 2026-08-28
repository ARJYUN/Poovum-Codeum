export type ElementType = 'flower' | 'leaf';

export interface PookalamElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  ringId?: string; // If it belongs to a ring
}

export interface GalleryDesign {
  id: string | number;
  name: string;
  creator: string;
  likes: number;
  image: string;
}

export interface Ring {
  id: string;
  size: number; // Radius
  flowerName: string;
  flowerCount: number;
  flowerSize: number; // Scale
  rotation: number;
}

export interface DesignState {
  elements: PookalamElement[];
  rings: Ring[];
  canvasSize: 'Small' | 'Medium' | 'Large';
  background: 'natural' | 'floral' | 'sand' | 'dark';
  showGrid: boolean;
  designName: string;
  description: string;
  tags: string[];
}

export type ToolType = 'Select' | 'Brush' | 'Circle' | 'SmallCircle' | 'Pen' | 'Line' | 'Eraser' | 'Mandala' | 'Polygon';

export interface AppState extends DesignState {
  selectedTool: ToolType;
  selectedFlower: string | null;
  currentFlowerSize: number;
  selectedElementId: string | null;
  history: DesignState[];
  historyIndex: number;
  
  // Actions
  setTool: (tool: ToolType) => void;
  selectFlower: (flowerName: string | null) => void;
  setFlowerSize: (size: number) => void;
  selectElement: (id: string | null) => void;
  setCanvasSize: (size: 'Small' | 'Medium' | 'Large') => void;
  setBackground: (bg: 'natural' | 'floral' | 'sand' | 'dark') => void;
  toggleGrid: () => void;
  
  addElement: (element: Omit<PookalamElement, 'id'>) => void;
  addElements: (elements: Omit<PookalamElement, 'id'>[]) => void;
  updateElement: (id: string, updates: Partial<PookalamElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  
  addRing: (ring: Omit<Ring, 'id'>) => void;
  updateRing: (id: string, updates: Partial<Ring>) => void;
  removeRing: (id: string) => void;
  
  undo: () => void;
  redo: () => void;
  
  setDesignInfo: (info: { designName?: string; description?: string; tags?: string[] }) => void;
  loadTemplate: (template: DesignState) => void;
  clearCanvas: () => void;
  
  galleryDesigns: GalleryDesign[];
  addGalleryDesign: (design: GalleryDesign) => void;
}
