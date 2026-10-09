import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Layers, BarChart3, Flame, Plus } from 'lucide-react';
import { Logo } from './Logo';
import { BackupDropdown } from './BackupDropdown';

interface NavbarProps {
  activeView?: 'queue' | 'analytics';
  onViewChange?: (view: 'queue' | 'analytics') => void;
  dueTodayCount?: number;
  currentStreak?: number;
  onSyncComplete?: () => void;
  onOpenAddModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'queue',
  onViewChange,
  dueTodayCount = 3,
  currentStreak = 14,
  onSyncComplete,
  onOpenAddModal
}) => {
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
    <header className="w-full bg-[#211832] border-b border-[#5C3E94] py-2.5 px-4 sm:px-8 flex flex-wrap justify-between items-center sticky top-0 z-50 gap-3">
      {/* Left Brand Group */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 select-none">
          <Logo />
          <span className="text-xl font-bold tracking-tight text-white">
            Code<span className="text-[#F25912]">Recall</span>
          </span>
        </div>

        {/* Center/Left Navigation View Toggle Switcher */}
        {onViewChange && (
          <nav className="flex items-center bg-[#1A1228] p-1 rounded-xl border border-[#5C3E94]/80 text-xs font-mono">
            <button
              onClick={() => onViewChange('queue')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                activeView === 'queue'
                  ? 'bg-[#412B6B] text-white shadow border border-[#F25912]/50'
                  : 'text-[#B4A7D6] hover:text-white hover:bg-[#2C1F45]'
              }`}
              title="Keyboard shortcut: G then Q"
            >
              <Layers className="w-3.5 h-3.5 text-[#F25912]" />
              <span>Revision Queue</span>
              <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 bg-[#211832] rounded text-[#B4A7D6] border border-[#5C3E94]/60">
                G Q
              </kbd>
            </button>

            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                activeView === 'analytics'
                  ? 'bg-[#4F3B78] text-[#C4BBF0] shadow border border-[#927FBF]'
                  : 'text-[#B4A7D6] hover:text-white hover:bg-[#2C1F45]'
              }`}
              title="Keyboard shortcut: G then A"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#C4BBF0]" />
              <span>Analytics Dashboard</span>
              <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 bg-[#211832] rounded text-[#B4A7D6] border border-[#5C3E94]/60">
                G A
              </kbd>
            </button>
          </nav>
        )}
      </div>

      {/* Right Utility Badges & Sync Action */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {syncStatus && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-[#1A1228] border border-[#5C3E94] text-xs text-[#B4A7D6] rounded-md animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>{syncStatus}</span>
          </div>
        )}

        {/* Streak Pill */}
        <div className="bg-[#412B6B] border border-[#5C3E94] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>{currentStreak}-day streak</span>
        </div>

        {/* Due Count Pill */}
        <div className="border border-[#F25912] text-[#F25912] bg-[#F25912]/10 text-xs px-3 py-1.5 rounded-full font-semibold">
          {dueTodayCount} Due Today
        </div>

        {/* Action Button: + New Card */}
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 text-white bg-[#4F3B78] hover:bg-[#927FBF] hover:text-[#363B4E] border border-[#927FBF] transition-all duration-150 px-3.5 py-1.5 rounded-md text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#C4BBF0] shadow-md"
            title="Create Custom Problem Card (Shortcut: N)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Card</span>
            <kbd className="hidden md:inline text-[9px] px-1 py-0.2 bg-[#363B4E] rounded text-[#C4BBF0] border border-[#927FBF]/60">
              N
            </kbd>
          </button>
        )}

        {/* Backup / Export / Import Dropdown */}
        <BackupDropdown />

        {/* Action Button: Sync LeetCode */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 text-white border border-[#5C3E94] bg-transparent hover:bg-[#412B6B] transition-colors duration-150 px-3 py-1.5 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F25912]"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-white ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync LeetCode'}</span>
        </button>
      </div>
    </header>
  );
};


