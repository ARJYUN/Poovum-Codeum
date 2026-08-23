import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { 
  Move, 
  Eraser, 
  Undo2, 
  Redo2,
  CircleDashed,
  Circle,
  Flower2,
  PenTool,
  Trash2
} from 'lucide-react';
import type { ToolType } from '../types';

const tools: { id: ToolType; icon: any; label: string }[] = [
  { id: 'Select', icon: Move, label: 'Move Elements' },
  { id: 'Place', icon: Flower2, label: 'Place Flower' },
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

  return (
    <div className="flex flex-row lg:flex-col items-center justify-center gap-2 bg-[#FFF9ED]/95 backdrop-blur-sm border border-[#E8DFCE] shadow-sm rounded-lg p-2 w-full lg:w-14 overflow-x-auto shrink-0">
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
    </div>
  );
}
