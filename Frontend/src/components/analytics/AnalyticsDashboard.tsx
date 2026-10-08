import React, { useMemo } from 'react';
import { ProblemCardData } from '../../types/problem';
import { TelemetryHeader } from './TelemetryHeader';
import { RetentionHeatmap } from './RetentionHeatmap';
import { ForgettingCurveChart } from './ForgettingCurveChart';
import { PatternMasteryGrid } from './PatternMasteryGrid';
import {
  generateHeatmapData,
  calculatePatternMastery,
  calculateTelemetryOverview
} from '../../utils/analyticsUtils';

interface AnalyticsDashboardProps {
  cards: ProblemCardData[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ cards }) => {
  // Memoize computed telemetry & activities to avoid unnecessary recalculations
  const telemetry = useMemo(() => calculateTelemetryOverview(cards), [cards]);
  const heatmapActivities = useMemo(() => generateHeatmapData(cards), [cards]);
  const patternMastery = useMemo(() => calculatePatternMastery(cards), [cards]);

  return (
    <div className="w-full max-w-7xl mx-auto py-2 animate-fade-in">
      {/* 1. Telemetry Header Metrics */}
      <TelemetryHeader telemetry={telemetry} totalCards={cards.length} />

      {/* 2. Revision Activity Heatmap Grid */}
      <RetentionHeatmap
        activities={heatmapActivities}
        currentStreak={telemetry.currentStreak}
        longestStreak={telemetry.longestStreak}
      />

      {/* 3. Ebbinghaus Forgetting Curve Line Chart */}
      <ForgettingCurveChart cards={cards} />

      {/* 4. Algorithm Pattern Mastery Breakdown Grid */}
      <PatternMasteryGrid patterns={patternMastery} />
    </div>
  );
};
