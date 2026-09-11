import React from 'react';

export const StatusBar: React.FC = () => {
  return (
    <footer className="w-full bg-[#211832] border-t border-[#3D2963] py-3 px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B4A7D6] mt-auto">
      {/* Left Shortcuts */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-slate-400 font-medium hidden md:inline">Shortcuts:</span>
        <div className="flex items-center gap-1.5">
          <kbd className="keycap">1</kbd>
          <span className="text-slate-300 text-[11px]">Solved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="keycap">2</kbd>
          <span className="text-slate-300 text-[11px]">Hints</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="keycap">3</kbd>
          <span className="text-slate-300 text-[11px]">Code</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="keycap">J / K</kbd>
          <span className="text-slate-300 text-[11px]">Navigate</span>
        </div>
      </div>

      {/* Right Branding */}
      <div className="font-mono text-[11px] text-[#B4A7D6] tracking-tight">
        CodeRecall SRS Engine • Zero Grinding Clutter
      </div>
    </footer>
  );
};
