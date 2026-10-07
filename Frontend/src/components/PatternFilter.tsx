import React from 'react';
import { PatternCount } from '../types/filter';

interface PatternFilterProps {
  patterns: PatternCount[];
  activePattern: string;
  onPatternChange: (patternName: string) => void;
  // Aliases for backwards compatibility
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
}

export const PatternFilter: React.FC<PatternFilterProps> = ({
  patterns,
  activePattern,
  onPatternChange,
  activeFilter,
  onFilterChange
}) => {
  const currentActive = activePattern || activeFilter || 'ALL';
  const handleSelect = (patternName: string) => {
    onPatternChange(patternName);
    if (onFilterChange) {
      onFilterChange(patternName);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {patterns.map((item) => {
        const isActive =
          currentActive === item.name ||
          (currentActive.toLowerCase() === 'all' && item.name.toLowerCase() === 'all');

        return (
          <button
            key={item.name}
            onClick={() => handleSelect(item.name)}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F25912] ${
              isActive
                ? 'bg-[#F25912] text-white shadow-sm ring-1 ring-[#F25912]/40'
                : 'bg-[#2C1F45] border border-[#5C3E94] text-[#B4A7D6] hover:text-white hover:border-[#F25912]/50'
            }`}
          >
            <span>{item.name}</span>
            <span
              className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-white/20 text-white font-bold' : 'bg-[#1A1228] text-[#B4A7D6]'
              }`}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
