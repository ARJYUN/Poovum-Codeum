import { createPortal } from 'react-dom';
import { X, CheckCircle } from 'lucide-react';

interface BloomModeProps {
  onClose: () => void;
}

export default function BloomMode({ onClose }: BloomModeProps) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#FFF9ED] rounded-2xl shadow-xl max-w-sm w-full p-8 relative flex flex-col items-center text-center animate-in zoom-in-95 duration-300 border border-[#E8DFCE]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5C4D3C] hover:text-[#2A4B26] transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="w-16 h-16 bg-[#3A5A34]/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-[#3A5A34] w-8 h-8" />
        </div>
        
        <h2 className="text-3xl font-display font-bold text-[#2A4B26] mb-2">Happy Onam! 🌼</h2>
        <p className="text-[#5C4D3C] font-medium">Your Pookalam downloaded successfully.</p>
        
        <button 
          onClick={onClose}
          className="mt-8 px-6 py-2 bg-[#3A5A34] text-white rounded-full font-bold hover:bg-[#2A4B26] transition-colors w-full shadow-sm hover:-translate-y-0.5"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
