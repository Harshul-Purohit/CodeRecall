import {
  Problem,
  RecallRating,
  ReviewLogEntry,
  DeckExportPayload
} from '../types/problem';
import { TelemetryOverview } from '../types/analytics';
import {
  loadProblems,
  saveProblems,
  logReviewAttempt,
  loadReviewHistory,
  loadUserSettings,
  saveUserSettings,
  resetToDefaultSeed,
  STORAGE_KEYS
} from './storage';
import { calculateTelemetryOverview } from '../utils/analyticsUtils';

/**
 * Service Layer Abstraction Interface
 * Decouples the React UI from direct storage or future REST/GraphQL endpoints.
 */
export interface IProblemService {
  getQueue(): Promise<Problem[]>;
  addProblem(newProblem: Omit<Problem, 'id'> & { id?: string | number }): Promise<Problem>;
  submitReview(problemId: string | number, rating: RecallRating): Promise<Problem>;
  getTelemetry(): Promise<TelemetryOverview>;
  exportData(): Promise<string>;
  importData(jsonData: string): Promise<boolean>;
  resetToDefault(): Promise<Problem[]>;
}

/**
 * Helper to simulate realistic micro-latencies (80-150ms)
 * to test optimistic UI and loading skeleton transitions.
 */
function simulateLatency(minMs = 80, maxMs = 150): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Date offset helper returning YYYY-MM-DD
 */
function addDaysToDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Concrete implementation of IProblemService backed by offline IndexedDB/LocalStorage persistence
 */
export class MockProblemService implements IProblemService {
  /**
   * Retrieves the current study queue, dynamically recalibrating due/overdue status for today.
   */
  async getQueue(): Promise<Problem[]> {
    await simulateLatency(80, 140);
    const problems = await loadProblems();
    const todayStr = new Date().toISOString().split('T')[0];

    return problems.map((card) => {
      const nextDate = card.sm2?.nextReviewDate || '';
      const isDueToday =
        card.isDueToday || (nextDate !== '' && nextDate <= todayStr) || card.dueStatus === 'Due Today';
      const isOverdue = card.isOverdue || (nextDate !== '' && nextDate < todayStr);
      const isMastered =
        card.isMastered ||
        (card.sm2?.intervalDays ?? 0) >= 21 ||
        (card.sm2?.easinessFactor ?? 0) >= 2.5;

      return {
        ...card,
        isDueToday,
        isOverdue,
        isMastered
      };
    });
  }

  /**
   * Adds a new problem card to persistent storage with default initial SM-2 state.
   */
  async addProblem(
    newProblem: Omit<Problem, 'id'> & { id?: string | number }
  ): Promise<Problem> {
    await simulateLatency(90, 150);
    const existingProblems = await loadProblems();
    const todayStr = new Date().toISOString().split('T')[0];

    const generatedId =
      newProblem.id ||
      `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const fullProblem: Problem = {
      ...newProblem,
      id: generatedId,
      number: newProblem.number || newProblem.problemNumber,
      problemNumber: newProblem.problemNumber || newProblem.number || '#000',
      patterns: newProblem.patterns?.length ? newProblem.patterns : [newProblem.pattern || 'General'],
      pattern: newProblem.pattern || newProblem.patterns?.[0] || 'General',
      patternId:
        newProblem.patternId ||
        (newProblem.pattern || newProblem.patterns?.[0] || 'general').toLowerCase().replace(/\s+/g, '-'),
      sm2: newProblem.sm2 || {
        intervalDays: 1,
        easinessFactor: 2.5,
        nextReviewDate: todayStr,
        repetitionCount: 0,
        lastAttemptResult: 'NEW'
      },
      isDueToday: true,
      isOverdue: false,
      isMastered: false,
      dueStatus: 'Due Today',
      lastHistory: 'Last: New Card',
      sm2Interval: '1 day',
      sm2Ef: '2.5'
    };

    const updated = [fullProblem, ...existingProblems];
    await saveProblems(updated);
    return fullProblem;
  }

  /**
   * Submits a recall review, applies SM-2 interval expansion/contraction, and logs the attempt.
   */
  async submitReview(problemId: string | number, rating: RecallRating): Promise<Problem> {
    await simulateLatency(80, 130);
    const problems = await loadProblems();
    const targetIdx = problems.findIndex((p) => String(p.id) === String(problemId));

    if (targetIdx === -1) {
      throw new Error(`Problem card with id "${problemId}" not found in storage.`);
    }

    const card = problems[targetIdx];
    const currentEf = card.sm2?.easinessFactor || parseFloat(card.sm2Ef || '2.5') || 2.5;
    const currentDays = card.sm2?.intervalDays || parseInt(card.sm2Interval || '1') || 1;
    const currentReps = card.sm2?.repetitionCount || 0;

    let newEf = currentEf;
    let newDays = currentDays;
    let newReps = currentReps;
    let attemptResult: 'SOLVED_WITHOUT_HELP' | 'NEEDED_HINTS' | 'CODE_VIEWED' = 'SOLVED_WITHOUT_HELP';
    let lastHistory = 'Last: Solved Without Help';
    let lastAttemptType: 'solved_without_help' | 'needed_hints' | 'code_viewed' = 'solved_without_help';

    if (rating === 'SOLVED_WITHOUT_HELP') {
      newEf = Math.min(3.0, parseFloat((currentEf + 0.1).toFixed(2)));
      newReps = currentReps + 1;
      newDays = newReps === 1 ? 1 : newReps === 2 ? 6 : Math.min(60, Math.round(currentDays * 2));
      attemptResult = 'SOLVED_WITHOUT_HELP';
      lastAttemptType = 'solved_without_help';
      lastHistory = 'Last: Solved Without Help';
    } else if (rating === 'NEEDED_HINTS') {
      newEf = Math.max(1.3, parseFloat((currentEf - 0.15).toFixed(2)));
      newReps = Math.max(1, currentReps);
      newDays = 3;
      attemptResult = 'NEEDED_HINTS';
      lastAttemptType = 'needed_hints';
      lastHistory = 'Last: Needed Hints';
    } else {
      // CODE_VIEWED
      newEf = Math.max(1.3, parseFloat((currentEf - 0.3).toFixed(2)));
      newReps = 0;
      newDays = 1;
      attemptResult = 'CODE_VIEWED';
      lastAttemptType = 'code_viewed';
      lastHistory = 'Last: Code Viewed';
    }

    const nextReviewDate = addDaysToDate(newDays);
    const isMastered = newDays >= 21 || newEf >= 2.5;

    const updatedCard: Problem = {
      ...card,
      lastHistory,
      lastAttemptType,
      sm2Interval: `${newDays} ${newDays === 1 ? 'day' : 'days'}`,
      sm2Ef: newEf.toFixed(1),
      isDueToday: false,
      isOverdue: false,
      isMastered,
      dueStatus: `Next in ${newDays}d`,
      sm2: {
        intervalDays: newDays,
        easinessFactor: newEf,
        nextReviewDate,
        repetitionCount: newReps,
        lastAttemptResult: attemptResult
      }
    };

    // Audit log entry
    const logEntry: ReviewLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      problemId: card.id,
      rating,
      date: new Date().toISOString(),
      oldEF: currentEf,
      newEF: newEf,
      oldInterval: currentDays,
      newInterval: newDays
    };

    // Save log & update problems in storage
    problems[targetIdx] = updatedCard;
    await Promise.all([
      saveProblems(problems),
      logReviewAttempt(logEntry)
    ]);

    return updatedCard;
  }

  /**
   * Calculates overall telemetry counters with review log awareness.
   */
  async getTelemetry(): Promise<TelemetryOverview> {
    await simulateLatency(80, 120);
    const problems = await loadProblems();
    const logs = await loadReviewHistory();
    const overview = calculateTelemetryOverview(problems);

    // If historical review logs exist, dynamically calculate real streaks & count
    if (logs.length > 0) {
      const uniqueDays = new Set(logs.map((l) => l.date.split('T')[0]));
      const streak = Math.max(overview.currentStreak, uniqueDays.size);
      return {
        ...overview,
        totalReviewsCompleted: overview.totalReviewsCompleted + logs.length,
        currentStreak: streak,
        longestStreak: Math.max(overview.longestStreak, streak)
      };
    }

    return overview;
  }

  /**
   * Exports complete study deck, SM-2 logs, and settings to JSON format.
   */
  async exportData(): Promise<string> {
    await simulateLatency(100, 150);
    const [problems, reviewLogs, userSettings] = await Promise.all([
      loadProblems(),
      loadReviewHistory(),
      loadUserSettings()
    ]);

    const payload: DeckExportPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      problems,
      reviewLogs,
      userSettings
    };

    return JSON.stringify(payload, null, 2);
  }

  /**
   * Validates and imports study deck JSON with schema verification and deduplication.
   */
  async importData(jsonData: string): Promise<boolean> {
    await simulateLatency(100, 150);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonData);
    } catch {
      throw new Error('Invalid JSON format: Parsing failed.');
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid Study Deck format: Root must be a JSON object or array.');
    }

    let incomingProblems: Problem[] = [];
    let incomingLogs: ReviewLogEntry[] = [];

    if (Array.isArray(parsed)) {
      // Direct array of problems
      incomingProblems = parsed as Problem[];
    } else {
      const obj = parsed as Record<string, unknown>;
      if (Array.isArray(obj.problems)) {
        incomingProblems = obj.problems as Problem[];
      }
      if (Array.isArray(obj.reviewLogs)) {
        incomingLogs = obj.reviewLogs as ReviewLogEntry[];
      }
      if (obj.userSettings && typeof obj.userSettings === 'object') {
        await saveUserSettings(obj.userSettings as never);
      }
    }

    if (incomingProblems.length === 0) {
      throw new Error('Import rejected: No problems found in file.');
    }

    // Validate problem items
    for (let i = 0; i < incomingProblems.length; i++) {
      const p = incomingProblems[i];
      if (!p || typeof p !== 'object' || !p.title) {
        throw new Error(`Invalid problem card at index ${i}: Missing "title" field.`);
      }
    }

    // Merge incoming problems into existing dataset
    const existing = await loadProblems();
    const existingMap = new Map<string, Problem>();
    existing.forEach((p) => existingMap.set(String(p.id), p));

    incomingProblems.forEach((newProb) => {
      const key = String(newProb.id || newProb.title);
      existingMap.set(key, {
        ...newProb,
        id: newProb.id || `imported-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      });
    });

    const mergedProblems = Array.from(existingMap.values());
    await saveProblems(mergedProblems);

    // Merge incoming logs
    if (incomingLogs.length > 0) {
      const existingLogs = await loadReviewHistory();
      const logMap = new Map<string, ReviewLogEntry>();
      existingLogs.forEach((l) => logMap.set(l.id, l));
      incomingLogs.forEach((l) => {
        const id = l.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        logMap.set(id, { ...l, id });
      });
      const mergedLogs = Array.from(logMap.values());
      const txLogs = mergedLogs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      localStorage.setItem(STORAGE_KEYS.CODERECALL_REVIEW_LOGS, JSON.stringify(txLogs));
    }

    return true;
  }

  /**
   * Resets entire storage back to initial seed dataset.
   */
  async resetToDefault(): Promise<Problem[]> {
    await simulateLatency(80, 120);
    return await resetToDefaultSeed();
  }
}

/**
 * Singleton instance of MockProblemService for frontend dependency injection
 */
export const problemService: IProblemService = new MockProblemService();
