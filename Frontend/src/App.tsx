import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroTelemetry } from './components/HeroTelemetry';
import { SearchAndFilters } from './components/SearchAndFilters';
import { PatternFilter } from './components/PatternFilter';
import { ProblemCard } from './components/ProblemCard';
import { EmptyQueueState } from './components/EmptyQueueState';
import { StatusBar } from './components/StatusBar';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { useProblemQueue } from './hooks/useProblemQueue';

export const App: React.FC = () => {
  const {
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
    handleSolveWithoutHelp: solveAction,
    handleNeedHints: hintsAction,
    handleViewSolution: solutionAction
  } = useProblemQueue();

  // Active View State: 'queue' vs 'analytics'
  const [activeView, setActiveView] = useState<'queue' | 'analytics'>('queue');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timestamp trigger passed down to active card for keyboard shortcuts
  const [keyboardTrigger, setKeyboardTrigger] = useState<{
    key: '1' | '2' | '3';
    timestamp: number;
  } | null>(null);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Global keyboard shortcuts including chorded G then A / G then Q navigation
  useEffect(() => {
    let isGActive = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing inside form inputs
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isInput) return;

      const key = e.key.toLowerCase();

      // Check for chord start key: 'g'
      if (key === 'g') {
        isGActive = true;
        if (gTimer) clearTimeout(gTimer);
        gTimer = setTimeout(() => {
          isGActive = false;
        }, 1500);
        return;
      }

      // Check chord sequence: G then A (Analytics) or G then Q (Queue)
      if (isGActive) {
        if (key === 'a') {
          e.preventDefault();
          setActiveView('analytics');
          isGActive = false;
          if (gTimer) clearTimeout(gTimer);
          showToast('📊 Switched to Analytics Telemetry Dashboard');
          return;
        } else if (key === 'q') {
          e.preventDefault();
          setActiveView('queue');
          isGActive = false;
          if (gTimer) clearTimeout(gTimer);
          showToast('📋 Switched to Revision Queue');
          return;
        }
      }

      // Queue-specific shortcuts (1, 2, 3, J, K, ArrowUp, ArrowDown)
      if (activeView === 'queue') {
        if (key === 'j' || key === 'arrowdown') {
          e.preventDefault();
          setActiveCardIndex((prev) => Math.min(prev + 1, Math.max(0, filteredCards.length - 1)));
        } else if (key === 'k' || key === 'arrowup') {
          e.preventDefault();
          setActiveCardIndex((prev) => Math.max(prev - 1, 0));
        } else if (key === '1') {
          e.preventDefault();
          setKeyboardTrigger({ key: '1', timestamp: Date.now() });
        } else if (key === '2') {
          e.preventDefault();
          setKeyboardTrigger({ key: '2', timestamp: Date.now() });
        } else if (key === '3') {
          e.preventDefault();
          setKeyboardTrigger({ key: '3', timestamp: Date.now() });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [filteredCards.length, setActiveCardIndex, activeView]);

  // Handler: Solved Without Help
  const handleSolveWithoutHelp = (cardId: string | number) => {
    solveAction(cardId);
    const card = cards.find((c) => c.id === cardId);
    showToast(`✓ Marked ${card?.problemNumber || card?.number || 'Card'} as Solved Without Help! Next review rescheduled.`);
  };

  // Handler: Needed Hints
  const handleNeedHints = (cardId: string | number) => {
    hintsAction(cardId);
    const card = cards.find((c) => c.id === cardId);
    showToast(`💡 Opened Hints Drawer for ${card?.problemNumber || card?.number || 'Card'}. Attempt status set to Needed Hints.`);
  };

  // Handler: View Solution & Breakdown
  const handleViewSolution = (cardId: string | number) => {
    solutionAction(cardId);
    const card = cards.find((c) => c.id === cardId);
    showToast(`</> Solution Breakdown opened for ${card?.problemNumber || card?.number || 'Card'}. Attempt status set to Code Viewed.`);
  };

  const dueTodayCount = quickFilterCounts.find((q) => q.id === 'DUE_TODAY')?.count || 0;

  return (
    <div className="min-h-screen bg-[#211832] text-white flex flex-col justify-between font-sans selection:bg-[#F25912] selection:text-white">
      {/* Top Navbar with View Switcher */}
      <Navbar
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          showToast(v === 'analytics' ? '📊 Switched to Analytics Telemetry Dashboard' : '📋 Switched to Revision Queue');
        }}
        dueTodayCount={dueTodayCount}
        currentStreak={14}
        onSyncComplete={() => showToast('LeetCode submissions synchronized successfully!')}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-8 z-50 bg-[#412B6B] border border-[#F25912] text-white px-4 py-2.5 rounded-lg shadow-2xl text-xs flex items-center gap-2.5 animate-bounce font-mono">
            <span className="w-2 h-2 rounded-full bg-[#F25912]"></span>
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* View Switch Condition: Analytics Dashboard vs Revision Queue */}
        {activeView === 'analytics' ? (
          <AnalyticsDashboard cards={cards} />
        ) : (
          <>
            {/* Hero Telemetry */}
            <HeroTelemetry
              totalCards={cards.length}
              filteredCount={filteredCards.length}
              dueTodayCount={dueTodayCount}
              retentionRate={94.8}
            />

            {/* Search Bar, Quick Filters & Sort Controls */}
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              quickFilter={quickFilter}
              onQuickFilterChange={setQuickFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              quickFilterCounts={quickFilterCounts}
            />

            {/* Pattern Filter Pills with Dynamic Counts */}
            <PatternFilter
              patterns={patternCounts}
              activePattern={selectedPattern}
              onPatternChange={setSelectedPattern}
            />

            {/* Stacked Problem Cards or Empty State View */}
            {filteredCards.length > 0 ? (
              <div className="space-y-4 mb-8">
                {filteredCards.map((card, index) => (
                  <ProblemCard
                    key={card.id}
                    card={card}
                    isActiveCard={index === activeCardIndex}
                    onSelectCard={() => setActiveCardIndex(index)}
                    onSolveWithoutHelp={handleSolveWithoutHelp}
                    onNeedHints={handleNeedHints}
                    onViewSolution={handleViewSolution}
                    keyboardTrigger={index === activeCardIndex ? keyboardTrigger : null}
                  />
                ))}
              </div>
            ) : (
              <EmptyQueueState
                hasActiveFilters={hasActiveFilters}
                quickFilter={quickFilter}
                onClearFilters={clearFilters}
                onSyncLeetCode={() => showToast('LeetCode submissions synchronized successfully!')}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Status & Keycap Bar */}
      <StatusBar />
    </div>
  );
};

