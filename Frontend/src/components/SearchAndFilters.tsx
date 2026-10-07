import React, { useRef, useEffect, useState } from 'react';
import { Search, X, ArrowUpDown, Filter, Sparkles, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { QuickFilterType, SortOptionType, QuickFilterCount } from '../types/filter';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  quickFilter: QuickFilterType;
  onQuickFilterChange: (filter: QuickFilterType) => void;
  sortBy: SortOptionType;
  onSortByChange: (sort: SortOptionType) => void;
  quickFilterCounts: QuickFilterCount[];
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  quickFilter,
  onQuickFilterChange,
  sortBy,
  onSortByChange,
  quickFilterCounts
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Global shortcut handler for "/" search focus and "Escape" clear/blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore "/" if user is typing inside any editable input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
          onSearchChange('');
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, onSearchChange]);

  const getQuickFilterIcon = (id: QuickFilterType) => {
    switch (id) {
      case 'DUE_TODAY':
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      case 'OVERDUE':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      case 'MASTERED':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      case 'FAILED_LAST':
        return <Filter className="w-3.5 h-3.5 text-indigo-400" />;
      case 'ALL':
      default:
        return <CheckCircle className="w-3.5 h-3.5 text-[#B4A7D6]" />;
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Primary Search Bar */}
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 pointer-events-none flex items-center justify-center text-[#B4A7D6]">
          <Search className={`w-4 h-4 transition-colors ${isFocused ? 'text-[#F25912]' : 'text-[#B4A7D6]'}`} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            inputRef.current?.select();
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search by title, #number (e.g., 001, #015), or pattern tag..."
          className="w-full pl-10 pr-24 py-2.5 bg-[#2C1F45]/90 border border-[#5C3E94] focus:border-[#F25912] focus:ring-2 focus:ring-[#F25912]/20 rounded-lg text-sm text-white placeholder-[#8E7CC3] transition-all duration-150 outline-none font-sans shadow-inner"
        />

        <div className="absolute right-3 flex items-center gap-2">
          {searchQuery ? (
            <button
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              className="p-1 text-[#B4A7D6] hover:text-white rounded-md bg-[#1A1228] hover:bg-[#5C3E94] transition-colors"
              title="Clear search (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            !isFocused && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-[#1A1228] border border-[#5C3E94] rounded text-[11px] font-mono text-[#B4A7D6] shadow-sm select-none">
                <span className="text-[#F25912] font-bold">/</span>
                <span>focus</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Toolbar: Quick Filter Segmented Control + Sort Dropdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#2C1F45]/50 border border-[#5C3E94]/60 p-2.5 rounded-xl">
        {/* Quick Filter Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {quickFilterCounts.map((item) => {
            const isActive = quickFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onQuickFilterChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F25912] ${
                  isActive
                    ? 'bg-[#F25912] text-white shadow-md'
                    : 'bg-[#1A1228]/70 text-[#B4A7D6] hover:text-white hover:bg-[#412B6B]/80 border border-[#5C3E94]/50'
                }`}
              >
                {getQuickFilterIcon(item.id)}
                <span>{item.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#2C1F45] text-[#B4A7D6] border border-[#5C3E94]/40'
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Controls Dropdown */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#B4A7D6] font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#F25912]" />
            <span className="hidden sm:inline">Sort:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOptionType)}
            className="bg-[#1A1228] border border-[#5C3E94] text-white text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#F25912] cursor-pointer hover:border-[#F25912]/50 transition-colors"
          >
            <option value="SM2_QUEUE">Next Due Date (SM-2 Priority)</option>
            <option value="EASINESS_FACTOR_ASC">Easiness Factor (Lowest First)</option>
            <option value="EASINESS_FACTOR_DESC">Easiness Factor (Highest First)</option>
            <option value="DIFFICULTY">Difficulty (Easy → Hard)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
