import React, { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onSyncComplete?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSyncComplete }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncStatus('Fetching LeetCode submissions...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('Synced 3 new due cards from LeetCode!');
      if (onSyncComplete) onSyncComplete();
      setTimeout(() => setSyncStatus(null), 3500);
    }, 1200);
  };

  return (
    <header className="w-full bg-[#211832] border-b border-[#5C3E94] py-3 px-8 flex justify-between items-center sticky top-0 z-50">
      {/* Left Brand Group */}
      <div className="flex items-center gap-1 select-none">
        <Logo />
        <span className="text-xl font-bold tracking-tight text-white">
          Code<span className="text-[#F25912]">Recall</span>
        </span>
      </div>

      {/* Right Utility Badges & Sync Action */}
      <div className="flex items-center gap-3">
        {syncStatus && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#1A1228] border border-[#5C3E94] text-xs text-[#B4A7D6] rounded-md animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>{syncStatus}</span>
          </div>
        )}

        {/* Streak Pill */}
        <div className="bg-[#412B6B] border border-[#5C3E94] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
          <span>🔥</span>
          <span>12-day streak</span>
        </div>

        {/* Due Count Pill */}
        <div className="border border-[#F25912] text-[#F25912] bg-[#F25912]/10 text-xs px-3 py-1.5 rounded-full font-semibold">
          3 Due Today
        </div>

        {/* Action Button */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 text-white border border-[#5C3E94] bg-transparent hover:bg-[#412B6B] transition-colors duration-150 px-3.5 py-1.5 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F25912]"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-white ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync LeetCode'}</span>
        </button>
      </div>
    </header>
  );
};
