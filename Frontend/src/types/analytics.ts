export interface DailyActivity {
  date: string; // YYYY-MM-DD
  count: number; // cards reviewed
  level: 0 | 1 | 2 | 3 | 4; // intensity bucket for heatmap tiles
}

export interface PatternMastery {
  pattern: string; // e.g., 'Two Pointers', 'Sliding Window', 'Dynamic Programming'
  totalCards: number;
  masteredCards: number; // cards with intervalDays >= 21 or EF >= 2.5
  retentionRate: number; // percentage 0-100
  healthStatus?: 'Strong' | 'Due for Recalibration' | 'Needs Review';
}

export interface RetentionDecayPoint {
  daysSinceReview: number;
  estimatedRetention: number; // Ebbinghaus decay curve calculation: R = e^(-t/S)
  targetReviewDay: number;
}

export interface TelemetryOverview {
  currentStreak: number;
  longestStreak: number;
  overallRetentionRate: number;
  totalReviewsCompleted: number;
  backlogCount: number;
  averageEasinessFactor: number;
  dueTodayCount: number;
  masteredCardsCount: number;
}
