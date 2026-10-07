export type AttemptType = 'solved_without_help' | 'needed_hints' | 'code_viewed' | null;

export type SupportedLanguage = 'Python' | 'JavaScript' | 'C++' | 'Java';

export type LastAttemptResult = 'SOLVED_WITHOUT_HELP' | 'NEEDED_HINTS' | 'CODE_VIEWED' | 'NEW';

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

export interface SingleLanguageSolution {
  language: SupportedLanguage;
  codeLines: string[];
  lineAnnotations: LineAnnotation[];
}

export interface CodeSolution {
  language: SupportedLanguage;
  timeComplexity: string;
  spaceComplexity: string;
  dryRun: DryRunSample;
  codeLines: string[];
  lineAnnotations: LineAnnotation[];
  explanation: string;
  languages?: Partial<Record<SupportedLanguage, SingleLanguageSolution>>;
}

export interface SM2Data {
  intervalDays: number;
  easinessFactor: number;
  nextReviewDate: string; // ISO format YYYY-MM-DD
  repetitionCount: number;
  lastAttemptResult: LastAttemptResult;
}

export interface ProblemCardData {
  id: string | number;
  title: string;
  problemNumber: string; // e.g., "#001", "#015"
  number?: string; // Backwards-compatibility alias for #number
  difficulty: 'Easy' | 'Medium' | 'Hard';
  patterns: string[]; // e.g., ['Two Pointers', 'Sliding Window', 'Hashing']
  pattern?: string; // Single pattern string for backwards compatibility
  patternId?: string; // Pattern ID slug for backwards compatibility
  leetcodeUrl: string;
  sm2: SM2Data;
  isDueToday: boolean;
  isOverdue: boolean;
  isMastered: boolean; // intervalDays >= 21 or EF >= 2.5
  
  // Phase 2 UI backwards-compatibility properties
  dueStatus?: string;
  lastHistory?: string;
  lastAttemptType?: AttemptType;
  sm2Interval?: string;
  sm2Ef?: string;

  hints: StructuredHint[];
  codeSolution: CodeSolution;
}
