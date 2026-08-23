import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Designer', path: '/designer' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About Onam', path: '/about' },
  ];

  return (
    <header className="relative z-50 w-full pt-4 pb-2 mt-2 px-2 flex justify-center">
      {/* Center: Navigation Container */}
      <nav className="flex flex-wrap items-center justify-center gap-1 md:gap-4 bg-[#FFF9ED]/80 backdrop-blur-xl rounded-full px-2 md:px-6 py-2 shadow-sm border border-[#E8DFCE]/50">
        
        {/* Brand */}
        <NavLink to="/" className="text-lg md:text-xl font-display font-bold text-[#2A4B26] tracking-tight flex items-center gap-2 pr-2 md:pr-4 border-r border-[#E8DFCE]/50">
          <Leaf size={20} className="text-[#3A5A34]" />
          <span className="hidden sm:inline">Poovum Codeum</span>
        </NavLink>

        {/* Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "text-xs md:text-sm font-bold transition-colors duration-300 relative px-3 md:px-5 py-2 md:py-2.5 rounded-full flex items-center gap-1 md:gap-2 outline-none group",
                  isActive ? "text-[#2A4B26]" : "text-[#5C4D3C] hover:text-[#2A4B26]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-[#3A5A34]/10 rounded-full shadow-inner"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                  {isActive && <Leaf size={14} className="relative z-10 text-[#3A5A34]" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
