import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { Grid3X3, Download, Maximize, Settings2 } from 'lucide-react';
import Canvas from './Canvas';
import * as htmlToImage from 'html-to-image';

interface WorkspaceProps {
  onBloom: () => void;
}

export default function Workspace({ onBloom }: WorkspaceProps) {
  const { canvasSize, setCanvasSize, background, setBackground, showGrid, toggleGrid } = useStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && canvasSize !== 'Small') {
        setCanvasSize('Small');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasSize, setCanvasSize]);

  const backgrounds = [
    { id: 'natural', color: 'bg-[#FFF9ED]' },
    { id: 'floral', color: 'bg-[url("https://www.transparenttextures.com/patterns/floral-texture.png")] bg-[#F3E5C8]' },
    { id: 'sand', color: 'bg-[#EBD5A9]' },
    { id: 'dark', color: 'bg-[#2A4B26]' },
  ] as const;

  const handleExport = async () => {
    const canvasElement = document.getElementById('pookalam-canvas');
    if (!canvasElement) return;

    try {
      const originalGridState = showGrid;
      if (showGrid) toggleGrid();
      
      const dataUrl = await htmlToImage.toPng(canvasElement, { 
        pixelRatio: 1, 
        backgroundColor: 'transparent',
        style: {
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: 'none',
          transform: 'none'
        }
      });
      
      if (originalGridState) toggleGrid();

      const link = document.createElement('a');
      link.download = `pookalam-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      onBloom();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  const handlePublish = async () => {
    const canvasElement = document.getElementById('pookalam-canvas');
    if (!canvasElement) return;

    try {
      const originalGridState = showGrid;
      if (showGrid) toggleGrid();
      
      const dataUrl = await htmlToImage.toPng(canvasElement, { 
        pixelRatio: 1, 
        backgroundColor: 'transparent',
        style: {
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: 'none',
          transform: 'none'
        }
      });
      
      if (originalGridState) toggleGrid();

      const designNameInput = prompt("Enter a name for your Pookalam:", useStore.getState().designName || "My Pookalam");
      if (designNameInput === null) return;

      const creatorName = prompt("Enter your name:", "Anonymous");
      if (creatorName !== null) {
        useStore.getState().addGalleryDesign({
          id: Date.now().toString(),
          name: designNameInput || 'My Pookalam',
          creator: creatorName || 'Anonymous',
          likes: 0,
          image: dataUrl
        });
        alert("Design successfully published to the Gallery!");
      }
    } catch (err) {
      console.error('Failed to publish image', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#FFF9ED]/95 backdrop-blur-sm border border-[#E8DFCE] rounded-lg overflow-hidden shadow-sm">

      {/* Photoshop Options Bar */}
      <div className="h-auto lg:h-10 px-2 lg:px-4 py-2 lg:py-0 bg-white/50 border-b border-[#E8DFCE] flex flex-col lg:flex-row items-center justify-between shadow-sm shrink-0 gap-2 lg:gap-0">

        <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-6 w-full lg:w-auto">
          <div className="hidden sm:flex items-center gap-2">
            <Maximize size={12} className="text-[#3A5A34]" />
            <span className="text-[10px] font-bold text-[#5C4D3C] uppercase hidden sm:inline">Size</span>
            <select
              value={canvasSize}
              onChange={(e) => setCanvasSize(e.target.value as any)}
              className="bg-white border border-[#E8DFCE] rounded px-2 py-0.5 text-[10px] font-bold text-[#2A4B26] outline-none shadow-inner cursor-pointer"
            >
              <option value="Small">Small (400px)</option>
              <option value="Medium">Medium (600px)</option>
              <option value="Large">Large (700px)</option>
            </select>
          </div>

          <div className="w-px h-4 bg-[#E8DFCE] hidden sm:block" />

          <div className="flex items-center gap-2">
            <Settings2 size={12} className="text-[#3A5A34]" />
            <span className="text-[10px] font-bold text-[#5C4D3C] uppercase hidden sm:inline">Fill</span>
            <div className="flex gap-1">
              {backgrounds.map(bg => (
                <button
                  key={bg.id}
                  onClick={() => setBackground(bg.id)}
                  className={cn(
                    "w-4 h-4 rounded border transition-transform",
                    bg.color,
                    background === bg.id ? "border-[#3A5A34] scale-110" : "border-[#E8DFCE] shadow-inner"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-4 bg-[#E8DFCE] hidden sm:block" />

          <button
            onClick={toggleGrid}
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold transition-colors border",
              showGrid ? "bg-[#3A5A34]/10 border-[#3A5A34]/30 text-[#2A4B26]" : "bg-white border-[#E8DFCE] text-[#5C4D3C] hover:bg-[#F5F9F4]"
            )}
          >
            <Grid3X3 size={12} />
            <span className="hidden sm:inline">Show Grid</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">
          <button 
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#3A5A34] border border-[#3A5A34] rounded text-[11px] font-bold hover:bg-[#F5F9F4] transition-colors shadow-sm"
          >
            Publish to Gallery
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3A5A34] text-white rounded text-[11px] font-bold hover:bg-[#2A4B26] transition-colors shadow-sm"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className={cn(
        "flex-1 relative w-full flex items-center justify-center transition-colors duration-500 overflow-hidden",
        backgrounds.find(b => b.id === background)?.color || 'bg-[#F7F1E6]'
      )}>
        {/* Drop shadow for the canvas container area */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
        <Canvas />
      </div>

    </div>
  );
}
