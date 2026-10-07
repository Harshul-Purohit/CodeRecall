export type QuickFilterType = 'ALL' | 'DUE_TODAY' | 'OVERDUE' | 'MASTERED' | 'FAILED_LAST';

export type SortOptionType =
  | 'SM2_QUEUE'
  | 'NEXT_REVIEW'
  | 'EASINESS_FACTOR_ASC'
  | 'EASINESS_FACTOR_DESC'
  | 'DIFFICULTY';

export interface FilterState {
  searchQuery: string;
  selectedPattern: string; // 'ALL' | specific pattern name
  quickFilter: QuickFilterType;
  sortBy: SortOptionType;
}

export interface PatternCount {
  name: string;
  count: number;
}

export interface QuickFilterCount {
  id: QuickFilterType;
  label: string;
  count: number;
}
