import React, { useState } from 'react';
import { SupportedLanguage, LineAnnotation } from '../../types/problem';
import { Code, Plus, Trash2, Clock, Layers, Cpu } from 'lucide-react';

interface CodeAnnotationBuilderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  codeText: string;
  onCodeTextChange: (text: string) => void;
  lineAnnotations: LineAnnotation[];
  onLineAnnotationsChange: (annotations: LineAnnotation[]) => void;
  timeComplexity: string;
  onTimeComplexityChange: (val: string) => void;
  spaceComplexity: string;
  onSpaceComplexityChange: (val: string) => void;
  dryRunInput: string;
  onDryRunInputChange: (val: string) => void;
  dryRunOutput: string;
  onDryRunOutputChange: (val: string) => void;
  dryRunExplanation: string;
  onDryRunExplanationChange: (val: string) => void;
}

export const CodeAnnotationBuilder: React.FC<CodeAnnotationBuilderProps> = ({
  language,
  onLanguageChange,
  codeText,
  onCodeTextChange,
  lineAnnotations,
  onLineAnnotationsChange,
  timeComplexity,
  onTimeComplexityChange,
  spaceComplexity,
  onSpaceComplexityChange,
  dryRunInput,
  onDryRunInputChange,
  dryRunOutput,
  onDryRunOutputChange,
  dryRunExplanation,
  onDryRunExplanationChange
}) => {
  // New line annotation form state
  const [targetLine, setTargetLine] = useState<number>(1);
  const [annotationTitle, setAnnotationTitle] = useState<string>('');
  const [annotationExplanation, setAnnotationExplanation] = useState<string>('');
  const [annotationType, setAnnotationType] = useState<LineAnnotation['type']>('state');

  // Compute lines array for line count & preview
  const codeLines = codeText ? codeText.split('\n') : [];
  const maxLines = Math.max(1, codeLines.length);

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annotationTitle.trim() || !annotationExplanation.trim()) return;

    const newAnnotation: LineAnnotation = {
      line: Math.min(Math.max(1, targetLine), maxLines),
      title: annotationTitle.trim(),
      explanation: annotationExplanation.trim(),
      type: annotationType
    };

    // Remove existing annotation on the same line if present, then push new one sorted by line
    const filtered = lineAnnotations.filter((a) => a.line !== newAnnotation.line);
    const updated = [...filtered, newAnnotation].sort((a, b) => a.line - b.line);

    onLineAnnotationsChange(updated);
    setAnnotationTitle('');
    setAnnotationExplanation('');
    // Advance targetLine to next line for convenience
    setTargetLine((prev) => Math.min(prev + 1, maxLines));
  };

  const handleRemoveAnnotation = (indexToRemove: number) => {
    onLineAnnotationsChange(lineAnnotations.filter((_, idx) => idx !== indexToRemove));
  };

  const getTypeBadge = (type: LineAnnotation['type']) => {
    switch (type) {
      case 'state':
        return <span className="bg-[#4F3B78] text-[#C4BBF0] border border-[#927FBF]/60 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold">State Transition</span>;
      case 'condition':
        return <span className="bg-amber-950/80 text-amber-300 border border-amber-500/50 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold">Condition Check</span>;
      case 'return':
        return <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold">Return Result</span>;
      case 'init':
        return <span className="bg-sky-950/80 text-sky-300 border border-sky-500/50 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold">State Init</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Language Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#927FBF]/30 pb-2">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-[#C4BBF0]" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#C4BBF0] font-bold">
            Solution Code &amp; Line Annotations
          </h3>
        </div>

        {/* Language Selector Pills */}
        <div className="flex items-center gap-1.5 bg-[#363B4E] p-1 rounded-lg border border-[#927FBF]/50">
          <span className="text-[10px] font-mono text-[#C4BBF0]/70 px-1 font-bold">Language:</span>
          {[
            { id: 'Python', label: 'Python' },
            { id: 'JavaScript', label: 'TypeScript / JS' },
            { id: 'C++', label: 'C++' },
            { id: 'Java', label: 'Java' }
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => onLanguageChange(lang.id as SupportedLanguage)}
              className={`px-2.5 py-1 text-[11px] rounded font-mono font-medium transition-colors ${
                language === lang.id
                  ? 'bg-[#4F3B78] text-[#C4BBF0] border border-[#927FBF] font-bold shadow-sm'
                  : 'text-[#C4BBF0]/70 hover:text-white hover:bg-[#4F3B78]/40'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Textarea & Dry Run Execution Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Code Text Area */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-bold text-[#C4BBF0]">
              {language} Source Code Snippet
            </label>
            <span className="text-[10px] font-mono text-[#C4BBF0]/70">
              {maxLines} {maxLines === 1 ? 'line' : 'lines'} detected
            </span>
          </div>

          <textarea
            rows={10}
            value={codeText}
            onChange={(e) => onCodeTextChange(e.target.value)}
            placeholder={`Paste clean ${language} code snippet here...\n\nExample:\ndef twoSum(nums, target):\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i`}
            className="w-full bg-[#363B4E] border border-[#927FBF]/60 text-[#C4BBF0] placeholder-[#C4BBF0]/40 rounded-lg p-3 font-mono text-xs focus:outline-none focus:border-[#C4BBF0] focus:ring-1 focus:ring-[#C4BBF0] leading-relaxed shadow-inner"
          />
        </div>

        {/* Right Column: Complexity & Dry Run Details */}
        <div className="lg:col-span-5 bg-[#363B4E] border border-[#927FBF]/50 rounded-lg p-3.5 space-y-3.5 shadow-md">
          <div className="flex items-center gap-2 border-b border-[#927FBF]/30 pb-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#C4BBF0]" />
            <span className="text-xs font-mono font-bold text-[#C4BBF0]">
              Complexity &amp; Dry Run Sample
            </span>
          </div>

          {/* Time & Space Complexity Input */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono font-semibold text-[#C4BBF0] mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#C4BBF0]" />
                Time Complexity
              </label>
              <input
                type="text"
                value={timeComplexity}
                onChange={(e) => onTimeComplexityChange(e.target.value)}
                placeholder="e.g. O(N)"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded px-2 py-1 font-mono text-xs focus:outline-none focus:border-[#C4BBF0]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold text-[#C4BBF0] mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#C4BBF0]" />
                Space Complexity
              </label>
              <input
                type="text"
                value={spaceComplexity}
                onChange={(e) => onSpaceComplexityChange(e.target.value)}
                placeholder="e.g. O(1)"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded px-2 py-1 font-mono text-xs focus:outline-none focus:border-[#C4BBF0]"
              />
            </div>
          </div>

          {/* Dry Run Sample Inputs */}
          <div className="space-y-2 pt-1 border-t border-[#927FBF]/20">
            <div>
              <label className="block text-[10px] font-mono text-[#C4BBF0] mb-0.5">
                Dry Run Sample Input
              </label>
              <input
                type="text"
                value={dryRunInput}
                onChange={(e) => onDryRunInputChange(e.target.value)}
                placeholder="e.g. nums = [2, 7, 11, 15], target = 9"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-amber-300 placeholder-[#C4BBF0]/50 rounded px-2.5 py-1 font-mono text-xs focus:outline-none focus:border-[#C4BBF0]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#C4BBF0] mb-0.5">
                Expected Output
              </label>
              <input
                type="text"
                value={dryRunOutput}
                onChange={(e) => onDryRunOutputChange(e.target.value)}
                placeholder="e.g. [0, 1]"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-emerald-300 placeholder-[#C4BBF0]/50 rounded px-2.5 py-1 font-mono text-xs focus:outline-none focus:border-[#C4BBF0]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#C4BBF0] mb-0.5">
                Dry Run Note / Explanation (Optional)
              </label>
              <input
                type="text"
                value={dryRunExplanation}
                onChange={(e) => onDryRunExplanationChange(e.target.value)}
                placeholder="e.g. 2 + 7 = 9, indices 0 and 1"
                className="w-full bg-[#4F3B78] border border-[#927FBF]/60 text-[#C4BBF0] placeholder-[#C4BBF0]/50 rounded px-2.5 py-1 font-sans text-xs focus:outline-none focus:border-[#C4BBF0]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Line Annotation Creator */}
      <div className="bg-[#363B4E] border border-[#927FBF]/50 rounded-lg p-4 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-[#927FBF]/30 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#C4BBF0] bg-[#4F3B78] border border-[#927FBF]/60 px-2 py-0.5 rounded">
              Line Annotations ({lineAnnotations.length})
            </span>
            <span className="text-[11px] font-sans text-[#C4BBF0]/80">
              Annotate key lines for deep code breakdown in the solution drawer
            </span>
          </div>
        </div>

        {/* Add Annotation Form */}
        <form onSubmit={handleAddAnnotation} className="bg-[#4F3B78] p-3 rounded-lg border border-[#927FBF]/50 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono text-[#C4BBF0] mb-1">
                Line Number
              </label>
              <input
                type="number"
                min={1}
                max={maxLines}
                value={targetLine}
                onChange={(e) => setTargetLine(parseInt(e.target.value) || 1)}
                className="w-full bg-[#363B4E] border border-[#927FBF]/60 text-white rounded px-2 py-1.5 font-mono text-xs text-center focus:outline-none focus:border-[#C4BBF0]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[10px] font-mono text-[#C4BBF0] mb-1">
                Annotation Type
              </label>
              <select
                value={annotationType}
                onChange={(e) => setAnnotationType(e.target.value as LineAnnotation['type'])}
                className="w-full bg-[#363B4E] border border-[#927FBF]/60 text-white rounded px-2 py-1.5 font-mono text-xs focus:outline-none focus:border-[#C4BBF0]"
              >
                <option value="state">State Transition</option>
                <option value="condition">Condition Check</option>
                <option value="return">Return Result</option>
                <option value="init">State Initialization</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-[10px] font-mono text-[#C4BBF0] mb-1">
                Annotation Title
              </label>
              <input
                type="text"
                value={annotationTitle}
                onChange={(e) => setAnnotationTitle(e.target.value)}
                placeholder="e.g. Complement Calculation"
                className="w-full bg-[#363B4E] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded px-2.5 py-1.5 font-sans text-xs focus:outline-none focus:border-[#C4BBF0]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={annotationExplanation}
              onChange={(e) => setAnnotationExplanation(e.target.value)}
              placeholder="Detailed explanation of what occurs on this line..."
              className="flex-1 bg-[#363B4E] border border-[#927FBF]/60 text-white placeholder-[#C4BBF0]/50 rounded px-2.5 py-1.5 font-sans text-xs focus:outline-none focus:border-[#C4BBF0]"
            />
            <button
              type="submit"
              disabled={!annotationTitle.trim() || !annotationExplanation.trim()}
              className="px-3.5 py-1.5 bg-[#927FBF] hover:bg-[#C4BBF0] text-[#363B4E] disabled:opacity-50 disabled:cursor-not-allowed rounded font-mono text-xs font-bold transition-colors flex items-center gap-1 whitespace-nowrap shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line Note</span>
            </button>
          </div>
        </form>

        {/* Existing Annotations List */}
        {lineAnnotations.length > 0 ? (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {lineAnnotations.map((ann, idx) => (
              <div
                key={idx}
                className="bg-[#4F3B78]/70 border border-[#927FBF]/40 rounded p-2.5 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold bg-[#C4BBF0] text-[#363B4E] px-1.5 py-0.2 rounded">
                      Line {ann.line}
                    </span>
                    <span className="font-mono font-bold text-white text-xs">
                      {ann.title}
                    </span>
                    {getTypeBadge(ann.type)}
                  </div>
                  <p className="text-[11px] font-sans text-[#C4BBF0] leading-snug">
                    {ann.explanation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAnnotation(idx)}
                  className="p-1 text-[#C4BBF0]/70 hover:text-red-400 hover:bg-[#363B4E] rounded transition-colors"
                  title="Remove Annotation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center border border-dashed border-[#927FBF]/40 rounded-lg text-xs font-mono text-[#C4BBF0]/70">
            No line annotations added yet. Specify line numbers above to annotate key solution steps.
          </div>
        )}
      </div>
    </div>
  );
};
