import { create } from 'zustand';
import type { AppState, DesignState, PookalamElement, Ring } from '../types';

const initialState: DesignState = {
  elements: [],
  rings: [],
  canvasSize: 'Medium',
  background: 'natural',
  showGrid: false,
  designName: 'Onam Memories 🌼',
  description: 'Inspired by the colors of Onam and nature.',
  tags: ['Onam', 'Traditional', 'Flowers'],
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>((set, get) => ({
  ...initialState,
  selectedTool: 'Select',
  selectedFlower: 'Flower 1',
  selectedElementId: null,
  history: [initialState],
  historyIndex: 0,

  setTool: (tool) => set({ selectedTool: tool }),
  selectFlower: (flowerName) => set({ selectedFlower: flowerName }),
  selectElement: (id) => set({ selectedElementId: id }),
  setCanvasSize: (size) => set({ canvasSize: size }),
  setBackground: (bg) => set({ background: bg }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  addElement: (elementData) => set((state) => {
    const newElement: PookalamElement = { ...elementData, id: generateId() };
    const newElements = [...state.elements, newElement];
    const newState = { elements: newElements };
    return updateHistory(state, newState);
  }),

  addElements: (elementsData) => set((state) => {
    const newElementsArray = elementsData.map(data => ({ ...data, id: generateId() }));
    const newElements = [...state.elements, ...newElementsArray];
    return updateHistory(state, { elements: newElements });
  }),

  updateElement: (id, updates) => set((state) => {
    const newElements = state.elements.map((el) => 
      el.id === id ? { ...el, ...updates } : el
    );
    return updateHistory(state, { elements: newElements });
  }),

  removeElement: (id) => set((state) => {
    const newElements = state.elements.filter((el) => el.id !== id);
    return updateHistory(state, { 
      elements: newElements,
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
    });
  }),

  duplicateElement: (id) => set((state) => {
    const element = state.elements.find((el) => el.id === id);
    if (!element) return state;
    
    const newElement: PookalamElement = {
      ...element,
      id: generateId(),
      x: element.x + 20,
      y: element.y + 20,
    };
    
    const newElements = [...state.elements, newElement];
    return updateHistory(state, { 
      elements: newElements,
      selectedElementId: newElement.id
    });
  }),

  addRing: (ringData) => set((state) => {
    const newRing: Ring = { ...ringData, id: generateId() };
    const newRings = [...state.rings, newRing];
    // Generate elements for the ring
    const ringElements: PookalamElement[] = [];
    const angleStep = (Math.PI * 2) / newRing.flowerCount;
    
    for (let i = 0; i < newRing.flowerCount; i++) {
      const angle = i * angleStep + (newRing.rotation * Math.PI / 180);
      ringElements.push({
        id: generateId(),
        type: 'flower',
        name: newRing.flowerName,
        x: Math.cos(angle) * newRing.size,
        y: Math.sin(angle) * newRing.size,
        rotation: angle * (180 / Math.PI) + 90, // point outward
        scale: newRing.flowerSize,
        ringId: newRing.id
      });
    }
    
    return updateHistory(state, { 
      rings: newRings,
      elements: [...state.elements, ...ringElements]
    });
  }),

  updateRing: (id, updates) => set((state) => {
    // This is more complex in reality: we'd need to recreate the ring's elements.
    const newRings = state.rings.map(r => r.id === id ? { ...r, ...updates } : r);
    return updateHistory(state, { rings: newRings });
  }),

  removeRing: (id) => set((state) => {
    const newRings = state.rings.filter(r => r.id !== id);
    const newElements = state.elements.filter(el => el.ringId !== id);
    return updateHistory(state, { rings: newRings, elements: newElements });
  }),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const previousState = state.history[newIndex];
      return {
        ...previousState,
        historyIndex: newIndex,
        selectedElementId: null
      };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const nextState = state.history[newIndex];
      return {
        ...nextState,
        historyIndex: newIndex,
        selectedElementId: null
      };
    }
    return state;
  }),

  setDesignInfo: (info) => set((state) => ({ ...state, ...info })),

  loadTemplate: (template) => set((state) => {
    return updateHistory(state, template);
  }),

  clearCanvas: () => set((state) => {
    return updateHistory(state, { elements: [], rings: [] });
  })
}));

// Helper to manage history
function updateHistory(state: AppState, newState: Partial<DesignState>): Partial<AppState> {
  const currentDesignState: DesignState = {
    elements: state.elements,
    rings: state.rings,
    canvasSize: state.canvasSize,
    background: state.background,
    showGrid: state.showGrid,
    designName: state.designName,
    description: state.description,
    tags: state.tags,
    ...newState
  };

  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(currentDesignState);
  
  // Limit history length to prevent memory issues
  if (newHistory.length > 50) {
    newHistory.shift();
  }

  return {
    ...currentDesignState,
    history: newHistory,
    historyIndex: newHistory.length - 1
  };
}
