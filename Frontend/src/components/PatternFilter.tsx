import React from 'react';

export interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface PatternFilterProps {
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const filters: FilterOption[] = [
  { id: 'all', label: 'All', count: 8 },
  { id: 'two-pointers', label: 'Two Pointers', count: 3 },
  { id: 'sliding-window', label: 'Sliding Window', count: 2 },
  { id: 'hashing', label: 'Hashing', count: 3 },
  { id: 'dp', label: 'Dynamic Programming', count: 0 },
];

export const PatternFilter: React.FC<PatternFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#F25912] ${
              isActive
                ? 'bg-[#F25912] text-white shadow-sm'
                : 'bg-[#2C1F45] border border-[#5C3E94] text-[#B4A7D6] hover:text-white hover:border-[#F25912]/50'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        );
      })}
    </div>
  );
};
