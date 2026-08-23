import { useState } from 'react';
import { Save, Download, Share2, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import * as htmlToImage from 'html-to-image';

export default function ActionBar() {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const { designName, description, setDesignInfo } = useStore();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    // In a real app, save to backend/localStorage
    setShowSaveModal(false);
    showToast('Your Pookalam has bloomed! 🌼');
  };

  const handleDownload = async () => {
    const node = document.getElementById('pookalam-canvas');
    if (!node) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${designName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Downloaded successfully! 🌼');
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <>
      <div className="card-surface p-2 flex flex-wrap items-center justify-center gap-4 bg-white/80">
        <button 
          onClick={() => setShowSaveModal(true)}
          className="btn-primary text-sm px-8"
        >
          <Save size={16} /> Save Design
        </button>
        <button 
          onClick={handleDownload}
          className="btn-secondary text-sm px-6"
        >
          <Download size={16} /> Download
        </button>
        <button 
          onClick={() => setShowShareModal(true)}
          className="btn-secondary text-sm px-6"
        >
          <Share2 size={16} /> Share
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background-cream rounded-2xl p-6 max-w-sm w-full shadow-xl border border-primary-green/20">
            <h2 className="text-2xl font-display font-bold text-primary-dark mb-4 flex items-center justify-between">
              Save Design
              <button onClick={() => setShowSaveModal(false)} className="text-accent-brown hover:text-primary-dark">
                <X size={20} />
              </button>
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-primary-dark mb-1">Design Name</label>
                <input 
                  type="text" 
                  value={designName}
                  onChange={(e) => setDesignInfo({ designName: e.target.value })}
                  className="w-full bg-white border border-accent-brown/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary-dark mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDesignInfo({ description: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-accent-brown/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-green resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleSave}
                className="btn-primary flex-1"
              >
                Save Design
              </button>
              <button 
                onClick={() => setShowSaveModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background-cream rounded-2xl p-6 max-w-sm w-full shadow-xl border border-primary-green/20">
            <h2 className="text-2xl font-display font-bold text-primary-dark mb-4 flex items-center justify-between">
              Share Pookalam
              <button onClick={() => setShowShareModal(false)} className="text-accent-brown hover:text-primary-dark">
                <X size={20} />
              </button>
            </h2>
            
            <div className="bg-white p-4 rounded-xl border border-accent-brown/10 mb-6 text-center">
              <span className="text-4xl mb-2 block">🌼</span>
              <p className="font-bold text-primary-dark">{designName}</p>
              <p className="text-xs text-accent-brown mb-2">Designed with Poovum Codeum</p>
              <p className="text-[10px] text-primary-green font-medium">#PoovumCodeum #Onam #Pookalam</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary py-2 text-xs" onClick={() => { setShowShareModal(false); showToast('Link copied!'); }}>Copy Link</button>
              <button className="btn-secondary py-2 text-xs bg-green-50 text-green-700 hover:bg-green-100">WhatsApp</button>
              <button className="btn-secondary py-2 text-xs bg-pink-50 text-pink-700 hover:bg-pink-100">Instagram</button>
              <button className="btn-secondary py-2 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">LinkedIn</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary-dark text-white px-6 py-3 rounded-full shadow-xl font-medium animate-bounce z-[60]">
          {toastMessage}
        </div>
      )}
    </>
  );
}
