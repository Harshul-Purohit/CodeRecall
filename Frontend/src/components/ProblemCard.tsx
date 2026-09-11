import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Code, Lightbulb, CheckCircle } from 'lucide-react';

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
  sm2Interval: string;
  sm2Ef: string;
  hints: string[];
  codeSolution: {
    language: string;
    code: string;
    explanation: string;
  };
  defaultExpandedTray?: 'hints' | 'code' | null;
}

interface ProblemCardProps {
  card: ProblemCardData;
  isActiveCard: boolean;
  onSelectCard: () => void;
  onSolveCard: (id: string) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  card,
  isActiveCard,
  onSelectCard,
  onSolveCard,
}) => {
  const [activeTray, setActiveTray] = useState<'hints' | 'code' | null>(
    card.defaultExpandedTray || null
  );
  const [solvedState, setSolvedState] = useState(false);

  const toggleTray = (tray: 'hints' | 'code') => {
    if (activeTray === tray) {
      setActiveTray(null);
    } else {
      setActiveTray(tray);
    }
  };

  const handleSolve = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSolvedState(true);
    onSolveCard(card.id);
  };

  // Difficulty pill styling
  const getDifficultyPill = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/50';
      case 'Medium':
        return 'bg-amber-950/60 text-[#EAB308] border border-amber-600/50';
      case 'Hard':
        return 'bg-red-950/60 text-red-400 border border-red-700/50';
    }
  };

  return (
    <div
      onClick={onSelectCard}
      className={`bg-[#412B6B] rounded-lg border p-5 flex flex-col gap-4 transition-all duration-200 cursor-pointer shadow-none ${
        isActiveCard
          ? 'border-[#F25912] ring-1 ring-[#F25912]/50'
          : 'border-[#5C3E94] hover:border-[#5C3E94]/80'
      }`}
    >
      {/* Card Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Info */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm text-[#B4A7D6] font-semibold">
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
          <span className="text-xs font-mono text-[#B4A7D6]">
            / {card.pattern}
          </span>
        </div>

        {/* Right Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Difficulty Pill */}
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getDifficultyPill(card.difficulty)}`}>
            {card.difficulty}
          </span>

          {/* Due Status */}
          <span className="bg-orange-950/50 text-[#F25912] border border-[#F25912]/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            {card.dueStatus}
          </span>

          {/* History Tag */}
          <span className="bg-[#211832] text-slate-300 border border-[#5C3E94] text-xs px-2.5 py-0.5 rounded-md font-mono">
            {card.lastHistory}
          </span>
        </div>
      </div>

      {/* Action & SM-2 Telemetry Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-[#5C3E94]/40">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSolve}
            className={`px-3 py-1.5 text-xs rounded font-medium transition-all duration-150 flex items-center gap-1.5 focus:outline-none ${
              solvedState
                ? 'bg-emerald-600 text-white'
                : 'bg-[#F25912] text-white hover:bg-[#F25912]/90'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{solvedState ? 'Solved!' : '✓ Solved Without Help'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTray('hints');
            }}
            className={`px-3 py-1.5 text-xs rounded border transition-colors duration-150 flex items-center gap-1.5 focus:outline-none ${
              activeTray === 'hints'
                ? 'bg-[#F25912]/20 border-[#F25912] text-[#F25912]'
                : 'border-[#F25912] text-[#F25912] bg-transparent hover:bg-[#F25912]/10'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Need Hints ({card.hints.length})</span>
            {activeTray === 'hints' ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTray('code');
            }}
            className={`px-3 py-1.5 text-xs rounded border transition-colors duration-150 flex items-center gap-1.5 focus:outline-none ${
              activeTray === 'code'
                ? 'bg-[#211832] border-[#F25912] text-white'
                : 'border-[#5C3E94] text-slate-300 bg-transparent hover:border-[#B4A7D6] hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-[#B4A7D6]" />
            <span>&lt;/&gt; View Code &amp; Breakdown</span>
            {activeTray === 'code' ? (
              <ChevronUp className="w-3 h-3 ml-0.5 text-[#B4A7D6]" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5 text-[#B4A7D6]" />
            )}
          </button>
        </div>

        {/* Right Algorithm Stats */}
        <div className="font-mono text-[12px] text-[#B4A7D6]">
          SM-2 Interval: <span className="text-white font-medium">{card.sm2Interval}</span> &nbsp;•&nbsp; EF: <span className="text-white font-medium">{card.sm2Ef}</span>
        </div>
      </div>

      {/* Expanded Inset Tray Drawer */}
      {activeTray && (
        <div className="bg-[#1A1228] border border-[#3B265E] rounded-md p-4 mt-1 space-y-3 transition-all duration-200">
          <div className="flex items-center justify-between border-b border-[#3B265E] pb-2">
            <div className="flex items-center gap-2">
              {activeTray === 'hints' ? (
                <>
                  <Lightbulb className="w-4 h-4 text-[#F25912]" />
                  <span className="font-semibold text-xs text-white uppercase tracking-wider">
                    Step Hints (3 Steps)
                  </span>
                </>
              ) : (
                <>
                  <Code className="w-4 h-4 text-[#F25912]" />
                  <span className="font-semibold text-xs text-white uppercase tracking-wider">
                    {card.codeSolution.language} Optimal Solution &amp; Pattern Breakdown
                  </span>
                </>
              )}
            </div>

            {/* Toggle tabs */}
            <div className="flex items-center gap-1 bg-[#211832] p-1 rounded border border-[#5C3E94]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTray('hints');
                }}
                className={`px-2 py-0.5 text-[11px] rounded font-medium ${
                  activeTray === 'hints'
                    ? 'bg-[#F25912] text-white'
                    : 'text-[#B4A7D6] hover:text-white'
                }`}
              >
                Hints
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTray('code');
                }}
                className={`px-2 py-0.5 text-[11px] rounded font-medium ${
                  activeTray === 'code'
                    ? 'bg-[#F25912] text-white'
                    : 'text-[#B4A7D6] hover:text-white'
                }`}
              >
                Code
              </button>
            </div>
          </div>

          {/* Tray Content */}
          {activeTray === 'hints' && (
            <div className="space-y-2 pt-1">
              {card.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 bg-[#211832]/80 border border-[#3B265E] p-2.5 rounded text-xs text-slate-200"
                >
                  <span className="font-mono text-[#F25912] font-bold bg-[#F25912]/10 px-1.5 py-0.5 rounded text-[11px] min-w-[22px] text-center">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed font-sans">{hint}</p>
                </div>
              ))}
            </div>
          )}

          {activeTray === 'code' && (
            <div className="space-y-2.5 pt-1">
              <p className="text-xs text-[#B4A7D6] italic">
                {card.codeSolution.explanation}
              </p>
              <div className="relative">
                <pre className="bg-[#211832] border border-[#5C3E94] p-3 rounded text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{card.codeSolution.code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
