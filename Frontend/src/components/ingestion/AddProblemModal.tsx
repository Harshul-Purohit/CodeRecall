import React, { useState, useEffect, useRef } from 'react';
import { ProblemCardData, SupportedLanguage, LineAnnotation } from '../../types/problem';
import { RecallDrawerFields, StructuredHintInput } from './RecallDrawerFields';
import { CodeAnnotationBuilder } from './CodeAnnotationBuilder';
import { X, Plus, Sparkles, AlertCircle, Tag, ExternalLink } from 'lucide-react';

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProblem: (newCard: ProblemCardData) => void;
  existingPatterns?: string[];
}

const DEFAULT_PRESET_PATTERNS = [
  'Two Pointers',
  'Sliding Window',
  'Dynamic Programming',
  'Hashing',
  'Binary Search',
  'Fast & Slow Pointers',
  'Monotonic Stack',
  'Graph BFS/DFS'
];

export const AddProblemModal: React.FC<AddProblemModalProps> = ({
  isOpen,
  onClose,
  onAddProblem,
  existingPatterns = []
}) => {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [problemNumber, setProblemNumber] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [leetcodeUrl, setLeetcodeUrl] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>(['Two Pointers']);
  const [customTag, setCustomTag] = useState<string>('');

  // 3-Step Hints State
  const [patternHook, setPatternHook] = useState<StructuredHintInput>({
    title: 'Pattern Hook Intuition',
    content: ''
  });
  const [invariantState, setInvariantState] = useState<StructuredHintInput>({
    title: 'Invariant State & Pointer Condition',
    content: ''
  });
  const [edgeCaseWarning, setEdgeCaseWarning] = useState<StructuredHintInput>({
    title: 'Edge Case & Boundary Failure Check',
    content: ''
  });

  // Code & Annotation State
  const [language, setLanguage] = useState<SupportedLanguage>('Python');
  const [codeText, setCodeText] = useState<string>(
    `def twoSum(nums: list[int], target: int) -> list[int]:\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n    return []`
  );
  const [lineAnnotations, setLineAnnotations] = useState<LineAnnotation[]>([
    {
      line: 2,
      title: 'State Initialization',
      explanation: 'Initialize hash map storing value-to-index mappings for O(1) complement lookup.',
      type: 'init'
    },
    {
      line: 5,
      title: 'Condition Check & Complement Match',
      explanation: 'Verify if required target complement exists in previously visited elements state.',
      type: 'condition'
    }
  ]);
  const [timeComplexity, setTimeComplexity] = useState<string>('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState<string>('O(N)');
  const [dryRunInput, setDryRunInput] = useState<string>('nums = [2, 7, 11, 15], target = 9');
  const [dryRunOutput, setDryRunOutput] = useState<string>('[0, 1]');
  const [dryRunExplanation, setDryRunExplanation] = useState<string>('2 + 7 = 9, returned indices [0, 1]');

  // Errors & Validation State
  const [urlError, setUrlError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);

  // Combine available pattern suggestions
  const allAvailablePatterns = Array.from(
    new Set([...DEFAULT_PRESET_PATTERNS, ...existingPatterns])
  );

  // Helper to format Problem Number to #XXX
  const formatProblemNumber = (val: string): string => {
    if (!val.trim()) return '';
    const cleaned = val.replace(/^#+/, '').trim();
    const num = parseInt(cleaned, 10);
    if (!isNaN(num)) {
      if (num < 10) return `#00${num}`;
      if (num < 100) return `#0${num}`;
      return `#${num}`;
    }
    return val.startsWith('#') ? val : `#${val}`;
  };

  // Reset form to default clean state
  const resetForm = () => {
    setProblemNumber('');
    setTitle('');
    setLeetcodeUrl('');
    setDifficulty('Medium');
    setSelectedPatterns(['Two Pointers']);
    setCustomTag('');
    setPatternHook({ title: 'Pattern Hook Intuition', content: '' });
    setInvariantState({ title: 'Invariant State & Pointer Condition', content: '' });
    setEdgeCaseWarning({ title: 'Edge Case & Boundary Failure Check', content: '' });
    setLanguage('Python');
    setCodeText(
      `def twoSum(nums: list[int], target: int) -> list[int]:\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n    return []`
    );
    setLineAnnotations([]);
    setTimeComplexity('O(N)');
    setSpaceComplexity('O(N)');
    setDryRunInput('nums = [2, 7, 11, 15], target = 9');
    setDryRunOutput('[0, 1]');
    setDryRunExplanation('2 + 7 = 9, returned indices [0, 1]');
    setUrlError(null);
    setTitleError(null);
  };

  // Auto-focus and Focus Trap on Modal open
  useEffect(() => {
    if (isOpen) {
      // Auto-focus title input field
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Escape key to close modal & Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus Trap inside modal
      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusableElements = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Toggle pattern tag selection
  const handleTogglePattern = (pattern: string) => {
    setSelectedPatterns((prev) =>
      prev.includes(pattern) ? prev.filter((p) => p !== pattern) : [...prev, pattern]
    );
  };

  // Add custom tag
  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tag = customTag.trim();
    if (!tag) return;
    if (!selectedPatterns.includes(tag)) {
      setSelectedPatterns((prev) => [...prev, tag]);
    }
    setCustomTag('');
  };

  // URL Validation helper
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Optional field
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname.includes('leetcode.com') || parsed.hostname.length > 3;
    } catch {
      return false;
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Problem Title is required.');
      titleInputRef.current?.focus();
      return;
    }
    setTitleError(null);

    if (leetcodeUrl.trim() && !validateUrl(leetcodeUrl.trim())) {
      setUrlError('Please enter a valid URL (e.g., https://leetcode.com/problems/...)');
      return;
    }
    setUrlError(null);

    const formattedNum = formatProblemNumber(problemNumber) || '#999';
    const finalUrl = leetcodeUrl.trim()
      ? (leetcodeUrl.startsWith('http') ? leetcodeUrl : `https://${leetcodeUrl}`)
      : `https://leetcode.com/problems/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`;

    const codeLines = codeText
      .split('\n')
      .map((line) => line)
      .filter((_, idx, arr) => idx < arr.length || lineAnnotations.length > 0);

    const todayStr = new Date().toISOString().split('T')[0];

    // Initialize SM-2 default spaced repetition metrics according to prompt spec
    const newCard: ProblemCardData = {
      id: `card-${Date.now()}`,
      title: title.trim(),
      problemNumber: formattedNum,
      number: formattedNum,
      difficulty: difficulty,
      patterns: selectedPatterns.length > 0 ? selectedPatterns : ['Two Pointers'],
      pattern: selectedPatterns[0] || 'Two Pointers',
      leetcodeUrl: finalUrl,
      sm2: {
        intervalDays: 1,
        easinessFactor: 2.5,
        repetitionCount: 0,
        nextReviewDate: todayStr,
        lastAttemptResult: 'NEW'
      },
      isDueToday: true,
      isOverdue: false,
      isMastered: false,

      // UI Backwards-compatibility metadata
      dueStatus: 'Due Today',
      lastHistory: 'New Card',
      lastAttemptType: null,
      sm2Interval: '1 day',
      sm2Ef: '2.5',

      // 3-Step Active Recall Structured Hints
      hints: [
        {
          step: 1,
          category: 'Pattern Hook',
          title: patternHook.title.trim() || 'Pattern Hook Intuition',
          content: patternHook.content.trim() || 'Identify problem patterns and core intuition.'
        },
        {
          step: 2,
          category: 'Invariant State',
          title: invariantState.title.trim() || 'Invariant State & Pointer Condition',
          content: invariantState.content.trim() || 'Maintain pointer invariants throughout iteration.'
        },
        {
          step: 3,
          category: 'Edge Case Warning',
          title: edgeCaseWarning.title.trim() || 'Edge Case & Boundary Failure Check',
          content: edgeCaseWarning.content.trim() || 'Check empty arrays, single elements, and zero bounds.'
        }
      ],

      // Code Solution & Line Annotations
      codeSolution: {
        language: language,
        timeComplexity: timeComplexity.trim() || 'O(N)',
        spaceComplexity: spaceComplexity.trim() || 'O(1)',
        dryRun: {
          input: dryRunInput.trim() || 'Default Sample Input',
          expectedOutput: dryRunOutput.trim() || 'Default Output',
          explanation: dryRunExplanation.trim() || undefined
        },
        codeLines: codeLines.length > 0 ? codeLines : ['# Solution code placeholder'],
        lineAnnotations: lineAnnotations,
        explanation: 'Custom problem solution added via Card Creator.',
        languages: {
          [language]: {
            language: language,
            codeLines: codeLines.length > 0 ? codeLines : ['# Solution code placeholder'],
            lineAnnotations: lineAnnotations
          }
        }
      }
    };

    onAddProblem(newCard);
    resetForm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalContainerRef}
        className="bg-[#4F3B78] border border-[#927FBF] rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] text-white font-sans"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="bg-[#363B4E] border-b border-[#927FBF]/50 p-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#4F3B78] border border-[#927FBF] rounded-lg">
              <Sparkles className="w-5 h-5 text-[#C4BBF0]" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Create Custom Recall Card</span>
                <span className="text-xs font-mono font-normal text-[#C4BBF0] bg-[#4F3B78] px-2 py-0.5 rounded border border-[#927FBF]/40">
                  Phase 5
                </span>
              </h2>
              <p className="text-xs font-mono text-[#C4BBF0]/80 mt-0.5">
                Dynamic LeetCode ingestion with 3-tier recall prompts &amp; line-annotated solutions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#C4BBF0] hover:text-white hover:bg-[#4F3B78] rounded-lg transition-colors border border-transparent hover:border-[#927FBF]/40"
            title="Close Modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* SECTION 1: CORE PROBLEM METADATA */}
          <div className="bg-[#363B4E] border border-[#927FBF]/50 rounded-lg p-4 sm:p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#927FBF]/30 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#C4BBF0] font-bold">
                1. Core Problem Metadata
              </h3>
              <span className="text-[10px] font-mono text-[#C4BBF0]/70">
                Primary Card Metadata
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Problem Number */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-mono font-semibold text-[#C4BBF0] mb-1">
                  Problem # <span className="text-[10px] text-[#C4BBF0]/70">(auto-formatted)</span>
                </label>
                <input
                  type="text"
                  value={problemNumber}
                  onChange={(e) => setProblemNumber(e.target.value)}
                  onBlur={() => setProblemNumber(formatProblemNumber(problemNumber))}
                  placeholder="e.g. 1 or #001"
                  className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded-md px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0]"
                />
              </div>

              {/* Problem Title */}
              <div className="sm:col-span-9">
                <label className="block text-xs font-mono font-semibold text-[#C4BBF0] mb-1">
                  Problem Title <span className="text-red-400">*</span>
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (titleError) setTitleError(null);
                  }}
                  placeholder="e.g. Two Sum"
                  className={`w-full bg-[#4F3B78] border ${
                    titleError ? 'border-red-400 ring-1 ring-red-400' : 'border-[#927FBF]/60'
                  } text-white placeholder-[#C4BBF0]/50 rounded-md px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0]`}
                />
                {titleError && (
                  <p className="text-[11px] font-mono text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{titleError}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* LeetCode URL */}
              <div className="sm:col-span-8">
                <label className="block text-xs font-mono font-semibold text-[#C4BBF0] mb-1 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-[#C4BBF0]" />
                  <span>LeetCode URL (Optional Link Validation)</span>
                </label>
                <input
                  type="text"
                  value={leetcodeUrl}
                  onChange={(e) => {
                    setLeetcodeUrl(e.target.value);
                    if (urlError) setUrlError(null);
                  }}
                  placeholder="https://leetcode.com/problems/two-sum/"
                  className={`w-full bg-[#4F3B78] border ${
                    urlError ? 'border-red-400 ring-1 ring-red-400' : 'border-[#927FBF]/60'
                  } text-white placeholder-[#C4BBF0]/50 rounded-md px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0]`}
                />
                {urlError && (
                  <p className="text-[11px] font-mono text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{urlError}</span>
                  </p>
                )}
              </div>

              {/* Difficulty Radio Selector */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-mono font-semibold text-[#C4BBF0] mb-1">
                  Difficulty Level
                </label>
                <div className="flex items-center gap-1.5 bg-[#4F3B78] p-1 rounded-md border border-[#927FBF]/60">
                  {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 py-1.5 text-xs font-mono font-bold rounded transition-all ${
                        difficulty === diff
                          ? diff === 'Easy'
                            ? 'bg-emerald-950 text-[#22C55E] border border-emerald-600 shadow'
                            : diff === 'Medium'
                            ? 'bg-amber-950 text-[#EAB308] border border-amber-600 shadow'
                            : 'bg-red-950 text-[#EF4444] border border-red-600 shadow'
                          : 'text-[#C4BBF0]/70 hover:text-white hover:bg-[#363B4E]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Patterns Tag Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold text-[#C4BBF0] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C4BBF0]" />
                <span>Pattern Tags (Select existing or add custom pattern tag)</span>
              </label>

              {/* Available preset tag pills */}
              <div className="flex flex-wrap gap-1.5">
                {allAvailablePatterns.map((pat) => {
                  const isSelected = selectedPatterns.includes(pat);
                  return (
                    <button
                      key={pat}
                      type="button"
                      onClick={() => handleTogglePattern(pat)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
                        isSelected
                          ? 'bg-[#C4BBF0] text-[#363B4E] border-[#C4BBF0] font-bold shadow-sm'
                          : 'bg-[#4F3B78] text-[#C4BBF0] border-[#927FBF]/50 hover:border-[#927FBF]'
                      }`}
                    >
                      {isSelected ? `✓ ${pat}` : pat}
                    </button>
                  );
                })}
              </div>

              {/* Custom tag input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  placeholder="Type custom pattern tag (e.g. Trie) & press Enter..."
                  className="flex-1 bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded-md px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-[#C4BBF0]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  disabled={!customTag.trim()}
                  className="px-3 py-1.5 bg-[#927FBF] hover:bg-[#C4BBF0] text-[#363B4E] font-mono text-xs font-bold rounded disabled:opacity-50 transition-colors"
                >
                  + Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: 3-TIER RECALL DRAWER FIELDS */}
          <RecallDrawerFields
            patternHook={patternHook}
            onChangePatternHook={setPatternHook}
            invariantState={invariantState}
            onChangeInvariantState={setInvariantState}
            edgeCaseWarning={edgeCaseWarning}
            onChangeEdgeCaseWarning={setEdgeCaseWarning}
          />

          {/* SECTION 3: CODE SOLUTION & ANNOTATION BUILDER */}
          <CodeAnnotationBuilder
            language={language}
            onLanguageChange={setLanguage}
            codeText={codeText}
            onCodeTextChange={setCodeText}
            lineAnnotations={lineAnnotations}
            onLineAnnotationsChange={setLineAnnotations}
            timeComplexity={timeComplexity}
            onTimeComplexityChange={setTimeComplexity}
            spaceComplexity={spaceComplexity}
            onSpaceComplexityChange={setSpaceComplexity}
            dryRunInput={dryRunInput}
            onDryRunInputChange={setDryRunInput}
            dryRunOutput={dryRunOutput}
            onDryRunOutputChange={setDryRunOutput}
            dryRunExplanation={dryRunExplanation}
            onDryRunExplanationChange={setDryRunExplanation}
          />
        </form>

        {/* Modal Footer Controls */}
        <div className="bg-[#363B4E] border-t border-[#927FBF]/50 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#C4BBF0]/80">
            Initializes SM-2 queue schedule (Interval: 1d • EF: 2.5 • Due Today)
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={resetForm}
              className="px-3.5 py-2 text-xs font-mono text-[#C4BBF0] hover:text-white hover:bg-[#4F3B78] rounded-md transition-colors"
            >
              Reset Form
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-[#C4BBF0] bg-[#4F3B78] hover:bg-[#4F3B78]/80 border border-[#927FBF]/50 rounded-md transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 sm:flex-none px-5 py-2 bg-[#C4BBF0] hover:bg-white text-[#363B4E] font-bold text-xs font-mono rounded-md shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#363B4E]" />
              <span>Create Problem Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
