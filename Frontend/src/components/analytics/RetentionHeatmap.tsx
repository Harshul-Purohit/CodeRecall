import React, { useState } from 'react';
import { Calendar, Flame, Trophy, Info } from 'lucide-react';
import { DailyActivity } from '../../types/analytics';

interface RetentionHeatmapProps {
  activities: DailyActivity[];
  currentStreak?: number;
  longestStreak?: number;
}

export const RetentionHeatmap: React.FC<RetentionHeatmapProps> = ({
  activities,
  currentStreak = 14,
  longestStreak = 28
}) => {
  const [hoveredTile, setHoveredTile] = useState<{
    date: string;
    count: number;
    level: number;
    x: number;
    y: number;
  } | null>(null);

  // Total active days count
  const totalActiveDays = activities.filter((a) => a.count > 0).length;
  const totalRevisions = activities.reduce((sum, a) => sum + a.count, 0);

  // Map level to background and border classes strictly matching spec
  const getTileClasses = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-[#363B4E] border border-[#927FBF]/30 hover:border-[#927FBF]';
      case 1:
        return 'bg-[#4F3B78] border border-[#927FBF]/50 hover:border-[#C4BBF0]';
      case 2:
        return 'bg-[#7A67A8] border border-[#927FBF]/70 hover:border-white';
      case 3:
        return 'bg-[#927FBF] border border-[#C4BBF0]/70 hover:border-white shadow-sm';
      case 4:
        return 'bg-[#C4BBF0] border border-white hover:brightness-110 shadow-md shadow-[#C4BBF0]/20';
      default:
        return 'bg-[#363B4E] border border-[#927FBF]/30';
    }
  };

  return (
    <div className="bg-[#4F3B78] border border-[#927FBF] rounded-xl p-5 shadow-xl relative mb-8">
      {/* Header section with metric callouts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#927FBF]/30 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#C4BBF0]" />
            90-Day Revision Heatmap
          </h2>
          <p className="text-xs font-mono text-[#C4BBF0]/80 mt-0.5">
            Visual record of daily cards reviewed and SRS memory refresh events.
          </p>
        </div>

        {/* Streak & Activity Callouts strictly matching prompt requirement */}
        <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
          <div className="bg-[#363B4E] border border-[#927FBF]/50 px-3 py-1.5 rounded-lg flex items-center gap-2 text-white">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              Current Streak: <strong className="text-[#C4BBF0]">{currentStreak} days</strong>
            </span>
          </div>

          <div className="bg-[#363B4E] border border-[#927FBF]/50 px-3 py-1.5 rounded-lg flex items-center gap-2 text-white">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>
              Best Streak: <strong className="text-[#C4BBF0]">{longestStreak} days</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[650px] flex flex-col gap-2">
          {/* Days & Tiles Grid */}
          <div className="flex items-start gap-3">
            {/* Day of Week Labels */}
            <div className="flex flex-col justify-between h-[120px] text-[10px] font-mono text-[#C4BBF0]/60 pr-1 select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Heatmap Grid Tiles */}
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1">
              {activities.map((act, index) => {
                const dateObj = new Date(act.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div
                    key={`${act.date}-${index}`}
                    className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-150 cursor-pointer ${getTileClasses(
                      act.level
                    )}`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredTile({
                        date: formattedDate,
                        count: act.count,
                        level: act.level,
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8
                      });
                    }}
                    onMouseLeave={() => setHoveredTile(null)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Tooltip display */}
      {hoveredTile && (
        <div
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-[#363B4E] border border-[#927FBF] text-white text-xs font-mono px-3 py-1.5 rounded-lg shadow-2xl pointer-events-none flex items-center gap-2"
          style={{ top: `${hoveredTile.y}px`, left: `${hoveredTile.x}px` }}
        >
          <span className={`w-2 h-2 rounded-full ${hoveredTile.count > 0 ? 'bg-[#C4BBF0]' : 'bg-[#927FBF]'}`}></span>
          <span>
            <strong>{hoveredTile.count} revisions</strong> on {hoveredTile.date}
          </span>
        </div>
      )}

      {/* Heatmap Legend & Bottom Metadata */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#C4BBF0]/70 pt-4 mt-2 border-t border-[#927FBF]/30">
        <div className="flex items-center gap-2 text-[11px]">
          <Info className="w-3.5 h-3.5 text-[#927FBF]" />
          <span>
            Total Active Days: <strong className="text-white">{totalActiveDays} days</strong> ({totalRevisions} total reviews)
          </span>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-2 text-[11px] select-none">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-[2px] bg-[#363B4E] border border-[#927FBF]/30" title="Level 0: 0 revisions"></div>
            <div className="w-3 h-3 rounded-[2px] bg-[#4F3B78] border border-[#927FBF]/50" title="Level 1: 1-2 revisions"></div>
            <div className="w-3 h-3 rounded-[2px] bg-[#7A67A8] border border-[#927FBF]/70" title="Level 2: 3-4 revisions"></div>
            <div className="w-3 h-3 rounded-[2px] bg-[#927FBF] border border-[#C4BBF0]/70" title="Level 3: 5-7 revisions"></div>
            <div className="w-3 h-3 rounded-[2px] bg-[#C4BBF0] border border-white" title="Level 4: 8+ revisions"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
