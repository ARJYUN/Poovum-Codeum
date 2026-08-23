import { useState } from 'react';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import Workspace from '../components/Workspace';
import BloomMode from '../components/BloomMode';

export default function Designer() {
  const [isBloomMode, setIsBloomMode] = useState(false);

  if (isBloomMode) {
    return <BloomMode onClose={() => setIsBloomMode(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col relative z-10 w-full min-h-0 pb-2">
      
      {/* Main 3-column layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-2 mt-2 min-h-0">
        {/* Left Toolbar */}
        <div className="flex-shrink-0 flex flex-col lg:min-h-0">
          <SidebarLeft />
        </div>
        
        {/* Center Workspace */}
        <div className="flex-1 min-w-0 flex flex-col min-h-[400px] lg:min-h-0">
          <Workspace onBloom={() => setIsBloomMode(true)} />
        </div>
        
        {/* Right Panels */}
        <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col h-[300px] lg:h-auto lg:min-h-0">
          <SidebarRight />
        </div>
      </div>
      
    </div>
  );
}
