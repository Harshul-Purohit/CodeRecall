import { useState, useMemo, useEffect } from 'react';
import { ProblemCardData } from '../types/problem';
import {
  QuickFilterType,
  SortOptionType,
  PatternCount,
  QuickFilterCount
} from '../types/filter';
import { INITIAL_CARDS } from '../data/mockProblems';

export function useProblemQueue(initialDataset: ProblemCardData[] = INITIAL_CARDS) {
  const [cards, setCards] = useState<ProblemCardData[]>(initialDataset);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPattern, setSelectedPattern] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortOptionType>('SM2_QUEUE');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // Today's date reference for SM2 calculations
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // 1. Derive unique pattern list with counts dynamically from dataset
  const patternCounts = useMemo<PatternCount[]>(() => {
    const countsMap = new Map<string, number>();

    cards.forEach((card) => {
      const cardPatterns = card.patterns || (card.pattern ? [card.pattern] : []);
      cardPatterns.forEach((p) => {
        countsMap.set(p, (countsMap.get(p) || 0) + 1);
      });
    });

    const list: PatternCount[] = [
      { name: 'ALL', count: cards.length }
    ];

    countsMap.forEach((count, name) => {
      list.push({ name, count });
    });

    return list;
  }, [cards]);

  // 2. Derive Quick Filter badge counts from dataset
  const quickFilterCounts = useMemo<QuickFilterCount[]>(() => {
    let dueToday = 0;
    let overdue = 0;
    let mastered = 0;
    let failedLast = 0;

    cards.forEach((card) => {
      const nextDate = card.sm2?.nextReviewDate || '';
      const isDue = card.isDueToday || (nextDate !== '' && nextDate <= todayStr) || card.dueStatus === 'Due Today';
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
      { id: 'ALL', label: 'All Queue', count: cards.length },
      { id: 'DUE_TODAY', label: 'Due Today', count: dueToday },
      { id: 'OVERDUE', label: 'Overdue', count: overdue },
      { id: 'MASTERED', label: 'Mastered', count: mastered },
      { id: 'FAILED_LAST', label: 'Failed Last', count: failedLast }
    ];
  }, [cards, todayStr]);

  // 3. Pure Memoized Derived Filtering & Sorting Pipeline
  const filteredCards = useMemo(() => {
    return cards
      .filter((card) => {
        // Step A: Search Query Matching
        if (searchQuery.trim() !== '') {
          const q = searchQuery.trim().toLowerCase();
          const cleanQ = q.replace(/^#/, '');

          const titleMatch = card.title.toLowerCase().includes(q);
          const probNum = (card.problemNumber || card.number || '').toLowerCase();
          const cleanProbNum = probNum.replace(/^#/, '');
          const numberMatch = probNum.includes(q) || (cleanQ !== '' && cleanProbNum.includes(cleanQ));

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
          const isDue = card.isDueToday || (nextDate !== '' && nextDate <= todayStr) || card.dueStatus === 'Due Today';
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
  }, [cards, searchQuery, selectedPattern, quickFilter, sortBy, todayStr]);

  // Keep active card index in bounds
  useEffect(() => {
    if (activeCardIndex >= filteredCards.length) {
      setActiveCardIndex(Math.max(0, filteredCards.length - 1));
    }
  }, [filteredCards.length, activeCardIndex]);

  // Reset all search and filter state
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPattern('ALL');
    setQuickFilter('ALL');
  };

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' || selectedPattern !== 'ALL' || quickFilter !== 'ALL';
  }, [searchQuery, selectedPattern, quickFilter]);

  // Handlers for Phase 2 card actions
  const handleSolveWithoutHelp = (cardId: string | number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const currentDays = c.sm2?.intervalDays || parseInt(c.sm2Interval || '3') || 3;
          const newDays = Math.min(30, currentDays * 2);
          const currentEf = c.sm2?.easinessFactor || parseFloat(c.sm2Ef || '2.5') || 2.5;
          const newEf = Math.min(3.0, parseFloat((currentEf + 0.1).toFixed(1)));

          return {
            ...c,
            lastHistory: 'Last: Solved Without Help',
            lastAttemptType: 'solved_without_help',
            sm2Interval: `${newDays} days`,
            sm2Ef: newEf.toFixed(1),
            sm2: {
              ...c.sm2,
              intervalDays: newDays,
              easinessFactor: newEf,
              lastAttemptResult: 'SOLVED_WITHOUT_HELP',
              repetitionCount: (c.sm2?.repetitionCount || 1) + 1
            },
            isMastered: newDays >= 21 || newEf >= 2.5
          };
        }
        return c;
      })
    );
  };

  const handleNeedHints = (cardId: string | number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            lastHistory: 'Last: Needed Hints',
            lastAttemptType: 'needed_hints',
            sm2Interval: '3 days',
            sm2: {
              ...c.sm2,
              intervalDays: 3,
              lastAttemptResult: 'NEEDED_HINTS'
            }
          };
        }
        return c;
      })
    );
  };

  const handleViewSolution = (cardId: string | number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            lastHistory: 'Last: Code Viewed',
            lastAttemptType: 'code_viewed',
            sm2Interval: '1 day',
            sm2: {
              ...c.sm2,
              intervalDays: 1,
              lastAttemptResult: 'CODE_VIEWED'
            }
          };
        }
        return c;
      })
    );
  };

  return {
    cards,
    filteredCards,
    searchQuery,
    setSearchQuery,
    selectedPattern,
    setSelectedPattern,
    quickFilter,
    setQuickFilter,
    sortBy,
    setSortBy,
    activeCardIndex,
    setActiveCardIndex,
    patternCounts,
    quickFilterCounts,
    clearFilters,
    hasActiveFilters,
    handleSolveWithoutHelp,
    handleNeedHints,
    handleViewSolution
  };
}
