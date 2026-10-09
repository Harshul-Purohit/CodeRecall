import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroTelemetry } from './components/HeroTelemetry';
import { SearchAndFilters } from './components/SearchAndFilters';
import { PatternFilter } from './components/PatternFilter';
import { ProblemCard } from './components/ProblemCard';
import { EmptyQueueState } from './components/EmptyQueueState';
import { StatusBar } from './components/StatusBar';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { AddProblemModal } from './components/ingestion/AddProblemModal';
import { ToastProvider, useToast } from './context/ToastContext';
import { ProblemProvider, useProblemContext } from './context/ProblemContext';
import { ProblemCardData } from './types/problem';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    problems,
    activeQueue,
    telemetry,
    isLoading,
    error,
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
    createProblem,
    reviewProblem,
    refreshQueue
  } = useProblemContext();

  const { showToast } = useToast();

  // Active View State: 'queue' vs 'analytics'
  const [activeView, setActiveView] = useState<'queue' | 'analytics'>('queue');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Timestamp trigger passed down to active card for keyboard shortcuts
  const [keyboardTrigger, setKeyboardTrigger] = useState<{
    key: '1' | '2' | '3';
    timestamp: number;
  } | null>(null);

  // Global keyboard shortcuts including chorded G then A / G then Q navigation & N shortcut for Add Problem Modal
  useEffect(() => {
    let isGActive = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing inside form inputs
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if (isInput) return;

      const key = e.key.toLowerCase();

      // Keyboard Shortcut 'N' -> Open Add Problem Card Modal
      if (key === 'n') {
        e.preventDefault();
        setIsAddModalOpen(true);
        return;
      }

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
          showToast('📊 Switched to Analytics Telemetry Dashboard', 'info');
          return;
        } else if (key === 'q') {
          e.preventDefault();
          setActiveView('queue');
          isGActive = false;
          if (gTimer) clearTimeout(gTimer);
          showToast('📋 Switched to Revision Queue', 'info');
          return;
        }
      }

      // Queue-specific shortcuts (1, 2, 3, J, K, ArrowUp, ArrowDown)
      if (activeView === 'queue') {
        if (key === 'j' || key === 'arrowdown') {
          e.preventDefault();
          setActiveCardIndex((prev) => Math.min(prev + 1, Math.max(0, activeQueue.length - 1)));
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
  }, [activeQueue.length, setActiveCardIndex, activeView, showToast]);

  // Handler: Solved Without Help (SM-2 expansion)
  const handleSolveWithoutHelp = async (cardId: string | number) => {
    try {
      const card = problems.find((c) => String(c.id) === String(cardId));
      const curDays = card?.sm2?.intervalDays || 1;
      const targetDays = Math.min(60, curDays * 2);
      await reviewProblem(cardId, 'SOLVED_WITHOUT_HELP');
      showToast(
        `Review saved: Next interval in ${targetDays} days (${card?.problemNumber || 'Card'})`,
        'success'
      );
    } catch {
      showToast('Failed to save review attempt.', 'error');
    }
  };

  // Handler: Needed Hints (SM-2 reset to 3 days)
  const handleNeedHints = async (cardId: string | number) => {
    try {
      const card = problems.find((c) => String(c.id) === String(cardId));
      await reviewProblem(cardId, 'NEEDED_HINTS');
      showToast(
        `Review saved: Next interval in 3 days (${card?.problemNumber || 'Card'})`,
        'warning'
      );
    } catch {
      showToast('Failed to save review attempt.', 'error');
    }
  };

  // Handler: View Solution & Breakdown (SM-2 reset to 1 day)
  const handleViewSolution = async (cardId: string | number) => {
    try {
      const card = problems.find((c) => String(c.id) === String(cardId));
      await reviewProblem(cardId, 'CODE_VIEWED');
      showToast(
        `Review saved: Next interval in 1 day (${card?.problemNumber || 'Card'})`,
        'info'
      );
    } catch {
      showToast('Failed to save review attempt.', 'error');
    }
  };

  // Handler: Add New Problem Card
  const handleAddProblem = async (newCard: ProblemCardData) => {
    try {
      await createProblem(newCard);
      showToast(`✨ Created recall card ${newCard.problemNumber}: ${newCard.title}!`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error creating card';
      showToast(`Failed to add problem: ${msg}`, 'error');
    }
  };

  const existingPatternList = patternCounts.map((p) => p.name).filter((n) => n !== 'ALL');

  return (
    <div className="min-h-screen bg-[#211832] text-white flex flex-col justify-between font-sans selection:bg-[#F25912] selection:text-white">
      {/* Top Navbar with View Switcher & Data Sync Dropdown */}
      <Navbar
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          showToast(
            v === 'analytics'
              ? '📊 Switched to Analytics Telemetry Dashboard'
              : '📋 Switched to Revision Queue',
            'info'
          );
        }}
        dueTodayCount={telemetry.dueTodayCount}
        currentStreak={telemetry.currentStreak}
        onSyncComplete={() => showToast('LeetCode submissions synchronized successfully!', 'success')}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col">
        {/* Error notification banner if service error occurs */}
        {error && (
          <div className="mb-4 bg-[#4F3B78] border border-red-500/80 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-mono shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => refreshQueue()}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#363B4E] hover:bg-[#927FBF] hover:text-[#363B4E] text-white rounded transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && problems.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-4 text-center font-mono">
            <Loader2 className="w-8 h-8 text-[#C4BBF0] animate-spin" />
            <p className="text-sm text-[#C4BBF0]">Loading persistent study queue from IndexedDB...</p>
            <div className="w-full max-w-md space-y-3 mt-4">
              <div className="h-20 bg-[#4F3B78]/40 border border-[#927FBF]/30 rounded-xl animate-pulse" />
              <div className="h-20 bg-[#4F3B78]/40 border border-[#927FBF]/30 rounded-xl animate-pulse" />
              <div className="h-20 bg-[#4F3B78]/40 border border-[#927FBF]/30 rounded-xl animate-pulse" />
            </div>
          </div>
        ) : activeView === 'analytics' ? (
          /* Analytics Dashboard View */
          <AnalyticsDashboard cards={problems} />
        ) : (
          /* Revision Queue View */
          <>
            {/* Hero Telemetry */}
            <HeroTelemetry
              totalCards={problems.length}
              filteredCount={activeQueue.length}
              dueTodayCount={telemetry.dueTodayCount}
              retentionRate={telemetry.overallRetentionRate}
              onOpenAddModal={() => setIsAddModalOpen(true)}
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
            {activeQueue.length > 0 ? (
              <div className="space-y-4 mb-8">
                {activeQueue.map((card, index) => (
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
                onSyncLeetCode={() => showToast('LeetCode submissions synchronized successfully!', 'success')}
              />
            )}
          </>
        )}
      </main>

      {/* Problem Ingestion & Custom Card Creator Modal */}
      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProblem={handleAddProblem}
        existingPatterns={existingPatternList}
      />

      {/* Bottom Status & Keycap Bar */}
      <StatusBar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <ProblemProvider>
        <AppContent />
      </ProblemProvider>
    </ToastProvider>
  );
};
