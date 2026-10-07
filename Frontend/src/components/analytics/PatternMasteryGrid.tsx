import React from 'react';
import { Layers, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { PatternMastery } from '../../types/analytics';

interface PatternMasteryGridProps {
  patterns: PatternMastery[];
}

export const PatternMasteryGrid: React.FC<PatternMasteryGridProps> = ({ patterns }) => {
  const getHealthBadge = (status: 'Strong' | 'Due for Recalibration' | 'Needs Review' = 'Strong') => {
    switch (status) {
      case 'Strong':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Strong
          </span>
        );
      case 'Due for Recalibration':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-amber-300 animate-spin-slow" />
            Due for Recalibration
          </span>
        );
      case 'Needs Review':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Needs Review
          </span>
        );
    }
  };

  return (
    <div className="w-full mb-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C4BBF0]" />
            Algorithm Pattern Mastery Breakdown
          </h2>
          <p className="text-xs font-mono text-[#C4BBF0]/80 mt-0.5">
            Individual proficiency scores and interval health per algorithmic pattern.
          </p>
        </div>

        <div className="text-xs font-mono text-[#C4BBF0]/70 bg-[#4F3B78] border border-[#927FBF]/50 px-3 py-1.5 rounded-lg self-start sm:self-auto">
          {patterns.length} Active Patterns Tracked
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patterns.map((pm) => {
          return (
            <div
              key={pm.pattern}
              className="bg-[#4F3B78] border border-[#927FBF] rounded-xl p-4 shadow-lg hover:border-[#C4BBF0] transition-colors duration-200 flex flex-col justify-between"
            >
              {/* Pattern Name & Health Tag */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-white text-base tracking-tight truncate">
                    {pm.pattern}
                  </h3>
                  {getHealthBadge(pm.healthStatus)}
                </div>

                <div className="text-xs font-mono text-[#C4BBF0]/80 flex items-center justify-between mb-3">
                  <span>{pm.totalCards} cards total</span>
                  <span>{pm.masteredCards} mastered</span>
                </div>
              </div>

              {/* Progress Bar & Percentage display strictly matching spec */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-300">Mastery Level</span>
                  <span className="font-bold text-[#C4BBF0]">{pm.retentionRate}%</span>
                </div>

                {/* Progress bar container: bg-[#363B4E], progress fill: bg-[#C4BBF0], border: border-[#927FBF] */}
                <div className="w-full bg-[#363B4E] h-2.5 rounded-full overflow-hidden border border-[#927FBF] p-[1px]">
                  <div
                    className="bg-[#C4BBF0] h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(100, Math.max(0, pm.retentionRate))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
