import React from 'react';

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-win-gray p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-xl ${className}`}>
      {/* Title Bar */}
      <div className="bg-win-blue px-2 py-1 flex items-center justify-between mb-4 select-none">
        <span className="text-white font-bold font-sans tracking-wide text-sm">{title}</span>
        <div className="flex gap-1">
          {/* Fake Minimize/Maximize/Close buttons */}
          <button className="w-4 h-4 bg-win-gray border-t border-l border-white border-b border-r border-black flex items-center justify-center text-[10px] font-bold leading-none active:border-t-black active:border-l-black">_</button>
          <button className="w-4 h-4 bg-win-gray border-t border-l border-white border-b border-r border-black flex items-center justify-center text-[10px] font-bold leading-none active:border-t-black active:border-l-black">□</button>
          <button className="w-4 h-4 bg-win-gray border-t border-l border-white border-b border-r border-black flex items-center justify-center text-[10px] font-bold leading-none active:border-t-black active:border-l-black">×</button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="px-2 pb-2">
        {children}
      </div>
    </div>
  );
};