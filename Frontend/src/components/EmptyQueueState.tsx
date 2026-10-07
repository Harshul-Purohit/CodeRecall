import React from 'react';
import { FilterX, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { QuickFilterType } from '../types/filter';

interface EmptyQueueStateProps {
  hasActiveFilters: boolean;
  quickFilter: QuickFilterType;
  onClearFilters: () => void;
  onSyncLeetCode?: () => void;
}

export const EmptyQueueState: React.FC<EmptyQueueStateProps> = ({
  hasActiveFilters,
  quickFilter,
  onClearFilters,
  onSyncLeetCode
}) => {
  // If zero results are due to active search / pattern / quick filter criteria
  if (hasActiveFilters && quickFilter !== 'DUE_TODAY') {
    return (
      <div className="bg-[#2C1F45] border border-[#5C3E94] rounded-2xl p-10 sm:p-14 text-center text-[#B4A7D6] space-y-4 mb-8 shadow-xl animate-fade-in">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1A1228] border border-[#5C3E94] flex items-center justify-center text-[#F25912] shadow-inner">
          <FilterX className="w-7 h-7" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-white tracking-tight">
            No revision cards match your current filters
          </h3>
          <p className="text-xs text-[#B4A7D6] leading-relaxed">
            We couldn&apos;t find any cards matching your active search query, selected pattern, or quick filter criteria.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#F25912] hover:bg-[#F25912]/90 text-white text-xs font-semibold rounded-lg shadow-lg hover:shadow-[#F25912]/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F25912]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Filters &amp; Search</span>
          </button>
        </div>
      </div>
    );
  }

  // "All Caught Up!" rewarding developer state (e.g. for DUE_TODAY or clean queue)
  return (
    <div className="bg-[#2C1F45] border border-[#5C3E94] rounded-2xl p-10 sm:p-14 text-center space-y-5 mb-8 shadow-2xl animate-fade-in relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F25912]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Rewarding Trophy / Sparkles Badge */}
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1A1228] border border-[#22C55E]/50 flex items-center justify-center text-[#22C55E] shadow-xl animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
      </div>

      <div className="relative z-10 space-y-2 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[11px] font-mono font-semibold">
          <span>✓ Queue Fully Retained</span>
        </div>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          You&apos;re Monotonically Retained!
        </h3>
        <p className="text-xs sm:text-sm text-[#B4A7D6] leading-relaxed">
          Zero cards due for review right now. Next spaced repetition batch arrives tomorrow.
        </p>
      </div>

      <div className="relative z-10 pt-3 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#412B6B] hover:bg-[#5C3E94] border border-[#5C3E94] text-white text-xs font-semibold rounded-lg shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F25912]"
        >
          <Layers className="w-3.5 h-3.5 text-[#F25912]" />
          <span>Review All Backlog Cards Anyway</span>
        </button>

        {onSyncLeetCode && (
          <button
            onClick={onSyncLeetCode}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#F25912] hover:bg-[#F25912]/90 text-white text-xs font-semibold rounded-lg shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F25912]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync LeetCode</span>
          </button>
        )}
      </div>
    </div>
  );
};
