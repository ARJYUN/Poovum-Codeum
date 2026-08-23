import { Mail, Globe, Link } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        
        <div className="flex gap-4 mb-2">
          <a href="#" className="w-6 h-6 rounded-full border border-[#5C4D3C]/30 flex items-center justify-center hover:bg-[#3A5A34] hover:text-white transition-all duration-300 text-[#5C4D3C]">
            <Globe size={12} />
          </a>
          <a href="#" className="w-6 h-6 rounded-full border border-[#5C4D3C]/30 flex items-center justify-center hover:bg-[#3A5A34] hover:text-white transition-all duration-300 text-[#5C4D3C]">
            <Mail size={12} />
          </a>
          <a href="#" className="w-6 h-6 rounded-full border border-[#5C4D3C]/30 flex items-center justify-center hover:bg-[#3A5A34] hover:text-white transition-all duration-300 text-[#5C4D3C]">
            <Link size={12} />
          </a>
        </div>

        <p className="text-[10px] text-[#5C4D3C] font-bold tracking-wide">
          © 2026 Poovum Codeum | Bloom Your Creativity
        </p>

      </div>
    </footer>
  );
}
