import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Code,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  Layers,
  Cpu,
  X
} from 'lucide-react';

export type AttemptType = 'solved_without_help' | 'needed_hints' | 'code_viewed' | null;

export interface StructuredHint {
  step: number;
  category: 'Pattern Hook' | 'Invariant State' | 'Edge Case Warning';
  title: string;
  content: string;
}

export interface LineAnnotation {
  line: number;
  title: string;
  explanation: string;
  type: 'state' | 'condition' | 'return' | 'init';
}

export interface DryRunSample {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface CodeSolution {
  language: string;
  timeComplexity: string;
  spaceComplexity: string;
  dryRun: DryRunSample;
  codeLines: string[];
  lineAnnotations: LineAnnotation[];
  explanation: string;
}

export interface ProblemCardData {
  id: string;
  number: string;
  title: string;
  pattern: string;
  patternId: string;
  leetcodeUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dueStatus: string;
  lastHistory: string;
  lastAttemptType?: AttemptType;
  sm2Interval: string;
  sm2Ef: string;
  hints: StructuredHint[];
  codeSolution: CodeSolution;
}

interface ProblemCardProps {
  card: ProblemCardData;
  isActiveCard: boolean;
  onSelectCard: () => void;
  onSolveWithoutHelp: (cardId: string) => void;
  onNeedHints: (cardId: string) => void;
  onViewSolution: (cardId: string) => void;
  keyboardTrigger?: { key: '1' | '2' | '3'; timestamp: number } | null;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  card,
  isActiveCard,
  onSelectCard,
  onSolveWithoutHelp,
  onNeedHints,
  onViewSolution,
  keyboardTrigger
}) => {
  // Active drawer mode: 'hints' (Col 2), 'code' (Col 3), 'split' (Col 2 & 3 View), or null
  const [activeDrawer, setActiveDrawer] = useState<'hints' | 'code' | 'split' | null>(null);
  
  // Progressively revealed hints count (default shows all 3 structured cards)
  const [revealedHints, setRevealedHints] = useState<number>(3);
  
  // Visual temporary checkmark indicator state
  const [showCheckmarkToast, setShowCheckmarkToast] = useState<boolean>(false);
  
  // Hovered line for highlighting line annotations
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);

  // Handle keyboard triggers from parent when active card receives shortcut '1', '2', or '3'
  useEffect(() => {
    if (!isActiveCard || !keyboardTrigger) return;

    if (keyboardTrigger.key === '1') {
      handleSolveWithoutHelp();
    } else if (keyboardTrigger.key === '2') {
      handleToggleHints();
    } else if (keyboardTrigger.key === '3') {
      handleToggleSolution();
    }
  }, [keyboardTrigger]);

  // Handler: Solved Without Help
  const handleSolveWithoutHelp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveDrawer(null);
    setShowCheckmarkToast(true);
    setTimeout(() => setShowCheckmarkToast(false), 2500);
    onSolveWithoutHelp(card.id);
  };

  // Handler: Need Hints
  const handleToggleHints = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeDrawer === 'hints') {
      setActiveDrawer(null);
    } else {
      setActiveDrawer('hints');
      setRevealedHints(3);
    }
    onNeedHints(card.id);
  };

  // Handler: View Solution & Breakdown
  const handleToggleSolution = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeDrawer === 'code') {
      setActiveDrawer(null);
    } else {
      setActiveDrawer('code');
    }
    onViewSolution(card.id);
  };

  // Difficulty pill styling
  const getDifficultyPill = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-950/70 text-[#22C55E] border border-emerald-700/60';
      case 'Medium':
        return 'bg-amber-950/70 text-[#EAB308] border border-amber-600/60';
      case 'Hard':
        return 'bg-red-950/70 text-[#EF4444] border border-red-700/60';
    }
  };

  // Attempt History Pill styling based on last attempt state
  const renderAttemptTag = () => {
    const text = card.lastHistory;
    
    if (text.includes('Solved Without Help') || card.lastAttemptType === 'solved_without_help') {
      return (
        <span className="bg-emerald-950/90 text-[#22C55E] border border-[#22C55E]/50 text-[11px] px-2.5 py-0.5 rounded font-mono font-semibold flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.15)]">
          <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
          <span>Last: Solved Without Help</span>
        </span>
      );
    } else if (text.includes('Needed Hints') || text.includes('Solved with Hints') || card.lastAttemptType === 'needed_hints') {
      return (
        <span className="bg-amber-950/90 text-[#EAB308] border border-[#EAB308]/50 text-[11px] px-2.5 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-[#EAB308]" />
          <span>Last: Needed Hints</span>
        </span>
      );
    } else if (text.includes('Code Viewed') || card.lastAttemptType === 'code_viewed') {
      return (
        <span className="bg-red-950/80 text-red-300 border border-red-700/50 text-[11px] px-2.5 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
          <Code className="w-3 h-3 text-red-400" />
          <span>Last: Code Viewed</span>
        </span>
      );
    }
    
    return (
      <span className="bg-[#211832] text-[#B4A7D6] border border-[#5C3E94] text-[11px] px-2.5 py-0.5 rounded font-mono font-medium">
        {text}
      </span>
    );
  };

  // Annotation Badge Type
  const getAnnotationBadge = (type: LineAnnotation['type']) => {
    switch (type) {
      case 'state':
        return <span className="bg-purple-900/60 text-purple-300 border border-purple-500/40 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold">State Transition</span>;
      case 'condition':
        return <span className="bg-amber-900/60 text-amber-300 border border-amber-500/40 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold">Condition Check</span>;
      case 'return':
        return <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold">Return Result</span>;
      case 'init':
        return <span className="bg-blue-900/60 text-blue-300 border border-blue-500/40 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold">State Init</span>;
    }
  };

  return (
    <div
      onClick={onSelectCard}
      className={`bg-[#412B6B] rounded-lg border transition-all duration-200 cursor-pointer shadow-lg relative ${
        isActiveCard
          ? 'border-[#F25912] ring-2 ring-[#F25912]/40 shadow-[0_4px_20px_rgba(242,89,18,0.15)]'
          : 'border-[#5C3E94] hover:border-[#B4A7D6]/50'
      }`}
    >
      {/* Temporary Success Recalibration Indicator Overlay */}
      {showCheckmarkToast && (
        <div className="absolute -top-3 right-6 z-30 bg-[#22C55E] text-[#1A1228] px-3 py-1 rounded-full text-xs font-mono font-bold shadow-xl flex items-center gap-1.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#1A1228]" />
          <span>Recall Verified! SM-2 Recalibrated (+Interval)</span>
        </div>
      )}

      {/* Card Header Row */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Problem Metadata */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-sm text-[#F25912] font-bold bg-[#211832] px-2 py-0.5 rounded border border-[#5C3E94]">
              {card.number}
            </span>
            <a
              href={card.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white font-bold text-base hover:text-[#F25912] transition-colors flex items-center gap-1.5"
            >
              <span>{card.title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#B4A7D6] hover:text-white" />
            </a>
            <span className="text-xs font-mono text-[#B4A7D6] bg-[#2C1F45] px-2 py-0.5 rounded border border-[#5C3E94]/60">
              {card.pattern}
            </span>
          </div>

          {/* Right Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${getDifficultyPill(card.difficulty)}`}>
              {card.difficulty}
            </span>

            <span className="bg-[#211832] text-[#F25912] border border-[#F25912]/40 text-xs px-2.5 py-0.5 rounded-md font-semibold font-mono">
              {card.dueStatus}
            </span>

            {/* Persistent Attempt Status Tag */}
            {renderAttemptTag()}
          </div>
        </div>

        {/* Action Row & SM-2 Telemetry */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-[#5C3E94]/40">
          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Button 1: Solved Without Help */}
            <button
              onClick={handleSolveWithoutHelp}
              className={`px-3 py-1.5 text-xs rounded font-medium transition-all duration-150 flex items-center gap-1.5 focus:outline-none ${
                card.lastAttemptType === 'solved_without_help' || card.lastHistory.includes('Solved Without Help')
                  ? 'bg-[#22C55E] text-slate-950 font-bold hover:bg-[#22C55E]/90 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                  : 'bg-[#F25912] text-white hover:bg-[#F25912]/90 shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved Without Help</span>
            </button>

            {/* Button 2: Need Hints (3) */}
            <button
              onClick={handleToggleHints}
              className={`px-3 py-1.5 text-xs rounded border transition-all duration-150 flex items-center gap-1.5 focus:outline-none ${
                activeDrawer === 'hints' || activeDrawer === 'split'
                  ? 'bg-amber-950/80 border-[#EAB308] text-[#EAB308] font-semibold'
                  : 'border-[#5C3E94] text-amber-400 bg-[#211832]/60 hover:bg-[#211832] hover:border-amber-500/60'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#EAB308]" />
              <span>Need Hints ({card.hints.length})</span>
              {activeDrawer === 'hints' ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {/* Button 3: View Solution & Breakdown */}
            <button
              onClick={handleToggleSolution}
              className={`px-3 py-1.5 text-xs rounded border transition-all duration-150 flex items-center gap-1.5 focus:outline-none ${
                activeDrawer === 'code' || activeDrawer === 'split'
                  ? 'bg-[#211832] border-[#F25912] text-[#F25912] font-semibold'
                  : 'border-[#5C3E94] text-[#B4A7D6] bg-[#211832]/40 hover:border-[#B4A7D6] hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-[#F25912]" />
              <span>View Solution &amp; Breakdown</span>
              {activeDrawer === 'code' ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* SM-2 Telemetry & Keyboard Hint */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#B4A7D6]">
            <div>
              SM-2 Interval: <span className="text-white font-semibold">{card.sm2Interval}</span> &nbsp;•&nbsp; EF: <span className="text-white font-semibold">{card.sm2Ef}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE RECALL EXPANDABLE DRAWER (3-Column Architecture) */}
      {activeDrawer && (
        <div className="bg-[#1A1228] border-t border-[#5C3E94] p-4 sm:p-5 space-y-4 rounded-b-lg">
          {/* Drawer Header & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3B265E] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F25912]" />
              <span className="font-semibold text-xs text-white uppercase tracking-wider font-mono">
                Active Recall Drawer
              </span>
              <span className="text-xs text-[#B4A7D6] font-mono">
                / {activeDrawer === 'hints' ? 'Column 2: Stepwise Hints' : activeDrawer === 'code' ? 'Column 3: Solution Breakdown' : 'Split 3-Column View'}
              </span>
            </div>

            {/* View Controls & Close */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center bg-[#211832] p-0.5 rounded border border-[#5C3E94]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDrawer('hints');
                  }}
                  className={`px-2.5 py-1 text-[11px] rounded font-mono font-medium transition-colors ${
                    activeDrawer === 'hints'
                      ? 'bg-[#F25912] text-white font-bold'
                      : 'text-[#B4A7D6] hover:text-white'
                  }`}
                >
                  Col 2: Hints
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDrawer('code');
                  }}
                  className={`px-2.5 py-1 text-[11px] rounded font-mono font-medium transition-colors ${
                    activeDrawer === 'code'
                      ? 'bg-[#F25912] text-white font-bold'
                      : 'text-[#B4A7D6] hover:text-white'
                  }`}
                >
                  Col 3: Breakdown
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDrawer('split');
                  }}
                  className={`px-2.5 py-1 text-[11px] rounded font-mono font-medium transition-colors hidden md:block ${
                    activeDrawer === 'split'
                      ? 'bg-[#F25912] text-white font-bold'
                      : 'text-[#B4A7D6] hover:text-white'
                  }`}
                >
                  Split View
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDrawer(null);
                }}
                className="p-1 text-[#B4A7D6] hover:text-white rounded hover:bg-[#2C1F45]"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DRAWER CONTENT LAYOUT */}
          <div className={activeDrawer === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-5' : 'space-y-4'}>
            
            {/* COLUMN 2: STEPWISE HINTS BOX */}
            {(activeDrawer === 'hints' || activeDrawer === 'split') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#EAB308] font-bold flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#EAB308]" />
                    <span>Stepwise Active Recall Hints (3 Steps)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-[#B4A7D6]">
                    Revealed {revealedHints} of 3
                  </span>
                </div>

                {/* Structured Hints List */}
                <div className="space-y-2.5">
                  {card.hints.slice(0, revealedHints).map((hint, idx) => (
                    <div
                      key={idx}
                      className="bg-[#211832] border border-[#3B265E] hover:border-[#5C3E94] p-3.5 rounded-md space-y-1.5 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#F25912] bg-[#F25912]/10 border border-[#F25912]/30 px-1.5 py-0.5 rounded">
                            Step {hint.step}
                          </span>
                          <span className="font-mono text-xs font-semibold text-white">
                            {hint.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-[#2C1F45] text-purple-300 border border-[#5C3E94]">
                          {hint.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                        {hint.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Progressive Reveal Action */}
                {revealedHints < 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRevealedHints((prev) => Math.min(3, prev + 1));
                    }}
                    className="w-full py-2 bg-[#2C1F45] hover:bg-[#412B6B] border border-[#5C3E94] rounded text-xs font-mono text-amber-300 font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#F25912]" />
                    <span>Reveal Step {revealedHints + 1} Hint</span>
                  </button>
                )}
              </div>
            )}

            {/* COLUMN 3: SOLUTION CODE & LINE BREAKDOWN TRAY */}
            {(activeDrawer === 'code' || activeDrawer === 'split') && (
              <div className="space-y-4">
                {/* Top Bar: Dry Run Preview Box & Complexity Badges */}
                <div className="bg-[#2C1F45] border border-[#5C3E94] rounded-md p-3.5 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#F25912]" />
                      <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        Dry Run Execution &amp; Complexity Profile
                      </span>
                    </div>

                    {/* Time & Space Complexity Badges */}
                    <div className="flex items-center gap-2">
                      <span className="bg-[#211832] border border-[#F25912]/50 text-[#F25912] font-mono text-xs px-2.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#F25912]" />
                        <span>Time: {card.codeSolution.timeComplexity}</span>
                      </span>
                      <span className="bg-[#211832] border border-[#22C55E]/50 text-[#22C55E] font-mono text-xs px-2.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#22C55E]" />
                        <span>Space: {card.codeSolution.spaceComplexity}</span>
                      </span>
                    </div>
                  </div>

                  {/* Dry Run Output Preview Box */}
                  <div className="bg-[#1A1228] border border-[#3B265E] rounded p-2.5 font-mono text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#B4A7D6] font-semibold">Sample Input:</span>
                      <code className="bg-[#211832] px-2 py-0.5 rounded text-amber-300 border border-[#5C3E94]/50">
                        {card.codeSolution.dryRun.input}
                      </code>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F25912] hidden sm:block" />
                    <div className="flex items-center gap-2">
                      <span className="text-[#B4A7D6] font-semibold">Expected Output:</span>
                      <code className="bg-[#211832] px-2 py-0.5 rounded text-[#22C55E] font-bold border border-[#22C55E]/40">
                        {card.codeSolution.dryRun.expectedOutput}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Solution Code Display & Inline Line Annotations */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Code Display Area (JetBrains Mono + Clean Line Numbers) */}
                  <div className="lg:col-span-7 bg-[#211832] border border-[#5C3E94] rounded-md overflow-hidden font-mono text-xs">
                    <div className="bg-[#2C1F45] border-b border-[#5C3E94] px-3 py-1.5 text-[11px] text-[#B4A7D6] font-bold flex items-center justify-between">
                      <span>{card.codeSolution.language} Solution</span>
                      <span className="text-[10px] text-slate-400">JetBrains Mono</span>
                    </div>
                    <div className="p-3 overflow-x-auto">
                      <table className="w-full border-collapse">
                        <tbody>
                          {card.codeSolution.codeLines.map((lineText, idx) => {
                            const lineNum = idx + 1;
                            const hasAnnotation = card.codeSolution.lineAnnotations.some(
                              (a) => a.line === lineNum
                            );
                            const isHighlighted = highlightedLine === lineNum;

                            return (
                              <tr
                                key={idx}
                                onMouseEnter={() => setHighlightedLine(lineNum)}
                                onMouseLeave={() => setHighlightedLine(null)}
                                className={`transition-colors font-mono ${
                                  isHighlighted
                                    ? 'bg-[#F25912]/20 text-white'
                                    : hasAnnotation
                                    ? 'bg-[#412B6B]/30 hover:bg-[#412B6B]/60'
                                    : 'hover:bg-[#2C1F45]/40'
                                }`}
                              >
                                <td className="pr-3 text-right select-none text-[#5C3E94] font-semibold w-8 text-[11px]">
                                  {lineNum}
                                </td>
                                <td className="pl-2 py-0.5 whitespace-pre font-mono text-slate-200">
                                  {lineText}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Inline Line Annotations Column */}
                  <div className="lg:col-span-5 space-y-2">
                    <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#B4A7D6] font-bold flex items-center gap-1.5 mb-1">
                      <Code className="w-3 h-3 text-[#F25912]" />
                      <span>Line-by-Line Breakdown Annotations</span>
                    </h5>

                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {card.codeSolution.lineAnnotations.map((ann, idx) => {
                        const isHighlighted = highlightedLine === ann.line;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHighlightedLine(ann.line)}
                            onMouseLeave={() => setHighlightedLine(null)}
                            className={`p-2.5 rounded border transition-all text-xs space-y-1 ${
                              isHighlighted
                                ? 'bg-[#F25912]/20 border-[#F25912] text-white shadow-md'
                                : 'bg-[#211832] border-[#3B265E] hover:border-[#5C3E94] text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold bg-[#F25912] text-white px-1.5 py-0.2 rounded">
                                  L{ann.line}
                                </span>
                                <span className="font-mono text-xs font-semibold text-white">
                                  {ann.title}
                                </span>
                              </div>
                              {getAnnotationBadge(ann.type)}
                            </div>
                            <p className="text-[11px] font-sans text-slate-300 leading-snug">
                              {ann.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
