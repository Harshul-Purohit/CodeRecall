import React from 'react';

interface HeroTelemetryProps {
  totalCards?: number;
  filteredCount?: number;
  dueTodayCount?: number;
  retentionRate?: number;
}

export const HeroTelemetry: React.FC<HeroTelemetryProps> = ({
  totalCards = 8,
  filteredCount,
  dueTodayCount = 3,
  retentionRate = 94.8
}) => {
  const displayCount = filteredCount !== undefined ? filteredCount : totalCards;

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pt-2">
      <div>
        <h1 className="text-[24px] font-bold text-white tracking-tight leading-tight">
          Active Revision Queue
        </h1>
        <p className="text-[13px] font-mono text-[#B4A7D6] mt-1">
          SuperMemo-2 retention schedule • Optimized for monotonic pattern recall
        </p>
      </div>

      <div className="font-mono text-[13px] text-white bg-[#2C1F45]/60 border border-[#5C3E94] px-3.5 py-2 rounded-md flex items-center gap-2 self-start md:self-auto shadow-md">
        <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
        <span>
          Retention Rate: <strong className="text-white">{retentionRate.toFixed(1)}%</strong>
        </span>
        <span className="text-[#5C3E94]">•</span>
        <span>
          Backlog: <strong className="text-white">{displayCount} cards</strong>
        </span>
        {dueTodayCount > 0 && (
          <>
            <span className="text-[#5C3E94]">•</span>
            <span>
              Due: <strong className="text-[#F25912]">{dueTodayCount} today</strong>
            </span>
          </>
        )}
      </div>
    </section>
  );
};
