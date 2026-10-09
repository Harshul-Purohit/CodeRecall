import { useProblemContext } from '../context/ProblemContext';

/**
 * Hook adapter providing backwards compatibility for useProblemQueue
 * by delegating to the unified global ProblemContext.
 */
export function useProblemQueue() {
  const context = useProblemContext();

  return {
    cards: context.problems,
    filteredCards: context.activeQueue,
    searchQuery: context.searchQuery,
    setSearchQuery: context.setSearchQuery,
    selectedPattern: context.selectedPattern,
    setSelectedPattern: context.setSelectedPattern,
    quickFilter: context.quickFilter,
    setQuickFilter: context.setQuickFilter,
    sortBy: context.sortBy,
    setSortBy: context.setSortBy,
    activeCardIndex: context.activeCardIndex,
    setActiveCardIndex: context.setActiveCardIndex,
    patternCounts: context.patternCounts,
    quickFilterCounts: context.quickFilterCounts,
    clearFilters: context.clearFilters,
    hasActiveFilters: context.hasActiveFilters,
    addProblemCard: context.addProblemCard,
    handleSolveWithoutHelp: context.handleSolveWithoutHelp,
    handleNeedHints: context.handleNeedHints,
    handleViewSolution: context.handleViewSolution
  };
}
