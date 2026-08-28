import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { 
  Move, 
  Eraser, 
  Undo2, 
  Redo2,
  CircleDashed,
  Circle,
  Trash2,
  Minus,
  Paintbrush,
  PenTool,
  Snowflake,
  Hexagon,
  Wand2
} from 'lucide-react';
import type { ToolType } from '../types';

const tools: { id: ToolType; icon: any; label: string }[] = [
  { id: 'Select', icon: Move, label: 'Move Elements' },
  { id: 'Brush', icon: Paintbrush, label: 'Brush Tool' },
  { id: 'Mandala', icon: Snowflake, label: 'Mandala Tool' },
  { id: 'Polygon', icon: Hexagon, label: 'Polygon Shape' },
  { id: 'Line', icon: Minus, label: 'Draw Line' },
  { id: 'Circle', icon: CircleDashed, label: 'Big Circle' },
  { id: 'SmallCircle', icon: Circle, label: 'Small Circle' },
  { id: 'Pen', icon: PenTool, label: 'Draw Path' },
  { id: 'Eraser', icon: Eraser, label: 'Eraser' },
];

export default function SidebarLeft() {
  const selectedTool = useStore(state => state.selectedTool);
  const setTool = useStore(state => state.setTool);
  
  const undo = useStore(state => state.undo);
  const redo = useStore(state => state.redo);
  const clearCanvas = useStore(state => state.clearCanvas);
  const historyIndex = useStore(state => state.historyIndex);
  const history = useStore(state => state.history);

  const handleAutoGenerate = () => {
    if (!confirm('This will clear your current canvas and auto-generate a new Pookalam. Continue?')) return;
    
    clearCanvas();
    
    // Small delay to ensure clear completes before adding new
    setTimeout(() => {
      const store = useStore.getState();
      const flowers = Array.from({ length: 23 }, (_, i) => `Flower ${i + 1}`);
      
      const numRings = 9;
      const baseRadius = 32; 
      
      // Outside in
      for (let r = numRings; r >= 1; r--) {
        const radius = r * baseRadius;
        const flowerName = flowers[Math.floor(Math.random() * flowers.length)];
        
        const circumference = 2 * Math.PI * radius;
        const flowerSizeEstimate = 32;
        const count = Math.max(6, Math.floor(circumference / flowerSizeEstimate));
        
        store.addRing({
          size: radius,
          flowerName: flowerName,
          flowerCount: count,
          flowerSize: 1,
          rotation: Math.random() * 360
        });
      }
      
      // Center piece
      store.addElements([{
        type: 'flower',
        name: flowers[Math.floor(Math.random() * flowers.length)],
        x: 0,
        y: 0,
        rotation: Math.random() * 360,
        scale: 1.2
      }]);
    }, 50);
  };

  return (
    <div className="flex flex-row lg:flex-col items-center justify-start lg:justify-center gap-2 bg-[#FFF9ED]/95 backdrop-blur-sm border border-[#E8DFCE] shadow-sm rounded-lg p-2 w-full lg:w-14 overflow-x-auto shrink-0 no-scrollbar">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => setTool(tool.id)}
          title={tool.label}
          className={cn(
            "flex shrink-0 items-center justify-center w-10 h-10 rounded-md transition-colors",
            selectedTool === tool.id 
              ? "bg-[#3A5A34] text-white shadow-inner" 
              : "text-[#5C4D3C] hover:bg-[#F5F9F4] hover:text-[#2A4B26]"
          )}
        >
          <tool.icon size={20} strokeWidth={1.5} />
        </button>
      ))}
      
      <div className="w-px h-8 lg:w-8 lg:h-px shrink-0 bg-[#E8DFCE] my-0 mx-1 lg:mx-0 lg:my-1" />
      
      <button
        onClick={undo}
        disabled={historyIndex === 0}
        title="Undo"
        className="flex shrink-0 items-center justify-center w-10 h-10 rounded-md text-[#5C4D3C] hover:bg-[#F5F9F4] disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Undo2 size={20} strokeWidth={1.5} />
      </button>
      <button
        onClick={redo}
        disabled={historyIndex === history.length - 1}
        title="Redo"
        className="flex shrink-0 items-center justify-center w-10 h-10 rounded-md text-[#5C4D3C] hover:bg-[#F5F9F4] disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Redo2 size={20} strokeWidth={1.5} />
      </button>

      <div className="w-px h-8 lg:w-8 lg:h-px shrink-0 bg-[#E8DFCE] my-0 mx-1 lg:mx-0 lg:my-1" />

      <button
        onClick={() => {
          if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
            clearCanvas();
          }
        }}
        title="Clear Canvas"
        className="flex shrink-0 items-center justify-center w-10 h-10 rounded-md text-[#C84630] hover:bg-red-50"
      >
        <Trash2 size={20} strokeWidth={1.5} />
      </button>

      <div className="w-px h-8 lg:w-8 lg:h-px shrink-0 bg-[#E8DFCE] my-0 mx-1 lg:mx-0 lg:my-1" />

      <button
        onClick={handleAutoGenerate}
        title="Magic Auto-Generate"
        className="flex shrink-0 items-center justify-center w-10 h-10 rounded-md text-[#E0A800] hover:bg-yellow-50/50 hover:text-yellow-600 shadow-sm border border-yellow-200/50"
      >
        <Wand2 size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}
