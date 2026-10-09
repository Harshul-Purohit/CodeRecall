import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import {
  Problem,
  RecallRating,
  ProblemCardData
} from '../types/problem';
import {
  QuickFilterType,
  SortOptionType,
  PatternCount,
  QuickFilterCount,
  FilterState
} from '../types/filter';
import { TelemetryOverview } from '../types/analytics';
import { problemService } from '../services/problemService';
import { calculateTelemetryOverview } from '../utils/analyticsUtils';

export interface FilterStateWithSetters extends FilterState {
  setSearchQuery: (query: string) => void;
  setSelectedPattern: (pattern: string) => void;
  setQuickFilter: (filter: QuickFilterType) => void;
  setSortBy: (sort: SortOptionType) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export interface ProblemContextValue {
  // State
  problems: Problem[];
  activeQueue: Problem[];
  telemetry: TelemetryOverview;
  isLoading: boolean;
  error: string | null;

  // Filter State & Setters
  filterState: FilterStateWithSetters;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  quickFilter: QuickFilterType;
  setQuickFilter: (filter: QuickFilterType) => void;
  sortBy: SortOptionType;
  setSortBy: (sort: SortOptionType) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // Navigation & Counts
  activeCardIndex: number;
  setActiveCardIndex: React.Dispatch<React.SetStateAction<number>>;
  patternCounts: PatternCount[];
  quickFilterCounts: QuickFilterCount[];

  // Asynchronous Actions
  reviewProblem: (problemId: string | number, rating: RecallRating) => Promise<Problem>;
  createProblem: (newProblem: Omit<Problem, 'id'> & { id?: string | number }) => Promise<Problem>;
  exportDeck: () => Promise<string>;
  importDeck: (jsonData: string) => Promise<boolean>;
  resetToDefaultDeck: () => Promise<void>;
  refreshQueue: () => Promise<void>;

  // Backwards-compatibility helpers for Phase 2 card handlers
  handleSolveWithoutHelp: (problemId: string | number) => void;
  handleNeedHints: (problemId: string | number) => void;
  handleViewSolution: (problemId: string | number) => void;
  addProblemCard: (card: ProblemCardData) => void;
}

const ProblemContext = createContext<ProblemContextValue | undefined>(undefined);

export const useProblemContext = (): ProblemContextValue => {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error('useProblemContext must be used within a ProblemProvider');
  }
  return context;
};

export const ProblemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryOverview>({
    currentStreak: 14,
    longestStreak: 28,
    overallRetentionRate: 94.8,
    totalReviewsCompleted: 142,
    backlogCount: 0,
    averageEasinessFactor: 2.5,
    dueTodayCount: 0,
    masteredCardsCount: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPattern, setSelectedPattern] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortOptionType>('SM2_QUEUE');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  /**
   * Initial data load from service layer
   */
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [queueData, telemetryData] = await Promise.all([
        problemService.getQueue(),
        problemService.getTelemetry()
      ]);
      setProblems(queueData);
      setTelemetry(telemetryData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to initialize study queue.';
      setError(msg);
      console.error('[ProblemProvider] Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /**
   * Refresh queue & telemetry on demand
   */
  const refreshQueue = useCallback(async () => {
    try {
      setError(null);
      const [queueData, telemetryData] = await Promise.all([
        problemService.getQueue(),
        problemService.getTelemetry()
      ]);
      setProblems(queueData);
      setTelemetry(telemetryData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to refresh queue.';
      setError(msg);
    }
  }, []);

  /**
   * Derive unique pattern list with counts dynamically
   */
  const patternCounts = useMemo<PatternCount[]>(() => {
    const countsMap = new Map<string, number>();

    problems.forEach((card) => {
      const cardPatterns = card.patterns || (card.pattern ? [card.pattern] : []);
      cardPatterns.forEach((p) => {
        countsMap.set(p, (countsMap.get(p) || 0) + 1);
      });
    });

    const list: PatternCount[] = [{ name: 'ALL', count: problems.length }];
    countsMap.forEach((count, name) => {
      list.push({ name, count });
    });

    return list;
  }, [problems]);

  /**
   * Derive Quick Filter badge counts dynamically
   */
  const quickFilterCounts = useMemo<QuickFilterCount[]>(() => {
    let dueToday = 0;
    let overdue = 0;
    let mastered = 0;
    let failedLast = 0;

    problems.forEach((card) => {
      const nextDate = card.sm2?.nextReviewDate || '';
      const isDue =
        card.isDueToday || (nextDate !== '' && nextDate <= todayStr) || card.dueStatus === 'Due Today';
      const isOver = card.isOverdue || (nextDate !== '' && nextDate < todayStr);
      const isMast =
        card.isMastered ||
        (card.sm2?.intervalDays ?? 0) >= 21 ||
        (card.sm2?.easinessFactor ?? 0) >= 2.5;

      const lastResult = card.sm2?.lastAttemptResult || '';
      const lastType = card.lastAttemptType || '';
      const isFailed =
        lastResult === 'CODE_VIEWED' ||
        lastResult === 'NEEDED_HINTS' ||
        lastType === 'code_viewed' ||
        lastType === 'needed_hints';

      if (isDue) dueToday++;
      if (isOver) overdue++;
      if (isMast) mastered++;
      if (isFailed) failedLast++;
    });

    return [
      { id: 'ALL', label: 'All Queue', count: problems.length },
      { id: 'DUE_TODAY', label: 'Due Today', count: dueToday },
      { id: 'OVERDUE', label: 'Overdue', count: overdue },
      { id: 'MASTERED', label: 'Mastered', count: mastered },
      { id: 'FAILED_LAST', label: 'Failed Last', count: failedLast }
    ];
  }, [problems, todayStr]);

  /**
   * Memoized Active Queue with Filtering & Sorting
   */
  const activeQueue = useMemo(() => {
    return problems
      .filter((card) => {
        // Step A: Search Query Matching
        if (searchQuery.trim() !== '') {
          const q = searchQuery.trim().toLowerCase();
          const cleanQ = q.replace(/^#/, '');

          const titleMatch = card.title.toLowerCase().includes(q);
          const probNum = (card.problemNumber || card.number || '').toLowerCase();
          const cleanProbNum = probNum.replace(/^#/, '');
          const numberMatch =
            probNum.includes(q) || (cleanQ !== '' && cleanProbNum.includes(cleanQ));

          const cardPatterns = card.patterns || (card.pattern ? [card.pattern] : []);
          const patternMatch = cardPatterns.some((p) => p.toLowerCase().includes(q));

          if (!titleMatch && !numberMatch && !patternMatch) {
            return false;
          }
        }

        // Step B: Pattern Filter Matching
        if (selectedPattern !== 'ALL' && selectedPattern.toLowerCase() !== 'all') {
          const cardPatterns = card.patterns || (card.pattern ? [card.pattern] : []);
          const matchesPatternName = cardPatterns.some(
            (p) => p.toLowerCase() === selectedPattern.toLowerCase()
          );
          const matchesPatternId = card.patternId === selectedPattern;

          if (!matchesPatternName && !matchesPatternId) {
            return false;
          }
        }

        // Step C: Quick Filter Matching
        const nextDate = card.sm2?.nextReviewDate || '';
        if (quickFilter === 'DUE_TODAY') {
          const isDue =
            card.isDueToday || (nextDate !== '' && nextDate <= todayStr) || card.dueStatus === 'Due Today';
          if (!isDue) return false;
        } else if (quickFilter === 'OVERDUE') {
          const isOver = card.isOverdue || (nextDate !== '' && nextDate < todayStr);
          if (!isOver) return false;
        } else if (quickFilter === 'MASTERED') {
          const isMast =
            card.isMastered ||
            (card.sm2?.intervalDays ?? 0) >= 21 ||
            (card.sm2?.easinessFactor ?? 0) >= 2.5;
          if (!isMast) return false;
        } else if (quickFilter === 'FAILED_LAST') {
          const lastResult = card.sm2?.lastAttemptResult || '';
          const lastType = card.lastAttemptType || '';
          const isFailed =
            lastResult === 'CODE_VIEWED' ||
            lastResult === 'NEEDED_HINTS' ||
            lastType === 'code_viewed' ||
            lastType === 'needed_hints';
          if (!isFailed) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Step D: Sort Comparator
        if (sortBy === 'SM2_QUEUE' || sortBy === 'NEXT_REVIEW') {
          const dateA = a.sm2?.nextReviewDate || '9999-99-99';
          const dateB = b.sm2?.nextReviewDate || '9999-99-99';
          if (dateA !== dateB) return dateA.localeCompare(dateB);
          return (a.sm2?.easinessFactor ?? 2.5) - (b.sm2?.easinessFactor ?? 2.5);
        }

        if (sortBy === 'EASINESS_FACTOR_ASC') {
          return (a.sm2?.easinessFactor ?? 2.5) - (b.sm2?.easinessFactor ?? 2.5);
        }

        if (sortBy === 'EASINESS_FACTOR_DESC') {
          return (b.sm2?.easinessFactor ?? 2.5) - (a.sm2?.easinessFactor ?? 2.5);
        }

        if (sortBy === 'DIFFICULTY') {
          const diffRank: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
          const rankA = diffRank[a.difficulty] || 2;
          const rankB = diffRank[b.difficulty] || 2;
          return rankA - rankB;
        }

        return 0;
      });
  }, [problems, searchQuery, selectedPattern, quickFilter, sortBy, todayStr]);

  // Keep active card index in bounds
  useEffect(() => {
    if (activeCardIndex >= activeQueue.length) {
      setActiveCardIndex(Math.max(0, activeQueue.length - 1));
    }
  }, [activeQueue.length, activeCardIndex]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedPattern('ALL');
    setQuickFilter('ALL');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' || selectedPattern !== 'ALL' || quickFilter !== 'ALL';
  }, [searchQuery, selectedPattern, quickFilter]);

  const filterState: FilterStateWithSetters = useMemo(
    () => ({
      searchQuery,
      selectedPattern,
      quickFilter,
      sortBy,
      setSearchQuery,
      setSelectedPattern,
      setQuickFilter,
      setSortBy,
      clearFilters,
      hasActiveFilters
    }),
    [searchQuery, selectedPattern, quickFilter, sortBy, clearFilters, hasActiveFilters]
  );

  /**
   * Optimistic SM-2 Review Submission
   */
  const reviewProblem = useCallback(
    async (problemId: string | number, rating: RecallRating): Promise<Problem> => {
      // 1. Snapshot previous state for rollback on error
      const previousProblems = [...problems];

      // 2. Perform immediate optimistic update on local React state
      const targetCard = problems.find((p) => String(p.id) === String(problemId));
      if (!targetCard) {
        throw new Error(`Problem with ID ${problemId} not found.`);
      }

      const currentEf = targetCard.sm2?.easinessFactor || 2.5;
      const currentDays = targetCard.sm2?.intervalDays || 1;
      const currentReps = targetCard.sm2?.repetitionCount || 0;

      let optimisticEf = currentEf;
      let optimisticDays = currentDays;
      let optimisticReps = currentReps;
      let attemptResult: 'SOLVED_WITHOUT_HELP' | 'NEEDED_HINTS' | 'CODE_VIEWED' = 'SOLVED_WITHOUT_HELP';
      let lastAttemptType: 'solved_without_help' | 'needed_hints' | 'code_viewed' =
        'solved_without_help';
      let lastHistory = 'Last: Solved Without Help';

      if (rating === 'SOLVED_WITHOUT_HELP') {
        optimisticEf = Math.min(3.0, parseFloat((currentEf + 0.1).toFixed(2)));
        optimisticReps = currentReps + 1;
        optimisticDays =
          optimisticReps === 1 ? 1 : optimisticReps === 2 ? 6 : Math.min(60, currentDays * 2);
        attemptResult = 'SOLVED_WITHOUT_HELP';
        lastAttemptType = 'solved_without_help';
        lastHistory = 'Last: Solved Without Help';
      } else if (rating === 'NEEDED_HINTS') {
        optimisticEf = Math.max(1.3, parseFloat((currentEf - 0.15).toFixed(2)));
        optimisticReps = Math.max(1, currentReps);
        optimisticDays = 3;
        attemptResult = 'NEEDED_HINTS';
        lastAttemptType = 'needed_hints';
        lastHistory = 'Last: Needed Hints';
      } else {
        optimisticEf = Math.max(1.3, parseFloat((currentEf - 0.3).toFixed(2)));
        optimisticReps = 0;
        optimisticDays = 1;
        attemptResult = 'CODE_VIEWED';
        lastAttemptType = 'code_viewed';
        lastHistory = 'Last: Code Viewed';
      }

      const offsetDate = new Date();
      offsetDate.setDate(offsetDate.getDate() + optimisticDays);
      const nextReviewDate = offsetDate.toISOString().split('T')[0];
      const isMastered = optimisticDays >= 21 || optimisticEf >= 2.5;

      const optimisticCard: Problem = {
        ...targetCard,
        lastHistory,
        lastAttemptType,
        sm2Interval: `${optimisticDays} ${optimisticDays === 1 ? 'day' : 'days'}`,
        sm2Ef: optimisticEf.toFixed(1),
        isDueToday: false,
        isOverdue: false,
        isMastered,
        dueStatus: `Next in ${optimisticDays}d`,
        sm2: {
          intervalDays: optimisticDays,
          easinessFactor: optimisticEf,
          nextReviewDate,
          repetitionCount: optimisticReps,
          lastAttemptResult: attemptResult
        }
      };

      const optimisticallyUpdated = problems.map((p) =>
        String(p.id) === String(problemId) ? optimisticCard : p
      );

      // Instantly commit state to React
      setProblems(optimisticallyUpdated);
      setTelemetry(calculateTelemetryOverview(optimisticallyUpdated));

      // 3. Persist asynchronously in background via problemService
      try {
        const persistedCard = await problemService.submitReview(problemId, rating);
        // Refresh telemetry silently in background
        const updatedTelemetry = await problemService.getTelemetry();
        setTelemetry(updatedTelemetry);
        return persistedCard;
      } catch (err) {
        // Rollback on failure
        console.error('[ProblemProvider] Review submission failed, rolling back:', err);
        setProblems(previousProblems);
        setTelemetry(calculateTelemetryOverview(previousProblems));
        const msg = err instanceof Error ? err.message : 'Failed to save review.';
        setError(msg);
        throw err;
      }
    },
    [problems]
  );

  /**
   * Create new problem card with optimistic update
   */
  const createProblem = useCallback(
    async (newProblem: Omit<Problem, 'id'> & { id?: string | number }): Promise<Problem> => {
      const tempId = newProblem.id || `temp-${Date.now()}`;
      const optimisticCard: Problem = {
        ...newProblem,
        id: tempId,
        problemNumber: newProblem.problemNumber || '#000',
        number: newProblem.number || newProblem.problemNumber || '#000',
        patterns: newProblem.patterns?.length ? newProblem.patterns : [newProblem.pattern || 'General'],
        pattern: newProblem.pattern || newProblem.patterns?.[0] || 'General',
        patternId: (newProblem.pattern || 'general').toLowerCase().replace(/\s+/g, '-'),
        sm2: newProblem.sm2 || {
          intervalDays: 1,
          easinessFactor: 2.5,
          nextReviewDate: new Date().toISOString().split('T')[0],
          repetitionCount: 0,
          lastAttemptResult: 'NEW'
        },
        isDueToday: true,
        isOverdue: false,
        isMastered: false,
        dueStatus: 'Due Today',
        lastHistory: 'Last: New Card',
        sm2Interval: '1 day',
        sm2Ef: '2.5'
      };

      // Optimistically prepend
      setProblems((prev) => [optimisticCard, ...prev]);
      setActiveCardIndex(0);

      try {
        const persisted = await problemService.addProblem(newProblem);
        setProblems((prev) =>
          prev.map((p) => (p.id === tempId ? persisted : p))
        );
        const updatedTelemetry = await problemService.getTelemetry();
        setTelemetry(updatedTelemetry);
        return persisted;
      } catch (err) {
        // Rollback
        setProblems((prev) => prev.filter((p) => p.id !== tempId));
        const msg = err instanceof Error ? err.message : 'Failed to create problem.';
        setError(msg);
        throw err;
      }
    },
    []
  );

  /**
   * Export deck JSON and trigger file download
   */
  const exportDeck = useCallback(async (): Promise<string> => {
    const json = await problemService.exportData();

    // Trigger browser file download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `coderecall-deck-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return json;
  }, []);

  /**
   * Import deck JSON with schema validation and queue reload
   */
  const importDeck = useCallback(
    async (jsonData: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        const success = await problemService.importData(jsonData);
        if (success) {
          await refreshQueue();
        }
        return success;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshQueue]
  );

  /**
   * Reset to default seed deck
   */
  const resetToDefaultDeck = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await problemService.resetToDefault();
      await refreshQueue();
    } finally {
      setIsLoading(false);
    }
  }, [refreshQueue]);

  // Backward compatibility helpers
  const handleSolveWithoutHelp = useCallback(
    (id: string | number) => {
      reviewProblem(id, 'SOLVED_WITHOUT_HELP');
    },
    [reviewProblem]
  );

  const handleNeedHints = useCallback(
    (id: string | number) => {
      reviewProblem(id, 'NEEDED_HINTS');
    },
    [reviewProblem]
  );

  const handleViewSolution = useCallback(
    (id: string | number) => {
      reviewProblem(id, 'CODE_VIEWED');
    },
    [reviewProblem]
  );

  const addProblemCard = useCallback(
    (card: ProblemCardData) => {
      createProblem(card);
    },
    [createProblem]
  );

  const value = useMemo<ProblemContextValue>(
    () => ({
      problems,
      activeQueue,
      telemetry,
      isLoading,
      error,
      filterState,
      searchQuery,
      setSearchQuery,
      selectedPattern,
      setSelectedPattern,
      quickFilter,
      setQuickFilter,
      sortBy,
      setSortBy,
      clearFilters,
      hasActiveFilters,
      activeCardIndex,
      setActiveCardIndex,
      patternCounts,
      quickFilterCounts,
      reviewProblem,
      createProblem,
      exportDeck,
      importDeck,
      resetToDefaultDeck,
      refreshQueue,
      handleSolveWithoutHelp,
      handleNeedHints,
      handleViewSolution,
      addProblemCard
    }),
    [
      problems,
      activeQueue,
      telemetry,
      isLoading,
      error,
      filterState,
      searchQuery,
      selectedPattern,
      quickFilter,
      sortBy,
      clearFilters,
      hasActiveFilters,
      activeCardIndex,
      patternCounts,
      quickFilterCounts,
      reviewProblem,
      createProblem,
      exportDeck,
      importDeck,
      resetToDefaultDeck,
      refreshQueue,
      handleSolveWithoutHelp,
      handleNeedHints,
      handleViewSolution,
      addProblemCard
    ]
  );

  return <ProblemContext.Provider value={value}>{children}</ProblemContext.Provider>;
};
