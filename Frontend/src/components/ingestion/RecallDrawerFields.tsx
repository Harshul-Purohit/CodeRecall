import React from 'react';
import { Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';

export interface StructuredHintInput {
  title: string;
  content: string;
}

interface RecallDrawerFieldsProps {
  patternHook: StructuredHintInput;
  onChangePatternHook: (val: StructuredHintInput) => void;
  invariantState: StructuredHintInput;
  onChangeInvariantState: (val: StructuredHintInput) => void;
  edgeCaseWarning: StructuredHintInput;
  onChangeEdgeCaseWarning: (val: StructuredHintInput) => void;
}

export const RecallDrawerFields: React.FC<RecallDrawerFieldsProps> = ({
  patternHook,
  onChangePatternHook,
  invariantState,
  onChangeInvariantState,
  edgeCaseWarning,
  onChangeEdgeCaseWarning
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#927FBF]/30 pb-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#C4BBF0] font-bold flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#C4BBF0]" />
          <span>3-Step Active Recall Hints Hierarchy</span>
        </h3>
        <span className="text-[11px] font-mono text-[#C4BBF0]/70">
          Phase 5 Structured Prompts
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Pattern Hook */}
        <div className="bg-[#363B4E] border border-[#927FBF]/50 rounded-lg p-3.5 sm:p-4 space-y-3 flex flex-col justify-between shadow-md hover:border-[#927FBF] transition-colors">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-[#C4BBF0] bg-[#4F3B78] border border-[#927FBF]/60 px-2 py-0.5 rounded">
                Step 1
              </span>
              <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-[#4F3B78] text-[#C4BBF0] border border-[#927FBF]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C4BBF0]" />
                Pattern Hook
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-[#C4BBF0] mb-1">
                Prompt Title
              </label>
              <input
                type="text"
                value={patternHook.title}
                onChange={(e) => onChangePatternHook({ ...patternHook, title: e.target.value })}
                placeholder="e.g. Pattern Hook & Core Intuition"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded px-2.5 py-1.5 font-sans text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-[#C4BBF0] mb-1">
                Recall Prompt Content
              </label>
              <textarea
                rows={3}
                value={patternHook.content}
                onChange={(e) => onChangePatternHook({ ...patternHook, content: e.target.value })}
                placeholder="What is the core intuition or trigger pattern?"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded p-2.5 font-sans text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Invariant State */}
        <div className="bg-[#363B4E] border border-[#927FBF]/50 rounded-lg p-3.5 sm:p-4 space-y-3 flex flex-col justify-between shadow-md hover:border-[#927FBF] transition-colors">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-[#C4BBF0] bg-[#4F3B78] border border-[#927FBF]/60 px-2 py-0.5 rounded">
                Step 2
              </span>
              <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-[#4F3B78] text-[#C4BBF0] border border-[#927FBF]/40">
                Invariant State
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-[#C4BBF0] mb-1">
                Prompt Title
              </label>
              <input
                type="text"
                value={invariantState.title}
                onChange={(e) => onChangeInvariantState({ ...invariantState, title: e.target.value })}
                placeholder="e.g. Invariant State & Pointer Condition"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded px-2.5 py-1.5 font-sans text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-[#C4BBF0] mb-1">
                Recall Prompt Content
              </label>
              <textarea
                rows={3}
                value={invariantState.content}
                onChange={(e) => onChangeInvariantState({ ...invariantState, content: e.target.value })}
                placeholder="What condition or pointer state must hold true?"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded p-2.5 font-sans text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Edge Case Warning */}
        <div className="bg-[#363B4E] border border-[#927FBF]/50 rounded-lg p-3.5 sm:p-4 space-y-3 flex flex-col justify-between shadow-md hover:border-[#927FBF] transition-colors">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-[#C4BBF0] bg-[#4F3B78] border border-[#927FBF]/60 px-2 py-0.5 rounded">
                Step 3
              </span>
              <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-[#4F3B78] text-[#C4BBF0] border border-[#927FBF]/40 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-[#C4BBF0]" />
                Edge Case Warning
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-[#C4BBF0] mb-1">
                Prompt Title
              </label>
              <input
                type="text"
                value={edgeCaseWarning.title}
                onChange={(e) => onChangeEdgeCaseWarning({ ...edgeCaseWarning, title: e.target.value })}
                placeholder="e.g. Edge Case & Boundary Checks"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded px-2.5 py-1.5 font-sans text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-[#C4BBF0] mb-1">
                Recall Prompt Content
              </label>
              <textarea
                rows={3}
                value={edgeCaseWarning.content}
                onChange={(e) => onChangeEdgeCaseWarning({ ...edgeCaseWarning, content: e.target.value })}
                placeholder="What inputs fail boundary checks?"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded p-2.5 font-sans text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0] resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
