import { useState } from 'react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { X, Plus, Image as ImageIcon, Info, Layers } from 'lucide-react';

const flowers = Array.from({ length: 23 }, (_, i) => ({
  id: `flower-${i + 1}`,
  name: `Flower ${i + 1}`,
  icon: `/flowers/${i + 1}.png`
}));

export default function SidebarRight() {
  const selectedTool = useStore(state => state.selectedTool);
  const setTool = useStore(state => state.setTool);
  const selectedFlower = useStore(state => state.selectedFlower);
  const selectFlower = useStore(state => state.selectFlower);
  
  const { designName, description, tags, setDesignInfo } = useStore();
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setDesignInfo({ tags: [...tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setDesignInfo({ tags: tags.filter(tag => tag !== tagToRemove) });
  };

  const loadTemplate = useStore(state => state.loadTemplate);

  const presets = [
    { 
      name: 'Traditional', 
      date: 'Aug 20',
      data: {
        elements: [
          { id: '1', type: 'flower' as const, name: 'Flower 1', x: 0, y: 0, rotation: 0, scale: 1 },
          { id: '2', type: 'flower' as const, name: 'Flower 2', x: 50, y: 0, rotation: 0, scale: 0.8 },
          { id: '3', type: 'flower' as const, name: 'Flower 2', x: -50, y: 0, rotation: 180, scale: 0.8 },
          { id: '4', type: 'flower' as const, name: 'Flower 2', x: 0, y: 50, rotation: 90, scale: 0.8 },
          { id: '5', type: 'flower' as const, name: 'Flower 2', x: 0, y: -50, rotation: 270, scale: 0.8 },
        ],
        rings: [],
        designName: 'Traditional',
        description: 'A classic start.',
        tags: ['Traditional']
      }
    },
    { 
      name: 'Modern Onam', 
      date: 'Aug 18',
      data: {
        elements: [
          { id: '1', type: 'flower' as const, name: 'Flower 3', x: 0, y: 0, rotation: 0, scale: 1.5 },
          { id: '2', type: 'flower' as const, name: 'Flower 4', x: 40, y: 40, rotation: 45, scale: 0.8 },
          { id: '3', type: 'flower' as const, name: 'Flower 4', x: -40, y: -40, rotation: 225, scale: 0.8 },
        ],
        rings: [],
        designName: 'Modern Onam',
        description: 'A modern approach.',
        tags: ['Modern', 'Minimal']
      }
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden w-full">
      
      {/* Panel 1: Flowers & Assets */}
      <div className="bg-[#FFF9ED]/95 backdrop-blur-sm rounded-lg border border-[#E8DFCE] flex flex-col flex-1 min-h-0 shadow-sm h-full">
        <div className="px-3 py-2 border-b border-[#E8DFCE] flex items-center gap-2 bg-white/50 rounded-t-lg">
          <ImageIcon size={14} className="text-[#3A5A34]" />
          <h2 className="text-[11px] font-bold text-[#5C4D3C] uppercase tracking-wider">Assets</h2>
        </div>
        
        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-2 grid grid-cols-4 gap-1 min-h-[200px]">
          {flowers.map(item => (
            <button
              key={item.id}
              title={item.name}
              onClick={() => {
                selectFlower(item.name);
                if (selectedTool !== 'Place' && selectedTool !== 'Circle') setTool('Place');
              }}
              className={cn(
                "flex items-center justify-center aspect-square rounded-md border transition-all duration-150",
                selectedFlower === item.name 
                  ? "border-[#3A5A34] bg-[#3A5A34]/10 shadow-inner" 
                  : "border-[#E8DFCE] bg-white hover:border-[#3A5A34]/50 hover:bg-[#F5F9F4]"
              )}
            >
              <span className="text-xl flex items-center justify-center">
                {item.icon.startsWith('/') ? (
                  <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain pointer-events-none" />
                ) : (
                  item.icon
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
