import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden py-20 px-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-dark mb-6 tracking-tight">
          Poovum Codeum
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-display text-accent-brown font-medium mb-4">
          Your Digital Pookalam Studio
        </h2>
        
        <p className="text-lg md:text-xl text-accent-brown/80 max-w-2xl mx-auto mb-10 font-medium italic">
          "No flowers. No floor. Just creativity, code, and a blank screen."
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/designer" className="btn-primary w-full sm:w-auto text-lg px-8 py-3">
            Start Designing
            <ArrowRight size={20} />
          </Link>
          <Link to="/gallery" className="btn-secondary w-full sm:w-auto text-lg px-8 py-3">
            Explore Pookalams
          </Link>
        </div>
      </div>
    </div>
  );
}
